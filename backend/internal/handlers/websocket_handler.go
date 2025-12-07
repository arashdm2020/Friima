package handlers

import (
	"net/http"

	"github.com/fariima/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type WebSocketHandler struct {
	wsService *services.WebSocketService
	logger    *logrus.Logger
	upgrader  websocket.Upgrader
}

func NewWebSocketHandler(wsService *services.WebSocketService, logger *logrus.Logger) *WebSocketHandler {
	return &WebSocketHandler{
		wsService: wsService,
		logger:    logger,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
}

func (h *WebSocketHandler) HandleConnection(c *gin.Context) {
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id required"})
		return
	}

	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		h.logger.Errorf("Failed to upgrade connection: %v", err)
		return
	}

	h.wsService.AddClient(userID, conn)

	defer func() {
		h.wsService.RemoveClient(userID)
		conn.Close()
	}()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}
}
