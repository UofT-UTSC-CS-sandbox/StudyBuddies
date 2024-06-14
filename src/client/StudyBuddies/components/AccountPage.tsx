import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '../app/style/account';
type Contact = {
  firstName: string;
  lastName: string;
  courses: string;
};

function ContactDetail({ contact, handleChange, handleSubmit }) {
  return (
    <View style={styles.appContactDetail}>
      <View style={styles.contactPhoto}></View>
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
        <View style={styles.formGroup}>
          <Text style={styles.formGroupLabel}>Courses</Text>
          <TextInput
            style={styles.formGroupInput}
            id="courses"
            name="courses"
            value={contact.courses}
            onChangeText={(text) => handleChange('courses', text)}
            placeholder="Enter courses separated by commas"
            required
          />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.formSubmitButton}>
          <Text style={styles.formGroupLabel}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [contact, setContact] = useState<Contact>({
    firstName: '',
    lastName: '',
    courses: '',
  });

  const handleChange = (name: string, value: string) => {
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const formattedCourses = contact.courses.split(',').map((course) => course.trim());
    console.log('Contact Created:', { ...contact, courses: formattedCourses });
    setContact({
      firstName: '',
      lastName: '',
      courses: '',
    });
  };

  return (
    <View style={styles.app}>
      <ContactDetail contact={contact} handleChange={handleChange} handleSubmit={handleSubmit} />
    </View>
  );
}
