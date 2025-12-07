package services

import (
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type AnalyticsService struct {
	db          *gorm.DB
	redisClient *redis.Client
	logger      *logrus.Logger
}

type PlatformStats struct {
	TotalProjects     int64   `json:"total_projects"`
	ActiveProjects    int64   `json:"active_projects"`
	CompletedProjects int64   `json:"completed_projects"`
	TotalUsers        int64   `json:"total_users"`
	TotalFreelancers  int64   `json:"total_freelancers"`
	TotalClients      int64   `json:"total_clients"`
	TotalValueLocked  float64 `json:"total_value_locked"`
	DisputeRate       float64 `json:"dispute_rate"`
}

type UserStats struct {
	TotalProjects     int     `json:"total_projects"`
	CompletedProjects int     `json:"completed_projects"`
	ActiveProjects    int     `json:"active_projects"`
	Rating            float64 `json:"rating"`
	ReviewCount       int     `json:"review_count"`
	TotalEarned       float64 `json:"total_earned"`
	SuccessRate       float64 `json:"success_rate"`
}

func NewAnalyticsService(db *gorm.DB, redisClient *redis.Client, logger *logrus.Logger) *AnalyticsService {
	return &AnalyticsService{
		db:          db,
		redisClient: redisClient,
		logger:      logger,
	}
}

func (s *AnalyticsService) GetPlatformStats() (*PlatformStats, error) {
	var stats PlatformStats

	// Total projects
	s.db.Table("projects").Count(&stats.TotalProjects)

	// Active projects
	s.db.Table("projects").Where("status = ?", "in_progress").Count(&stats.ActiveProjects)

	// Completed projects
	s.db.Table("projects").Where("status = ?", "completed").Count(&stats.CompletedProjects)

	// Total users
	s.db.Table("users").Count(&stats.TotalUsers)

	// Calculate dispute rate
	var totalDisputes int64
	s.db.Table("disputes").Count(&totalDisputes)
	if stats.CompletedProjects > 0 {
		stats.DisputeRate = float64(totalDisputes) / float64(stats.CompletedProjects) * 100
	}

	return &stats, nil
}

func (s *AnalyticsService) GetUserStats(userAddress string) (*UserStats, error) {
	var stats UserStats

	// Get user stats from database
	var user struct {
		TotalProjects     int     `json:"total_projects"`
		CompletedProjects int     `json:"completed_projects"`
		Rating            float64 `json:"rating"`
		ReviewCount       int     `json:"review_count"`
	}

	s.db.Table("users").
		Select("total_projects, completed_projects, rating, review_count").
		Where("address = ?", userAddress).
		Scan(&user)

	stats.TotalProjects = user.TotalProjects
	stats.CompletedProjects = user.CompletedProjects
	stats.Rating = user.Rating
	stats.ReviewCount = user.ReviewCount

	// Calculate active projects
	var activeCount int64
	s.db.Table("projects").
		Where("(freelancer_id IN (SELECT id FROM users WHERE address = ?) OR client_id IN (SELECT id FROM users WHERE address = ?)) AND status = ?",
			userAddress, userAddress, "in_progress").
		Count(&activeCount)
	stats.ActiveProjects = int(activeCount)

	// Calculate success rate
	if stats.TotalProjects > 0 {
		stats.SuccessRate = float64(stats.CompletedProjects) / float64(stats.TotalProjects) * 100
	}

	return &stats, nil
}
