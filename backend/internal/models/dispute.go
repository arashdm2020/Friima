package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DisputeStatus string

const (
	DisputeStatusOpen     DisputeStatus = "open"
	DisputeStatusVoting   DisputeStatus = "voting"
	DisputeStatusResolved DisputeStatus = "resolved"
	DisputeStatusClosed   DisputeStatus = "closed"
)

type Dispute struct {
	ID          uuid.UUID     `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	ProjectID   uuid.UUID     `json:"project_id" gorm:"type:uuid;not null;index"`
	Project     Project       `json:"project" gorm:"foreignKey:ProjectID"`
	EscrowID    uuid.UUID     `json:"escrow_id" gorm:"type:uuid;not null;index"`
	Escrow      Escrow        `json:"escrow" gorm:"foreignKey:EscrowID"`
	
	// Blockchain data
	OnChainID   int64         `json:"on_chain_id" gorm:"uniqueIndex;not null"`
	InitiatorAddr string      `json:"initiator_address" gorm:"not null"`
	
	// Dispute details
	Title       string        `json:"title" gorm:"not null"`
	Description string        `json:"description" gorm:"type:text;not null"`
	Category    string        `json:"category"` // quality, payment, deadline, etc.
	
	// Evidence
	Evidence    []Evidence    `json:"evidence" gorm:"foreignKey:DisputeID"`
	
	// Voting
	VotingEndsAt *time.Time   `json:"voting_ends_at"`
	TotalVotes   int          `json:"total_votes" gorm:"default:0"`
	ClientVotes  int          `json:"client_votes" gorm:"default:0"`
	FreelancerVotes int       `json:"freelancer_votes" gorm:"default:0"`
	
	// Resolution
	Status      DisputeStatus `json:"status" gorm:"type:varchar(20);not null;index"`
	Resolution  string        `json:"resolution" gorm:"type:text"`
	ClientSplit int           `json:"client_split"` // Percentage (0-100)
	FreelancerSplit int       `json:"freelancer_split"` // Percentage (0-100)
	
	// Transaction
	TxHash      string        `json:"tx_hash"`
	BlockNumber uint64        `json:"block_number"`
	
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
	ResolvedAt  *time.Time    `json:"resolved_at"`
}

type Evidence struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	DisputeID  uuid.UUID `json:"dispute_id" gorm:"type:uuid;not null;index"`
	SubmitterID uuid.UUID `json:"submitter_id" gorm:"type:uuid;not null"`
	Submitter  User      `json:"submitter" gorm:"foreignKey:SubmitterID"`
	
	// Evidence details
	Title      string    `json:"title" gorm:"not null"`
	Description string   `json:"description" gorm:"type:text"`
	FileType   string    `json:"file_type"` // document, image, video
	IPFSHash   string    `json:"ipfs_hash" gorm:"not null"`
	FileURL    string    `json:"file_url"`
	
	CreatedAt  time.Time `json:"created_at"`
}

type Vote struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	DisputeID  uuid.UUID `json:"dispute_id" gorm:"type:uuid;not null;index"`
	VoterID    uuid.UUID `json:"voter_id" gorm:"type:uuid;not null;index"`
	Voter      User      `json:"voter" gorm:"foreignKey:VoterID"`
	
	// Vote details
	VoterAddr  string    `json:"voter_address" gorm:"not null"`
	VoteFor    string    `json:"vote_for" gorm:"not null"` // client, freelancer
	Weight     int64     `json:"weight" gorm:"not null"` // Staked FARI amount
	
	// Blockchain
	TxHash     string    `json:"tx_hash" gorm:"not null"`
	BlockNumber uint64   `json:"block_number"`
	
	CreatedAt  time.Time `json:"created_at"`
}

func (d *Dispute) BeforeCreate(tx *gorm.DB) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	return nil
}

func (e *Evidence) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}

func (v *Vote) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}
