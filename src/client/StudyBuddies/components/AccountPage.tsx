import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const ProfileScreen: React.FC = () => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isFriendsModalVisible, setFriendsModalVisible] = useState(false);
  const [friends, setFriends] = useState<{ id: number; name: string; username: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newFriendUsername, setNewFriendUsername] = useState<string>('');

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const fetchFriends = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      console.log('Fetched Token:', token);

      if (!token) {
        console.error('No token found');
        setError('No token found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/account/getFriends', {
        headers: {
          Authorization: token,
        },
      });
      console.log('Friends response:', response.data);
      setFriends(response.data.friends || []);
      setFriendsModalVisible(true);
    } catch (error) {
      console.error('Error fetching friends:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const removeFriend = async (username: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      console.log('Fetched Token:', token);

      if (!token) {
        console.error('No token found');
        setError('No token found');
        return;
      }

      await axios.delete('http://localhost:8080/api/account/removeFriend', {
        headers: {
          Authorization: token,
        },
        data: {
          username,
        },
      });

      // Update the friends list locally after successful deletion
      setFriends((prevFriends) => prevFriends.filter(friend => friend.username !== username));
    } catch (error) {
      console.error('Error removing friend:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const addFriend = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      console.log('Fetched Token:', token);

      if (!token) {
        console.error('No token found');
        setError('No token found');
        return;
      }

      await axios.post('http://localhost:8080/api/account/addFriend', {
        username: newFriendUsername,
      }, {
        headers: {
          Authorization: token,
        },
      });

      // Optionally, you can update the friends list after adding a new friend
      await fetchFriends();

      // Reset the input field
      setNewFriendUsername('');
      setError(null);
    } catch (error) {
      console.error('Error adding friend:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.error === "Could Not Find a User With That Name") {
        setError("User not found");
      } else {
        setError(error.response ? error.response.data.error : error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/path/to/your/profile-picture.png' }} // replace with your pfp image URI
          style={styles.profileImage}
        />
      </View>
      <View style={styles.accountInfoContainer}>
        <View style={styles.accountInfo}>
          <Text style={styles.label}>Account Name</Text>
          <Text style={styles.label}>Bio</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.editButton, styles.editProfileButton]} onPress={toggleProfileModal}>
            <Icon name="pencil" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.card} onPress={fetchFriends}>
          <Text style={styles.cardText}>Your Friends</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.card} onPress={() => {}}>
          <Text style={styles.cardText}>Goals</Text>
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={toggleProfileModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput style={styles.input} placeholder="Edit Name" placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Edit Bio" placeholderTextColor="#888" />
            <TouchableOpacity style={styles.saveButton} onPress={toggleProfileModal}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFriendsModalVisible}
        onRequestClose={() => setFriendsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {friends.map((friend) => (
                <View key={friend.id} style={styles.friendCard}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <View style={styles.friendButtonContainer}>
                    <TouchableOpacity style={styles.friendButton}>
                      <Icon name="envelope" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.friendButton, styles.deleteButton]} onPress={() => removeFriend(friend.username)}>
                      <Icon name="trash" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View style={styles.addFriendContainer}>
              <TextInput
                style={styles.addFriendInput}
                placeholder="Add by StudyBuddies username"
                placeholderTextColor="#888"
                value={newFriendUsername}
                onChangeText={setNewFriendUsername}
              />
              <TouchableOpacity style={styles.sendButton} onPress={addFriend}>
                <Icon name="paper-plane" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setFriendsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60, // Added padding to move everything down
    backgroundColor: '#2c2c2e', // Updated background color
  },
  header: {
    alignItems: 'flex-start', // Align items to the left
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc', // Placeholder color
    marginLeft: 20, // Move the profile picture to the right
  },
  accountInfoContainer: {
    borderWidth: 1,
    borderColor: '#3a3a3c', // Updated border color
    borderRadius: 10,
    padding: 30, // Further increased padding
    marginBottom: 20,
    backgroundColor: '#3a3a3c', // Updated background color
    minHeight: 200, // Further increased minimum height
    justifyContent: 'space-between', // Ensure content is spaced out
  },
  accountInfo: {
    alignItems: 'flex-start', // Align content to the left
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    color: '#fff', // Updated text color
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons in a row
    justifyContent: 'center', // Center the buttons horizontally
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A259FF',
    padding: 10,
    borderRadius: 25, // Make corners very rounded
    marginHorizontal: 10, // Add horizontal margin to space buttons apart
    width: 200, // Make the button longer
    justifyContent: 'center', // Center the text and icon
  },
  icon: {
    marginRight: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    marginVertical: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#3a3a3c', // Updated border color
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
    backgroundColor: '#3a3a3c', // Updated background color
  },
  cardText: {
    fontSize: 18,
    color: '#fff', // Updated text color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#3a3a3c',
    borderRadius: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    backgroundColor: '#3a3a3c',
    color: '#fff',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#A259FF',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3a3a3c',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#3a3a3c',
    marginBottom: 10,
  },
  friendName: {
    fontSize: 16,
    color: '#fff',
  },
  friendButtonContainer: {
    flexDirection: 'row',
  },
  friendButton: {
    backgroundColor: '#A259FF',
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF4D4D',
  },
  addFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addFriendInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 25, // Very rounded corners
    backgroundColor: '#3a3a3c',
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#5275c4',
    padding: 10,
    borderRadius: 15, // Slightly rounded corners
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: '#A259FF',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProfileScreen;
