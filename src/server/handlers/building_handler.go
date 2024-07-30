package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/gin-gonic/gin"
)

func (h *Handler) GetBuilding(ctx *gin.Context) {
	var buildingData struct {
		BuildingName string `json:"building_name"`
	}

	if err := ctx.ShouldBindJSON(&buildingData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	building, err := h.buildingService.GetBuilding(buildingData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, building)
}

func (h *Handler) CreateBuilding(ctx *gin.Context) {
	var buildingData struct {
		BuildingName string `json:"building_name"`
	}
	if err := ctx.ShouldBindJSON(&buildingData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	building := model.Building{Name: buildingData.BuildingName, Rooms: []model.Room{}}
	if _, err := h.buildingService.CreateBuilding(&building); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Building created successfully"})
}

func (h *Handler) DeleteBuilding(ctx *gin.Context) {
	var buildingData struct {
		BuildingName string `json:"building_name"`
	}
	if err := ctx.ShouldBindJSON(&buildingData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.buildingService.DeleteBuilding(buildingData.BuildingName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Building deleted successfully"})
}

func (h *Handler) GetRooms(ctx *gin.Context) {
	var buildingData struct {
		BuildingName string `json:"building_name"`
	}

	if err := ctx.ShouldBindJSON(&buildingData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rooms, err := h.buildingService.GetRooms(buildingData.BuildingName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"rooms": rooms})
}

func (h *Handler) AddRoom(ctx *gin.Context) {
	var roomData struct {
		BuildingName string `json:"building_name"`
		RoomNumber   string `json:"room_number"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.buildingService.AddRoom(roomData.BuildingName, roomData.RoomNumber); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Room added successfully"})
}

func (h *Handler) RemoveRoom(ctx *gin.Context) {
	var roomData struct {
		BuildingName string `json:"building_name"`
		RoomNumber   string `json:"room_number"`
	}

	if err := ctx.ShouldBindJSON(&roomData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.buildingService.RemoveRoom(roomData.BuildingName, roomData.RoomNumber); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Room removed successfully"})
}
