package repositories

import (
	"github.com/fariima/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DisputeRepository struct {
	db *gorm.DB
}

func NewDisputeRepository(db *gorm.DB) *DisputeRepository {
	return &DisputeRepository{db: db}
}

func (r *DisputeRepository) Create(dispute *models.Dispute) error {
	return r.db.Create(dispute).Error
}

func (r *DisputeRepository) GetByID(id uuid.UUID) (*models.Dispute, error) {
	var dispute models.Dispute
	err := r.db.Preload("Project").Preload("Escrow").Preload("Evidence").
		First(&dispute, "id = ?", id).Error
	return &dispute, err
}

func (r *DisputeRepository) GetByOnChainID(onChainID int64) (*models.Dispute, error) {
	var dispute models.Dispute
	err := r.db.Where("on_chain_id = ?", onChainID).First(&dispute).Error
	return &dispute, err
}

func (r *DisputeRepository) Update(dispute *models.Dispute) error {
	return r.db.Save(dispute).Error
}

func (r *DisputeRepository) List(status string, limit, offset int) ([]models.Dispute, int64, error) {
	var disputes []models.Dispute
	var total int64

	db := r.db.Model(&models.Dispute{}).Preload("Project")

	if status != "" {
		db = db.Where("status = ?", status)
	}

	db.Count(&total)
	err := db.Order("created_at DESC").Limit(limit).Offset(offset).Find(&disputes).Error

	return disputes, total, err
}

// Evidence
func (r *DisputeRepository) CreateEvidence(evidence *models.Evidence) error {
	return r.db.Create(evidence).Error
}

func (r *DisputeRepository) GetEvidenceByDisputeID(disputeID uuid.UUID) ([]models.Evidence, error) {
	var evidence []models.Evidence
	err := r.db.Where("dispute_id = ?", disputeID).
		Preload("Submitter").
		Order("created_at DESC").
		Find(&evidence).Error
	return evidence, err
}

// Votes
func (r *DisputeRepository) CreateVote(vote *models.Vote) error {
	return r.db.Create(vote).Error
}

func (r *DisputeRepository) GetVotesByDisputeID(disputeID uuid.UUID) ([]models.Vote, error) {
	var votes []models.Vote
	err := r.db.Where("dispute_id = ?", disputeID).
		Preload("Voter").
		Order("created_at DESC").
		Find(&votes).Error
	return votes, err
}

func (r *DisputeRepository) HasUserVoted(disputeID uuid.UUID, voterID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&models.Vote{}).
		Where("dispute_id = ? AND voter_id = ?", disputeID, voterID).
		Count(&count).Error
	return count > 0, err
}
