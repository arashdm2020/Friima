package services

import (
	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type EscrowService struct {
	escrowRepo        *repositories.EscrowRepository
	blockchainService *BlockchainService
	logger            *logrus.Logger
}

func NewEscrowService(
	escrowRepo *repositories.EscrowRepository,
	blockchainService *BlockchainService,
	logger *logrus.Logger,
) *EscrowService {
	return &EscrowService{
		escrowRepo:        escrowRepo,
		blockchainService: blockchainService,
		logger:            logger,
	}
}

func (s *EscrowService) GetEscrowByProjectID(projectID uuid.UUID) (*models.Escrow, error) {
	return s.escrowRepo.GetByProjectID(projectID)
}

func (s *EscrowService) GetEscrowHistory(escrowID uuid.UUID) ([]models.EscrowEvent, error) {
	return s.escrowRepo.GetEventsByEscrowID(escrowID)
}

func (s *EscrowService) CreateEscrow(escrow *models.Escrow) error {
	return s.escrowRepo.Create(escrow)
}

func (s *EscrowService) UpdateEscrow(escrow *models.Escrow) error {
	return s.escrowRepo.Update(escrow)
}
