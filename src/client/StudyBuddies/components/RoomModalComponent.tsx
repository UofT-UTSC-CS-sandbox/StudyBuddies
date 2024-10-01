// RoomModalComponent.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Room, Student } from '../types/types'; // Import Room and Student types

type RoomModalComponentProps = {
  room: Room;
  currentUser: Student;
  onClose: () => void;
  onJoinLeaveRoom: () => void;
};

const RoomModalComponent: React.FC<RoomModalComponentProps> = ({ room, currentUser, onClose, onJoinLeaveRoom }) => {
  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{`Room ${room.roomNumber}`}</Text>
        <Text>{`Capacity: ${room.capacity}`}</Text>
        <ScrollView style={styles.detailsScrollView}>
          {room.students.map((student, index) => (
            <View key={index} style={styles.detailCard}>
              <Text>{student.name}</Text>
              <Text>{student.course}</Text>
            </View>
          ))}
        </ScrollView>
        <Button
          title={room.students.some((student) => student.name === currentUser.name) ? 'Leave Room' : 'Join Room'}
          onPress={onJoinLeaveRoom}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  detailsScrollView: {
    marginTop: 10,
    maxHeight: '50%',
  },
  detailCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default RoomModalComponent;
