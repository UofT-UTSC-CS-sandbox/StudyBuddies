package model

import (
	"encoding/json"
	"fmt"
)

type WebsocketMessage struct {
	Action string `json:"action"`
	Data   any    `json:"data"`
}

type ReceivedMessage struct {
	Action string `json:"action"`
	Room   string `json:"room"`
	Data   *any   `json:"data"`
}

func (message *WebsocketMessage) EncodeAsBytes() []byte {
	encodedMsg, err := json.Marshal(message)
	if err != nil {
		fmt.Println("Error encoding message: ", err)
	}
	return encodedMsg
}

type WebsocketService interface {
	PublishNewMessage(message *MessageResponse, room string)
	PublishEditMessage(message *MessageResponse, room string)
	PublishDeleteMessage(messageID, room string)

	PublishAddUser(user *User, room string)
	PublishRemoveUser(userID, room string)

	PublishNewChat(chat *ChatResponse, room string)
	PublishEditChat(chat *ChatResponse, room string)
	PublishDeleteChat(chatID, room string)

	// friend events below
}
