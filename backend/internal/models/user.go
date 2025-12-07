package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID                uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	Email             string         `gorm:"uniqueIndex;not null" json:"email"`
	Password          string         `json:"-"` // Hashed password
	Role              string         `gorm:"not null;check:role IN ('client', 'freelancer')" json:"role"` // client or freelancer
	Address           string         `gorm:"uniqueIndex" json:"address"` // Wallet address (optional)
	Username          string         `gorm:"uniqueIndex" json:"username"`
	FullName          string         `json:"full_name"`
	Bio               string         `gorm:"type:text" json:"bio"`
	Avatar            string         `json:"avatar"`
	Title             string         `json:"title"` // For freelancers
	CompanyName       string         `json:"company_name"` // For clients
	Website           string         `json:"website"` // For clients
	Skills            datatypes.JSON `gorm:"type:jsonb;default:'[]'" json:"skills"` // For freelancers
	HourlyRate        float64        `json:"hourly_rate"` // For freelancers
	Location          string         `json:"location"`
	ResumeURL         string         `json:"resume_url"` // For freelancers
	Portfolio         datatypes.JSON `gorm:"type:jsonb;default:'[]'" json:"portfolio"` // For freelancers
	TotalProjects     int            `gorm:"default:0" json:"total_projects"`
	CompletedProjects int            `gorm:"default:0" json:"completed_projects"`
	Rating            float64        `gorm:"default:0" json:"rating"`
	ReviewCount       int            `gorm:"default:0" json:"review_count"`
	Verified          bool           `gorm:"default:false" json:"verified"` // For clients
	Nonce             string         `json:"-"`
	NonceExpiry       time.Time      `json:"-"`
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
	DeletedAt         gorm.DeletedAt `json:"-" gorm:"index"`
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
