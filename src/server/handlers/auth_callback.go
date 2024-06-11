package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func (h *Handler) AuthCallbackHandler(ctx *gin.Context) {
	token := ctx.Request.Header.Get("Authorization")

	if token == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		return
	}

	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte("AUTH0TOKEN NOT IN YET"), nil
	})
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok || !parsedToken.Valid {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	auth0ID := claims["sub"].(string)

	user, err := h.userService.GetUser(auth0ID)
	if err == nil {
		ctx.JSON(http.StatusOK, gin.H{"message": "User already registered", "user": user})
	} else {
		ctx.JSON(http.StatusOK, gin.H{"message": "New user, please register"})
	}
}

func (h *Handler) Register(ctx *gin.Context) {
	var userData struct {
		Auth0ID  string `json:"auth0_id"`
		Username string `json:"username"`
		Name     string `json:"name"`
	}

	if err := ctx.ShouldBindJSON(&userData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := model.User{Auth0ID: userData.Auth0ID, Username: userData.Username, Name: userData.Name}
	if _, err := h.userService.Register(&user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "user": user})
}
