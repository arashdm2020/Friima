package repositories

import (
	"github.com/fariima/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProjectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

func (r *ProjectRepository) Create(project *models.Project) error {
	return r.db.Create(project).Error
}

func (r *ProjectRepository) GetByID(id uuid.UUID) (*models.Project, error) {
	var project models.Project
	err := r.db.Preload("Client").Preload("Freelancer").First(&project, "id = ?", id).Error
	return &project, err
}

func (r *ProjectRepository) Update(project *models.Project) error {
	return r.db.Save(project).Error
}

func (r *ProjectRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Project{}, "id = ?", id).Error
}

func (r *ProjectRepository) List(filters map[string]interface{}, limit, offset int) ([]models.Project, int64, error) {
	var projects []models.Project
	var total int64

	db := r.db.Model(&models.Project{}).Preload("Client").Preload("Freelancer")

	// Apply filters
	for key, value := range filters {
		db = db.Where(key, value)
	}

	db.Count(&total)
	err := db.Order("created_at DESC").Limit(limit).Offset(offset).Find(&projects).Error

	return projects, total, err
}

func (r *ProjectRepository) Search(query string, category string, limit, offset int) ([]models.Project, int64, error) {
	var projects []models.Project
	var total int64

	db := r.db.Model(&models.Project{}).Preload("Client")

	if query != "" {
		db = db.Where("title ILIKE ? OR description ILIKE ?", "%"+query+"%", "%"+query+"%")
	}

	if category != "" {
		db = db.Where("category = ?", category)
	}

	db.Count(&total)
	err := db.Order("created_at DESC").Limit(limit).Offset(offset).Find(&projects).Error

	return projects, total, err
}

func (r *ProjectRepository) GetByClientID(clientID uuid.UUID) ([]models.Project, error) {
	var projects []models.Project
	err := r.db.Where("client_id = ?", clientID).
		Preload("Freelancer").
		Order("created_at DESC").
		Find(&projects).Error
	return projects, err
}

func (r *ProjectRepository) GetByFreelancerID(freelancerID uuid.UUID) ([]models.Project, error) {
	var projects []models.Project
	err := r.db.Where("freelancer_id = ?", freelancerID).
		Preload("Client").
		Order("created_at DESC").
		Find(&projects).Error
	return projects, err
}

// Applications
func (r *ProjectRepository) CreateApplication(app *models.Application) error {
	return r.db.Create(app).Error
}

func (r *ProjectRepository) GetApplicationsByProjectID(projectID uuid.UUID) ([]models.Application, error) {
	var applications []models.Application
	err := r.db.Where("project_id = ?", projectID).
		Preload("Freelancer").
		Order("created_at DESC").
		Find(&applications).Error
	return applications, err
}

func (r *ProjectRepository) UpdateApplication(app *models.Application) error {
	return r.db.Save(app).Error
}
