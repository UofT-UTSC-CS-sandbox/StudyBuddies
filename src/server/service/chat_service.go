package service

import "github.com/VibeMerchants/StudyBuddies/model"

type chatService struct {
	ChatStore model.ChatDatastore
}

type ChatServiceConfig struct {
	ChatStore model.ChatDatastore
}

func (c *chatService) CreateChat(chat *model.Chat) (*model.Chat, error) {
	return c.ChatStore.CreateChat(chat)
}

func (c *chatService) GetChat(ID string) (*model.Chat, error) {
	return c.ChatStore.GetChatByID(ID)
}

func (c *chatService) UpdateChat(chat *model.Chat) (*model.Chat, error) {
	return c.ChatStore.UpdateChat(chat)
}

func (c *chatService) DeleteChat(ID string) error {
	return c.ChatStore.DeleteChat(ID)
}

func (c *chatService) GetAllChats(userID string) ([]model.Chat, error) {
	return c.ChatStore.GetAllChats(userID)
}

func (c *chatService) GetUsers(ID string) ([]model.User, error) {
	return c.ChatStore.GetUsers(ID)
}

func (c *chatService) AddUser(ID, userID string) error {
	return c.ChatStore.AddUser(ID, userID)
}

func (c *chatService) RemoveUser(ID, userID string) error {
	return c.ChatStore.RemoveUser(ID, userID)
}
