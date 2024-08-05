// screens/CourseScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useRoute, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import styles from './style/CourseScreen';
import Carousel from './Carousel';
import GradeBreakdown from './GradeBreakdown';
import StudyVsGradeChart from './TimeStudiedChart';

type Grade = {
  id: string;
  name: string;
  grade: string;
  weight: string;
};

const CourseScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseName } = route.params ?? {};

  const [grades, setGrades] = useState<Grade[]>([]);
  const [isGradeModalVisible, setGradeModalVisible] = useState(false);
  const [isEditGradeModalVisible, setEditGradeModalVisible] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [newGrade, setNewGrade] = useState({ name: '', grade: '', weight: '' });
  const [nameError, setNameError] = useState('');
  const [gradeError, setGradeError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (courseName) {
      fetchGrades();
    } else {
      Alert.alert('Error', 'Course name is undefined');
      navigation.goBack();
    }
  }, [courseName]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (!isTimerRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const fetchGrades = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`http://localhost:8080/api/account/getUserCourseByName:${courseName}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log("FETCH GRADES RESPONSE:", response);
      const gradesData = response.data.user_course;
      const gradesArray = Object.entries(gradesData).map(([name, details]) => ({
        id: name,
        name,
        grade: details.Grade.toString(),
        weight: details.Weight.toString()
      }));

      setGrades(gradesArray);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    }
  };

  const validateGradeName = (name: string) => {
    if (grades.find(grade => grade.name === name)) {
      setNameError('Grade name already exists.');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateGradeValue = (value: string) => {
    const grade = parseInt(value);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      setGradeError('Grade must be between 0 and 100.');
      return false;
    }
    setGradeError('');
    return true;
  };

  const validateWeightValue = (value: string) => {
    const weight = parseFloat(value);
    if (isNaN(weight) || weight < 0 || weight > 100) {
      setWeightError('Weight must be between 0 and 100.');
      return false;
    }
    setWeightError('');
    return true;
  };

  const addGrade = async () => {
    if (validateGradeName(newGrade.name) && validateGradeValue(newGrade.grade) && validateWeightValue(newGrade.weight)) {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        await axios.post('http://localhost:8080/api/account/addUserCourse', { assignment: newGrade.name, grade: parseInt(newGrade.grade), weight: parseFloat(newGrade.weight), course: courseName }, {
          headers: {
            Authorization: `${token}`
          }
        });
        fetchGrades();
        setNewGrade({ name: '', grade: '', weight: '' }); 
        setGradeModalVisible(false);
      } catch (error) {
        console.error('Failed to add grade:', error);
      }
    }
  };

  const editGrade = async () => {
    if (selectedGrade && validateGradeValue(selectedGrade.grade) && validateWeightValue(selectedGrade.weight)) {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        await axios.post('http://localhost:8080/api/account/addUserCourse', { assignment: selectedGrade.name, grade: parseInt(selectedGrade.grade), weight: parseFloat(selectedGrade.weight), course: courseName }, {
          headers: {
            Authorization: `${token}`
          }
        });
        fetchGrades();
        setSelectedGrade(null); // Reset selectedGrade
        setEditGradeModalVisible(false);
      } catch (error) {
        console.error('Failed to edit grade:', error);
      }
    }
  };

  const deleteGrade = async (id: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      await axios.delete(`http://localhost:8080/api/account/removeAssignment?course=${courseName}&assignment=${id}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      fetchGrades();
    } catch (error) {
      console.error('Failed to delete grade:', error);
    }
    Alert.alert(`Successfully Removed ${id}`);
  };

  const openEditModal = (grade: Grade) => {
    setSelectedGrade(grade);
    setEditGradeModalVisible(true);
  };

  const renderRightActions = (grade: Grade) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity onPress={() => openEditModal(grade)} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteGrade(grade.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGrade = ({ item }: { item: Grade }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.gradeContainer}>
        <Text style={styles.gradeText}>{item.name} ({item.weight}): {item.grade}</Text>
      </View>
    </Swipeable>
  );

  const handleStop = async () => {
    const timeInSecs = timer;
    setTimerRunning(false);
    setTimer(0);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      await axios.post('http://localhost:8080/api/account/updateStudyLogs', { Course: courseName, time: timer }, {
        headers: {
          Authorization: `${token}`
        }
      });
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  const toggleStartPause = () => {
    setTimerRunning(!isTimerRunning);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.title}>Study</Text>
          <Text style={styles.timer}>{Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</Text>
          <View style={styles.timerButtons}>
            <TouchableOpacity onPress={toggleStartPause} style={styles.startButton}>
              <Text style={styles.buttonText}>{isTimerRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Grades</Text>
          <TouchableOpacity onPress={() => setGradeModalVisible(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <ScrollView style={styles.gradeScrollView}>
            {grades.map(grade => (
              <Swipeable key={grade.id} renderRightActions={() => renderRightActions(grade)}>
                <View style={styles.gradeContainer}>
                  <Text style={styles.gradeText}>{grade.name} ({grade.weight}%): {grade.grade}</Text>
                </View>
              </Swipeable>
            ))}
          </ScrollView>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Analytics</Text>
          <Carousel>
            <GradeBreakdown grades={grades} />
            <StudyVsGradeChart />
          </Carousel>
        </View>
      </ScrollView>
      <Modal
        isVisible={isGradeModalVisible}
        onBackdropPress={() => {
          setNewGrade({ name: '', grade: '', weight: '' });
          setGradeModalVisible(false);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Grade</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={newGrade.name}
            onChangeText={(text) => {
              setNewGrade({ ...newGrade, name: text });
              validateGradeName(text);
            }}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Grade"
            placeholderTextColor="#888"
            value={newGrade.grade}
            onChangeText={(text) => {
              setNewGrade({ ...newGrade, grade: text });
              validateGradeValue(text);
            }}
          />
          {gradeError ? <Text style={styles.errorText}>{gradeError}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Weight"
            placeholderTextColor="#888"
            value={newGrade.weight}
            onChangeText={(text) => {
              setNewGrade({ ...newGrade, weight: text });
              validateWeightValue(text);
            }}
          />
          {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
          <TouchableOpacity onPress={addGrade} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={isEditGradeModalVisible}
        onBackdropPress={() => {
          setSelectedGrade(null);
          setEditGradeModalVisible(false);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Grade</Text>
          {selectedGrade && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#888"
                value={selectedGrade.name}
                onChangeText={(text) => setSelectedGrade({ ...selectedGrade, name: text })}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Grade"
                placeholderTextColor="#888"
                value={selectedGrade.grade}
                onChangeText={(text) => {
                  setSelectedGrade({ ...selectedGrade, grade: text });
                  validateGradeValue(text);
                }}
              />
              {gradeError ? <Text style={styles.errorText}>{gradeError}</Text> : null}
              <TextInput
                style={styles.input}
                placeholder="Weight"
                placeholderTextColor="#888"
                value={selectedGrade.weight}
                onChangeText={(text) => {
                  setSelectedGrade({ ...selectedGrade, weight: text });
                  validateWeightValue(text);
                }}
              />
              {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
              <TouchableOpacity onPress={editGrade} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default CourseScreen;
