package services

import (
	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type DisputeService struct {
	disputeRepo       *repositories.DisputeRepository
	blockchainService *BlockchainService
	logger            *logrus.Logger
}

func NewDisputeService(
	disputeRepo *repositories.DisputeRepository,
	blockchainService *BlockchainService,
	logger *logrus.Logger,
) *DisputeService {
	return &DisputeService{
		disputeRepo:       disputeRepo,
		blockchainService: blockchainService,
		logger:            logger,
	}
}

func (s *DisputeService) CreateDispute(dispute *models.Dispute) error {
	dispute.Status = models.DisputeStatusOpen
	return s.disputeRepo.Create(dispute)
}

func (s *DisputeService) GetDispute(id uuid.UUID) (*models.Dispute, error) {
	return s.disputeRepo.GetByID(id)
}

func (s *DisputeService) ListDisputes(status string, limit, offset int) ([]models.Dispute, int64, error) {
	return s.disputeRepo.List(status, limit, offset)
}

func (s *DisputeService) SubmitEvidence(evidence *models.Evidence) error {
	return s.disputeRepo.CreateEvidence(evidence)
}

func (s *DisputeService) GetEvidence(disputeID uuid.UUID) ([]models.Evidence, error) {
	return s.disputeRepo.GetEvidenceByDisputeID(disputeID)
}

func (s *DisputeService) CreateVote(vote *models.Vote) error {
	// Check if user already voted
	hasVoted, err := s.disputeRepo.HasUserVoted(vote.DisputeID, vote.VoterID)
	if err != nil {
		return err
	}
	if hasVoted {
		return err
	}

	return s.disputeRepo.CreateVote(vote)
}

func (s *DisputeService) GetVotes(disputeID uuid.UUID) ([]models.Vote, error) {
	return s.disputeRepo.GetVotesByDisputeID(disputeID)
}
