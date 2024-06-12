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
			return nil, errors.NewBadReqError(errors.ExistingEmail)
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
	if err := u.DB.Delete(&model.User{}, id).Error; err != nil {
		return err
	}
	return nil
}

func duplicateKeyError(err error) bool {
	duplicateKeyError := "SQLSTATE 23505"

	return strings.Contains(err.Error(), duplicateKeyError)
}
