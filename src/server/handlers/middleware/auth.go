package middleware

import "github.com/gin-gonic/gin"

func AuthUser() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Next()
	}
}
