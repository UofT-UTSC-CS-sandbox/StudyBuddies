package model

type User struct {
	DefaultModel
	Auth0ID  string `gorm:"not null;uniqueIndex" json:"auth0_id"`
	Username string `gorm:"not null;uniqueIndex" json:"username"`
	Avatar   string `json:"image"`
	Name     string `json:"name"`
	//more fields to fill in
}

// Handler Functions
type UserService interface {
	Register(user *User) (*User, error)
	Login(user *User) (*User, error)
	GetUser(id string) (*User, error)
	DeleteUser(id string) error
}

type UserDataStore interface {
	CreateUser(user *User) (*User, error)
	GetUserByID(id string) (*User, error)
	DeleteUser(id string) error
}
