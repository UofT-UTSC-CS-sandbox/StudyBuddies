package datastore

import (
	"fmt"
	"strings"

	"github.com/VibeMerchants/StudyBuddies/model"
	errors "github.com/VibeMerchants/StudyBuddies/model/errors"
	"gorm.io/gorm"
)

type UserDatastore struct {
	DB *gorm.DB
}

func UserDatastoreFactory(db *gorm.DB) model.UserDataStore {
	return &UserDatastore{
		DB: db,
	}
}

func (ud *UserDatastore) CreateUser(user *model.User) (*model.User, error) {

	if res := ud.DB.Create(&user); res.Error != nil {
		if duplicateKeyError(res.Error) {
			return nil, errors.NewBadReqError(errors.ExistingUser)
		}
	}

	return user, nil
}

func (u *UserDatastore) GetUserByID(id string) (*model.User, error) {
	var user model.User
	if err := u.DB.Where("auth0_id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *UserDatastore) DeleteUser(id string) error {
	if err := u.DB.Where("auth0_id = ?", id).Delete(&model.User{}).Error; err != nil {
		return err
	}
	return nil
}

func (u *UserDatastore) UpdateUser(user *model.User) (*model.User, error) {
    if res := u.DB.Save(&user).Error; res != nil {
        return nil, res 
    }

    return user, nil
}

func (u *UserDatastore) GetCourses(id string) ([]model.Course, error) {
	var user model.User
	if err := u.DB.Where("auth0_id = ?", id).Preload("Courses").First(&user).Error; err != nil {
		return nil, err
	}
	return user.Courses, nil
}

func (u *UserDatastore) JoinCourse(userID string, courseName string) error {
	var user model.User
	var course model.Course

	if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
		return err
	}

	if err := u.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := u.DB.Model(&user).Association("Courses").Append(&course); err != nil {
		return err
	}

	return nil
}

func (u *UserDatastore) LeaveCourse(userID string, courseName string) error {
	var user model.User
	var course model.Course

	if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
		return err
	}

	if err := u.DB.Where("name = ?", courseName).First(&course).Error; err != nil {
		return err
	}

	if err := u.DB.Model(&user).Association("Courses").Delete(&course); err != nil {
		return err
	}

	return nil
}

func (u *UserDatastore) GetFriendByUsername(username string) (*model.User, error) {
    var user model.User

    if err := u.DB.Where("username = ?", username).First(&user).Error; err != nil {
        return nil, err
    }

    return &user, nil
}

func (u *UserDatastore) AddFriend(userID, friendID string) error {
    var user model.User
    var friend model.User

    if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
        return err
    }

    if err := u.DB.Where("auth0_id = ?", friendID).First(&friend).Error; err != nil {
        return err
    }

    if err := u.DB.Model(&user).Association("Friends").Append(&friend); err != nil {
        return nil
    }

    return nil
}

func (u *UserDatastore) RemoveFriend(userID, friendID string) error {
    var user model.User
    var friend model.User

    if err := u.DB.Where("auth0_id = ?", userID).First(&user).Error; err != nil {
        return err
    }

    if err := u.DB.Where("auth0_id = ?", friendID).First(&friend).Error; err != nil {
        return err
    }

    if err := u.DB.Model(&user).Association("Friends").Delete(&friend); err != nil {
        return nil
    }

    return nil
}

func (u *UserDatastore) GetFriends(userID string) ([]model.User, error) {
	var user model.User
	if err := u.DB.Where("auth0_id = ?", userID).Preload("Friends").First(&user).Error; err != nil {
		return nil, err
	}
	return user.Friends, nil
}

func (u *UserDatastore) GetAllStudyLogs(userID string) (*model.StudyLogs, error) {

    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err
    }

    return &user.StudyLogs, nil

}

func (u *UserDatastore) GetStudyLogByCourse(userID, course string) (*model.StudyLog, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err
    }

    return user.GetLogByCourse(course), nil
}

func (u *UserDatastore) UpdateStudyLogs(userID string, log model.StudyLog) (*model.StudyLogs, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err
    }

    user.UpdateStudyLogs(log)

    user, err = u.UpdateUser(user)
    if err != nil {
        return nil, err
    }

    return &user.StudyLogs, nil
}

