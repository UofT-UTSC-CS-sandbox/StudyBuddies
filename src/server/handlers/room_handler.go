package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/gin-gonic/gin"
)

func (h *Handler) GetRoom(ctx *gin.Context) {
	var roomData struct {
		RoomName string `json:"room_name"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	room, err := h.roomService.GetRoom(roomData.RoomName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, room)
}

func (h *Handler) CreateRoom(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingCode string `json:"building_code"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	building, err := h.buildingService.GetBuilding(roomData.BuildingCode)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Building not found"})
		return
	}

	room := model.Room{RoomNumber: roomData.RoomName, BuildingCode: *building, Capacity: 0, Students: []model.User{}, Occupancy: 0}
	if _, err := h.roomService.CreateRoom(&room); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Room created successfully"})
}

func (h *Handler) DeleteRoom(ctx *gin.Context) {
	var roomData struct {
		RoomName string `json:"room_name"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.DeleteRoom(roomData.RoomName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Room deleted successfully"})
}

func (h *Handler) GetCourses(ctx *gin.Context) {
	var roomData struct {
		RoomName string `json:"room_name"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	courses, err := h.roomService.GetCourses(roomData.RoomName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"courses": courses})
}

func (h *Handler) AddCourse(ctx *gin.Context) {
	var courseData struct {
		RoomName   string `json:"room_name"`
		CourseName string `json:"course_name"`
	}
	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.courseService.GetCourse(courseData.CourseName)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	if err := h.roomService.AddCourse(courseData.RoomName, courseData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Course added successfully"})
}

func (h *Handler) RemoveCourse(ctx *gin.Context) {
	var courseData struct {
		RoomName   string `json:"room_name"`
		CourseName string `json:"course_name"`
	}
	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.RemoveCourse(courseData.RoomName, courseData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Course removed successfully"})
}

func (h *Handler) GetOccupants(ctx *gin.Context) {
	var roomData struct {
		RoomName string `json:"room_name"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	students, err := h.roomService.GetOccupants(roomData.RoomName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"students": students})
}

func (h *Handler) AddOccupant(ctx *gin.Context) {
	var occupantData struct {
		RoomName string `json:"room_name"`
		UserID   string `json:"user_id"`
	}
	if err := ctx.ShouldBindJSON(&occupantData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.userService.GetUser(occupantData.UserID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := h.roomService.AddOccupant(occupantData.RoomName, occupantData.UserID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "User added successfully"})
}

func (h *Handler) RemoveOccupant(ctx *gin.Context) {
	var occupantData struct {
		RoomName string `json:"room_name"`
		UserID   string `json:"user_id"`
	}
	if err := ctx.ShouldBindJSON(&occupantData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.RemoveOccupant(occupantData.RoomName, occupantData.UserID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User removed successfully"})
}

func (h *Handler) SetBuilding(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingCode string `json:"building_code"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingCode)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Building not found"})
		return
	}

	if err := h.roomService.SetBuilding(roomData.RoomName, roomData.BuildingCode); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Building set successfully"})
}

func (h *Handler) SetCapacity(ctx *gin.Context) {
	var roomData struct {
		RoomName string `json:"room_name"`
		Capacity int    `json:"capacity"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.SetCapacity(roomData.RoomName, roomData.Capacity); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Capacity set successfully"})
}

func (h *Handler) SetOccupancy(ctx *gin.Context) {
	var roomData struct {
		RoomName  string `json:"room_name"`
		Occupancy int    `json:"occupancy"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.SetOccupancy(roomData.RoomName, roomData.Occupancy); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Occupancy set successfully"})
}
