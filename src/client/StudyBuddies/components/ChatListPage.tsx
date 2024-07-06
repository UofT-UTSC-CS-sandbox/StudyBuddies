import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
import chatListStyles from '../app/style/chatList';
import { addChat, deleteChat, deleteMessagesForChat } from '../store';

const ChatListScreen = ({ navigation }) => {
  const chats = useSelector((state) => state.chatList);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPeople, setSelectedPeople] = useState([]);

  const people = ['Person 1', 'Person 2', 'Person 3'];

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
  };

  const handleDeleteChat = (id) => {
    dispatch(deleteChat(id));
    dispatch(deleteMessagesForChat(id));
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
        <Image source={require('@/assets/images/lebronjames.png')} style={chatListStyles.profileImage} />
        <View style={chatListStyles.chatDetails}>
          <Text style={chatListStyles.chatName}>{item.name}</Text>
          <Text style={chatListStyles.chatMessage} numberOfLines={1}>{item.message}</Text>
        </View>
        <Text style={chatListStyles.chatTime}>{item.time}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={chatListStyles.container}>
      <View style={chatListStyles.headerContainer}>
        <Text style={chatListStyles.header}>Group Chats</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={chatListStyles.addButton}>
          <Text style={chatListStyles.addButtonText}>Add Chat</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={chatListStyles.modalContainer}>
          <View style={chatListStyles.modalContent}>
            <Text style={chatListStyles.modalTitle}>Select People</Text>
            {people.map((name) => (
              <CheckBox
                key={name}
                title={name}
                checked={selectedPeople.includes(name)}
                onPress={() => {
                  if (selectedPeople.includes(name)) {
                    setSelectedPeople(selectedPeople.filter(person => person !== name));
                  } else {
                    setSelectedPeople([...selectedPeople, name]);
                  }
                }}
              />
            ))}
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
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ChatListScreen;
