package model

import "time"

type Chat struct {
	DefaultModel
	Name      string `gorm:"not null;uniqueIndex"`
	Messages  []Message
	Users     []User    `gorm:"many2many:chat_users;"`
	Owner     User      `gorm:"foreignKey:OwnerID"`
	LastEvent time.Time `gorm: autoCreateTime`
}

type ChatResponse struct {
	ID             string        `json:"id"`
	Name           string        `json:"name"`
	OwnerID        string        `json:"owner_id"`
	Owner          *UserResponse `json:"owner"`
	CreatedAt      string        `json:"created_at"`
	LastEvent      string        `json:"last_event"`
	HasNewMessages bool          `json:"has_new_messages"`
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
