package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProjectStatus string

const (
	ProjectStatusDraft      ProjectStatus = "draft"
	ProjectStatusOpen       ProjectStatus = "open"
	ProjectStatusInProgress ProjectStatus = "in_progress"
	ProjectStatusCompleted  ProjectStatus = "completed"
	ProjectStatusCancelled  ProjectStatus = "cancelled"
	ProjectStatusDisputed   ProjectStatus = "disputed"
)

type Project struct {
	ID          uuid.UUID     `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ClientID    uuid.UUID     `json:"client_id" gorm:"type:uuid;not null;index"`
	Client      User          `json:"client" gorm:"foreignKey:ClientID"`
	FreelancerID *uuid.UUID   `json:"freelancer_id" gorm:"type:uuid;index"`
	Freelancer  *User         `json:"freelancer,omitempty" gorm:"foreignKey:FreelancerID"`
	
	// Basic Info
	Title       string        `json:"title" gorm:"not null"`
	Description string        `json:"description" gorm:"type:text;not null"`
	Category    string        `json:"category" gorm:"index"`
	Skills      []string      `json:"skills" gorm:"type:jsonb"`
	Budget      float64       `json:"budget" gorm:"not null"`
	Currency    string        `json:"currency" gorm:"default:'USDC'"`
	Duration    int           `json:"duration"` // in days
	
	// Status
	Status      ProjectStatus `json:"status" gorm:"type:varchar(20);default:'draft';index"`
	
	// Blockchain
	OnChainID   *int64        `json:"on_chain_id" gorm:"index"`
	TxHash      string        `json:"tx_hash"`
	
	// Metadata
	Attachments []string      `json:"attachments" gorm:"type:jsonb"`
	IPFSHash    string        `json:"ipfs_hash"`
	
	// Timestamps
	StartDate   *time.Time    `json:"start_date"`
	EndDate     *time.Time    `json:"end_date"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type Application struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProjectID   uuid.UUID `json:"project_id" gorm:"type:uuid;not null;index"`
	Project     Project   `json:"project" gorm:"foreignKey:ProjectID"`
	FreelancerID uuid.UUID `json:"freelancer_id" gorm:"type:uuid;not null;index"`
	Freelancer  User      `json:"freelancer" gorm:"foreignKey:FreelancerID"`
	
	// Application details
	CoverLetter string    `json:"cover_letter" gorm:"type:text"`
	ProposedRate float64  `json:"proposed_rate"`
	ProposedDuration int  `json:"proposed_duration"`
	Status      string    `json:"status" gorm:"default:'pending'"` // pending, accepted, rejected
	
	// Timestamps
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Review struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProjectID   uuid.UUID `json:"project_id" gorm:"type:uuid;not null;index"`
	ReviewerID  uuid.UUID `json:"reviewer_id" gorm:"type:uuid;not null;index"`
	RevieweeID  uuid.UUID `json:"reviewee_id" gorm:"type:uuid;not null;index"`
	
	// Review
	Rating      int       `json:"rating" gorm:"not null"` // 1-5
	Comment     string    `json:"comment" gorm:"type:text"`
	
	// Timestamps
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (p *Project) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

func (a *Application) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

func (r *Review) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}
