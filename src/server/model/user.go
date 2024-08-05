package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/VibeMerchants/StudyBuddies/utils"
)

type StudyLogs map[string]uint
type StudyLog struct {
    Course string
    Time uint
    CurrentGrade float32
}
type UserCourses map[string]UserCourse
type UserCourse map[string]CourseData
type CourseData struct {
    Grade uint
    Weight float32
}
type UserCourseData struct {
    Course string
    Assignment string
    Grade uint
    Weight float32
}
// exmaple
//  UserCourses: {
//    "MATA31": {
//      "A1": 75,
//      "Midterm": 65
//    },
//    "CSCA08": {
//      "TT1": 95
//    }
// 
//}

// Necessary interfaace implementations to use maps in postgres

func (s StudyLogs) Value() (driver.Value, error) {
	return json.Marshal(s)
}

func (s *StudyLogs) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(bytes, s)
}

func (u UserCourses) Value() (driver.Value, error) {
	return json.Marshal(u)
}

func (u *UserCourses) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(bytes, u)
}


type User struct {
	DefaultModel
	Auth0ID  string    `gorm:"not null;uniqueIndex" json:"auth0_id"`
	Username string    `gorm:"not null;uniqueIndex" json:"username"`
	Avatar   string    `json:"image"`
	Name     string    `json:"name"`
	Courses  []Course  `gorm:"many2many:user_courses;"`
    Message  []Message `gorm:"foreignKey:SenderId" json:"-"`
    Friends []User `gorm:"many2many:friends;"`
    StudyLogs StudyLogs `json:"study_logs"`
    UserCourses UserCourses `json:"usercourses"`
    Lat float64 `json:"lat"`
    Long float64 `json:"long"`
}

type UserResponse struct {
	ID       string   `json:"id"`
	Username string   `json:"username"`
	Avatar   string   `json:"image"`
	Name     string   `json:"name"`
	Courses  []Course `json:"courses"`
    Friends []User `json:"friends"`
}

type FriendLocationResponse struct {
    Username string `json:"username"`
    Name string `json:"name"`
    Lat float64 `json:"lat"`
    Long float64 `json:"long"`
}

func (u *User) ToLocationResponse() *FriendLocationResponse {
    return &FriendLocationResponse{
        Username: u.Username,
        Name: u.Name,
        Lat: u.Lat,
        Long: u.Long,
    }
}

func (u *User) Serialize() *UserResponse {
	return &UserResponse{
		ID:       utils.IdToString(u.ID),
		Username: u.Username,
		Avatar:   u.Avatar,
		Name:     u.Name,
		Courses:  u.Courses,
	}
}

func (u *User) GetLogByCourse(name string) *StudyLog {
    fmt.Printf("LOGS: %v",u.StudyLogs)
    if _, ok := u.StudyLogs[name]; !ok {
        fmt.Printf("HERE")
        return &StudyLog{"", 0, 0}
    }

    return &StudyLog{
        Course: name,
        Time: u.StudyLogs[name],
        CurrentGrade: u.GetGrade(name),
    }
}

func (u *User) GetGrade(course string) float32 {
    grades := u.UserCourses[course]
    var grade float32
    var totalWeight float32
    for _, info := range grades {
        grade += float32(info.Grade) * (info.Weight / 100) 
        totalWeight += info.Weight
        fmt.Printf("GRADE: %v\n", grade)
        fmt.Printf("WEIGHT: %v\n", totalWeight)
    }

    fmt.Printf("RESULT: %v", (grade / totalWeight) * 100)
    return (grade / totalWeight) * 100
}

func (u *User) UpdateStudyLogs(log StudyLog) {
    if u.StudyLogs == nil {
        u.StudyLogs = StudyLogs{}
    }
    if val, ok := u.StudyLogs[log.Course]; !ok {
       u.StudyLogs[log.Course] = log.Time 
    } else {
        u.StudyLogs[log.Course] = val + log.Time
    }
}

// exmaple
//  UserCourses: {
//    "MATA31": {
//      "A1": 75,
//      "Midterm": 65
//    },
//    "CSCA08": {
//      "TT1": 95
//    }
// 
//}

