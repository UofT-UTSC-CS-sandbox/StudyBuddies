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

func (u *userService) UpdateUser(user *model.User) (*model.User, error) {
    return u.UserStore.UpdateUser(user)
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


func (u *userService) GetAllStudyLogs(userID string) (*model.StudyLogs, error) {
    return u.UserStore.GetAllStudyLogs(userID)
}

func (u *userService) GetStudyLogByCourse(userID, course string) (*model.StudyLog, error) {
    return u.UserStore.GetStudyLogByCourse(userID, course)
}

func (u *userService) UpdateStudyLogs(userID string, log model.StudyLog) (*model.StudyLogs, error) {
    return u.UserStore.UpdateStudyLogs(userID, log)
}

func (u *userService) GetAllUserCourses(userID string) (*model.UserCourses, error) {
    return u.UserStore.GetAllUserCourses(userID)
}
func (u *userService) AddUserCourse(userID string, uc model.UserCourseData) (*model.UserCourses, error) {
    return u.UserStore.AddUserCourse(userID, uc)
}

func (u *userService) RemoveUserCourse(userID, name string) (*model.UserCourses, error) {
    return u.UserStore.RemoveUserCourse(userID, name)
}

func (u *userService) RemoveAssignment(userID, course, assignment string) (*model.UserCourses, error) {
    return u.UserStore.RemoveAssignment(userID, course, assignment)
}

func (u *userService) GetUserCourseByName(userID, name string) (model.UserCourse, error) {
    return u.UserStore.GetUserCourseByName(userID, name)
}

func (u *userService) GetStudyLogsByCourseForAllStudents(course string) ([]model.StudyLog, error) {
    return u.UserStore.GetStudyLogsByCourseForAllStudents(course)
}
func (u *userService) GetFriendsLocations(userID string) ([]model.FriendLocationResponse, error) {
    return u.UserStore.GetFriendsLocations(userID)
}
func (u *userService) UpdateLocation(userID string, lat, long float64) error {
    return u.UserStore.UpdateLocation(userID, lat, long)
}
func NewUserService(us *UserServiceConfig) model.UserService {
	return &userService{
		UserStore: us.UserStore,
	}
}
