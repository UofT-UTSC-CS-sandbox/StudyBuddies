package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/gin-gonic/gin"
)

func (h *Handler) GetGroup(ctx *gin.Context) {
	var groupData struct {
		GroupName string `json:"group_name"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	group, err := h.groupService.GetGroup(groupData.GroupName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, group)
}

func (h *Handler) CreateGroup(ctx *gin.Context) {
	var groupData struct {
		GroupName string `json:"group_name"`
		OwnerID   string `json:"owner_id"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	owner, err := h.userService.GetUser(groupData.OwnerID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	group := model.Group{Name: groupData.GroupName, NumUsers: 1, Members: []model.User{*owner}, Owner: *owner}
	if _, err := h.groupService.CreateGroup(&group); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Group created successfully"})
}

func (h *Handler) DeleteGroup(ctx *gin.Context) {
	var groupData struct {
		GroupName string `json:"group_name"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.groupService.DeleteGroup(groupData.GroupName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Group deleted successfully"})
}

func (h *Handler) GetMembers(ctx *gin.Context) {
	var groupData struct {
		GroupName string `json:"group_name"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	members, err := h.groupService.GetMembers(groupData.GroupName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, members)
}

func (h *Handler) AddMember(ctx *gin.Context) {
	var memberData struct {
		GroupName string `json:"group_name"`
		UserID    string `json:"user_id"`
	}
	if err := ctx.ShouldBindJSON(&memberData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.userService.GetUser(memberData.UserID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := h.groupService.AddMember(memberData.GroupName, memberData.UserID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "User added successfully"})
}

func (h *Handler) RemoveMember(ctx *gin.Context) {
	var memberData struct {
		GroupName string `json:"group_name"`
		UserID    string `json:"user_id"`
	}
	if err := ctx.ShouldBindJSON(&memberData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.groupService.RemoveMember(memberData.GroupName, memberData.UserID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User removed successfully"})
}

func (h *Handler) SetDescription(ctx *gin.Context) {
	var groupData struct {
		GroupName   string `json:"group_name"`
		Description string `json:"description"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.groupService.SetDescription(groupData.GroupName, groupData.Description); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Description set successfully"})
}

func (h *Handler) GetDescription(ctx *gin.Context) {
	var groupData struct {
		GroupName string `json:"group_name"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	description, err := h.groupService.GetDescription(groupData.GroupName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"description": description})
}

func (h *Handler) SetName(ctx *gin.Context) {
	var groupData struct {
		GroupName string `json:"group_name"`
		Name      string `json:"name"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.groupService.SetName(groupData.GroupName, groupData.Name); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Name set successfully"})
}

func (h *Handler) SetOwner(ctx *gin.Context) {
	var groupData struct {
		GroupName string `json:"group_name"`
		OwnerID   string `json:"owner_id"`
	}
	if err := ctx.ShouldBindJSON(&groupData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.userService.GetUser(groupData.OwnerID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := h.groupService.SetOwner(groupData.GroupName, groupData.OwnerID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Owner set successfully"})
}
