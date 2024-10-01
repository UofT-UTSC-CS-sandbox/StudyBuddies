package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/gin-gonic/gin"
)

func (h *Handler) GetRoom(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	room, err := h.roomService.GetRoom(roomData.RoomName, roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, room)
}

func (h *Handler) CreateRoom(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	building, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	room := model.Room{RoomNumber: roomData.RoomName, BuildingCode: *building, Students: []model.User{}}
	if _, err := h.roomService.CreateRoom(&room); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Room created successfully"})
}

func (h *Handler) DeleteRoom(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
	}
	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.DeleteRoom(roomData.RoomName, roomData.BuildingName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Room deleted successfully"})
}

func (h *Handler) GetCourses(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	courses, err := h.roomService.GetCourses(roomData.RoomName, roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"courses": courses})
}

func (h *Handler) AddCourse(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
		CourseName   string `json:"course_name"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.AddCourse(roomData.RoomName, roomData.BuildingName, roomData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Course added successfully"})
}

func (h *Handler) RemoveCourse(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
		CourseName   string `json:"course_name"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.RemoveCourse(roomData.RoomName, roomData.BuildingName, roomData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Course removed successfully"})
}

func (h *Handler) SetCapacity(ctx *gin.Context) {
	var buildingData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
		Capacity     int    `json:"capacity"`
	}

	if err := ctx.ShouldBindJSON(&buildingData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(buildingData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.SetCapacity(buildingData.RoomName, buildingData.BuildingName, buildingData.Capacity); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Capacity set successfully"})
}

func (h *Handler) SetOccupancy(ctx *gin.Context) {
	var buildingData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
		Occupancy    int    `json:"occupancy"`
	}

	if err := ctx.ShouldBindJSON(&buildingData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(buildingData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.SetOccupancy(buildingData.RoomName, buildingData.BuildingName, buildingData.Occupancy); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Occupancy set successfully"})
}

func (h *Handler) AddOccupant(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
		StudentID    string `json:"student_id"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.AddOccupant(roomData.RoomName, roomData.BuildingName, roomData.StudentID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Occupant added successfully"})
}

func (h *Handler) RemoveOccupant(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
		StudentID    string `json:"student_id"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.roomService.RemoveOccupant(roomData.RoomName, roomData.BuildingName, roomData.StudentID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Occupant removed successfully"})
}

func (h *Handler) GetOccupants(ctx *gin.Context) {
	var roomData struct {
		RoomName     string `json:"room_name"`
		BuildingName string `json:"building_name"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.buildingService.GetBuilding(roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	occupants, err := h.roomService.GetOccupants(roomData.RoomName, roomData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"occupants": occupants})
}
