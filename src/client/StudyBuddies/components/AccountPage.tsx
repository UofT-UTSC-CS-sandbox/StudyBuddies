import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../app/style/account'; // Import the styles without the .ts extension

type Contact = {
  firstName: string;
  lastName: string;
  courses: string[];
};

function ContactDetail({ contact, handleChange, handleSubmit, handleCourseChange }) {
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
          <View style={styles.formGroupPicker}>
            <Picker
              selectedValue={contact.courses[0]}
              onValueChange={(itemValue) => handleCourseChange(itemValue)}
              style={{ color: '#fff' }} // This inline style ensures the text color is white
            >
              <Picker.Item label="Select a course" value="" />
              <Picker.Item label="Linear Algebra 2" value="MATB42" />
              <Picker.Item label="Systems Programming" value="CSCB09" />
              <Picker.Item label="Software Design" value="CSCB07" />
              {/* Add more courses as needed */}
            </Picker>
          </View>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.formSubmitButton}>
          <Text style={styles.formSubmitButtonText}>Save</Text>
        </TouchableOpacity>
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

  const handleChange = (name: string, value: string) => {
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleCourseChange = (course: string) => {
    setContact((prevContact) => ({
      ...prevContact,
      courses: [course],
    }));
  };

  const handleSubmit = () => {
    console.log('Contact Created:', contact);
    setContact({
      firstName: '',
      lastName: '',
      courses: [],
    });
  };

  return (
    <View style={styles.app}>
      <ContactDetail
        contact={contact}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCourseChange={handleCourseChange}
      />
    </View>
  );
}
