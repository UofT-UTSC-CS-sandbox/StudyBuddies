package model

import "strconv"

type User struct {
	DefaultModel
	Auth0ID  string    `gorm:"not null;uniqueIndex" json:"auth0_id"`
	Username string    `gorm:"not null;uniqueIndex" json:"username"`
	Avatar   string    `json:"image"`
	Name     string    `json:"name"`
	Courses  []Course  `gorm:"many2many:user_courses;"`
	Message  []Message `json:"-"`
}

type UserResponse struct {
	ID       string   `json:"id"`
	Username string   `json:"username"`
	Avatar   string   `json:"image"`
	Name     string   `json:"name"`
	Courses  []Course `json:"courses"`
}

func (u *User) Serialize() *UserResponse {
	return &UserResponse{
		ID:       strconv.Itoa(int(u.ID)),
		Username: u.Username,
		Avatar:   u.Avatar,
		Name:     u.Name,
		Courses:  u.Courses,
	}
}

func (u *User) GetId() string {
    return strconv.Itoa(int(u.ID)) 
}

// Handler Functions
type UserService interface {
	Register(user *User) (*User, error)
	GetUser(id string) (*User, error)
	DeleteUser(id string) error
	GetCourses(id string) ([]Course, error)
	JoinCourse(userID string, courseName string) error
	LeaveCourse(userID string, courseName string) error
}

type UserDataStore interface {
	CreateUser(user *User) (*User, error)
	GetUserByID(id string) (*User, error)
	DeleteUser(id string) error
	GetCourses(id string) ([]Course, error)
	JoinCourse(userID string, courseName string) error
	LeaveCourse(userID string, courseName string) error
}
