package database

import (
	"context"

	"github.com/fariima/backend/internal/config"
	"github.com/redis/go-redis/v9"
)

func NewRedisClient(cfg *config.Config) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     cfg.GetRedisAddr(),
		Password: cfg.RedisPassword,
		DB:       cfg.RedisDB,
	})
}

func PingRedis(client *redis.Client) error {
	ctx := context.Background()
	return client.Ping(ctx).Err()
}
