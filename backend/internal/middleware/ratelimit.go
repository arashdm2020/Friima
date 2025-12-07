package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/fariima/backend/internal/config"
	"github.com/gin-gonic/gin"
)

type visitor struct {
	requests int
	lastSeen time.Time
}

var (
	visitors = make(map[string]*visitor)
	mu       sync.RWMutex
)

func RateLimit(cfg *config.Config) gin.HandlerFunc {
	// Cleanup old visitors every minute
	go func() {
		for {
			time.Sleep(time.Minute)
			mu.Lock()
			for ip, v := range visitors {
				if time.Since(v.lastSeen) > time.Duration(cfg.RateLimitWindowSeconds)*time.Second {
					delete(visitors, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(c *gin.Context) {
		ip := c.ClientIP()

		mu.Lock()
		v, exists := visitors[ip]
		if !exists {
			visitors[ip] = &visitor{
				requests: 1,
				lastSeen: time.Now(),
			}
			mu.Unlock()
			c.Next()
			return
		}

		if time.Since(v.lastSeen) > time.Duration(cfg.RateLimitWindowSeconds)*time.Second {
			v.requests = 1
			v.lastSeen = time.Now()
			mu.Unlock()
			c.Next()
			return
		}

		if v.requests >= cfg.RateLimitRequests {
			mu.Unlock()
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded",
			})
			c.Abort()
			return
		}

		v.requests++
		v.lastSeen = time.Now()
		mu.Unlock()

		c.Next()
	}
}
