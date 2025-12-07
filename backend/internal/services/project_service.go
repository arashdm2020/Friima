package services

import (
	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type ProjectService struct {
	projectRepo       *repositories.ProjectRepository
	blockchainService *BlockchainService
	logger            *logrus.Logger
}

func NewProjectService(
	projectRepo *repositories.ProjectRepository,
	blockchainService *BlockchainService,
	logger *logrus.Logger,
) *ProjectService {
	return &ProjectService{
		projectRepo:       projectRepo,
		blockchainService: blockchainService,
		logger:            logger,
	}
}

func (s *ProjectService) CreateProject(project *models.Project) error {
	project.Status = models.ProjectStatusDraft
	return s.projectRepo.Create(project)
}

func (s *ProjectService) GetProject(id uuid.UUID) (*models.Project, error) {
	return s.projectRepo.GetByID(id)
}

func (s *ProjectService) UpdateProject(id uuid.UUID, updates map[string]interface{}) (*models.Project, error) {
	project, err := s.projectRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// Update allowed fields
	if title, ok := updates["title"].(string); ok {
		project.Title = title
	}
	if description, ok := updates["description"].(string); ok {
		project.Description = description
	}
	if category, ok := updates["category"].(string); ok {
		project.Category = category
	}
	if budget, ok := updates["budget"].(float64); ok {
		project.Budget = budget
	}
	if duration, ok := updates["duration"].(float64); ok {
		project.Duration = int(duration)
	}

	if err := s.projectRepo.Update(project); err != nil {
		return nil, err
	}

	return project, nil
}

func (s *ProjectService) DeleteProject(id uuid.UUID) error {
	return s.projectRepo.Delete(id)
}

func (s *ProjectService) ListProjects(filters map[string]interface{}, limit, offset int) ([]models.Project, int64, error) {
	return s.projectRepo.List(filters, limit, offset)
}

func (s *ProjectService) SearchProjects(query, category string, limit, offset int) ([]models.Project, int64, error) {
	return s.projectRepo.Search(query, category, limit, offset)
}

func (s *ProjectService) GetUserProjects(userID uuid.UUID, role string) ([]models.Project, error) {
	if role == "client" {
		return s.projectRepo.GetByClientID(userID)
	}
	return s.projectRepo.GetByFreelancerID(userID)
}

// Applications
func (s *ProjectService) ApplyToProject(app *models.Application) error {
	app.Status = "pending"
	return s.projectRepo.CreateApplication(app)
}

func (s *ProjectService) GetApplications(projectID uuid.UUID) ([]models.Application, error) {
	return s.projectRepo.GetApplicationsByProjectID(projectID)
}

func (s *ProjectService) UpdateApplication(app *models.Application) error {
	return s.projectRepo.UpdateApplication(app)
}
