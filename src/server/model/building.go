package model

type Building struct {
	DefaultModel
	Name  string `gorm:"not null;uniqueIndex" json:"name"`
	Image string `json:"image"`
}
