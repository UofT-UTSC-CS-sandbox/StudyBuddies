package datastore

import (
	"github.com/VibeMerchants/StudyBuddies/model"
	"gorm.io/gorm"
)

type RoomDatastore struct {
	DB *gorm.DB
}

func RoomDatastoreFactory(db *gorm.DB) model.RoomDatastore {
	return &RoomDatastore{
		DB: db,
	}
}

func (rds *RoomDatastore) CreateRoom(room *model.Room) (*model.Room, error) {
	if res := rds.DB.Create(&room); res.Error != nil {
		return nil, res.Error
	}
	return room, nil
}

func (rds *RoomDatastore) GetRoom(roomNumber string, buildingName string) (*model.Room, error) {
	var room model.Room
	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).First(&room).Error; err != nil {
		return nil, err
	}
	return &room, nil
}

func (rds *RoomDatastore) DeleteRoom(roomNumber string, buildingName string) error {
	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).Delete(&model.Room{}).Error; err != nil {
		return err
	}
	return nil
}

func (rds *RoomDatastore) GetCourses(roomNumber string, buildingName string) ([]model.Course, error) {
	var room model.Room
	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).Preload("Courses").First(&room).Error; err != nil {
		return nil, err
	}
	return room.Courses, nil
}

func (rds *RoomDatastore) AddCourse(roomNumber string, buildingName string, courseName string) error {
	var room model.Room
	var course model.Course

	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).First(&room).Error; err != nil {
		return err
	}

	if err := rds.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := rds.DB.Model(&room).Association("Courses").Append(&course); err != nil {
		return err
	}

	return nil
}

func (rds *RoomDatastore) RemoveCourse(roomNumber string, buildingName string, courseName string) error {
	var room model.Room
	var course model.Course

	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).First(&room).Error; err != nil {
		return err
	}

	if err := rds.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := rds.DB.Model(&room).Association("Courses").Delete(&course); err != nil {
		return err
	}

	return nil
}

func (rds *RoomDatastore) SetCapacity(roomNumber string, buildingName string, capacity int) error {
	var room model.Room
	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).First(&room).Error; err != nil {
		return err
	}

	room.Capacity = capacity
	if res := rds.DB.Save(&room); res.Error != nil {
		return res.Error
	}
	return nil
}

func (rds *RoomDatastore) SetOccupancy(roomNumber string, buildingName string, occupancy int) error {
	var room model.Room
	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).First(&room).Error; err != nil {
		return err
	}

	room.Occupancy = occupancy
	if res := rds.DB.Save(&room); res.Error != nil {
		return res.Error
	}
	return nil
}

func (rds *RoomDatastore) AddOccupant(roomNumber string, buildingName string, studentID string) error {
	var room model.Room
	var user model.User

	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).First(&room).Error; err != nil {
		return err
	}

	if err := rds.DB.Where("auth0_id = ?", studentID).First(&user).Error; err != nil {
		return err
	}

	if err := rds.DB.Model(&room).Association("Students").Append(&user); err != nil {
		return err
	}

	return nil
}

func (rds *RoomDatastore) RemoveOccupant(roomNumber string, buildingName string, studentID string) error {
	var room model.Room
	var user model.User

	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).First(&room).Error; err != nil {
		return err
	}

	if err := rds.DB.Where("auth0_id = ?", studentID).First(&user).Error; err != nil {
		return err
	}

	if err := rds.DB.Model(&room).Association("Students").Delete(&user); err != nil {
		return err
	}

	return nil
}

func (rds *RoomDatastore) GetOccupants(roomNumber string, buildingName string) ([]model.User, error) {
	var room model.Room
	if err := rds.DB.Where("room_number = ? AND building_code = ?", roomNumber, buildingName).Preload("Students").First(&room).Error; err != nil {
		return nil, err
	}
	return room.Students, nil
}
