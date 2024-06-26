package datastore

import (
	"time"

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
    ID string
    Text *string //can be empty, so we use a pointer
    CreatedAt time.Time
    UpdatedAt time.Time
    UserID string
}

func (r *messageDatastore) GetMessages(userID, position string, chat *model.Chat) {
    var message []messageData

}

// implement chat first, this will follow
