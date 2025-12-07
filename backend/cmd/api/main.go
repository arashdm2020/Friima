package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/fariima/backend/internal/config"
	"github.com/fariima/backend/internal/database"
	"github.com/fariima/backend/internal/handlers"
	"github.com/fariima/backend/internal/middleware"
	"github.com/fariima/backend/internal/repositories"
	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// @title FARIIMA API
// @version 1.0
// @description Production-ready backend for FARIIMA decentralized freelance platform
// @host localhost:8080
// @BasePath /api/v1
// @schemes http https
func main() {
	// Initialize logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.InfoLevel)

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		logger.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	db, err := database.NewPostgresDB(cfg)
	if err != nil {
		logger.Fatalf("Failed to connect to database: %v", err)
	}

	// Run migrations
	if err := database.RunMigrations(db); err != nil {
		logger.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize Redis
	redisClient := database.NewRedisClient(cfg)

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	projectRepo := repositories.NewProjectRepository(db)
	escrowRepo := repositories.NewEscrowRepository(db)
	disputeRepo := repositories.NewDisputeRepository(db)
	nftRepo := repositories.NewNFTRepository(db)
	
	// Initialize services
	blockchainService := services.NewBlockchainService(cfg, logger)
	authService := services.NewAuthService(cfg, userRepo, logger)
	userService := services.NewUserService(userRepo, redisClient, logger)
	projectService := services.NewProjectService(projectRepo, blockchainService, logger)
	escrowService := services.NewEscrowService(escrowRepo, blockchainService, logger)
	disputeService := services.NewDisputeService(disputeRepo, blockchainService, logger)
	nftService := services.NewNFTService(nftRepo, blockchainService, logger)
	ipfsService := services.NewIPFSService(cfg, logger)
	searchService := services.NewSearchService(projectRepo, userRepo, redisClient, logger)
	analyticsService := services.NewAnalyticsService(db, redisClient, logger)
	wsService := services.NewWebSocketService(logger)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService, logger)
	userHandler := handlers.NewUserHandler(userService, logger)
	projectHandler := handlers.NewProjectHandler(projectService, logger)
	escrowHandler := handlers.NewEscrowHandler(escrowService, logger)
	disputeHandler := handlers.NewDisputeHandler(disputeService, logger)
	nftHandler := handlers.NewNFTHandler(nftService, logger)
	ipfsHandler := handlers.NewIPFSHandler(ipfsService, logger)
	searchHandler := handlers.NewSearchHandler(searchService, logger)
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsService, logger)
	wsHandler := handlers.NewWebSocketHandler(wsService, logger)

	// Setup router
	router := setupRouter(cfg, 
		authHandler, 
		userHandler, 
		projectHandler,
		escrowHandler,
		disputeHandler,
		nftHandler,
		ipfsHandler,
		searchHandler,
		analyticsHandler,
		wsHandler,
		authService,
	)

	// Start blockchain indexer
	indexer := services.NewBlockchainIndexer(cfg, blockchainService, escrowRepo, disputeRepo, nftRepo, logger)
	go indexer.Start(context.Background())

	// Start HTTP server
	srv := &http.Server{
		Addr:           fmt.Sprintf(":%s", cfg.Port),
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	// Graceful shutdown
	go func() {
		logger.Infof("Server starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatalf("Server forced to shutdown: %v", err)
	}

	logger.Info("Server exited")
}

func setupRouter(
	cfg *config.Config,
	authHandler *handlers.AuthHandler,
	userHandler *handlers.UserHandler,
	projectHandler *handlers.ProjectHandler,
	escrowHandler *handlers.EscrowHandler,
	disputeHandler *handlers.DisputeHandler,
	nftHandler *handlers.NFTHandler,
	ipfsHandler *handlers.IPFSHandler,
	searchHandler *handlers.SearchHandler,
	analyticsHandler *handlers.AnalyticsHandler,
	wsHandler *handlers.WebSocketHandler,
	authService *services.AuthService,
) *gin.Engine {
	if cfg.GinMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.Logger())
	router.Use(middleware.CORS(cfg))
	router.Use(middleware.RateLimit(cfg))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Public routes
		auth := v1.Group("/auth")
		{
			auth.POST("/nonce", authHandler.GetNonce)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// Public search
		v1.GET("/search/projects", searchHandler.SearchProjects)
		v1.GET("/search/users", searchHandler.SearchUsers)

		// Public analytics
		v1.GET("/analytics/platform", analyticsHandler.GetPlatformStats)

		// Protected routes
		protected := v1.Group("")
		protected.Use(middleware.Auth(authService))
		{
			// User routes
			users := protected.Group("/users")
			{
				users.GET("/me", userHandler.GetCurrentUser)
				users.PUT("/me", userHandler.UpdateProfile)
				users.GET("/:address", userHandler.GetUserByAddress)
				users.GET("/:address/projects", userHandler.GetUserProjects)
				users.GET("/:address/nfts", userHandler.GetUserNFTs)
				users.POST("/:address/follow", userHandler.FollowUser)
				users.DELETE("/:address/follow", userHandler.UnfollowUser)
			}

			// Project routes
			projects := protected.Group("/projects")
			{
				projects.POST("", projectHandler.CreateProject)
				projects.GET("/:id", projectHandler.GetProject)
				projects.PUT("/:id", projectHandler.UpdateProject)
				projects.DELETE("/:id", projectHandler.DeleteProject)
				projects.POST("/:id/apply", projectHandler.ApplyToProject)
				projects.GET("/:id/applications", projectHandler.GetApplications)
				projects.PUT("/:id/applications/:appId", projectHandler.UpdateApplication)
				projects.POST("/:id/complete", projectHandler.CompleteProject)
			}

			// Escrow routes
			escrow := protected.Group("/escrow")
			{
				escrow.POST("/:projectId/deposit", escrowHandler.Deposit)
				escrow.POST("/:projectId/release", escrowHandler.Release)
				escrow.GET("/:projectId", escrowHandler.GetEscrow)
				escrow.GET("/:projectId/history", escrowHandler.GetHistory)
			}

			// Dispute routes
			disputes := protected.Group("/disputes")
			{
				disputes.POST("", disputeHandler.CreateDispute)
				disputes.GET("/:id", disputeHandler.GetDispute)
				disputes.GET("", disputeHandler.GetDisputes)
				disputes.POST("/:id/vote", disputeHandler.Vote)
				disputes.POST("/:id/evidence", disputeHandler.SubmitEvidence)
				disputes.GET("/:id/votes", disputeHandler.GetVotes)
			}

			// NFT routes
			nfts := protected.Group("/nfts")
			{
				nfts.GET("/:tokenId", nftHandler.GetNFT)
				nfts.GET("/user/:address", nftHandler.GetUserNFTs)
				nfts.GET("/:tokenId/metadata", nftHandler.GetMetadata)
			}

			// IPFS routes
			ipfs := protected.Group("/ipfs")
			{
				ipfs.POST("/upload", ipfsHandler.Upload)
				ipfs.GET("/:hash", ipfsHandler.Get)
			}

			// Analytics
			analytics := protected.Group("/analytics")
			{
				analytics.GET("/user/:address", analyticsHandler.GetUserStats)
				analytics.GET("/project/:id", analyticsHandler.GetProjectStats)
			}
		}

		// WebSocket
		v1.GET("/ws", wsHandler.HandleConnection)
	}

	return router
}
