package services

import (
	"encoding/json"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type WebSocketService struct {
	clients map[string]*websocket.Conn
	mu      sync.RWMutex
	logger  *logrus.Logger
}

type WSMessage struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

func NewWebSocketService(logger *logrus.Logger) *WebSocketService {
	return &WebSocketService{
		clients: make(map[string]*websocket.Conn),
		logger:  logger,
	}
}

func (s *WebSocketService) AddClient(userID string, conn *websocket.Conn) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.clients[userID] = conn
	s.logger.Infof("WebSocket client added: %s", userID)
}

func (s *WebSocketService) RemoveClient(userID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if conn, ok := s.clients[userID]; ok {
		conn.Close()
		delete(s.clients, userID)
		s.logger.Infof("WebSocket client removed: %s", userID)
	}
}

func (s *WebSocketService) SendToUser(userID string, message WSMessage) error {
	s.mu.RLock()
	conn, ok := s.clients[userID]
	s.mu.RUnlock()

	if !ok {
		return nil // User not connected
	}

	data, err := json.Marshal(message)
	if err != nil {
		return err
	}

	return conn.WriteMessage(websocket.TextMessage, data)
}

func (s *WebSocketService) Broadcast(message WSMessage) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	data, err := json.Marshal(message)
	if err != nil {
		s.logger.Errorf("Failed to marshal broadcast message: %v", err)
		return
	}

	for userID, conn := range s.clients {
		if err := conn.WriteMessage(websocket.TextMessage, data); err != nil {
			s.logger.Errorf("Failed to send message to %s: %v", userID, err)
		}
	}
}

func (s *WebSocketService) NotifyProjectUpdate(projectID string, data interface{}) {
	message := WSMessage{
		Type:    "project_update",
		Payload: data,
	}
	s.Broadcast(message)
}

func (s *WebSocketService) NotifyDisputeUpdate(disputeID string, data interface{}) {
	message := WSMessage{
		Type:    "dispute_update",
		Payload: data,
	}
	s.Broadcast(message)
}

func (s *WebSocketService) NotifyEscrowUpdate(escrowID string, data interface{}) {
	message := WSMessage{
		Type:    "escrow_update",
		Payload: data,
	}
	s.Broadcast(message)
}
