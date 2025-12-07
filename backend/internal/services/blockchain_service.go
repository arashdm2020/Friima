package services

import (
	"context"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/fariima/backend/internal/config"
	"github.com/sirupsen/logrus"
)

type BlockchainService struct {
	cfg    *config.Config
	client *ethclient.Client
	logger *logrus.Logger
}

func NewBlockchainService(cfg *config.Config, logger *logrus.Logger) *BlockchainService {
	client, err := ethclient.Dial(cfg.GetRPCURL())
	if err != nil {
		logger.Fatalf("Failed to connect to blockchain: %v", err)
	}

	return &BlockchainService{
		cfg:    cfg,
		client: client,
		logger: logger,
	}
}

func (s *BlockchainService) GetClient() *ethclient.Client {
	return s.client
}

func (s *BlockchainService) GetLatestBlockNumber() (uint64, error) {
	header, err := s.client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		return 0, err
	}
	return header.Number.Uint64(), nil
}

func (s *BlockchainService) GetBlockByNumber(blockNumber uint64) (*types.Block, error) {
	return s.client.BlockByNumber(context.Background(), big.NewInt(int64(blockNumber)))
}

func (s *BlockchainService) GetLogs(fromBlock, toBlock uint64, addresses []common.Address, topics [][]common.Hash) ([]types.Log, error) {
	query := ethereum.FilterQuery{
		FromBlock: big.NewInt(int64(fromBlock)),
		ToBlock:   big.NewInt(int64(toBlock)),
		Addresses: addresses,
		Topics:    topics,
	}

	return s.client.FilterLogs(context.Background(), query)
}

func (s *BlockchainService) GetTransaction(txHash common.Hash) (*types.Transaction, bool, error) {
	return s.client.TransactionByHash(context.Background(), txHash)
}

func (s *BlockchainService) GetTransactionReceipt(txHash common.Hash) (*types.Receipt, error) {
	return s.client.TransactionReceipt(context.Background(), txHash)
}

func (s *BlockchainService) GetBalance(address common.Address) (*big.Int, error) {
	return s.client.BalanceAt(context.Background(), address, nil)
}

func (s *BlockchainService) EstimateGas(msg ethereum.CallMsg) (uint64, error) {
	return s.client.EstimateGas(context.Background(), msg)
}

func (s *BlockchainService) GetContractAddress(name string) (common.Address, error) {
	var addr string
	
	switch name {
	case "escrow":
		addr = s.cfg.EscrowContract
	case "fari_token":
		addr = s.cfg.FARITokenContract
	case "dao":
		addr = s.cfg.DAOContract
	case "nft":
		addr = s.cfg.NFTContract
	default:
		return common.Address{}, fmt.Errorf("unknown contract: %s", name)
	}

	if addr == "" {
		return common.Address{}, fmt.Errorf("contract %s address not configured", name)
	}

	return common.HexToAddress(addr), nil
}
