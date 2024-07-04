package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/VibeMerchants/StudyBuddies/model"
	StudyBuddyErrors "github.com/VibeMerchants/StudyBuddies/model/errors"
	"github.com/gin-gonic/gin"
)

type msgRequest struct {
    Text *string `form:"text"`
}

func (h *Handler) CreateMessage(c *gin.Context) {
    chatID := c.Param("chatId")
    userID := c.MustGet("userId").(string)
    
    var req msgRequest

    if ok := c.Bind(&req); (ok != nil) {
        e := StudyBuddyErrors.NewBadReqError("Message couldnt bind to msgRequest")
        c.JSON(e.Status(), gin.H{"error": e}) 
    }

    chat, err := h.chatService.GetChat(chatID)

    if err != nil {
        e := StudyBuddyErrors.NewNotFoundError("chat", chatID)
        c.JSON(e.Status(), gin.H{"error": e})
        return
    }

    sender, err := h.userService.GetUser(userID)

    if err != nil {
        e := StudyBuddyErrors.NewNotFoundError("user", userID)
        c.JSON(e.Status(), gin.H{"error": e})
        return
    } 
   
    builtMessage := model.Message{
       Content: req.Text,
       SenderId: userID, 
       ChatId: chatID,
    }

    message, err := h.messageService.CreateMessage(
        &builtMessage,
    )

    if err != nil {
        e := StudyBuddyErrors.NewInternalError()
        c.JSON(e.Status(), gin.H{"error": fmt.Sprintf("Unable to create message with error: %v", err)})
        return
    }
    
    userResponse := sender.Serialize()

    response := message.Serialize(*userResponse)

    h.websocketService.PublishNewMessage(response, chatID)

    chat.LastEvent = time.Now()

    _, err = h.chatService.UpdateChat(chat)

    if err != nil {
        e := StudyBuddyErrors.NewInternalError()
        c.JSON(e.Status(), gin.H{"error": "Error Updating Chat"})
        return
    }

    // publish a notification, need to implement that first

    c.JSON(http.StatusCreated, true)

}

func (h *Handler) GetMessages(c *gin.Context) {

    chatID := c.Param("chatId")

    chat, err := h.chatService.GetChat(chatID)

    if err != nil {
        e := StudyBuddyErrors.NewNotFoundError("chat", chatID)
        c.JSON(e.Status(), gin.H{"error": e})
        return
    }

    messages, err := h.messageService.GetMessages(chat)

    if err != nil {
        e := StudyBuddyErrors.NewNotFoundError("messages", chatID)
        c.JSON(e.Status(), gin.H{"error": e})
        return
    }
   
    if len(*messages) == 0 {
        var emptyMessages = make([]model.MessageResponse, 0)
        c.JSON(http.StatusOK, emptyMessages)
        return
    }
    c.JSON(http.StatusOK, messages)
}

func (h *Handler) UpdateMessage(c *gin.Context) {

}

func (h *Handler) DeleteMessage(c *gin.Context) {

}
