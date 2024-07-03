package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	userService     model.UserService
	courseService   model.CourseService
	buildingService model.BuildingService
	roomService     model.RoomService
	groupService    model.GroupService
}

type Config struct {
	R               *gin.Engine
	UserService     model.UserService
	CourseService   model.CourseService
	BuildingService model.BuildingService
	RoomService     model.RoomService
	GroupService    model.GroupService
}

func NewHandler(c *Config) {
	h := &Handler{
		userService:     c.UserService,
		courseService:   c.CourseService,
		buildingService: c.BuildingService,
		roomService:     c.RoomService,
		groupService:    c.GroupService,
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
