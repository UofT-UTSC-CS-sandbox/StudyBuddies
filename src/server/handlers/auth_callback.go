package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type Jwks struct {
	Keys []JSONWebKeys `json:"keys"`
}

type JSONWebKeys struct {
	Kty string   `json:"kty"`
	Kid string   `json:"kid"`
	Use string   `json:"use"`
	N   string   `json:"n"`
	E   string   `json:"e"`
	X5c []string `json:"x5c"`
}

func (h *Handler) getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get("https://dev-b5grqf3saaizzpim.us.auth0.com/.well-known/jwks.json")

	if err != nil {
		return cert, err
	}
	defer resp.Body.Close()

	var jwks = Jwks{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)

	if err != nil {
		return cert, err
	}

	for k := range jwks.Keys {
		if token.Header["kid"] == jwks.Keys[k].Kid {
			cert = "-----BEGIN CERTIFICATE-----\n" + jwks.Keys[k].X5c[0] + "\n-----END CERTIFICATE-----"
		}
	}

	if cert == "" {
		return cert, fmt.Errorf("unable to find appropriate key")
	}

	return cert, nil
}

func (h *Handler) AuthCallbackHandler(ctx *gin.Context) {
	token := ctx.Request.Header.Get("Authorization")

	fmt.Println("Token: ", token)

	if token == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		return
	}

	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		cert, err := h.getPemCert(token)
		if err != nil {
			fmt.Println("Error getting pem cert: ", err)
			return nil, err
		}

		result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
		return result, nil
	})

	if err != nil {
		fmt.Println("Error parsing token: ", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	fmt.Println("Parsed Token: ", parsedToken)

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok || !parsedToken.Valid {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	auth0ID := claims["sub"].(string)

	user, err := h.userService.GetUser(auth0ID)
	if err == nil {
		fmt.Println("User Is Already Registered: ", user)
		ctx.JSON(http.StatusOK, gin.H{"message": "User already registered", "user": user})
	} else {
		fmt.Println("User Not Registered: ", err)
		ctx.JSON(http.StatusOK, gin.H{"message": "New user, please register", "auth0_id": auth0ID})
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
