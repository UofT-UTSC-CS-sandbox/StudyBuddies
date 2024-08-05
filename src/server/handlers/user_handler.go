package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

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

	user := model.User{Auth0ID: userData.Auth0ID, Username: userData.Username, Name: userData.Name, Courses: []model.Course{}}
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

func (h *Handler) GetUserCourses(ctx *gin.Context) {
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

	fmt.Println("Auth0 ID: ", auth0ID)
	fmt.Println("Course Name: ", courseData.CourseName)

	if err := h.userService.JoinCourse(auth0ID, courseData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

    if _, err := h.userService.AddUserCourse(auth0ID, model.UserCourseData{
        Course: courseData.CourseName,
    }); err != nil {
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

func (h *Handler) AddFriend(ctx *gin.Context) {

	var friendData struct {
		Username string `json:"username"`
	}

	if err := ctx.ShouldBindJSON(&friendData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	friend, err := h.userService.GetFriendByUsername(friendData.Username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could Not Find a User With That Name"})
	}

	auth0ID, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	fmt.Println("Auth0 ID: ", auth0ID)
	fmt.Println("Course Name: ", friendData.Username)

	if err := h.userService.AddFriend(auth0ID, friend.Auth0ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Friend Added successfully"})

}

func (h *Handler) RemoveFriend(ctx *gin.Context) {

	var friendData struct {
		Username string `json:"username"`
	}

	if err := ctx.ShouldBindJSON(&friendData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	friend, err := h.userService.GetFriendByUsername(friendData.Username)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could Not Find a User With That Name"})
	}

	auth0ID, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	fmt.Println("Auth0 ID: ", auth0ID)
	fmt.Println("Course Name: ", friendData.Username)

	if err := h.userService.RemoveFriend(auth0ID, friend.Auth0ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Friend Added successfully"})
}

func (h *Handler) GetFriends(ctx *gin.Context) {

	id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
	}

	friends, err := h.userService.GetFriends(id)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
	}

	ctx.JSON(http.StatusOK, gin.H{"friends": friends})
}
 
func (h *Handler) GetAllStudyLogs(ctx *gin.Context) {
    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    logs, err := h.userService.GetAllStudyLogs(id)
    
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }
    
    ctx.JSON(http.StatusOK, gin.H{"logs": logs})
}

func (h *Handler) GetStudyLogByCourse(ctx *gin.Context) {

    course := ctx.DefaultQuery("course", "UNKNOWN")

    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    log, err := h.userService.GetStudyLogByCourse(id, course) 

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"log": log})
}

func (h *Handler) UpdateStudyLogs(ctx *gin.Context) {

    var log struct {
        Course string `json:"name"`
        Time uint `json:"time"`
        CurrentGrade float32 `json:"grade"`
    }
	
    if err := ctx.ShouldBindJSON(&log); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }


    logs, err := h.userService.UpdateStudyLogs(id, model.StudyLog(log))

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"logs": logs})

}

func (h *Handler) AddUserCourse(ctx *gin.Context) {
    
    var ucData struct {
        Course string `json:"course"`
        Assignment string `json:"assignment"`
        Grade uint `json:"grade"`
        Weight float32 `json:"weight"`
    }
    
    if err := ctx.ShouldBindJSON(&ucData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
    
    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    uc, err := h.userService.AddUserCourse(id, model.UserCourseData(ucData))

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"user_courses": uc})
}

func (h *Handler) RemoveUserCourse(ctx *gin.Context) {

	var course struct {
		Name string `json:"name"`
	}

	if err := ctx.ShouldBindJSON(&course); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    courses, err := h.userService.RemoveUserCourse(id, course.Name)

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"courses": courses})
}

func (h *Handler) GetAllUserCourses(ctx *gin.Context) {
    
    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    courses, err := h.userService.GetAllUserCourses(id)
    
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }
    
    ctx.JSON(http.StatusOK, gin.H{"courses": courses})
}

func (h *Handler) GetUserCourseByName(ctx *gin.Context) {

    name := strings.Trim(ctx.Param("name"), ":")

    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    uc, err := h.userService.GetUserCourseByName(id, name)

    fmt.Printf("UC: %v", uc)

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"user_course": uc})
}
func (h *Handler) getStudyLogsByCourseForAllStudents(ctx *gin.Context) {
    
    course := ctx.DefaultQuery("course", "UNKNOWN")

    fmt.Printf("RECEIVED COURSE: %v", course)

    logs, err := h.userService.GetStudyLogsByCourseForAllStudents(course) 

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"log": logs})
}

func (h *Handler) RemoveAssignment(ctx *gin.Context) {

    course := ctx.DefaultQuery("course", "UNKNOWN")
    assignment := ctx.Query("assignment")

    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }
    
    _, err = h.userService.RemoveAssignment(id, course, assignment) 

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "Assignment Removed"})

}

func (h *Handler) UpdateLocation(ctx *gin.Context) {
    
    lat, err := strconv.ParseFloat(ctx.DefaultQuery("lat", "UNKNOWN"), 64)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to parse Latitude as float"})
    }
    long, err := strconv.ParseFloat(ctx.Query("long"), 64)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to parse Longitude as float"})
    }

    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    err = h.userService.UpdateLocation(id, lat, long)

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"message": "successfully updated your location"})

}

func (h *Handler) GetFriendsLocations(ctx *gin.Context) {
    
    id, err := getAuth0IDFromToken(ctx.Request.Header.Get("Authorization"), ctx)
    if err != nil {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Token"})
    }

    response, err := h.userService.GetFriendsLocations(id)

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Database Error"})
    }

    ctx.JSON(http.StatusOK, gin.H{"locations": response})
}
