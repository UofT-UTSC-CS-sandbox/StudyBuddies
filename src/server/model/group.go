package model

type Group struct {
	DefaultModel
	Name        string `gorm:"not null;uniqueIndex" json:"name"`
	Description string `json:"description"`
	Owner       User   `gorm:"many2one:owner;"`
	Members     []User `gorm:"many2many:group_members;"`
}
