import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import chatListStyles from '../app/style/chatList';

const ChatListScreen = ({ navigation }) => {
  const chats = useSelector((state) => state.chatList);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={chatListStyles.chatItem} onPress={() => navigation.navigate('MessagingPage', { chatId: item.id })}>
      <Image source={require('@/assets/images/lebronjames.png')} style={chatListStyles.profileImage} />
      <View style={chatListStyles.chatDetails}>
        <Text style={chatListStyles.chatName}>{item.name}</Text>
        <Text style={chatListStyles.chatMessage} numberOfLines={1}>{item.message}</Text>
      </View>
      <Text style={chatListStyles.chatTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={chatListStyles.container}>
      <View style={chatListStyles.headerContainer}>
        <Text style={chatListStyles.header}>Messages</Text>
        <View style={chatListStyles.searchBarContainer}>
          <TextInput
            style={chatListStyles.searchBar}
            placeholder="Search"
            placeholderTextColor="#888"
          />
        </View>
      </View>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ChatListScreen;
