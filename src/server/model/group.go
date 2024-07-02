package model

type Group struct {
	DefaultModel
	Name        string   `gorm:"not null;uniqueIndex" json:"name"`
	Description string   `json:"description"`
	Courses     []Course `gorm:"many2many:group_courses;"`
	Owner       User     `gorm:"many2one:owner;"`
	Members     []User   `gorm:"many2many:group_members;"`
	Building    Building `gorm:"many2one:building;"`
	Room        Room     `gorm:"many2one:room;"`
}
