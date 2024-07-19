package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

func main() {
	// Define the URL for the CreateCourse endpoint
	url := "http://localhost:8080/api/account/courses/create"
	fileName := "crsstuff_new.txt"
	// Read the course data from a file
	file, err := os.Open(fileName)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	// Read the course data from the file
	var course_name string
	var course_code string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		parts := strings.Split(line, "|")
		if len(parts) == 2 {
			course_name = parts[1]
			course_code = parts[0]
		}
		courseData := map[string]string{
			"course_name": course_name,
			"course_code": course_code,
		}
		send_course_data(url, courseData)
	}

}

func send_course_data(url string, courseData map[string]string) {
	jsonData, err := json.Marshal(courseData)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		return
	}

	// Send a POST request to the CreateCourse endpoint
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error sending POST request:", err)
		return
	}
	defer resp.Body.Close()

	// Print the response from the server
	fmt.Println("Response Status:", resp.Status)
	if resp.StatusCode == http.StatusOK {
		fmt.Println("Course created successfully")
	} else {
		fmt.Println("Error creating course")
	}
}
