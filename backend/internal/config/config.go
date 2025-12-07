package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server
	Port       string
	GinMode    string
	APIVersion string

	// Database
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// Redis
	RedisHost     string
	RedisPort     string
	RedisPassword string
	RedisDB       int

	// Blockchain
	PolygonRPCURL       string
	PolygonMumbaiRPCURL string
	ChainID             int64
	TestnetChainID      int64
	Network             string

	// Contract Addresses
	EscrowContract   string
	FARITokenContract string
	DAOContract      string
	NFTContract      string

	// IPFS
	IPFSAPIUrl     string
	IPFSGatewayURL string
	PinataAPIKey   string
	PinataSecretKey string

	// JWT
	JWTSecret          string
	JWTExpirationHours int

	// Indexer
	IndexerStartBlock     int64
	IndexerBatchSize      int
	IndexerIntervalSeconds int

	// Rate Limiting
	RateLimitRequests     int
	RateLimitWindowSeconds int

	// CORS
	CORSAllowedOrigins []string
	CORSAllowedMethods []string
	CORSAllowedHeaders []string

	// Logging
	LogLevel  string
	LogFormat string
}

func Load() (*Config, error) {
	// Load .env file if exists
	_ = godotenv.Load()

	cfg := &Config{
		// Server
		Port:       getEnv("PORT", "8080"),
		GinMode:    getEnv("GIN_MODE", "debug"),
		APIVersion: getEnv("API_VERSION", "v1"),

		// Database
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "fariima"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", "fariima_db"),
		DBSSLMode:  getEnv("DB_SSLMODE", "disable"),

		// Redis
		RedisHost:     getEnv("REDIS_HOST", "localhost"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       getEnvAsInt("REDIS_DB", 0),

		// Blockchain
		PolygonRPCURL:       getEnv("POLYGON_RPC_URL", "https://polygon-rpc.com"),
		PolygonMumbaiRPCURL: getEnv("POLYGON_MUMBAI_RPC_URL", "https://rpc-mumbai.maticvigil.com"),
		ChainID:             int64(getEnvAsInt("CHAIN_ID", 137)),
		TestnetChainID:      int64(getEnvAsInt("TESTNET_CHAIN_ID", 80001)),
		Network:             getEnv("NETWORK", "testnet"),

		// Contracts
		EscrowContract:   getEnv("ESCROW_CONTRACT", ""),
		FARITokenContract: getEnv("FARI_TOKEN_CONTRACT", ""),
		DAOContract:      getEnv("DAO_CONTRACT", ""),
		NFTContract:      getEnv("NFT_CONTRACT", ""),

		// IPFS
		IPFSAPIUrl:     getEnv("IPFS_API_URL", "https://api.pinata.cloud"),
		IPFSGatewayURL: getEnv("IPFS_GATEWAY_URL", "https://gateway.pinata.cloud/ipfs/"),
		PinataAPIKey:   getEnv("PINATA_API_KEY", ""),
		PinataSecretKey: getEnv("PINATA_SECRET_KEY", ""),

		// JWT
		JWTSecret:          getEnv("JWT_SECRET", "change-me-in-production"),
		JWTExpirationHours: getEnvAsInt("JWT_EXPIRATION_HOURS", 168),

		// Indexer
		IndexerStartBlock:     int64(getEnvAsInt("INDEXER_START_BLOCK", 0)),
		IndexerBatchSize:      getEnvAsInt("INDEXER_BATCH_SIZE", 1000),
		IndexerIntervalSeconds: getEnvAsInt("INDEXER_INTERVAL_SECONDS", 10),

		// Rate Limiting
		RateLimitRequests:     getEnvAsInt("RATE_LIMIT_REQUESTS", 100),
		RateLimitWindowSeconds: getEnvAsInt("RATE_LIMIT_WINDOW_SECONDS", 60),

		// CORS
		CORSAllowedOrigins: getEnvAsSlice("CORS_ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
		CORSAllowedMethods: getEnvAsSlice("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		CORSAllowedHeaders: getEnvAsSlice("CORS_ALLOWED_HEADERS", []string{"Content-Type", "Authorization"}),

		// Logging
		LogLevel:  getEnv("LOG_LEVEL", "info"),
		LogFormat: getEnv("LOG_FORMAT", "json"),
	}

	return cfg, cfg.Validate()
}

func (c *Config) Validate() error {
	if c.JWTSecret == "change-me-in-production" && c.GinMode == "release" {
		return fmt.Errorf("JWT_SECRET must be set in production")
	}

	if c.DBPassword == "" {
		return fmt.Errorf("DB_PASSWORD is required")
	}

	return nil
}

func (c *Config) GetDatabaseDSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
}

func (c *Config) GetRedisAddr() string {
	return fmt.Sprintf("%s:%s", c.RedisHost, c.RedisPort)
}

func (c *Config) GetRPCURL() string {
	if c.Network == "mainnet" {
		return c.PolygonRPCURL
	}
	return c.PolygonMumbaiRPCURL
}

func (c *Config) GetChainID() int64 {
	if c.Network == "mainnet" {
		return c.ChainID
	}
	return c.TestnetChainID
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

func getEnvAsSlice(key string, defaultValue []string) []string {
	valueStr := getEnv(key, "")
	if valueStr == "" {
		return defaultValue
	}
	return strings.Split(valueStr, ",")
}
