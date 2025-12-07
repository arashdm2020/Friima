package services

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/fariima/backend/internal/config"
	"github.com/fariima/backend/internal/models"
	"github.com/fariima/backend/internal/repositories"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sirupsen/logrus"
)

type AuthService struct {
	cfg      *config.Config
	userRepo *repositories.UserRepository
	logger   *logrus.Logger
}

type Claims struct {
	UserID  string `json:"user_id"`
	Address string `json:"address"`
	jwt.RegisteredClaims
}

func NewAuthService(cfg *config.Config, userRepo *repositories.UserRepository, logger *logrus.Logger) *AuthService {
	return &AuthService{
		cfg:      cfg,
		userRepo: userRepo,
		logger:   logger,
	}
}

func (s *AuthService) GenerateNonce() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func (s *AuthService) GetOrCreateNonce(address string) (string, error) {
	address = strings.ToLower(address)
	
	user, err := s.userRepo.GetByAddress(address)
	if err != nil {
		// User doesn't exist, create new user
		nonce, err := s.GenerateNonce()
		if err != nil {
			return "", err
		}

		user = &models.User{
			Address:     address,
			Nonce:       nonce,
			NonceExpiry: time.Now().Add(15 * time.Minute),
		}

		if err := s.userRepo.Create(user); err != nil {
			return "", err
		}

		return nonce, nil
	}

	// Check if nonce is expired
	if time.Now().After(user.NonceExpiry) {
		nonce, err := s.GenerateNonce()
		if err != nil {
			return "", err
		}

		user.Nonce = nonce
		user.NonceExpiry = time.Now().Add(15 * time.Minute)

		if err := s.userRepo.Update(user); err != nil {
			return "", err
		}

		return nonce, nil
	}

	return user.Nonce, nil
}

func (s *AuthService) VerifySignature(address, signature, nonce string) error {
	address = strings.ToLower(address)
	
	// Get user
	user, err := s.userRepo.GetByAddress(address)
	if err != nil {
		return fmt.Errorf("user not found")
	}

	// Check nonce
	if user.Nonce != nonce {
		return fmt.Errorf("invalid nonce")
	}

	// Check nonce expiry
	if time.Now().After(user.NonceExpiry) {
		return fmt.Errorf("nonce expired")
	}

	// Verify signature
	message := fmt.Sprintf("Sign this message to authenticate with FARIIMA.\n\nNonce: %s", nonce)
	messageHash := accounts.TextHash([]byte(message))

	sig, err := hexutil.Decode(signature)
	if err != nil {
		return fmt.Errorf("invalid signature format")
	}

	if len(sig) != 65 {
		return fmt.Errorf("invalid signature length")
	}

	// Adjust V value (EIP-155)
	if sig[64] >= 27 {
		sig[64] -= 27
	}

	pubKey, err := crypto.SigToPub(messageHash, sig)
	if err != nil {
		return fmt.Errorf("failed to recover public key")
	}

	recoveredAddr := crypto.PubkeyToAddress(*pubKey)
	
	if strings.ToLower(recoveredAddr.Hex()) != address {
		return fmt.Errorf("signature verification failed")
	}

	return nil
}

func (s *AuthService) GenerateToken(user *models.User) (string, error) {
	expirationTime := time.Now().Add(time.Duration(s.cfg.JWTExpirationHours) * time.Hour)

	claims := &Claims{
		UserID:  user.ID.String(),
		Address: user.Address,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "fariima-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.cfg.JWTSecret))
}

func (s *AuthService) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.cfg.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

func (s *AuthService) Login(address, signature, nonce string) (string, *models.User, error) {
	// Verify signature
	if err := s.VerifySignature(address, signature, nonce); err != nil {
		return "", nil, err
	}

	// Get user
	user, err := s.userRepo.GetByAddress(strings.ToLower(address))
	if err != nil {
		return "", nil, err
	}

	// Invalidate nonce
	newNonce, _ := s.GenerateNonce()
	user.Nonce = newNonce
	user.NonceExpiry = time.Now().Add(15 * time.Minute)
	s.userRepo.Update(user)

	// Generate token
	token, err := s.GenerateToken(user)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}
