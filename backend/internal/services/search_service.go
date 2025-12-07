package services

import (
	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

type SearchService struct {
	projectRepo *repositories.ProjectRepository
	userRepo    *repositories.UserRepository
	redisClient *redis.Client
	logger      *logrus.Logger
}

func NewSearchService(
	projectRepo *repositories.ProjectRepository,
	userRepo *repositories.UserRepository,
	redisClient *redis.Client,
	logger *logrus.Logger,
) *SearchService {
	return &SearchService{
		projectRepo: projectRepo,
		userRepo:    userRepo,
		redisClient: redisClient,
		logger:      logger,
	}
}

func (s *SearchService) SearchProjects(query, category string, limit, offset int) ([]models.Project, int64, error) {
	return s.projectRepo.Search(query, category, limit, offset)
}

func (s *SearchService) SearchUsers(query string, limit, offset int) ([]models.User, int64, error) {
	return s.userRepo.Search(query, limit, offset)
}
