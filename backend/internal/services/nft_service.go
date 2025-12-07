package services

import (
	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/sirupsen/logrus"
)

type NFTService struct {
	nftRepo           *repositories.NFTRepository
	blockchainService *BlockchainService
	logger            *logrus.Logger
}

func NewNFTService(
	nftRepo *repositories.NFTRepository,
	blockchainService *BlockchainService,
	logger *logrus.Logger,
) *NFTService {
	return &NFTService{
		nftRepo:           nftRepo,
		blockchainService: blockchainService,
		logger:            logger,
	}
}

func (s *NFTService) GetNFTByTokenID(tokenID int64) (*models.NFT, error) {
	return s.nftRepo.GetByTokenID(tokenID)
}

func (s *NFTService) GetUserNFTs(ownerAddress string) ([]models.NFT, error) {
	return s.nftRepo.GetByOwnerAddress(ownerAddress)
}

func (s *NFTService) CreateNFT(nft *models.NFT) error {
	return s.nftRepo.Create(nft)
}
