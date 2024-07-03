package model

type Building struct {
	DefaultModel
	Name         string `gorm:"not null;uniqueIndex" json:"name"`
	Image        string `json:"image"`
	BuildingCode string `gorm:"not null;uniqueIndex" json:"code"`
	Rooms        []Room `gorm:"many2many:rooms;"`
}

// Handler Functions
type BuildingService interface {
	CreateBuilding(building *Building) (*Building, error)
	GetBuilding(code string) (*Building, error)
	DeleteBuilding(code string) error
	GetRooms(code string) ([]Room, error)
	AddRoom(buildingCode string, roomNumber string) error
	RemoveRoom(buildingCode string, roomNumber string) error
}

type BuildingDatastore interface {
	CreateBuilding(building *Building) (*Building, error)
	GetBuildingByCode(code string) (*Building, error)
	DeleteBuilding(code string) error
	GetRooms(code string) ([]Room, error)
	AddRoom(buildingCode string, roomNumber string) error
	RemoveRoom(buildingCode string, roomNumber string) error
}
