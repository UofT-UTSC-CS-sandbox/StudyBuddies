package datastore

import (
	"github.com/VibeMerchants/StudyBuddies/model"
	"gorm.io/gorm"
)

type messageDatastore struct {
	DB *gorm.DB
}

func MessageDatastoreFactory(db *gorm.DB) model.MessageDatastore {
	return &messageDatastore{
		DB: db,
	}
}

type messageData struct {
}

// implement chat first, this will follow
