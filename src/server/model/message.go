package model

import (
	"strconv"
	"time"
)

type Message struct {
	DefaultModel
	Content  *string
	SenderId string `gorm:"index;constraint:OnDelete:CASCADE"`
	ChatId   string `gorm:"index;constraint:OnDelete:CASCADE"`
}

type MessageResponse struct {
	ID        string       `json:"id"`
	Content   *string      `json:"content"`
	CreatedAt time.Time    `json:"created_at"`
	UpdateAt  time.Time    `json:"updated_at"`
	SenderId  string       `json:"sender_id"`
	User      UserResponse `json:"user"`
}

func (m *Message) serializeMessage(user UserResponse) *MessageResponse {
    return &MessageResponse{
        ID: strconv.Itoa(int(m.ID)),
        Content: m.Content,
        CreatedAt: m.CreatedAt,
        UpdateAt: m.UpdatedAt,
        User: user,
    }
}

// Handler Functions
type MessageService interface {
	CreateMessage(message *Message) (*Message, error)
	GetMessages(chat *Chat) (*[]MessageResponse, error)
	UpdateMessage(message *Message) error
	DeleteMessage(message *Message) error
}

type MessageDatastore interface {
	CreateMessage(message *Message) (*Message, error)
	GetMessagesFromChat(chat *Chat) (*[]Message, error)
	UpdateMessage(message *Message) error
	DeleteMessage(message *Message) error
}
