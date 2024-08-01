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

func (u *userService) GetUser(id string) (*model.User, error) {
	return u.UserStore.GetUserByID(id)
}

func (u *userService) DeleteUser(id string) error {
	return u.UserStore.DeleteUser(id)
}

func (u *userService) GetCourses(id string) ([]model.Course, error) {
	return u.UserStore.GetCourses(id)
}

func (u *userService) JoinCourse(userID string, courseName string) error {
	return u.UserStore.JoinCourse(userID, courseName)
}

func (u *userService) LeaveCourse(userID string, courseName string) error {
	return u.UserStore.LeaveCourse(userID, courseName)
}

func (u *userService) AddFriend(userID, friendID string) error {
    return u.UserStore.AddFriend(userID, friendID)
}

func (u *userService) RemoveFriend(userID, friendID string) error {
    return u.UserStore.RemoveFriend(userID, friendID)
}

func (u *userService) GetFriends(userID string) ([]model.User, error) {
    return u.UserStore.GetFriends(userID)
}

func (u *userService) GetFriendByUsername(username string) (*model.User, error) {
    return u.UserStore.GetFriendByUsername(username)
}

func NewUserService(us *UserServiceConfig) model.UserService {
	return &userService{
		UserStore: us.UserStore,
	}
}
