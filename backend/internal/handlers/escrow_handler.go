package handlers

import (
	"net/http"

	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type EscrowHandler struct {
	escrowService *services.EscrowService
	logger        *logrus.Logger
}

func NewEscrowHandler(escrowService *services.EscrowService, logger *logrus.Logger) *EscrowHandler {
	return &EscrowHandler{
		escrowService: escrowService,
		logger:        logger,
	}
}

// @Summary Deposit to escrow
// @Tags escrow
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param projectId path string true "Project ID"
// @Success 200 {object} map[string]interface{}
// @Router /escrow/{projectId}/deposit [post]
func (h *EscrowHandler) Deposit(c *gin.Context) {
	projectID, err := uuid.Parse(c.Param("projectId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deposit successful", "project_id": projectID})
}

// @Summary Release escrow payment
// @Tags escrow
// @Security BearerAuth
// @Param projectId path string true "Project ID"
// @Success 200 {object} map[string]interface{}
// @Router /escrow/{projectId}/release [post]
func (h *EscrowHandler) Release(c *gin.Context) {
	projectID, err := uuid.Parse(c.Param("projectId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment released", "project_id": projectID})
}

// @Summary Get escrow details
// @Tags escrow
// @Produce json
// @Param projectId path string true "Project ID"
// @Success 200 {object} models.Escrow
// @Router /escrow/{projectId} [get]
func (h *EscrowHandler) GetEscrow(c *gin.Context) {
	projectID, err := uuid.Parse(c.Param("projectId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	escrow, err := h.escrowService.GetEscrowByProjectID(projectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Escrow not found"})
		return
	}

	c.JSON(http.StatusOK, escrow)
}

// @Summary Get escrow history
// @Tags escrow
// @Produce json
// @Param projectId path string true "Project ID"
// @Success 200 {array} models.EscrowEvent
// @Router /escrow/{projectId}/history [get]
func (h *EscrowHandler) GetHistory(c *gin.Context) {
	projectID, err := uuid.Parse(c.Param("projectId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	escrow, err := h.escrowService.GetEscrowByProjectID(projectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Escrow not found"})
		return
	}

	history, err := h.escrowService.GetEscrowHistory(escrow.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get history"})
		return
	}

	c.JSON(http.StatusOK, history)
}
