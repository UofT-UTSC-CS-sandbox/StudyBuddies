package service

import "github.com/VibeMerchants/StudyBuddies/model"

type courseService struct {
	CourseStore model.CourseDatastore
}

type CourseServiceConfig struct {
	CourseStore model.CourseDatastore
}

func (c *courseService) CreateCourse(course *model.Course) (*model.Course, error) {
	return c.CourseStore.CreateCourse(course)
}

func (c *courseService) GetCourse(id string) (*model.Course, error) {
	return c.CourseStore.GetCourseByName(id)
}

func (c *courseService) DeleteCourse(id string) error {
	return c.CourseStore.DeleteCourse(id)
}

func (c *courseService) GetAllCourses() ([]model.Course, error) {
	return c.CourseStore.GetAllCourses()
}

func (c *courseService) GetStudents(id string) ([]model.User, error) {
	return c.CourseStore.GetStudents(id)
}

func (c *courseService) AddStudent(courseName string, studentID string) error {
	return c.CourseStore.AddStudent(courseName, studentID)
}

func (c *courseService) RemoveStudent(courseName string, studentID string) error {
	return c.CourseStore.RemoveStudent(courseName, studentID)
}

func NewCourseService(cs *CourseServiceConfig) model.CourseService {
	return &courseService{
		CourseStore: cs.CourseStore,
	}
}
