package datastore

import (
	"github.com/VibeMerchants/StudyBuddies/model"
	"gorm.io/gorm"
)

type BuildingDatastore struct {
	DB *gorm.DB
}

func BuildingDatastoreFactory(db *gorm.DB) model.BuildingDatastore {
	return &BuildingDatastore{
		DB: db,
	}
}

func (bds *BuildingDatastore) CreateBuilding(building *model.Building) (*model.Building, error) {
	if res := bds.DB.Create(&building); res.Error != nil {
		return nil, res.Error
	}
	return building, nil
}

func (bds *BuildingDatastore) GetBuilding(name string) (*model.Building, error) {
	var building model.Building
	if err := bds.DB.Where("name = ?", name).First(&building).Error; err != nil {
		return nil, err
	}
	return &building, nil
}

func (bds *BuildingDatastore) DeleteBuilding(name string) error {
	if err := bds.DB.Where("name = ?", name).Delete(&model.Building{}).Error; err != nil {
		return err
	}
	return nil
}

func (bds *BuildingDatastore) GetRooms(name string) ([]model.Room, error) {
	var building model.Building
	if err := bds.DB.Where("name = ?", name).Preload("Rooms").First(&building).Error; err != nil {
		return nil, err
	}
	return building.Rooms, nil
}

func (bds *BuildingDatastore) AddRoom(buildingName string, roomNumber string) error {
	var building model.Building
	var room model.Room

	if err := bds.DB.Where("name = ?", buildingName).First(&building).Error; err != nil {
		return err
	}

	if err := bds.DB.Where("room_number = ?", roomNumber).First(&room).Error; err != nil {
		return err
	}

	if err := bds.DB.Model(&building).Association("Rooms").Append(&room); err != nil {
		return err
	}

	return nil
}

func (bds *BuildingDatastore) RemoveRoom(buildingName string, roomNumber string) error {
	var building model.Building
	var room model.Room

	if err := bds.DB.Where("name = ?", buildingName).First(&building).Error; err != nil {
		return err
	}

	if err := bds.DB.Where("room_number = ?", roomNumber).First(&room).Error; err != nil {
		return err
	}

	if err := bds.DB.Model(&building).Association("Rooms").Delete(&room); err != nil {
		return err
	}

	return nil
}
