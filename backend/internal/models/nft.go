package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type NFT struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	TokenID     int64     `json:"token_id" gorm:"uniqueIndex;not null"`
	OwnerID     uuid.UUID `json:"owner_id" gorm:"type:uuid;not null;index"`
	Owner       User      `json:"owner" gorm:"foreignKey:OwnerID"`
	ProjectID   uuid.UUID `json:"project_id" gorm:"type:uuid;not null;index"`
	Project     Project   `json:"project" gorm:"foreignKey:ProjectID"`
	
	// Blockchain data
	OwnerAddr   string    `json:"owner_address" gorm:"not null;index"`
	TokenURI    string    `json:"token_uri"`
	
	// Metadata
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text"`
	Image       string    `json:"image"`
	Attributes  map[string]interface{} `json:"attributes" gorm:"type:jsonb"`
	
	// Transaction
	MintTxHash  string    `json:"mint_tx_hash" gorm:"not null"`
	BlockNumber uint64    `json:"block_number"`
	
	// Timestamps
	MintedAt    time.Time `json:"minted_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (n *NFT) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return nil
}
