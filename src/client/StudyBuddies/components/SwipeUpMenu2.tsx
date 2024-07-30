import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, StyleSheet, TextInput, Button } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';

type Goal = {
  id: number;
  title: string;
  description: string;
  duration: string; // e.g., "2 weeks"
};

const initialGoals: Goal[] = [
  {
    id: 1,
    title: 'Learn TypeScript',
    description: 'Complete a TypeScript tutorial',
    duration: '1 week',
  },
  {
    id: 2,
    title: 'Build React Native App',
    description: 'Create a personal project using React Native',
    duration: '3 weeks',
  },
];

const App = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState<boolean>(false);
  const [newGoal, setNewGoal] = useState<{ title: string; description: string; duration: string }>({ title: '', description: '', duration: '' });
  const [swipeHeight, setSwipeHeight] = useState<number>(94);

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleCreateGoal = () => {
    const newGoalId = goals.length ? Math.max(goals.map(g => g.id)) + 1 : 1;
    setGoals([...goals, { id: newGoalId, ...newGoal }]);
    setNewGoal({ title: '', description: '', duration: '' });
    setIsCreatingGoal(false);
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    if (selectedGoal && selectedGoal.id === goalId) {
      setSelectedGoal(null);
    }
  };

  return (
    <SwipeUpDown
      itemMini={() => (
        <View style={styles.itemMini}>
          <Text>Swipe up for your goals</Text>
        </View>
      )}
      itemFull={() => (
        <View style={styles.itemFull}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {goals.map((goal) => (
              <View key={goal.id} style={styles.cardContainer}>
                <TouchableOpacity onPress={() => handleGoalClick(goal)}>
                  <View style={styles.card}>
                    <Text style={styles.cardTitle}>{goal.title}</Text>
                    <Text>{goal.description}</Text>
                    <Text>{`Duration: ${goal.duration}`}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteGoal(goal.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
  cardContainer: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
