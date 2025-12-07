package repositories

import (
	"github.com/fariima/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) GetByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, "id = ?", id).Error
	return &user, err
}

func (r *UserRepository) GetByAddress(address string) (*models.User, error) {
	var user models.User
	err := r.db.Where("address = ?", address).First(&user).Error
	return &user, err
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.User{}, "id = ?", id).Error
}

func (r *UserRepository) Search(query string, limit, offset int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	db := r.db.Model(&models.User{})
	
	if query != "" {
		db = db.Where("username ILIKE ? OR full_name ILIKE ? OR bio ILIKE ?", 
			"%"+query+"%", "%"+query+"%", "%"+query+"%")
	}

	db.Count(&total)
	err := db.Limit(limit).Offset(offset).Find(&users).Error

	return users, total, err
}

func (r *UserRepository) UpdateNonce(address, nonce string) error {
	return r.db.Model(&models.User{}).
		Where("address = ?", address).
		Update("nonce", nonce).Error
}
