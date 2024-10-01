import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import AWS from 'aws-sdk';

const awsConfig = {
  region: 'us-east-1',
  accessKeyId: 'AKIA4T2YRUXKBWWVDY4H',
  secretAccessKey: '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',
  bucketName: 'studybuddies123',
};

AWS.config.update({
  region: awsConfig.region,
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey
});

const s3 = new AWS.S3();

const ProfileScreen: React.FC = () => {
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isFriendsModalVisible, setFriendsModalVisible] = useState(false);
  const [isGoalsModalVisible, setGoalsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState<{ id: number; name: string; username: string }[]>([]);
  const [goals, setGoals] = useState<{ id: string; name: string; description: string }[]>([]);
  const [newGoal, setNewGoal] = useState({ id: '', name: '', description: '' });
  const [selectedGoal, setSelectedGoal] = useState<{ id: string; name: string; description: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newFriendUsername, setNewFriendUsername] = useState<string>('');
  const [accountInfo, setAccountInfo] = useState({ name: '', bio: '' });
  const [profileImage, setProfileImage] = useState<string>('');

  useEffect(() => {
    fetchAccountInfo();
    fetchProfileImage();
    fetchFriends();
  }, []);

  const fetchAccountInfo = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get('http://localhost:8080/api/account/getAccountInfo', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log("ACCOUNT INFO RECEIVED: ", response.data)
      setAccountInfo(response.data.info);
    } catch (error) {
      console.error('Error fetching account info:', error);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get('http://localhost:8080/api/account/getProfileImage', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log("RESPONSE: ", response.data)
      setProfileImage(response.data.img);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setError(error.response ? error.response.data.error : error.message);
    }
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

      await fetchFriends();

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

  const updateAccountInfo = async (name: string, bio: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      console.log('Fetched Token:', token);

      if (!token) {
        console.error('No token found');
        setError('No token found');
        return;
      }

      await axios.post(`http://localhost:8080/api/account/updateAccountInfo?name=${name}&bio=${bio}`, null, {
        headers: {
          Authorization: token,
        },
      });

      setAccountInfo({ name, bio });
      setProfileModalVisible(false);
    } catch (error) {
      console.error('Error updating account info:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const updateProfileImage = async (imageUrl: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      await axios.post(`http://localhost:8080/api/account/updateProfileImage?profileImage=${imageUrl}`, null, {
        headers: {
          Authorization: `${token}`
        }
      });
      setProfileImage(imageUrl);
      fetchProfileImage();
    } catch (error) {
      console.error('Error updating profile image:', error);
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setIsLoading(true);
      const uploadTimeout = setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Upload Timeout", "The image upload process is taking too long. Please try again.");
      }, 10000); // 10 seconds timeout

      try {
        const imageUrl = await uploadImageToS3(selectedImageUri);
        clearTimeout(uploadTimeout);
        updateProfileImage(imageUrl);
      } catch (error) {
        clearTimeout(uploadTimeout);
        Alert.alert("Upload Error", "There was an error uploading the image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const uploadImageToS3 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = uri.split('/').pop();
    const s3Params = {
      Bucket: awsConfig.bucketName,
      Key: fileName,
      Body: blob,
      ContentType: blob.type,
      ACL: 'public-read'
    };

    return new Promise<string>((resolve, reject) => {
      s3.upload(s3Params, (err: any, data: any) => {
        if (err) {
          console.error('Error uploading to S3:', err);
          reject(err);
        } else {
          console.log('Successfully uploaded to S3:', data);
          resolve(data.Location);
        }
      });
    });
  };

  const addGoal = () => {
    setGoals([...goals, { ...newGoal, id: `${goals.length + 1}` }]);
    setNewGoal({ id: '', name: '', description: '' });
 //   setGoalsModalVisible(false);
  };

  const editGoal = () => {
    if (selectedGoal) {
      setGoals(goals.map(goal => (goal.id === selectedGoal.id ? selectedGoal : goal)));
      setSelectedGoal(null);
      setGoalsModalVisible(false);
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const renderRightActions = (goal: { id: string; name: string; description: string }) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity onPress={() => setSelectedGoal(goal)} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteGoal(goal.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.accountInfoContainer}>
        <View style={styles.accountInfo}>
          <Text style={styles.infoTitle}>Name</Text>
          <Text style={styles.infoText}>{accountInfo.name}</Text>
          <Text style={styles.infoTitle}>Bio</Text>
          <Text style={styles.infoText}>{accountInfo.bio}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => setProfileModalVisible(true)}>
            <Icon name="pencil" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.card} onPress={() => setFriendsModalVisible(true)}>
          <Text style={styles.cardText}>Your Friends</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.card} onPress={() => setGoalsModalVisible(true)}>
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
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Edit Name"
              placeholderTextColor="#888"
              value={accountInfo.name}
              onChangeText={(text) => setAccountInfo((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Edit Bio"
              placeholderTextColor="#888"
              value={accountInfo.bio}
              onChangeText={(text) => setAccountInfo((prev) => ({ ...prev, bio: text }))}
            />
            <TouchableOpacity style={styles.saveButton} onPress={() => updateAccountInfo(accountInfo.name, accountInfo.bio)}>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGoalsModalVisible}
        onRequestClose={() => setGoalsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {goals.map((goal) => (
                <View key={goal.id} style={styles.goalCard}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                  <View style={styles.goalButtonContainer}>
                    <TouchableOpacity style={styles.goalButton} onPress={() => setSelectedGoal(goal)}>
                      <Icon name="pencil" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.goalButton, styles.deleteButton]} onPress={() => deleteGoal(goal.id)}>
                      <Icon name="trash" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Goal Name"
              placeholderTextColor="#888"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Goal Description"
              placeholderTextColor="#888"
              value={newGoal.description}
              onChangeText={(text) => setNewGoal((prev) => ({ ...prev, description: text }))}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addGoal}>
              <Text style={styles.saveButtonText}>Add Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setGoalsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => setIsLoading(false)}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A259FF" />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedGoal !== null}
        onRequestClose={() => setSelectedGoal(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Edit Goal Name"
              placeholderTextColor="#888"
              value={selectedGoal?.name}
              onChangeText={(text) => setSelectedGoal((prev) => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Edit Goal Description"
              placeholderTextColor="#888"
              value={selectedGoal?.description}
              onChangeText={(text) => setSelectedGoal((prev) => ({ ...prev, description: text }))}
            />
            <TouchableOpacity style={styles.saveButton} onPress={editGoal}>
              <Text style={styles.saveButtonText}>Save Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedGoal(null)}>
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
    paddingTop: 60, 
    backgroundColor: '#2c2c2e',
  },
  header: {
    alignItems: 'flex-start', 
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc', 
    marginLeft: 20, 
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc', 
    marginLeft: 20, 
  },
  accountInfoContainer: {
    borderWidth: 1,
    borderColor: '#3a3a3c', 
    borderRadius: 10,
    padding: 30, 
    marginBottom: 20,
    backgroundColor: '#3a3a3c', 
    minHeight: 200, 
    justifyContent: 'space-between', 
  },
  accountInfo: {
    alignItems: 'flex-start', 
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A259FF',
    padding: 10,
    borderRadius: 25, 
    marginHorizontal: 10,
    width: 200, 
    justifyContent: 'center', 
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
    borderColor: '#3a3a3c', 
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
    backgroundColor: '#3a3a3c',
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
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
    borderRadius: 25, 
    backgroundColor: '#3a3a3c',
    color: '#fff',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#5275c4',
    padding: 10,
    borderRadius: 15,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  goalCard: {
    borderWidth: 1,
    borderColor: '#3a3a3c',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#3a3a3c',
    marginBottom: 10,
  },
  goalName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  goalDescription: {
    fontSize: 14,
    color: '#fff',
  },
  goalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  goalButton: {
    backgroundColor: '#A259FF',
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
