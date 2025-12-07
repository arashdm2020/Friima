package handlers

import (
	"net/http"

	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

type UserHandler struct {
	userService *services.UserService
	logger      *logrus.Logger
}

func NewUserHandler(userService *services.UserService, logger *logrus.Logger) *UserHandler {
	return &UserHandler{
		userService: userService,
		logger:      logger,
	}
}

// @Summary Get current user
// @Tags users
// @Security BearerAuth
// @Produce json
// @Success 200 {object} models.User
// @Router /users/me [get]
func (h *UserHandler) GetCurrentUser(c *gin.Context) {
	userIDStr, _ := c.Get("user_id")
	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, err := h.userService.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// @Summary Get user by address
// @Tags users
// @Produce json
// @Param address path string true "User address"
// @Success 200 {object} models.User
// @Router /users/{address} [get]
func (h *UserHandler) GetUserByAddress(c *gin.Context) {
	address := c.Param("address")

	user, err := h.userService.GetUserByAddress(address)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// @Summary Update user profile
// @Tags users
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body map[string]interface{} true "Profile updates"
// @Success 200 {object} models.User
// @Router /users/me [put]
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userIDStr, _ := c.Get("user_id")
	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.UpdateProfile(userID, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// @Summary Get user projects
// @Tags users
// @Produce json
// @Param address path string true "User address"
// @Success 200 {array} models.Project
// @Router /users/{address}/projects [get]
func (h *UserHandler) GetUserProjects(c *gin.Context) {
	address := c.Param("address")

	user, err := h.userService.GetUserByAddress(address)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user_id": user.ID})
}

// @Summary Get user NFTs
// @Tags users
// @Produce json
// @Param address path string true "User address"
// @Success 200 {array} models.NFT
// @Router /users/{address}/nfts [get]
func (h *UserHandler) GetUserNFTs(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"nfts": []interface{}{}})
}

// @Summary Follow user
// @Tags users
// @Security BearerAuth
// @Param address path string true "User address to follow"
// @Success 200 {object} map[string]interface{}
// @Router /users/{address}/follow [post]
func (h *UserHandler) FollowUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "User followed"})
}

// @Summary Unfollow user
// @Tags users
// @Security BearerAuth
// @Param address path string true "User address to unfollow"
// @Success 200 {object} map[string]interface{}
// @Router /users/{address}/follow [delete]
func (h *UserHandler) UnfollowUser(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "User unfollowed"})
}