func (u *User) UpdateUserCourse(uc UserCourseData) {
    if u.UserCourses == nil {
        u.UserCourses = UserCourses{}
    }

    if _, ok := u.UserCourses[uc.Course]; !ok {
        u.UserCourses[uc.Course] = UserCourse{
            uc.Assignment: CourseData{
                Grade: uc.Grade,
                Weight: uc.Weight,
            },
        }
    } else {
        u.UserCourses[uc.Course][uc.Assignment] = CourseData{
            Grade: uc.Grade,
            Weight: uc.Weight,
        }
    }
}

func (u *User) RemoveAssignmentFromCourse(course, assignment string) {
    if _, ok := u.UserCourses[course]; ok {
        delete(u.UserCourses[course], assignment)
    } 
}

func (u *User) RemoveUserCourse(name string) {
    if _, ok := u.UserCourses[name]; ok {
        delete(u.UserCourses, name)
    }
}

func (u *User) GetUserCourseByName(name string) UserCourse {
    fmt.Printf("MAP AT NAME(%v): %v", name, u.UserCourses[name])
    return u.UserCourses[name]
}

func (u *User) GetId() string {
    return utils.IdToString(u.ID) 
}

// Handler Functions
//TODO: Removing Assignments
type UserService interface {
	Register(user *User) (*User, error)
	GetUser(id string) (*User, error)
	DeleteUser(id string) error
    UpdateUser(u *User) (*User, error)
	GetCourses(id string) ([]Course, error)
	JoinCourse(userID string, courseName string) error
	LeaveCourse(userID string, courseName string) error
    AddFriend(userID, friendID string) error
    GetFriendByUsername(username string) (*User, error)
    RemoveFriend(userID, friendID string) error
    GetFriends(userID string) ([]User, error)
    GetAllStudyLogs(userID string) (*StudyLogs, error)
    GetStudyLogByCourse(userID, course string) (*StudyLog, error)
    UpdateStudyLogs(userID string, log StudyLog) (*StudyLogs, error)
    AddUserCourse(userID string, uc UserCourseData) (*UserCourses, error)
    RemoveUserCourse(userID, name string) (*UserCourses, error)
    GetAllUserCourses(userID string) (*UserCourses, error)
    RemoveAssignment(userID, course, assignment string) (*UserCourses, error)
    GetUserCourseByName(userID, name string) (UserCourse, error)
    GetStudyLogsByCourseForAllStudents(course string) ([]StudyLog, error)
    GetFriendsLocations(userID string) ([]FriendLocationResponse, error)
    UpdateLocation(userID string, lat, long float64) error
}

type UserDataStore interface {
	CreateUser(user *User) (*User, error)
	GetUserByID(id string) (*User, error)
	DeleteUser(id string) error
    UpdateUser(u *User) (*User, error)
	GetCourses(id string) ([]Course, error)
	JoinCourse(userID string, courseName string) error
	LeaveCourse(userID string, courseName string) error
    AddFriend(userID, friendID string) error
    GetFriendByUsername(username string) (*User, error)
    RemoveFriend(userID, friendID string) error
    GetFriends(userID string) ([]User, error)
    GetAllStudyLogs(userID string) (*StudyLogs, error)
    GetStudyLogByCourse(userID, course string) (*StudyLog, error)
    UpdateStudyLogs(userID string, log StudyLog) (*StudyLogs, error)
    AddUserCourse(userID string, uc UserCourseData) (*UserCourses, error)
    RemoveUserCourse(userID, name string) (*UserCourses, error)
    GetAllUserCourses(userID string) (*UserCourses, error)
    RemoveAssignment(userID, course, assignment string) (*UserCourses, error)
    GetUserCourseByName(userID, name string) (UserCourse, error)
    GetStudyLogsByCourseForAllStudents(course string) ([]StudyLog, error)
    GetFriendsLocations(userID string) ([]FriendLocationResponse, error)
    UpdateLocation(userID string, lat, long float64) error
}
