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

type ProjectHandler struct {
	projectService *services.ProjectService
	logger         *logrus.Logger
}

func NewProjectHandler(projectService *services.ProjectService, logger *logrus.Logger) *ProjectHandler {
	return &ProjectHandler{
		projectService: projectService,
		logger:         logger,
	}
}

// @Summary Create project
// @Tags projects
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param project body models.Project true "Project"
// @Success 201 {object} models.Project
// @Router /projects [post]
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	userIDStr, _ := c.Get("user_id")
	userID, _ := uuid.Parse(userIDStr.(string))

	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project.ClientID = userID

	if err := h.projectService.CreateProject(&project); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusCreated, project)
}

// @Summary Get project
// @Tags projects
// @Produce json
// @Param id path string true "Project ID"
// @Success 200 {object} models.Project
// @Router /projects/{id} [get]
func (h *ProjectHandler) GetProject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	project, err := h.projectService.GetProject(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, project)
}

// @Summary Update project
// @Tags projects
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Param updates body map[string]interface{} true "Updates"
// @Success 200 {object} models.Project
// @Router /projects/{id} [put]
func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := h.projectService.UpdateProject(id, updates)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
		return
	}

	c.JSON(http.StatusOK, project)
}

// @Summary Delete project
// @Tags projects
// @Security BearerAuth
// @Param id path string true "Project ID"
// @Success 200 {object} map[string]interface{}
// @Router /projects/{id} [delete]
func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	if err := h.projectService.DeleteProject(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted"})
}

// @Summary Apply to project
// @Tags projects
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Param application body models.Application true "Application"
// @Success 201 {object} models.Application
// @Router /projects/{id}/apply [post]
func (h *ProjectHandler) ApplyToProject(c *gin.Context) {
	projectID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	userIDStr, _ := c.Get("user_id")
	freelancerID, _ := uuid.Parse(userIDStr.(string))

	var app models.Application
	if err := c.ShouldBindJSON(&app); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	app.ProjectID = projectID
	app.FreelancerID = freelancerID

	if err := h.projectService.ApplyToProject(&app); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to apply"})
		return
	}

	c.JSON(http.StatusCreated, app)
}

// @Summary Get project applications
// @Tags projects
// @Security BearerAuth
// @Produce json
// @Param id path string true "Project ID"
// @Success 200 {array} models.Application
// @Router /projects/{id}/applications [get]
func (h *ProjectHandler) GetApplications(c *gin.Context) {
	projectID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	applications, err := h.projectService.GetApplications(projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get applications"})
		return
	}

	c.JSON(http.StatusOK, applications)
}

// @Summary Update application status
// @Tags projects
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "Project ID"
// @Param appId path string true "Application ID"
// @Param status body map[string]string true "Status"
// @Success 200 {object} models.Application
// @Router /projects/{id}/applications/{appId} [put]
func (h *ProjectHandler) UpdateApplication(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Application updated"})
}

// @Summary Complete project
// @Tags projects
// @Security BearerAuth
// @Param id path string true "Project ID"
// @Success 200 {object} map[string]interface{}
// @Router /projects/{id}/complete [post]
func (h *ProjectHandler) CompleteProject(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Project completed"})
}
