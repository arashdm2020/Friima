package handlers

import (
	"net/http"
	"strconv"

	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type DisputeHandler struct {
	disputeService *services.DisputeService
	logger         *logrus.Logger
}

func NewDisputeHandler(disputeService *services.DisputeService, logger *logrus.Logger) *DisputeHandler {
	return &DisputeHandler{
		disputeService: disputeService,
		logger:         logger,
	}
}

func (h *DisputeHandler) CreateDispute(c *gin.Context) {
	var dispute models.Dispute
	if err := c.ShouldBindJSON(&dispute); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.disputeService.CreateDispute(&dispute); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create dispute"})
		return
	}

	c.JSON(http.StatusCreated, dispute)
}

func (h *DisputeHandler) GetDispute(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dispute ID"})
		return
	}

	dispute, err := h.disputeService.GetDispute(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispute not found"})
		return
	}

	c.JSON(http.StatusOK, dispute)
}

func (h *DisputeHandler) GetDisputes(c *gin.Context) {
	status := c.Query("status")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	disputes, total, err := h.disputeService.ListDisputes(status, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list disputes"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"disputes": disputes,
		"total":    total,
		"limit":    limit,
		"offset":   offset,
	})
}

func (h *DisputeHandler) Vote(c *gin.Context) {
	disputeID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dispute ID"})
		return
	}

	userIDStr, _ := c.Get("user_id")
	voterID, _ := uuid.Parse(userIDStr.(string))

	var vote models.Vote
	if err := c.ShouldBindJSON(&vote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	vote.DisputeID = disputeID
	vote.VoterID = voterID

	if err := h.disputeService.CreateVote(&vote); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to vote"})
		return
	}

	c.JSON(http.StatusCreated, vote)
}

func (h *DisputeHandler) SubmitEvidence(c *gin.Context) {
	disputeID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dispute ID"})
		return
	}

	userIDStr, _ := c.Get("user_id")
	submitterID, _ := uuid.Parse(userIDStr.(string))

	var evidence models.Evidence
	if err := c.ShouldBindJSON(&evidence); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	evidence.DisputeID = disputeID
	evidence.SubmitterID = submitterID

	if err := h.disputeService.SubmitEvidence(&evidence); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit evidence"})
		return
	}

	c.JSON(http.StatusCreated, evidence)
}

func (h *DisputeHandler) GetVotes(c *gin.Context) {
	disputeID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid dispute ID"})
		return
	}

	votes, err := h.disputeService.GetVotes(disputeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get votes"})
		return
	}

	c.JSON(http.StatusOK, votes)
}
