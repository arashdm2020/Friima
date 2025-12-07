package repositories

import (
	"github.com/fariima/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EscrowRepository struct {
	db *gorm.DB
}

func NewEscrowRepository(db *gorm.DB) *EscrowRepository {
	return &EscrowRepository{db: db}
}

func (r *EscrowRepository) Create(escrow *models.Escrow) error {
	return r.db.Create(escrow).Error
}

func (r *EscrowRepository) GetByID(id uuid.UUID) (*models.Escrow, error) {
	var escrow models.Escrow
	err := r.db.Preload("Project").First(&escrow, "id = ?", id).Error
	return &escrow, err
}

func (r *EscrowRepository) GetByProjectID(projectID uuid.UUID) (*models.Escrow, error) {
	var escrow models.Escrow
	err := r.db.Preload("Project").Where("project_id = ?", projectID).First(&escrow).Error
	return &escrow, err
}

func (r *EscrowRepository) GetByOnChainID(onChainID int64) (*models.Escrow, error) {
	var escrow models.Escrow
	err := r.db.Where("on_chain_id = ?", onChainID).First(&escrow).Error
	return &escrow, err
}

func (r *EscrowRepository) Update(escrow *models.Escrow) error {
	return r.db.Save(escrow).Error
}

func (r *EscrowRepository) CreateEvent(event *models.EscrowEvent) error {
	return r.db.Create(event).Error
}

func (r *EscrowRepository) GetEventsByEscrowID(escrowID uuid.UUID) ([]models.EscrowEvent, error) {
	var events []models.EscrowEvent
	err := r.db.Where("escrow_id = ?", escrowID).
		Order("created_at DESC").
		Find(&events).Error
	return events, err
}
