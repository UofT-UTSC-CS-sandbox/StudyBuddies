package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	userService   model.UserService
	courseService model.CourseService
	chatService   model.ChatService
}

type Config struct {
	R             *gin.Engine
	UserService   model.UserService
	CourseService model.CourseService
	ChatService   model.ChatService
}

func NewHandler(c *Config) {
	h := &Handler{
		userService:   c.UserService,
		courseService: c.CourseService,
		chatService:   c.ChatService,
	}
	c.R.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not Found: Invalid API Route"})
	})

	accGroup := c.R.Group("/api/account")

	accGroup.POST("/register", h.Register)
	accGroup.POST("/auth/callback", h.AuthCallbackHandler)
	accGroup.POST("/login", h.Login)
	accGroup.DELETE("/delete", h.Delete)
	accGroup.GET("/courses", h.GetCourses)
	accGroup.POST("/courses/join", h.JoinCourse)
	accGroup.POST("/courses/leave", h.LeaveCourse)
	accGroup.POST("/courses/create", h.CreateCourse)
	accGroup.DELETE("/courses/delete", h.DeleteCourse)
	accGroup.GET("/courses/get", h.GetCourse)
	accGroup.GET("/courses/get_all", h.GetAllCourses)
	accGroup.GET("/courses/students", h.GetStudents)
	accGroup.PUT("/courses/add_student", h.AddStudent)
	accGroup.PUT("/courses/remove_student", h.RemoveStudent)

}
