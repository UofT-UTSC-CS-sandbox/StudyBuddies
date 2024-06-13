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

func getPemCert(token *jwt.Token) (string, error) {
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

	auth0ID, err := getAuth0IDFromToken(token, ctx)

	fmt.Println("Auth0 ID: ", auth0ID)

	user, err := h.userService.GetUser(auth0ID)
	if err == nil {
		fmt.Println("User Is Already Registered: ", user)
		ctx.JSON(http.StatusOK, gin.H{"message": "User already registered", "auth0_id": auth0ID})
	} else {
		fmt.Println("User Not Registered: ", err)
		ctx.JSON(http.StatusOK, gin.H{"message": "New user, please register", "auth0_id": auth0ID})
	}
}

func getAuth0IDFromToken(token string, ctx *gin.Context) (string, error) {
	if token == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		return "", nil
	}

	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		cert, err := getPemCert(token)
		if err != nil {
			fmt.Println("Error getting pem cert: ", err)
			return nil, err
		}

		result, _ := jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
		return result, nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return "", err
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	if !ok || !parsedToken.Valid {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return "", err
	}

	auth0ID := claims["sub"].(string)

	return auth0ID, nil

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

	auth0ID, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	if auth0ID != "" {
		userData.Auth0ID = auth0ID
	}

	user := model.User{Auth0ID: userData.Auth0ID, Username: userData.Username, Name: userData.Name}
	if _, err := h.userService.Register(&user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "user": user})
}

func (h *Handler) Login(ctx *gin.Context) {
	var userData struct {
		Auth0ID string `json:"auth0_id"`
	}

	if err := ctx.ShouldBindJSON(&userData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.userService.GetUser(userData.Auth0ID)

	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Login Successful"})
}

func (h *Handler) Delete(ctx *gin.Context) {
	auth0ID, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	if err := h.userService.DeleteUser(auth0ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (h *Handler) GetCourses(ctx *gin.Context) {
	auth0ID, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	courses, err := h.userService.GetCourses(auth0ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"courses": courses})
}

func (h *Handler) JoinCourse(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
	}

	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth0ID, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	if err := h.userService.JoinCourse(auth0ID, courseData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Course joined successfully"})
}

func (h *Handler) LeaveCourse(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
	}

	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	auth0ID, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	if err := h.userService.LeaveCourse(auth0ID, courseData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Course left successfully"})
}
