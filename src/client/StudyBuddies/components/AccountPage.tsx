import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../app/style/account';

const { width: screenWidth } = Dimensions.get('window');

type Contact = {
  firstName: string;
  lastName: string;
  courses: string[];
};

const initialAvailableCourses = [
  'CSCB09',
  'CSCC01',
  'CSCB63',
  'CSCB07',
  'CSCC43'
];

function ContactDetail({
  contact,
  handleChange,
  handleSubmit,
  handleCourseSelection,
  selectedCourse,
  handleRemoveCourse,
  showPicker,
  togglePicker,
  availableCourses,
  profileImagePath
}) {
  return (
    <View style={styles.appContactDetail}>
      <Image source={profileImagePath} style={styles.profileImage} />
      <Text style={styles.formGroupLabel}>Contact Photo & Poster</Text>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.formGroupLabel}>First name</Text>
          <TextInput
            style={styles.formGroupInput}
            id="firstName"
            name="firstName"
            value={contact.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            required
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.formGroupLabel}>Last name</Text>
          <TextInput
            style={styles.formGroupInput}
            id="lastName"
            name="lastName"
            value={contact.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            required
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.selectedCoursesContainer}>
            <Text style={styles.formGroupLabel}>Selected Courses</Text>
            <ScrollView>
              {contact.courses.map((course, index) => (
                <View key={index} style={styles.selectedCourseItemContainer}>
                  <TouchableOpacity onPress={() => handleRemoveCourse(course)} style={styles.removeCourseButton}>
                    <Text style={styles.removeCourseButtonText}>x</Text>
                  </TouchableOpacity>
                  <Text style={styles.selectedCourseItem}>{course}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.pickerContainer}>
            <TouchableOpacity onPress={togglePicker} style={styles.addCourseButton}>
              <Text style={styles.addCourseButtonText}>Add Course</Text>
            </TouchableOpacity>
            {showPicker && (
              <>
                <View style={styles.formGroupPicker}>
                  <Picker
                    selectedValue={selectedCourse}
                    onValueChange={(itemValue) => handleCourseSelection(itemValue)}
                    style={{ color: '#fff' }} 
                    itemStyle={styles.pickerItem} 
                  >
                    <Picker.Item label="Select a course" value="" />
                    {availableCourses.map((course, index) => (
                      <Picker.Item key={index} label={course} value={course} />
                    ))}
                  </Picker>
                </View>
                <View style={styles.fullWidthButtonContainer}>
                  <TouchableOpacity onPress={handleSubmit} style={styles.formSubmitButton}>
                    <Text style={styles.formSubmitButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [contact, setContact] = useState<Contact>({
    firstName: '',
    lastName: '',
    courses: [],
  });

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [availableCourses, setAvailableCourses] = useState<string[]>(initialAvailableCourses);

  const profileImagePath = require('../assets/images/lebronjames.png'); 

  const handleChange = (name: string, value: string) => {
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleCourseSelection = (course: string) => {
    setSelectedCourse(course);
  };

  const handleSubmit = () => {
    if (selectedCourse && !contact.courses.includes(selectedCourse)) {
      setContact((prevContact) => ({
        ...prevContact,
        courses: [...prevContact.courses, selectedCourse],
      }));
      setAvailableCourses((prevCourses) => prevCourses.filter((course) => course !== selectedCourse));
    }
    setSelectedCourse('');
    console.log('Contact Created:', contact);
  };

  const handleRemoveCourse = (course: string) => {
    setContact((prevContact) => ({
      ...prevContact,
      courses: prevContact.courses.filter(c => c !== course),
    }));
    setAvailableCourses((prevCourses) => [...prevCourses, course]);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <View style={styles.app}>
      <ContactDetail
        contact={contact}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCourseSelection={handleCourseSelection}
        selectedCourse={selectedCourse}
        handleRemoveCourse={handleRemoveCourse}
        showPicker={showPicker}
        togglePicker={togglePicker}
        availableCourses={availableCourses}
        profileImagePath={profileImagePath} 
      />
    </View>
  );
}
