package handlers

import (
	"net/http"
	"strconv"

	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type NFTHandler struct {
	nftService *services.NFTService
	logger     *logrus.Logger
}

func NewNFTHandler(nftService *services.NFTService, logger *logrus.Logger) *NFTHandler {
	return &NFTHandler{
		nftService: nftService,
		logger:     logger,
	}
}

func (h *NFTHandler) GetNFT(c *gin.Context) {
	tokenID, err := strconv.ParseInt(c.Param("tokenId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
		return
	}

	nft, err := h.nftService.GetNFTByTokenID(tokenID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "NFT not found"})
		return
	}

	c.JSON(http.StatusOK, nft)
}

func (h *NFTHandler) GetUserNFTs(c *gin.Context) {
	address := c.Param("address")

	nfts, err := h.nftService.GetUserNFTs(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get NFTs"})
		return
	}

	c.JSON(http.StatusOK, nfts)
}

func (h *NFTHandler) GetMetadata(c *gin.Context) {
	tokenID, err := strconv.ParseInt(c.Param("tokenId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token ID"})
		return
	}

	nft, err := h.nftService.GetNFTByTokenID(tokenID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "NFT not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"name":        nft.Name,
		"description": nft.Description,
		"image":       nft.Image,
		"attributes":  nft.Attributes,
	})
}
