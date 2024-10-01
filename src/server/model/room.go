package model

type Room struct {
	DefaultModel
	RoomNumber   string   `gorm:"not null;uniqueIndex" json:"room_number"`
	Image        string   `json:"image"`
	Courses      []Course `gorm:"many2many:room_courses;"`
	BuildingCode Building `gorm:"foreignkey:building_code;"`
	Capacity     int      `json:"capacity"`
	Occupancy    int      `json:"occupancy"`
	Students     []User   `gorm:"many2many:room_students;"`
}

// Handler Functions
type RoomService interface {
	CreateRoom(room *Room) (*Room, error)
	GetRoom(number string, buildingCode string) (*Room, error)
	DeleteRoom(number string, buildingCode string) error
	GetCourses(number string, buildingCode string) ([]Course, error)
	AddCourse(roomNumber string, buildingCode string, courseName string) error
	RemoveCourse(roomNumber string, buildingCode string, courseName string) error
	SetCapacity(roomNumber string, buildingCode string, capacity int) error
	SetOccupancy(roomNumber string, buildingCode string, occupancy int) error
	AddOccupant(roomNumber string, buildingCode string, studentID string) error
	RemoveOccupant(roomNumber string, buildingCode string, studentID string) error
	GetOccupants(roomNumber string, buildingCode string) ([]User, error)
}

type RoomDatastore interface {
	CreateRoom(room *Room) (*Room, error)
	GetRoom(number string, buildingCode string) (*Room, error)
	DeleteRoom(number string, buildingCode string) error
	GetCourses(number string, buildingCode string) ([]Course, error)
	AddCourse(roomNumber string, buildingCode string, courseName string) error
	RemoveCourse(roomNumber string, buildingCode string, courseName string) error
	SetCapacity(roomNumber string, buildingCode string, capacity int) error
	SetOccupancy(roomNumber string, buildingCode string, occupancy int) error
	AddOccupant(roomNumber string, buildingCode string, studentID string) error
	RemoveOccupant(roomNumber string, buildingCode string, studentID string) error
	GetOccupants(roomNumber string, buildingCode string) ([]User, error)
}
