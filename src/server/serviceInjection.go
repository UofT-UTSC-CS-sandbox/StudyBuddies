package main

import (
	"github.com/VibeMerchants/StudyBuddies/config"
	"github.com/VibeMerchants/StudyBuddies/datastore"
	"github.com/VibeMerchants/StudyBuddies/handlers"
	"github.com/VibeMerchants/StudyBuddies/service"
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

	router := gin.Default()

	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowCredentials: true,
	})

	router.Use(cors)

	handlers.NewHandler(&handlers.Config{
		R:             router,
		UserService:   userService,
		CourseService: courseService,
	})

	return router, nil

}
