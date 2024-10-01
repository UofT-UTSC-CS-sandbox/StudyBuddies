package main

import (
	"github.com/VibeMerchants/StudyBuddies/config"
	"github.com/VibeMerchants/StudyBuddies/datastore"
	"github.com/VibeMerchants/StudyBuddies/handlers"
	"github.com/VibeMerchants/StudyBuddies/service"
	"github.com/VibeMerchants/StudyBuddies/websockets"
	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func injectServices(d *data, cfg config.Config) (*gin.Engine, error) {

	userStore := datastore.UserDatastoreFactory(d.DB)

	userService := service.NewUserService(&service.UserServiceConfig{
		UserStore: userStore,
	})

	courseStore := datastore.CourseDatastoreFactory(d.DB)

	courseService := service.NewCourseService(&service.CourseServiceConfig{
		CourseStore: courseStore, 
	})
    
    chatStore := datastore.NewChatDatastore(d.DB)

    chatService := service.NewChatService(
        &service.ChatServiceConfig{
            ChatStore: chatStore,
        })

    messageStore := datastore.MessageDatastoreFactory(d.DB)

    messageService := service.NewMessageService(
        &service.MessageServiceConfig{
            MessageStore: messageStore,
        })

	router := gin.Default()

	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowCredentials: true,
	})

	router.Use(cors)

    // Websockets injection

    hub := websockets.NewHub(&websockets.Config{
        UserService: userService,
        RedisClient: d.RedisClient,
    })  

    go hub.Run()

    router.GET("/ws", func(c *gin.Context) {
        websockets.ServeSocket(hub, c)
    })

    websocketService := service.NewWebsocketService(&service.WSSConfig{
        Hub: *hub,
        ChatDatastore: chatStore,
    })

	handlers.NewHandler(&handlers.Config{
		R:             router,
		UserService:   userService,
		CourseService: courseService,
        MessageService: messageService,
        WebsocketService: websocketService,
        ChatService: chatService,
	})

	return router, nil

}
