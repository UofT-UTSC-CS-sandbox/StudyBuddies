// screens/StudyTimerScreen.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const StudyTimerScreen = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const startTimer = () => {
    setRunning(true);
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Timer</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric" 
        placeholder="Enter seconds" 
        onChangeText={(text) => setSeconds(parseInt(text))} 
      />
      <Button title="Start" onPress={startTimer} disabled={running} />
      <Text style={styles.timerText}>{seconds} seconds remaining</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '80%',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 30,
    marginTop: 20,
  },
});

export default StudyTimerScreen;
