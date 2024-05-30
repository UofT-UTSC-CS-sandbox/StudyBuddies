package model

type User struct {
	DefaultModel
	Email    string `gorm:"not null;uniqueIndex" json:"email"`
	Password string `gorm:"not null" json:"-"`
	Username string `gorm:"not null;uniqueIndex" json:"username"`
	Avatar   string `json:"image"`
	//more fields to fill in
}
