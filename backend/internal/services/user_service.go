package services

import (
	"context"
	"encoding/json"
	"time"

	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

type UserService struct {
	userRepo    *repositories.UserRepository
	redisClient *redis.Client
	logger      *logrus.Logger
}

func NewUserService(userRepo *repositories.UserRepository, redisClient *redis.Client, logger *logrus.Logger) *UserService {
	return &UserService{
		userRepo:    userRepo,
		redisClient: redisClient,
		logger:      logger,
	}
}

func (s *UserService) GetUserByID(id uuid.UUID) (*models.User, error) {
	// Try cache first
	ctx := context.Background()
	cacheKey := "user:" + id.String()

	cached, err := s.redisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var user models.User
		if json.Unmarshal([]byte(cached), &user) == nil {
			return &user, nil
		}
	}

	// Get from database
	user, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Cache for 5 minutes
	userJSON, _ := json.Marshal(user)
	s.redisClient.Set(ctx, cacheKey, userJSON, 5*time.Minute)

	return user, nil
}

func (s *UserService) GetUserByAddress(address string) (*models.User, error) {
	return s.userRepo.GetByAddress(address)
}

func (s *UserService) UpdateProfile(id uuid.UUID, updates map[string]interface{}) (*models.User, error) {
	user, err := s.userRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update allowed fields
	if username, ok := updates["username"].(string); ok {
		user.Username = username
	}
	if fullName, ok := updates["full_name"].(string); ok {
		user.FullName = fullName
	}
	if bio, ok := updates["bio"].(string); ok {
		user.Bio = bio
	}
	if avatar, ok := updates["avatar"].(string); ok {
		user.Avatar = avatar
	}
	if title, ok := updates["title"].(string); ok {
		user.Title = title
	}
	if hourlyRate, ok := updates["hourly_rate"].(float64); ok {
		user.HourlyRate = hourlyRate
	}
	if location, ok := updates["location"].(string); ok {
		user.Location = location
	}
	if website, ok := updates["website"].(string); ok {
		user.Website = website
	}

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	// Invalidate cache
	ctx := context.Background()
	s.redisClient.Del(ctx, "user:"+id.String())

	return user, nil
}

func (s *UserService) SearchUsers(query string, limit, offset int) ([]models.User, int64, error) {
	return s.userRepo.Search(query, limit, offset)
}
