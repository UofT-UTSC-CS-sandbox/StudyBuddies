package service

import "github.com/VibeMerchants/StudyBuddies/model"

type messageService struct {
    MessageStore model.MessageDatastore 
}

type MessageServiceConfig struct {
   MessageStore model.MessageDatastore 
}

func (m *messageService) CreateMessage(message *model.Message) (*model.Message, error) {
    return m.MessageStore.CreateMessage(message) 
}
func (m *messageService) GetMessages(chat *model.Chat) (*[]model.MessageWithUser, error) {
    return m.MessageStore.GetMessagesFromChat(chat)
}
func (m *messageService) UpdateMessage(message *model.Message) error {
    return m.MessageStore.UpdateMessage(message)
}
func (m *messageService) DeleteMessage(message *model.Message) error {
   return m.MessageStore.UpdateMessage(message) 
}

func NewMessageService(m *MessageServiceConfig) model.MessageService {
    return &messageService{
        MessageStore: m.MessageStore,
    }
}
