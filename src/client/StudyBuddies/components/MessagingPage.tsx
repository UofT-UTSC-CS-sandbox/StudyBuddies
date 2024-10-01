import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../store';
import messagingStyle from '../app/style/messaging';

const MessagingPage = ({ route }) => {
  const { chatId } = route.params;
  const messages = useSelector((state) => state.messages[chatId]) || [];
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      dispatch(addMessage({ chatId, message: { text, isSender: true } }));
      setText('');
    }
  };

  return (
    <SafeAreaView style={messagingStyle.app}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={messagingStyle.container} keyboardVerticalOffset={80}>
        <ScrollView contentContainerStyle={messagingStyle.messageList}>
          {messages.map((msg, index) => (
            <View key={index} style={[messagingStyle.messageBubble, msg.isSender ? messagingStyle.sender : messagingStyle.receiver]}>
              <Text style={messagingStyle.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={messagingStyle.inputContainer}>
          <TextInput
            style={messagingStyle.input}
            placeholder="iMessage"
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
            autoCorrect={true}
          />
          <TouchableOpacity style={messagingStyle.sendButton} onPress={handleSend}>
            <Text style={messagingStyle.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagingPage;