import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, TextInput } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

type Item = {
  id: string;
  name: string;
};

const StudyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<Item[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInputModalVisible, setInputModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchAvailableItems();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get('http://localhost:8080/api/account/courses', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Courses Response:', response);
      const courses = response.data.courses.map((course: { id: string; name: string }) => ({
        id: course.id,
        name: course.name,
      }));
      setItems(courses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchAvailableItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/account/courses/get_all');
      console.log('Available Items Response:', response);
      const availableItems = response.data.courses.map((name: string, index: number) => ({
        id: index.toString(),
        name: name !== "undefined" ? name : "Unnamed Course",
      }));
      setAvailableItems(availableItems);
      setFilteredItems(availableItems);
    } catch (error) {
      console.error('Failed to fetch available items:', error);
    }
  };

  const addItem = async (name: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post('http://localhost:8080/api/account/courses/join', {
        course_name: name
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Join Course Response:', response);
      fetchCourses();
      setModalVisible(false);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const removeItem = async (id: string) => {
    const course = items.find((item) => item.id == id);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post('http://localhost:8080/api/account/courses/leave', {
        course_name: course?.name 
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Leave Course Response:', response);
      fetchCourses();
    } catch (error) {
      console.error('Failed to leave course:', error);
    }
    Alert.alert(`Successfully Left ${course?.name}`);
  };

  const navigateToItem = (item: Item) => {
    navigation.navigate('Course', { courseName: item.name });
  };

  const apiCall1 = async (input: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post('http://localhost:8080/api/account/courses/create', {
        course_name: input
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Create Course Response:', response);
      fetchCourses();
      fetchAvailableItems();
    } catch (error) {
      console.error('Failed to make API call 1:', error);
    }
  };

  const apiCall2 = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get('http://localhost:8080/api/your-endpoint-2', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('API Call 2 Response:', response);
      fetchCourses();
      fetchAvailableItems();
    } catch (error) {
      console.error('Failed to make API call 2:', error);
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = availableItems.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredItems(filtered);
  };

  const handleApiCall1 = () => {
    apiCall1(inputValue);
    setInputModalVisible(false);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity onPress={() => removeItem(id)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Leave</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity onPress={() => navigateToItem(item)} style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>My Courses</Text>
      <View style={styles.courseListContainer}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.additionalInfoContainer}>
        <Text style={styles.additionalInfoText}>Overall Analytics</Text>
        <TouchableOpacity onPress={() => setInputModalVisible(true)} style={styles.apiButton}>
          <Text style={styles.apiButtonText}>Add Course</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={apiCall2} style={styles.apiButton}>
          <Text style={styles.apiButtonText}>API Call 2</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select an Item</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <FlatList
            data={filteredItems}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => addItem(item.name)}>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={isInputModalVisible}
        onBackdropPress={() => setInputModalVisible(false)}
      >
        <View style={styles.inputModalContent}>
          <Text style={styles.modalTitle}>Enter Input</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your input"
            value={inputValue}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity onPress={handleApiCall1} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1c1c1e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#a259ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  courseListContainer: {
    maxHeight: 240,
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
  },
  itemText: {
    fontSize: 18,
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  additionalInfoContainer: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
    elevation: 1,
  },
  additionalInfoText: {
    fontSize: 18,
    color: '#fff',
  },
  apiButton: {
    backgroundColor: '#a259ff',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  apiButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%', // Limit the height of the modal
  },
  inputModalContent: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  searchInput: {
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#3a3a3c',
    color: '#fff',
  },
  card: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#3a3a3c',
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StudyScreen;
