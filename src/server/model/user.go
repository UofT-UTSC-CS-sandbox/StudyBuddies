package model

type User struct {
	DefaultModel
	Email    string `gorm:"not null;uniqueIndex" json:"email"`
	Password string `gorm:"not null" json:"-"`
	Username string `gorm:"not null;uniqueIndex" json:"username"`
	Avatar   string `json:"image"`
	//more fields to fill in
}

// Handler Functions
type UserService interface {
	Register(user *User) (*User, error)
	Login(user *User) (*User, error)
	GetUser(id string) (*User, error)
	DeleteUser(id string) error
}

type UserDataService interface {
	CreateUser(user *User) (*User, error)
	GetUserByEmail(email string) (*User, error)
	GetUserByID(id string) (*User, error)
	DeleteUser(id string) error
}
