package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EscrowStatus string

const (
	EscrowStatusCreated   EscrowStatus = "created"
	EscrowStatusFunded    EscrowStatus = "funded"
	EscrowStatusReleased  EscrowStatus = "released"
	EscrowStatusDisputed  EscrowStatus = "disputed"
	EscrowStatusRefunded  EscrowStatus = "refunded"
)

type Escrow struct {
	ID          uuid.UUID    `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProjectID   uuid.UUID    `json:"project_id" gorm:"type:uuid;not null;index"`
	Project     Project      `json:"project" gorm:"foreignKey:ProjectID"`
	
	// Blockchain data
	OnChainID   int64        `json:"on_chain_id" gorm:"uniqueIndex;not null"`
	ClientAddr  string       `json:"client_address" gorm:"not null"`
	FreelancerAddr string    `json:"freelancer_address"`
	
	// Amounts
	Amount      string       `json:"amount" gorm:"not null"` // Wei string
	Token       string       `json:"token" gorm:"not null"` // USDC/USDT address
	PlatformFee string       `json:"platform_fee"` // 5%
	
	// Status
	Status      EscrowStatus `json:"status" gorm:"type:varchar(20);not null;index"`
	
	// Transaction hashes
	DepositTxHash  string    `json:"deposit_tx_hash"`
	ReleaseTxHash  string    `json:"release_tx_hash"`
	
	// Timestamps (from blockchain)
	CreatedAtBlock uint64    `json:"created_at_block"`
	FundedAtBlock  uint64    `json:"funded_at_block"`
	ReleasedAtBlock uint64   `json:"released_at_block"`
	
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
}

type EscrowEvent struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	EscrowID   uuid.UUID `json:"escrow_id" gorm:"type:uuid;not null;index"`
	
	// Event details
	EventType  string    `json:"event_type" gorm:"not null"` // deposit, release, dispute_initiated
	TxHash     string    `json:"tx_hash" gorm:"not null;index"`
	BlockNumber uint64   `json:"block_number" gorm:"not null"`
	
	// Data
	Data       map[string]interface{} `json:"data" gorm:"type:jsonb"`
	
	CreatedAt  time.Time `json:"created_at"`
}

func (e *Escrow) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}

func (e *EscrowEvent) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}
