package model

type User struct {
	DefaultModel
	Auth0ID  string   `gorm:"not null;uniqueIndex" json:"auth0_id"`
	Username string   `gorm:"not null;uniqueIndex" json:"username"`
	Avatar   string   `json:"image"`
	Name     string   `json:"name"`
	Courses  []Course `gorm:"many2many:user_courses;"`
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
