package service

import "github.com/VibeMerchants/StudyBuddies/model"

type userService struct {
	UserStore model.UserDataStore
}

type UserServiceConfig struct {
	UserStore model.UserDataStore
}

func (u *userService) Register(user *model.User) (*model.User, error) {
	return u.UserStore.CreateUser(user)
}

func (u *userService) Login(user *model.User) (*model.User, error) {
	// Implement login logic, check for auth0id in db
	panic("unimplemented")
}

func (u *userService) GetUser(id string) (*model.User, error) {
	return u.UserStore.GetUserByID(id)
}

func (u *userService) DeleteUser(id string) error {
	return u.UserStore.DeleteUser(id)
}

func NewUserService(us *UserServiceConfig) model.UserService {
	return &userService{
		UserStore: us.UserStore,
	}
}
