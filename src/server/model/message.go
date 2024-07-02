package model

import (
	"time"

	"github.com/VibeMerchants/StudyBuddies/utils"
)

type Message struct {
	DefaultModel
	Content  *string
    SenderId string `gorm:"index;constraint:OnDelete:CASCADE" json:"sender_id"`
	ChatId   string `gorm:"index;constraint:OnDelete:CASCADE"`
}

type MessageWithUser struct {
    Msg Message
    User User
}

type MessageResponse struct {
	ID        string       `json:"id"`
	Content   *string      `json:"content"`
	CreatedAt time.Time    `json:"created_at"`
	UpdateAt  time.Time    `json:"updated_at"`
	SenderId  string       `json:"sender_id"`
	User      UserResponse `json:"user"`
}

func (m *Message) Serialize(user UserResponse) *MessageResponse {
    return &MessageResponse{
        ID: utils.IdToString(m.ID),
        Content: m.Content,
        CreatedAt: m.CreatedAt,
        UpdateAt: m.UpdatedAt,
        User: user,
    }
}

// Handler Functions
type MessageService interface {
	CreateMessage(message *Message) (*Message, error)
	GetMessages(chat *Chat) (*[]MessageWithUser, error)
	UpdateMessage(message *Message) error
	DeleteMessage(message *Message) error
}

type MessageDatastore interface {
	CreateMessage(message *Message) (*Message, error)
	GetMessagesFromChat(chat *Chat) (*[]MessageWithUser, error)
	UpdateMessage(message *Message) error
	DeleteMessage(message *Message) error
}
