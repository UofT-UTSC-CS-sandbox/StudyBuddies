import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Button, Animated, Easing, Dimensions, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const StudyScreen: React.FC = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState('');
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleCard = (card: 'timer') => {
    if (card === 'timer') {
      setShowTimer(!showTimer);
    }
  };

  const closeCard = (card: 'timer') => {
    if (card === 'timer') {
      setShowTimer(false);
      setIsTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const animateCard = (show: boolean) => {
    Animated.timing(slideAnim, {
      toValue: show ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animateCard(showTimer);
  }, [showTimer]);

  const slideY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0] // Use pixel values
  });

  const startTimer = () => {
    const timeInMinutes = parseInt(timer, 10);
    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
      Alert.alert('Invalid Time', 'Please enter a valid number of minutes.');
      return;
    }
    
    const endTime = Date.now() + timeInMinutes * 60 * 1000; // Time in milliseconds
    setRemainingTime(timeInMinutes * 60);
    setIsTimerRunning(true);

    timerRef.current = setInterval(() => {
      const timeLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerRef.current!);
        setIsTimerRunning(false);
        Alert.alert('Timer Finished', 'Your study session has ended!');
      }
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome Back CurrentUser,</Text>
        <Image 
          source={require('./motivation.jpeg')} 
          style={styles.image}
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => toggleCard('timer')}
        >
          <Text style={styles.buttonText}>Study Timer</Text>
        </TouchableOpacity>

        {showTimer && (
          <Animated.View style={[styles.card, { transform: [{ translateY: slideY }], zIndex: 1 }]}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => closeCard('timer')}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.cardTitle}>Set Study Timer</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter time in minutes"
              keyboardType="numeric"
              value={timer}
              onChangeText={setTimer}
            />
            <Button 
              title={isTimerRunning ? 'Timer Running' : 'Start Timer'} 
              onPress={startTimer}
              disabled={isTimerRunning}
            />
            {isTimerRunning && (
              <Text style={styles.reminderText}>
                Don't touch your phone!
              </Text>
            )}
            {remainingTime !== null && (
              <Text style={styles.timerText}>
                Time Remaining: {formatTime(remainingTime)}
              </Text>
            )}
          </Animated.View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#333',
      padding: 20,
    },
    welcomeText: {
      fontSize: 24,
      color: 'white',
      marginBottom: 20,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 30,
      borderRadius: 20, // Rounded corners for the image
    },
    button: {
      backgroundColor: '#B041FF',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
    },
    card: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      paddingBottom: 70, // Extra padding at the bottom to ensure button visibility
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // Increased shadow for better visibility
      zIndex: 2, // Ensure it's on top of other elements
    },
    closeButtonText: {
      fontSize: 24,
      color: '#B041FF',
    },
    cardTitle: {
      fontSize: 20,
      marginBottom: 10,
    },
    input: {
      width: '100%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 20,
    },
    timerText: {
      fontSize: 18,
      marginTop: 20,
      textAlign: 'center',
    },
    reminderText: {
      fontSize: 16,
      color: '#FF5733',
      marginTop: 10,
      textAlign: 'center',
    },
  });

export default StudyScreen;
