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

func (mds *messageDatastore) GetMessagesFromChat(chat *model.Chat) (*[]model.MessageWithUser, error){
    var messages *[]model.MessageWithUser

    if err := mds.DB.Table("messages").
        Select("messages.*, users.Username").
        Joins("left join users on users.ID = messages.SenderID").
        Where("messages.chatID = ?", chat.ID).
        Scan(&messages).Error; err != nil {
            return nil, err
    }

    return messages, nil
}

func (mds *messageDatastore) UpdateMessage(chat *model.Message) error {

    
	if result := mds.DB.Save(&chat).Error; result != nil {
		return result 
	}
	return  nil

}
