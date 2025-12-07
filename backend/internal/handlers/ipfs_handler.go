package handlers

import (
	"io"
	"net/http"

	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type IPFSHandler struct {
	ipfsService *services.IPFSService
	logger      *logrus.Logger
}

func NewIPFSHandler(ipfsService *services.IPFSService, logger *logrus.Logger) *IPFSHandler {
	return &IPFSHandler{
		ipfsService: ipfsService,
		logger:      logger,
	}
}

func (h *IPFSHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	hash, err := h.ipfsService.UploadFile(header.Filename, content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload to IPFS"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"hash": hash,
		"url":  h.ipfsService.GetFileURL(hash),
	})
}

func (h *IPFSHandler) Get(c *gin.Context) {
	hash := c.Param("hash")
	url := h.ipfsService.GetFileURL(hash)

	c.JSON(http.StatusOK, gin.H{
		"hash": hash,
		"url":  url,
	})
}
