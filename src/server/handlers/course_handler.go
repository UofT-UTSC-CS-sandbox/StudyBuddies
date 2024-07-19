package handlers

import (
	"net/http"

	"github.com/VibeMerchants/StudyBuddies/model"
	"github.com/gin-gonic/gin"
)

func (h *Handler) GetCourse(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
	}

	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	course, err := h.courseService.GetCourse(courseData.CourseName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var course_serial = course.SerializeCourse()

	ctx.JSON(http.StatusOK, course_serial)
}

func (h *Handler) CreateCourse(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
		CourseCode string `json:"course_code"`
	}
	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	course := model.Course{Name: courseData.CourseName, Code: courseData.CourseCode, NumStudents: 0, Students: []model.User{}}
	if _, err := h.courseService.CreateCourse(&course); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Course created successfully"})
}

func (h *Handler) DeleteCourse(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
	}
	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.courseService.DeleteCourse(courseData.CourseName); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
}

func (h *Handler) GetAllCourses(ctx *gin.Context) {
	courses, err := h.courseService.GetAllCourses()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	courseNames := make([]string, len(courses))
	for i, course := range courses {
		courseNames[i] = course.Name
	}

	ctx.JSON(http.StatusOK, gin.H{"courses": courseNames})
}

func (h *Handler) GetStudents(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
	}
	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	students, err := h.courseService.GetStudents(courseData.CourseName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"students": students})
}

func (h *Handler) AddStudent(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
		StudentID  string `json:"student_id"`
	}
	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.courseService.AddStudent(courseData.CourseName, courseData.StudentID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Student added successfully"})
}

func (h *Handler) RemoveStudent(ctx *gin.Context) {
	var courseData struct {
		CourseName string `json:"course_name"`
		StudentID  string `json:"student_id"`
	}
	if err := ctx.ShouldBindJSON(&courseData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.courseService.RemoveStudent(courseData.CourseName, courseData.StudentID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Student removed successfully"})
}
