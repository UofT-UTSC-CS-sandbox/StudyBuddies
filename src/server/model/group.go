package model

type Group struct {
	DefaultModel
	Name        string `gorm:"not null;uniqueIndex" json:"name"`
	Description string `json:"description"`
	Owner       User   `gorm:"many2one:owner;"`
	Members     []User `gorm:"many2many:group_members;"`
	NumUsers    int    `json:"numUsers"`
}

// Handler Functions
type GroupService interface {
	CreateGroup(group *Group) (*Group, error)
	GetGroup(name string) (*Group, error)
	DeleteGroup(name string) error
	GetMembers(name string) ([]User, error)
	AddMember(groupName string, memberID string) error
	RemoveMember(groupName string, memberID string) error
	SetDescription(groupName string, description string) error
	GetDescription(groupName string) (string, error)
	SetName(groupName string, name string) error
	SetOwner(groupName string, ownerID string) error
}

type GroupDatastore interface {
	CreateGroup(group *Group) (*Group, error)
	GetGroupByName(name string) (*Group, error)
	DeleteGroup(name string) error
	GetMembers(name string) ([]User, error)
	AddMember(groupName string, memberID string) error
	RemoveMember(groupName string, memberID string) error
	SetDescription(groupName string, description string) error
	GetDescription(groupName string) (string, error)
	SetName(groupName string, name string) error
	SetOwner(groupName string, ownerID string) error
}
