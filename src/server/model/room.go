package model

type Room struct {
	DefaultModel
	RoomNumber   string   `gorm:"not null;uniqueIndex" json:"room_number"`
	Image        string   `json:"image"`
	Courses      []Course `gorm:"many2many:room_courses;"`
	BuildingCode Building `gorm:"foreignkey:BuildingCode;association_foreignkey:BuildingCode;"` // BuildingCode is the foreign key
	Capacity     int      `json:"capacity"`
	Occupancy    int      `json:"occupancy"`
	Students     []User   `gorm:"many2many:room_students;"`
}

// Handler Functions
type RoomService interface {
	CreateRoom(room *Room, building *Building) (*Room, error)
	GetRoom(number string, buildingCode string) (*Room, error)
	DeleteRoom(number string) error
	GetCourses(number string) ([]Course, error)
	AddCourse(roomNumber string, courseName string) error
	RemoveCourse(roomNumber string, courseName string) error
	SetBuilding(roomNumber string, buildingCode string) error
	SetCapacity(roomNumber string, capacity int) error
	SetOccupancy(roomNumber string, occupancy int) error
	AddStudent(roomNumber string, studentID string) error
	RemoveStudent(roomNumber string, studentID string) error
}

type RoomDatastore interface {
	CreateRoom(room *Room) (*Room, error)
	GetRoomByNumber(number string) (*Room, error)
	DeleteRoom(number string) error
	GetCourses(number string) ([]Course, error)
	AddCourse(roomNumber string, courseName string) error
	RemoveCourse(roomNumber string, courseName string) error
	SetBuilding(roomNumber string, buildingCode string) error
	SetCapacity(roomNumber string, capacity int) error
	SetOccupancy(roomNumber string, occupancy int) error
	AddStudent(roomNumber string, studentID string) error
	RemoveStudent(roomNumber string, studentID string) error
}
