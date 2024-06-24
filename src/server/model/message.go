package model

import (
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

// Handler Functions
type MessageService interface {
	CreateMessage(message *Message) (*Message, error)
	GetMessages(chatId, position string) (*[]MessageResponse, error)
	UpdateMessage(message *Message) error
	DeleteMessage(message *Message) error
	GetMessage(id string) (*Message, error)
}

type MessageDatastore interface {
	CreateMessage(message *Message) (*Message, error)
	GetMessages(chatId, position string) (*[]Message, error)
	UpdateMessage(message *Message) error
	DeleteMessage(message *Message) error
	GetMessageByID(id string) (*Message, error)
}
