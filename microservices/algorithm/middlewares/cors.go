package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Set the allowed methods, headers, and credentials
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// Check if the request method is OPTIONS
		if c.Request.Method == "OPTIONS" {
			// Set the allowed origin and status code
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
			c.AbortWithStatus(http.StatusOK)
			return
		}

		// Set the allowed origin for other requests
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		// Call the next middleware or handler
		c.Next()
	}
}
