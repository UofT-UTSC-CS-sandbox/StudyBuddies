import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../app/style/messaging';

const MessagingPage = () => {
  const messages = [
    { text: 'um hi ^_^', isSender: true },
    { text: 'uwu', isSender: false },
  ];

  return (
    <SafeAreaView style={styles.app}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <View style={styles.header}>
          <Image source={require('../assets/images/lebronjames.png')} style={styles.profileImage} />
          <Text style={styles.headerText}>big D</Text>
        </View>
        <ScrollView contentContainerStyle={styles.messageList}>
          {messages.map((msg, index) => (
            <View key={index} style={[styles.messageBubble, msg.isSender ? styles.sender : styles.receiver]}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="iMessage"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagingPage;
