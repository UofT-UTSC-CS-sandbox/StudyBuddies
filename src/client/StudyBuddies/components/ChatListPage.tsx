import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal, TextInput, StatusBar, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
import chatListStyles from '../app/style/chatList';
import { addChat, deleteChat, deleteMessagesForChat } from '../store';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const ChatListScreen = ({ navigation }) => {
  const chats = useSelector((state) => state.chatList);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  const fetchFriends = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      console.log('Fetched Token:', token);

      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/account/getFriends', {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log('Friends response:', response.data);
      setFriends(response.data.friends || []);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching friends:', error.response ? error.response.data : error.message);
    }
  };

  const handleAddChat = () => {
    if (selectedPeople.length === 0) {
      setErrorMessage('Please select at least one person');
      return;
    }

    const groupName = selectedPeople.join(', ');
    const chatExists = chats.some(chat => chat.name === groupName);
    if (chatExists) {
      setErrorMessage('Chat already exists');
      return;
    }

    const newChat = {
      id: (chats.length + 1).toString(),
      name: groupName,
      message: '',
      time: new Date().toLocaleTimeString(),
    };
    dispatch(addChat(newChat));
    setIsModalVisible(false);
    setSelectedPeople([]);
    setErrorMessage('');
    setSearchQuery('');
  };

  const handleDeleteChat = (id) => {
    dispatch(deleteChat(id));
    dispatch(deleteMessagesForChat(id));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredChats(chats);
    } else {
      setFilteredChats(chats.filter(chat => chat.name.toLowerCase().includes(query.toLowerCase())));
    }
  };

  const renderLeftActions = (progress, dragX, item) => {
    return (
      <View style={chatListStyles.leftAction}>
        <RectButton style={chatListStyles.actionButton} onPress={() => handleDeleteChat(item.id)}>
          <Text style={chatListStyles.actionButtonText}>X</Text>
        </RectButton>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, item)}>
      <TouchableOpacity style={chatListStyles.chatItem} onPress={() => navigation.navigate('MessagingPage', { chatId: item.id })}>
        <Image source={require('@/assets/images/default_pic.png')} style={chatListStyles.profileImage} />
        <View style={chatListStyles.chatDetails}>
          <Text style={chatListStyles.chatName}>{item.name}</Text>
          <Text style={chatListStyles.chatMessage} numberOfLines={1}>{item.message}</Text>
        </View>
        <Text style={chatListStyles.chatTime}>{item.time}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  const getAvailableFriends = () => {
    const existingFriends = new Set(chats.flatMap(chat => chat.name.split(', ')));
    return friends.filter(friend => !existingFriends.has(friend.name));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1c1c1e" />
      <View style={chatListStyles.container}>
        <View style={chatListStyles.headerContainer}>
          <Text style={chatListStyles.header}>Chats</Text>
          <TouchableOpacity onPress={fetchFriends} style={chatListStyles.addButton}>
            <Text style={chatListStyles.addButtonText}>Add Chat</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={chatListStyles.searchBar}
          placeholder="Search chats..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Modal visible={isModalVisible} transparent={true} animationType="slide">
          <View style={chatListStyles.modalContainer}>
            <View style={chatListStyles.modalContent}>
              <Text style={chatListStyles.modalTitle}>Select People</Text>
              {getAvailableFriends().length > 0 ? (
                getAvailableFriends().map((friend) => (
                  <CheckBox
                    key={friend.id}
                    title={friend.name}
                    checked={selectedPeople.includes(friend.name)}
                    onPress={() => {
                      if (selectedPeople.includes(friend.name)) {
                        setSelectedPeople(selectedPeople.filter(person => person !== friend.name));
                      } else {
                        setSelectedPeople([...selectedPeople, friend.name]);
                      }
                    }}
                  />
                ))
              ) : (
                <Text style={chatListStyles.errorMessage}>No friends available to add</Text>
              )}
              {errorMessage ? <Text style={chatListStyles.errorMessage}>{errorMessage}</Text> : null}
              <TouchableOpacity style={chatListStyles.modalAddButton} onPress={handleAddChat}>
                <Text style={chatListStyles.modalAddButtonText}>Create Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={chatListStyles.modalCloseButton} onPress={() => setIsModalVisible(false)}>
                <Text style={chatListStyles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <FlatList
          data={filteredChats}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatListScreen;
