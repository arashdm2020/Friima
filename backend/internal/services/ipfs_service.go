package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/fariima/backend/internal/config"
	"github.com/sirupsen/logrus"
)

type IPFSService struct {
	cfg    *config.Config
	logger *logrus.Logger
}

type PinataResponse struct {
	IpfsHash  string `json:"IpfsHash"`
	PinSize   int    `json:"PinSize"`
	Timestamp string `json:"Timestamp"`
}

func NewIPFSService(cfg *config.Config, logger *logrus.Logger) *IPFSService {
	return &IPFSService{
		cfg:    cfg,
		logger: logger,
	}
}

func (s *IPFSService) UploadFile(filename string, content []byte) (string, error) {
	url := s.cfg.IPFSAPIUrl + "/pinning/pinFileToIPFS"

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return "", err
	}

	if _, err := part.Write(content); err != nil {
		return "", err
	}

	if err := writer.Close(); err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("pinata_api_key", s.cfg.PinataAPIKey)
	req.Header.Set("pinata_secret_api_key", s.cfg.PinataSecretKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("pinata error: %s", string(bodyBytes))
	}

	var result PinataResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.IpfsHash, nil
}

func (s *IPFSService) UploadJSON(data interface{}) (string, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	url := s.cfg.IPFSAPIUrl + "/pinning/pinJSONToIPFS"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("pinata_api_key", s.cfg.PinataAPIKey)
	req.Header.Set("pinata_secret_api_key", s.cfg.PinataSecretKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("pinata error: %s", string(bodyBytes))
	}

	var result PinataResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.IpfsHash, nil
}

func (s *IPFSService) GetFileURL(hash string) string {
	return s.cfg.IPFSGatewayURL + hash
}
