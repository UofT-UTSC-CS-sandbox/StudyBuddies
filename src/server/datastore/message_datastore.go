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

func (mds *messageDatastore) CreateMessage(m *model.Message) (*model.Message, error) {

	if result := mds.DB.Save(&m).Error; result != nil {
		return nil, result
	}
	return m, nil
}

func (mds *messageDatastore) DeleteMessage(m *model.Message) error {

    if result := mds.DB.Where("id = ?", m.ID).Delete(&model.Message{}).Error; result != nil {
		return result
	}
	return nil
}

func (mds *messageDatastore) GetMessagesFromChat(chat *model.Chat) (*[]model.Message, error){
    var messages []messageData

    cid := chat.ID

}

func (mds *messageDatastore) UpdateMessage(chat *model.Message) error {

    
	if result := mds.DB.Save(&chat).Error; result != nil {
		return result 
	}
	return  nil

}
