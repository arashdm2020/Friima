package services

import (
	"context"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/fariima/backend/internal/config"
	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/sirupsen/logrus"
)

type BlockchainIndexer struct {
	cfg              *config.Config
	blockchainService *BlockchainService
	escrowRepo       *repositories.EscrowRepository
	disputeRepo      *repositories.DisputeRepository
	nftRepo          *repositories.NFTRepository
	logger           *logrus.Logger
	lastIndexedBlock uint64
}

func NewBlockchainIndexer(
	cfg *config.Config,
	blockchainService *BlockchainService,
	escrowRepo *repositories.EscrowRepository,
	disputeRepo *repositories.DisputeRepository,
	nftRepo *repositories.NFTRepository,
	logger *logrus.Logger,
) *BlockchainIndexer {
	return &BlockchainIndexer{
		cfg:              cfg,
		blockchainService: blockchainService,
		escrowRepo:       escrowRepo,
		disputeRepo:      disputeRepo,
		nftRepo:          nftRepo,
		logger:           logger,
		lastIndexedBlock: uint64(cfg.IndexerStartBlock),
	}
}

func (i *BlockchainIndexer) Start(ctx context.Context) {
	i.logger.Info("Starting blockchain indexer...")

	ticker := time.NewTicker(time.Duration(i.cfg.IndexerIntervalSeconds) * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			i.logger.Info("Stopping blockchain indexer...")
			return
		case <-ticker.C:
			if err := i.indexBlocks(); err != nil {
				i.logger.Errorf("Error indexing blocks: %v", err)
			}
		}
	}
}

func (i *BlockchainIndexer) indexBlocks() error {
	latestBlock, err := i.blockchainService.GetLatestBlockNumber()
	if err != nil {
		return err
	}

	if i.lastIndexedBlock >= latestBlock {
		return nil
	}

	// Index in batches
	toBlock := i.lastIndexedBlock + uint64(i.cfg.IndexerBatchSize)
	if toBlock > latestBlock {
		toBlock = latestBlock
	}

	i.logger.Infof("Indexing blocks from %d to %d", i.lastIndexedBlock+1, toBlock)

	// Get contract addresses
	escrowAddr, _ := i.blockchainService.GetContractAddress("escrow")
	daoAddr, _ := i.blockchainService.GetContractAddress("dao")
	nftAddr, _ := i.blockchainService.GetContractAddress("nft")

	addresses := []common.Address{escrowAddr, daoAddr, nftAddr}

	// Get logs
	logs, err := i.blockchainService.GetLogs(i.lastIndexedBlock+1, toBlock, addresses, nil)
	if err != nil {
		return err
	}

	// Process logs
	for _, log := range logs {
		if err := i.processLog(log); err != nil {
			i.logger.Errorf("Error processing log: %v", err)
			continue
		}
	}

	i.lastIndexedBlock = toBlock
	return nil
}

func (i *BlockchainIndexer) processLog(log common.Log) error {
	// Event signatures
	projectCreatedSig := crypto.Keccak256Hash([]byte("ProjectCreated(uint256,address,address,uint256)"))
	depositedSig := crypto.Keccak256Hash([]byte("Deposited(uint256,address,uint256)"))
	releasedSig := crypto.Keccak256Hash([]byte("Released(uint256,address,address,uint256,uint256)"))
	disputeInitiatedSig := crypto.Keccak256Hash([]byte("DisputeInitiated(uint256,uint256,address)"))
	disputeResolvedSig := crypto.Keccak256Hash([]byte("DisputeResolved(uint256,uint256,uint256)"))
	nftMintedSig := crypto.Keccak256Hash([]byte("Transfer(address,address,uint256)"))

	eventSig := log.Topics[0]

	switch {
	case eventSig == projectCreatedSig:
		return i.handleProjectCreated(log)
	case eventSig == depositedSig:
		return i.handleDeposited(log)
	case eventSig == releasedSig:
		return i.handleReleased(log)
	case eventSig == disputeInitiatedSig:
		return i.handleDisputeInitiated(log)
	case eventSig == disputeResolvedSig:
		return i.handleDisputeResolved(log)
	case eventSig == nftMintedSig:
		return i.handleNFTMinted(log)
	}

	return nil
}

func (i *BlockchainIndexer) handleProjectCreated(log common.Log) error {
	// ProjectCreated(uint256 indexed projectId, address indexed client, address freelancer, uint256 amount)
	if len(log.Topics) < 3 {
		return nil
	}

	projectID := new(big.Int).SetBytes(log.Topics[1].Bytes()).Int64()
	clientAddr := common.BytesToAddress(log.Topics[2].Bytes())

	i.logger.Infof("Project created: ID=%d, Client=%s", projectID, clientAddr.Hex())

	// Check if escrow already exists
	_, err := i.escrowRepo.GetByOnChainID(projectID)
	if err == nil {
		return nil // Already indexed
	}

	// Create escrow record
	escrow := &models.Escrow{
		OnChainID:      projectID,
		ClientAddr:     clientAddr.Hex(),
		Status:         models.EscrowStatusCreated,
		CreatedAtBlock: log.BlockNumber,
	}

	return i.escrowRepo.Create(escrow)
}

