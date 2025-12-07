package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Address   string         `json:"address" gorm:"uniqueIndex;not null"`
	Username  string         `json:"username" gorm:"index"`
	Email     string         `json:"email" gorm:"index"`
	FullName  string         `json:"full_name"`
	Bio       string         `json:"bio" gorm:"type:text"`
	Avatar    string         `json:"avatar"`
	Role      string         `json:"role" gorm:"default:'user'"` // user, freelancer, client, admin
	
	// Profile
	Title         string   `json:"title"`
	Skills        []string `json:"skills" gorm:"type:jsonb"`
	HourlyRate    float64  `json:"hourly_rate"`
	Location      string   `json:"location"`
	Languages     []string `json:"languages" gorm:"type:jsonb"`
	Website       string   `json:"website"`
	Github        string   `json:"github"`
	LinkedIn      string   `json:"linkedin"`
	Twitter       string   `json:"twitter"`
	
	// Stats
	TotalProjects   int     `json:"total_projects" gorm:"default:0"`
	CompletedProjects int   `json:"completed_projects" gorm:"default:0"`
	Rating          float64 `json:"rating" gorm:"default:0"`
	ReviewCount     int     `json:"review_count" gorm:"default:0"`
	
	// Blockchain
	Nonce         string    `json:"-" gorm:"not null"`
	NonceExpiry   time.Time `json:"-"`
	
	// Timestamps
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type Follow struct {
	ID         uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	FollowerID uuid.UUID `json:"follower_id" gorm:"type:uuid;not null;index"`
	FollowingID uuid.UUID `json:"following_id" gorm:"type:uuid;not null;index"`
	CreatedAt  time.Time `json:"created_at"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}
