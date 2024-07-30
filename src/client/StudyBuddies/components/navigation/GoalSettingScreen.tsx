// screens/GoalSettingScreen.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList, Slider } from 'react-native';

const GoalSettingScreen = () => {
  const [goals, setGoals] = useState<{ key: string; goal: string; progress: number; }[]>([]);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    setGoals([...goals, { key: String(goals.length), goal: newGoal, progress: 0 }]);
    setNewGoal('');
  };

  const updateProgress = (key: string, progress: number) => {
    setGoals(goals.map(g => g.key === key ? { ...g, progress } : g));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Setting</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter new goal" 
        value={newGoal} 
        onChangeText={setNewGoal} 
      />
      <Button title="Add Goal" onPress={addGoal} />
      <FlatList 
        data={goals} 
        renderItem={({ item }) => (
          <View style={styles.goalContainer}>
            <Text style={styles.goalText}>{item.goal}</Text>
            <Slider 
              style={styles.slider} 
              value={item.progress} 
              onValueChange={(value) => updateProgress(item.key, value)} 
              step={1} 
              minimumValue={0} 
              maximumValue={100} 
            />
            <Text>Progress: {item.progress}%</Text>
          </View>
        )} 
      />
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
  goalContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 18,
  },
  slider: {
    width: '80%',
  },
});

export default GoalSettingScreen;