func (i *BlockchainIndexer) handleDeposited(log common.Log) error {
	// Deposited(uint256 indexed projectId, address indexed token, uint256 amount)
	if len(log.Topics) < 3 {
		return nil
	}

	projectID := new(big.Int).SetBytes(log.Topics[1].Bytes()).Int64()
	tokenAddr := common.BytesToAddress(log.Topics[2].Bytes())

	i.logger.Infof("Deposit made: ProjectID=%d, Token=%s", projectID, tokenAddr.Hex())

	escrow, err := i.escrowRepo.GetByOnChainID(projectID)
	if err != nil {
		return err
	}

	escrow.Status = models.EscrowStatusFunded
	escrow.Token = tokenAddr.Hex()
	escrow.FundedAtBlock = log.BlockNumber
	escrow.DepositTxHash = log.TxHash.Hex()

	return i.escrowRepo.Update(escrow)
}

func (i *BlockchainIndexer) handleReleased(log common.Log) error {
	// Released(uint256 indexed projectId, address indexed freelancer, address client, uint256 amount, uint256 fee)
	if len(log.Topics) < 2 {
		return nil
	}

	projectID := new(big.Int).SetBytes(log.Topics[1].Bytes()).Int64()

	i.logger.Infof("Payment released: ProjectID=%d", projectID)

	escrow, err := i.escrowRepo.GetByOnChainID(projectID)
	if err != nil {
		return err
	}

	escrow.Status = models.EscrowStatusReleased
	escrow.ReleasedAtBlock = log.BlockNumber
	escrow.ReleaseTxHash = log.TxHash.Hex()

	return i.escrowRepo.Update(escrow)
}

func (i *BlockchainIndexer) handleDisputeInitiated(log common.Log) error {
	// DisputeInitiated(uint256 indexed disputeId, uint256 indexed projectId, address initiator)
	if len(log.Topics) < 3 {
		return nil
	}

	disputeID := new(big.Int).SetBytes(log.Topics[1].Bytes()).Int64()
	projectID := new(big.Int).SetBytes(log.Topics[2].Bytes()).Int64()

	i.logger.Infof("Dispute initiated: ID=%d, ProjectID=%d", disputeID, projectID)

	// Check if dispute already exists
	_, err := i.disputeRepo.GetByOnChainID(disputeID)
	if err == nil {
		return nil // Already indexed
	}

	// Create dispute record
	dispute := &models.Dispute{
		OnChainID:   disputeID,
		Status:      models.DisputeStatusOpen,
		BlockNumber: log.BlockNumber,
		TxHash:      log.TxHash.Hex(),
	}

	return i.disputeRepo.Create(dispute)
}

func (i *BlockchainIndexer) handleDisputeResolved(log common.Log) error {
	// DisputeResolved(uint256 indexed disputeId, uint256 clientSplit, uint256 freelancerSplit)
	if len(log.Topics) < 2 {
		return nil
	}

	disputeID := new(big.Int).SetBytes(log.Topics[1].Bytes()).Int64()

	i.logger.Infof("Dispute resolved: ID=%d", disputeID)

	dispute, err := i.disputeRepo.GetByOnChainID(disputeID)
	if err != nil {
		return err
	}

	dispute.Status = models.DisputeStatusResolved
	now := time.Now()
	dispute.ResolvedAt = &now

	return i.disputeRepo.Update(dispute)
}

func (i *BlockchainIndexer) handleNFTMinted(log common.Log) error {
	// Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
	// Only process mints (from = 0x0)
	if len(log.Topics) < 4 {
		return nil
	}

	from := common.BytesToAddress(log.Topics[1].Bytes())
	if from != (common.Address{}) {
		return nil // Not a mint
	}

	to := common.BytesToAddress(log.Topics[2].Bytes())
	tokenID := new(big.Int).SetBytes(log.Topics[3].Bytes()).Int64()

	i.logger.Infof("NFT minted: TokenID=%d, Owner=%s", tokenID, to.Hex())

	// Create NFT record
	nft := &models.NFT{
		TokenID:     tokenID,
		OwnerAddr:   to.Hex(),
		MintTxHash:  log.TxHash.Hex(),
		BlockNumber: log.BlockNumber,
		MintedAt:    time.Now(),
	}

	return i.nftRepo.Create(nft)
}
