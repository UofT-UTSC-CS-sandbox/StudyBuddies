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

func UserDatastoreFactory(db *gorm.DB) model.UserDataService {
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

func (ud *UserDatastore) GetUserByEmail(email string) (*model.User, error) {
	return nil, nil
}

func (ud *UserDatastore) GetUserByID(id string) (*model.User, error) {
	return nil, nil
}

func (ud *UserDatastore) DeleteUser(id string) error {

	return nil
}

func duplicateKeyError(err error) bool {
	duplicateKeyError := "SQLSTATE 23505"

	return strings.Contains(err.Error(), duplicateKeyError)
}
