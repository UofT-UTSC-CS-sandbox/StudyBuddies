package model

import (
	"time"

	"github.com/VibeMerchants/StudyBuddies/utils"
)

type Chat struct {
	DefaultModel
	Name      string `gorm:"not null;uniqueIndex"`
	Messages  []Message
	Users     []User    `gorm:"many2many:chat_users;"`
	OwnerID   uint
	LastEvent time.Time `gorm: autoCreateTime`
}

type ChatResponse struct {
	ID             string        `json:"id"`
	Name           string        `json:"name"`

	CreatedAt      time.Time     `json:"created_at"`
	LastEvent      time.Time     `json:"last_event"`
	HasNewMessages bool          `json:"has_new_messages"`
}

type ChatDetailsResponse struct {
    ID string `json:"id"`
    Name string `json:"name"`
    Users []*UserResponse `json:"users"`
    OwnerID uint `json:"owner_id"`
    Messages []Message `json:"messages"`
}

func (c *Chat) SerializeChat() *ChatResponse {
	return &ChatResponse{
		ID:             utils.IdToString(c.ID),
		Name:           c.Name,
		CreatedAt:      c.CreatedAt,
		LastEvent:      c.LastEvent,
		HasNewMessages: false,
	}
}

func (c *Chat) SerializeChatDetails() *ChatDetailsResponse {
    
    serializedUsers := utils.Map(c.Users, func(u User) *UserResponse { return u.Serialize() })

    return &ChatDetailsResponse{
        ID: utils.IdToString(c.ID),
        Name: c.Name,
        Users: serializedUsers,
        Messages: c.Messages,
        OwnerID: c.OwnerID,
    }
}

// Handler Functions
type ChatService interface {
	CreateChat(chat *Chat) (*Chat, error)
	GetChat(ID string) (*Chat, error)
	UpdateChat(chat *Chat) (*Chat, error)
	DeleteChat(ID string) error
	GetAllChats(userID string) ([]Chat, error)
	GetUsers(ID string) ([]User, error)
	AddUser(ID, userID string) error
	RemoveUser(ID, userID string) error
}

type ChatDatastore interface {
	CreateChat(chat *Chat) (*Chat, error)
	GetChatByID(ID string) (*Chat, error)
	UpdateChat(chat *Chat) (*Chat, error)
	DeleteChat(ID string) error
	GetAllChats(userID string) ([]Chat, error)
	GetUsers(ID string) ([]User, error)
	AddUser(ID, userID string) error
	RemoveUser(ID, userID string) error
}
