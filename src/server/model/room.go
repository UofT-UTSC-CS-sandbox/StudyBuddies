package model

type Room struct {
	DefaultModel
	RoomNumber string   `gorm:"not null;uniqueIndex" json:"room_number"`
	Image      string   `json:"image"`
	Courses    []Course `gorm:"many2many:room_courses;"`
	Building   Building `gorm:"many2one:building;"`
}
