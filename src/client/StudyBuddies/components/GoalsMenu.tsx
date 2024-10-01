import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, StyleSheet, TextInput, Button } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';

type Goal = {
  id: number;
  title: string;
  description: string;
  duration: string; // e.g., "2 weeks"
  progress: number; // Percentage
};

const initialGoals: Goal[] = [
  {
    id: 1,
    title: 'Learn TypeScript',
    description: 'Complete a TypeScript tutorial',
    duration: '1 week',
    progress: 50,
  },
  {
    id: 2,
    title: 'Build React Native App',
    description: 'Create a personal project using React Native',
    duration: '3 weeks',
    progress: 20,
  },
];

const App = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [swipeHeight, setSwipeHeight] = useState<number>(94);
  const [isCreatingGoal, setIsCreatingGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<{ title: string; description: string; duration: string }>({ title: '', description: '', duration: '' });

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleUpdateProgress = (progress: number) => {
    if (selectedGoal) {
      const updatedGoals = goals.map((goal) =>
        goal.id === selectedGoal.id ? { ...goal, progress } : goal
      );
      setGoals(updatedGoals);
    }
  };

  const handleCreateGoal = () => {
    const newGoalId = goals.length ? Math.max(goals.map(g => g.id)) + 1 : 1;
    setGoals([...goals, { id: newGoalId, ...newGoal, progress: 0 }]);
    setNewGoal({ title: '', description: '', duration: '' });
    setIsCreatingGoal(false);
  };

  return (
    <SwipeUpDown
      itemMini={(show) => (
        <View style={styles.itemMini}>
          <Text>Swipe up for your goals</Text>
        </View>
      )}
      itemFull={(hide) => (
        <View style={styles.itemFull}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {goals.map((goal) => (
              <TouchableOpacity key={goal.id} onPress={() => handleGoalClick(goal)}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{goal.title}</Text>
                  <Text>{goal.description}</Text>
                  <Text>{`Duration: ${goal.duration}`}</Text>
                  <Text>{`Progress: ${goal.progress}%`}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Button title="Create New Goal" onPress={() => setIsCreatingGoal(true)} />
          </ScrollView>
          <Modal visible={!!selectedGoal} transparent animationType="slide">
            <View style={styles.modalBackground}>
              {selectedGoal && (
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selectedGoal.title}</Text>
                  <Text>{selectedGoal.description}</Text>
                  <Text>{`Duration: ${selectedGoal.duration}`}</Text>
                  <Text>{`Progress: ${selectedGoal.progress}%`}</Text>
                  <Button title="Update Progress" onPress={() => handleUpdateProgress(selectedGoal.progress + 10)} /> {/* Example for incrementing progress */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedGoal(null)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>
          <Modal visible={isCreatingGoal} transparent animationType="slide">
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Create New Goal</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={newGoal.title}
                  onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={newGoal.description}
                  onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Duration (e.g., 2 weeks)"
                  value={newGoal.duration}
                  onChangeText={(text) => setNewGoal({ ...newGoal, duration: text })}
                />
                <Button title="Create Goal" onPress={handleCreateGoal} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsCreatingGoal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
      onShowMini={() => {
        console.log('Swipe up menu minimized');
        setSwipeHeight(94);
      }}
      onShowFull={() => console.log('Swipe up menu expanded')}
      animation="easeInEaseOut"
      disableSwipeIcon
      swipeHeight={swipeHeight}
      swipeFullHeight={Dimensions.get('window').height * 0.75}
      style={styles.swipeUpDown}
    />
  );
};

const styles = StyleSheet.create({
  swipeUpDown: {
    backgroundColor: 'rgba(162, 89, 255, 0.5)', // Translucent #A259FF
    position: 'absolute',
    bottom: 95,
    width: '100%',
    marginBottom: 95, // Adjust to be above the nav bar
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  itemMini: {
    padding: 20,
    backgroundColor: 'rgba(162, 89, 255, 0.01)', // Translucent #A259FF
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -15, // Adjust this to move the mini item view up
  },
  itemFull: {
    padding: 20,
    backgroundColor: 'rgba(162, 89, 255, 0.01)', // Translucent #A259FF
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Adjust this to move the full item view up
    zIndex: 1, // Ensure the full item view is above the background
  },
  scrollViewContent: {
    marginTop: 20, // Add space between the top part and the scroll view
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'rgba(162, 89, 255, 0.5)', // Translucent #A259FF
  },
});

export default App;