func (u *UserDatastore) GetAllUserCourses(userID string) (*model.UserCourses, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err
    }

    return &user.UserCourses, err
}

func (u *UserDatastore) AddUserCourse(userID string, uc model.UserCourseData) (*model.UserCourses, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err 
    }

    user.UpdateUserCourse(uc)

    fmt.Printf("UPDATED USER COURSE (AddUserCourse): %v", user.UserCourses)

    user, err = u.UpdateUser(user)
    if err != nil {
        return nil, err
    }

    return &user.UserCourses, nil
}

func (u *UserDatastore) RemoveUserCourse(userID, name string) (*model.UserCourses, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err 
    }

    user.RemoveUserCourse(name)

    user, err = u.UpdateUser(user)
    if err != nil {
        return nil, err
    }

    return &user.UserCourses, nil
}

func (u *UserDatastore) GetUserCourseByName(userID, name string) (model.UserCourse, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err
    }

    uc := user.GetUserCourseByName(name)

    return uc, nil 

}

func (u *UserDatastore) RemoveAssignment(userID, course, assignment string) (*model.UserCourses, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
        return nil, err 
    }

    user.RemoveAssignmentFromCourse(course, assignment)

    user, err = u.UpdateUser(user)
    if err != nil {
        return nil, err
    }

    return &user.UserCourses, nil
}

func (u *UserDatastore) GetStudyLogsByCourseForAllStudents(course string) ([]model.StudyLog, error) {

    var users []model.User
    var logs []model.StudyLog 
    result := u.DB.Find(&users).Error

    if result != nil {
        return nil, result 
    }

    fmt.Printf("USERS: %v,", users)

    for _, user := range users {
        logs = append(logs, *user.GetLogByCourse(course))
        fmt.Printf("NEW LOGS: %v", logs)
    }

    return logs, nil


}

func (u *UserDatastore) UpdateLocation(userID string, lat, long float64) error {
    user, err := u.GetUserByID(userID)

    if err != nil {
       return err 
    }

    user.Lat = lat
    user.Long = long


    user, err = u.UpdateUser(user)
    if err != nil {
        return err
    }

    return nil

}

func (u *UserDatastore) GetFriendsLocations(userID string) ([]model.FriendLocationResponse, error) {
    friends, err := u.GetFriends(userID)

    responses := make([]model.FriendLocationResponse, 0)

    if err != nil {
        return nil, err
    }

    for _, f := range friends {
        responses = append(responses, *f.ToLocationResponse())
    }

    return responses, nil
}


func (u *UserDatastore) UpdateAccountInfo(userID, name, bio string) error {
    user, err := u.GetUserByID(userID)

    if err != nil {
       return err 
    }

    user.UpdateAccountInfo(name, bio)

    user, err = u.UpdateUser(user)

    return err
}

func (u *UserDatastore) GetAccountInfo(userID string) (string, string, error) {
    user, err := u.GetUserByID(userID)

    if err != nil {
       return "", "", err 
    }

    return user.Name, user.Bio, nil

}

func (u *UserDatastore) AddGoal(userID string, goal model.Goal) error {
    user, err := u.GetUserByID(userID)

    if err != nil {
       return err 
    }
    user.AddGoal(goal)

    user, err = u.UpdateUser(user)

    return err
}
func (u *UserDatastore) RemoveGoal(userID string, goal model.Goal) error {

    user, err := u.GetUserByID(userID)

    if err != nil {
       return err 
    }
    user.RemoveGoal(goal)

    user, err = u.UpdateUser(user)

    return err
}
func (u *UserDatastore) UpdateGoal(userID string, goal model.Goal) error {

    user, err := u.GetUserByID(userID)

    if err != nil {
       return err 
    }
    user.UpdateGoal(goal)

    user, err = u.UpdateUser(user)

    return err
}

func (u *UserDatastore) GetGoals(userID string) ([]model.Goal, error) {

    user, err := u.GetUserByID(userID)

    if err != nil {
       return nil, err 
    }
    
    return user.Goals, err
}
func duplicateKeyError(err error) bool {
	duplicateKeyError := "SQLSTATE 23505"

	return strings.Contains(err.Error(), duplicateKeyError)
}
