package service

import (
	"encoding/json"
	"fmt"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/VibeMerchants/StudyBuddies/websockets"
)

type websocketService struct {
    Hub websockets.Hub
    ChatDatastore model.ChatDatastore
}


type WSSConfig struct {
    Hub websockets.Hub
    ChatDatastore model.ChatDatastore
}

func NewWebsocketService(c *WSSConfig) model.WebsocketService {
    return &websocketService{
        Hub: c.Hub,
        ChatDatastore: c.ChatDatastore,
    }
}


func (wss *websocketService) PublishNewMessage(message *model.MessageResponse, room string) {
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.NewMessage,
        Data: message,
    } )     
    if err != nil {
        fmt.Println("error marshalling message resposne %v\n", err)
    }
    
    wss.Hub.BroadcastMessageToPool(data, room)
}

func (wss *websocketService) PublishEditMessage(message *model.MessageResponse, room string) {
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.EditMessage,
        Data: message,
    })

    if err != nil {
        fmt.Println("err marshalling message response %v\n", err)
    }

    wss.Hub.BroadcastMessageToPool(data, room)

}

func (wss *websocketService) PublishDeleteMessage(messageID, room string) {
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.DeleteMessage,
        Data: messageID,
    })

    if err != nil {
        fmt.Println("err marshalling response %v\n", err)
    }

    wss.Hub.BroadcastMessageToPool(data, room)

}

func (wss *websocketService) PublishAddUser(user *model.User, room string) {
    
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.AddUser,
        Data: user.Serialize(),
    })

    if err != nil {
        fmt.Println("err marshalling response %v\n", err)
    }

    wss.Hub.BroadcastMessageToPool(data, room)

}

func (wss *websocketService) PublishRemoveUser(userID, room string) {
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.RemoveUser,
        Data: userID,
    })

    if err != nil {
        fmt.Println("err marshalling response %v\n", err)
    }

    wss.Hub.BroadcastMessageToPool(data, room)
}

func (wss *websocketService) PublishNewChat(chat *model.ChatResponse, room string) {
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.NewChat,
        Data: chat,
    })

    if err != nil {
        fmt.Println("err marshalling response %v\n", err)
    }

    wss.Hub.BroadcastMessageToPool(data, room)
}

func (wss *websocketService) PublishEditChat(chat *model.ChatResponse, room string) {
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.Editchat,
        Data: chat,
    })

    if err != nil {
        fmt.Println("err marshalling response %v\n", err)
    }

    wss.Hub.BroadcastMessageToPool(data, room)
}

func (wss *websocketService) PublishDeleteChat(chatID, room string) {
    data, err := json.Marshal(model.WebsocketMessage{
        Action: websockets.RemoveChat,
        Data: chatID,
    })

    if err != nil {
        fmt.Println("err marshalling response %v\n", err)
    }

    wss.Hub.BroadcastMessageToPool(data, room)
}

