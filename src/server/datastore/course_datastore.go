package datastore

import (
	"github.com/VibeMerchants/StudyBuddies/model"
	"gorm.io/gorm"
)

type CourseDatastore struct {
	DB *gorm.DB
}

func CourseDatastoreFactory(db *gorm.DB) model.CourseDatastore {
	return &CourseDatastore{
		DB: db,
	}
}

func (cds *CourseDatastore) CreateCourse(course *model.Course) (*model.Course, error) {
	if res := cds.DB.Create(&course); res.Error != nil {
		return nil, res.Error
	}
	return course, nil
}

func (cds *CourseDatastore) GetCourseByName(name string) (*model.Course, error) {
	var course model.Course
	if err := cds.DB.Where("name = ?", name).First(&course).Error; err != nil {
		return nil, err
	}
	return &course, nil
}

func (cds *CourseDatastore) DeleteCourse(name string) error {
	if err := cds.DB.Where("name = ?", name).Delete(&model.Course{}).Error; err != nil {
		return err
	}
	return nil
}

func (cds *CourseDatastore) GetAllCourses() ([]model.Course, error) {
	var courses []model.Course
	if err := cds.DB.Find(&courses).Error; err != nil {
		return nil, err
	}
	return courses, nil
}

func (cds *CourseDatastore) GetStudents(name string) ([]model.User, error) {
	var course model.Course
	if err := cds.DB.Where("name = ?", name).Preload("Students").First(&course).Error; err != nil {
		return nil, err
	}
	return course.Students, nil
}

func (cds *CourseDatastore) AddStudent(courseName string, studentID string) error {
	var course model.Course
	var user model.User

	if err := cds.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := cds.DB.Where("auth0_id = ?", studentID).First(&user).Error; err != nil {
		return err
	}

	if err := cds.DB.Model(&course).Association("Students").Append(&user); err != nil {
		return err
	}
	return nil
}

func (cds *CourseDatastore) RemoveStudent(courseName string, studentID string) error {
	var course model.Course
	var user model.User

	if err := cds.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := cds.DB.Where("auth0_id = ?", studentID).First(&user).Error; err != nil {
		return err
	}

	if err := cds.DB.Model(&course).Association("Students").Delete(&user); err != nil {
		return err
	}
	return nil
}
