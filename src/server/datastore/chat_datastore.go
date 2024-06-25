package datastore

import (
	"github.com/VibeMerchants/StudyBuddies/model"
	"gorm.io/gorm"
)

type chatDatastore struct {
	DB *gorm.DB
}

func NewChatDatastore(db *gorm.DB) model.ChatDatastore {
	return &chatDatastore{
		DB: db,
	}
}

func (cd *chatDatastore) CreateChat(chat *model.Chat) (*model.Chat, error) {
	if result := cd.DB.Create(&chat).Error; result != nil {
		return nil, result
	}
	return chat, nil
}

func (cds chatDatastore) GetChatByID(ID string) (*model.Chat, error) {
	var chat model.Chat
	if result := cds.DB.Where("id = ?", ID).First(&chat).Error; result != nil {
		return nil, result
	}
	return &chat, nil
}

func (cds chatDatastore) UpdateChat(chat *model.Chat) (*model.Chat, error) {
	if result := cds.DB.Save(&chat).Error; result != nil {
		return nil, result
	}
	return chat, nil
}

func (cds chatDatastore) DeleteChat(ID string) error {
	if result := cds.DB.Where("id = ?", ID).Delete(&model.Chat{}).Error; result != nil {
		return result
	}
	return nil
}

func (cds chatDatastore) GetAllChats(userID string) ([]model.Chat, error) {
	var chats []model.Chat
	if result := cds.DB.Find(&chats).Error; result != nil {
		return nil, result
	}
	return chats, nil
}

func (cds chatDatastore) GetUsers(ID string) ([]model.User, error) {
	var chat model.Chat
	if result := cds.DB.Preload("Users").Where("id = ?", ID).First(&chat).Error; result != nil {
		return nil, result
	}
	return chat.Users, nil
}

func (cds chatDatastore) AddUser(ID, userID string) error {
	var chat model.Chat
	if result := cds.DB.Where("id = ?", ID).First(&chat).Error; result != nil {
		return result
	}
	var user model.User
	if result := cds.DB.Where("id = ?", userID).First(&user).Error; result != nil {
		return result
	}
	if result := cds.DB.Model(&chat).Association("Users").Append(&user); result != nil {
		return result
	}
	return nil
}

func (cds chatDatastore) RemoveUser(ID, userID string) error {
	var chat model.Chat
	if result := cds.DB.Where("id = ?", ID).First(&chat).Error; result != nil {
		return result
	}
	var user model.User
	if result := cds.DB.Where("id = ?", userID).First(&user).Error; result != nil {
		return result
	}
	if result := cds.DB.Model(&chat).Association("Users").Delete(&user); result != nil {
		return result
	}
	return nil
}
