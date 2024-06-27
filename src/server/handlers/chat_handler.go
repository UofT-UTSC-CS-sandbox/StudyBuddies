package handlers

import (
	"fmt"
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/VibeMerchants/StudyBuddies/utils"
	"github.com/gin-gonic/gin"
)

func (h *Handler) GetChat(ctx *gin.Context) {
	var chatData struct {
		ChatID string `json:"chat_id"`
	}

	if err := ctx.ShouldBindJSON(&chatData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	chat, err := h.chatService.GetChat(chatData.ChatID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, chat)
}

func (h *Handler) CreateChat(ctx *gin.Context) {
	var ncd struct {
		ChatName        string   `json:"chat_name"`
		OwnerID         string   `json:"owner_id"`
		AdditionalUsers []string `json:"additional_users"`
	}

	if err := ctx.ShouldBindJSON(&ncd); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	owner, err := h.userService.GetUser(ncd.OwnerID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	users := []model.User{*owner}
	for _, user := range ncd.AdditionalUsers {
		u, err := h.userService.GetUser(user)

		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error}": fmt.Sprintf("Unable to add user %v, with error %v", u.Name, err.Error())})
			return
		}

		users = append(users, *u)
	}

	chat := model.Chat{
		Name:  ncd.ChatName,
		Owner: *owner,
		Users: []model.User{*owner},
	}

	if _, err := h.chatService.CreateChat(&chat); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Chat created successfully"})
}

func (h *Handler) UpdateChat(ctx *gin.Context) {
	var ucd struct {
		Name string `json:"name"`
        ChatID string `json:"chat_id"`
	}

    if err := ctx.ShouldBindJSON(&ucd); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    chat, err := h.chatService.GetChat(ucd.ChatID)
    
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    oldName := chat.Name
    chat.Name = ucd.Name

    if _, err := h.chatService.UpdateChat(chat); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Chat Name Successfully changed from %v to %v", oldName, chat.Name)})
}

func (h *Handler) DeleteChat(ctx *gin.Context) {
	// need to ensure that the user making this request is owner
	// on the client side, should only show option to delete if user is not an owner
    var cd struct {
        ChatID string `json:"chat_id"`
        UserID string `json:"user_id"`
    }
    if err := ctx.ShouldBindJSON(&cd); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    chat, err := h.chatService.GetChat(cd.ChatID)
    
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if chat.Owner.GetId() != cd.UserID {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("The user with id %v is not the owner of the chat", cd.UserID)})
        return
    }
    
    if err := h.chatService.DeleteChat(cd.ChatID); err != nil {
         ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
         return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("The chat %v was successfully deleted", chat.Name)})

}

func (h *Handler) GetAllChats(ctx *gin.Context) {
	// get all chats in which the user is a member of
    var ud struct {
        UserID string `json:"user_id"`
    }

    if err := ctx.ShouldBindJSON(&ud); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Request is missing data `user_id` | %v", err.Error())})
        return
    }

    chats, err := h.chatService.GetAllChats(ud.UserID)

    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
   
    serializedChats := utils.Map(chats, func (c model.Chat) *model.ChatDetailsResponse { return c.SerializeChatDetails() })

    ctx.JSON(http.StatusOK, gin.H{"message": serializedChats})

}

func (h *Handler) AddUser(ctx *gin.Context) {
	// grab current userid and chatid, add to chat_users table
    var cd struct {
        UserID string `json:"user_id"`
        ChatId string `json:"chat_id"`
    }

    if err := ctx.ShouldBindJSON(&cd); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.chatService.AddUser(cd.ChatId, cd.UserID); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Successfully added user with id %v to the chat", cd.UserID)})
}

func (h *Handler) RemoveUser(ctx *gin.Context) {
	// grab current userid and chatid, remove from chat_users table
    var cd struct {
        UserID string `json:"user_id"`
        ChatId string `json:"chat_id"`
    }

    if err := ctx.ShouldBindJSON(&cd); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.chatService.RemoveUser(cd.ChatId, cd.UserID); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Successfully removed user with id %v from the chat", cd.UserID)})
}
