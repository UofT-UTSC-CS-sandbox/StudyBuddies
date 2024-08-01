package datastore

import (
	"strings"

	"github.com/VibeMerchants/StudyBuddies/model"
	errors "github.com/VibeMerchants/StudyBuddies/model/errors"
	"gorm.io/gorm"
)

type UserDatastore struct {
	DB *gorm.DB
}

func UserDatastoreFactory(db *gorm.DB) model.UserDataStore {
	return &UserDatastore{
		DB: db,
	}
}

func (ud *UserDatastore) CreateUser(user *model.User) (*model.User, error) {

	if res := ud.DB.Create(&user); res.Error != nil {
		if duplicateKeyError(res.Error) {
			return nil, errors.NewBadReqError(errors.ExistingUser)
		}
	}

	return user, nil
}

func (u *UserDatastore) GetUserByID(id string) (*model.User, error) {
	var user model.User
	if err := u.DB.Where("auth0_id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *UserDatastore) DeleteUser(id string) error {
	if err := u.DB.Where("auth0_id = ?", id).Delete(&model.User{}).Error; err != nil {
		return err
	}
	return nil
}

func (u *UserDatastore) GetCourses(id string) ([]model.Course, error) {
	var user model.User
	if err := u.DB.Where("auth0_id = ?", id).Preload("Courses").First(&user).Error; err != nil {
		return nil, err
	}
	return user.Courses, nil
}

func (u *UserDatastore) JoinCourse(userID string, courseName string) error {
	var user model.User
	var course model.Course

	if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
		return err
	}

	if err := u.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := u.DB.Model(&user).Association("Courses").Append(&course); err != nil {
		return err
	}

	return nil
}

func (u *UserDatastore) LeaveCourse(userID string, courseName string) error {
	var user model.User
	var course model.Course

	if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
		return err
	}

	if err := u.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := u.DB.Model(&user).Association("Courses").Delete(&course); err != nil {
		return err
	}

	return nil
}

func (u *UserDatastore) GetFriendByUsername(username string) (*model.User, error) {
    var user model.User

    if err := u.DB.Where("username = ?", username).First(&user).Error; err != nil {
        return nil, err
    }

    return &user, nil
}

func (u *UserDatastore) AddFriend(userID, friendID string) error {
    var user model.User
    var friend model.User

    if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
        return err
    }

    if err := u.DB.Where("auth0_id = ?", friendID).First(&friend).Error; err != nil {
        return err
    }

    if err := u.DB.Model(&user).Association("Friends").Append(&friend); err != nil {
        return nil
    }

    return nil
}

func (u *UserDatastore) RemoveFriend(userID, friendID string) error {
    var user model.User
    var friend model.User

    if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
        return err
    }

    if err := u.DB.Where("auth0_id = ?", friendID).First(&friend).Error; err != nil {
        return err
    }

    if err := u.DB.Model(&user).Association("Friends").Delete(&friend); err != nil {
        return nil
    }

    return nil
}

func (u *UserDatastore) GetFriends(userID string) ([]model.User, error) {
	var user model.User
	if err := u.DB.Where("auth0_id = ?", userID).Preload("Friends").First(&user).Error; err != nil {
		return nil, err
	}
	return user.Friends, nil
}

func duplicateKeyError(err error) bool {
	duplicateKeyError := "SQLSTATE 23505"

	return strings.Contains(err.Error(), duplicateKeyError)
}
