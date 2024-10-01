package model

type Course struct {
	DefaultModel
	Name        string `gorm:"not null;uniqueIndex" json:"name"`
	Image       string `json:"image"`
	NumStudents int    `json:"numStudents"`
	Students    []User `gorm:"many2many:user_courses;"`
}

// Handler Functions
type CourseService interface {
	CreateCourse(course *Course) (*Course, error)
	GetCourse(name string) (*Course, error)
	DeleteCourse(name string) error
	GetAllCourses() ([]Course, error)
	GetStudents(name string) ([]User, error)
	AddStudent(courseName string, studentID string) error
	RemoveStudent(courseName string, studentID string) error
}

type CourseDatastore interface {
	CreateCourse(course *Course) (*Course, error)
	GetCourseByName(name string) (*Course, error)
	DeleteCourse(name string) error
	GetAllCourses() ([]Course, error)
	GetStudents(name string) ([]User, error)
	AddStudent(courseName string, studentID string) error
	RemoveStudent(courseName string, studentID string) error
}
