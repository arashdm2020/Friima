package repositories

import (
	"github.com/fariima/backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type NFTRepository struct {
	db *gorm.DB
}

func NewNFTRepository(db *gorm.DB) *NFTRepository {
	return &NFTRepository{db: db}
}

func (r *NFTRepository) Create(nft *models.NFT) error {
	return r.db.Create(nft).Error
}

func (r *NFTRepository) GetByTokenID(tokenID int64) (*models.NFT, error) {
	var nft models.NFT
	err := r.db.Preload("Owner").Preload("Project").
		First(&nft, "token_id = ?", tokenID).Error
	return &nft, err
}

func (r *NFTRepository) GetByOwnerAddress(ownerAddr string) ([]models.NFT, error) {
	var nfts []models.NFT
	err := r.db.Where("owner_address = ?", ownerAddr).
		Preload("Project").
		Order("minted_at DESC").
		Find(&nfts).Error
	return nfts, err
}

func (r *NFTRepository) GetByOwnerID(ownerID uuid.UUID) ([]models.NFT, error) {
	var nfts []models.NFT
	err := r.db.Where("owner_id = ?", ownerID).
		Preload("Project").
		Order("minted_at DESC").
		Find(&nfts).Error
	return nfts, err
}

func (r *NFTRepository) Update(nft *models.NFT) error {
	return r.db.Save(nft).Error
}
