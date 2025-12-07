package handlers

import (
	"net/http"

	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type AnalyticsHandler struct {
	analyticsService *services.AnalyticsService
	logger           *logrus.Logger
}

func NewAnalyticsHandler(analyticsService *services.AnalyticsService, logger *logrus.Logger) *AnalyticsHandler {
	return &AnalyticsHandler{
		analyticsService: analyticsService,
		logger:           logger,
	}
}

func (h *AnalyticsHandler) GetPlatformStats(c *gin.Context) {
	stats, err := h.analyticsService.GetPlatformStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *AnalyticsHandler) GetUserStats(c *gin.Context) {
	address := c.Param("address")

	stats, err := h.analyticsService.GetUserStats(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *AnalyticsHandler) GetProjectStats(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Project stats"})
}
