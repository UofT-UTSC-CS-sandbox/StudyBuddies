// RoomComponent.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Room, Student } from '../types/types'; // Adjust import as per your file structure

type RoomComponentProps = {
  room: Room;
  onRoomClick: (room: Room) => void;
};

const RoomComponent: React.FC<RoomComponentProps> = ({ room, onRoomClick }) => {
  return (
    <TouchableOpacity onPress={() => onRoomClick(room)}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{`Room ${room.roomNumber}`}</Text>
        <Text>{`Capacity: ${room.capacity}`}</Text>
        <Text>{`Occupancy: ${room.occupancy}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default RoomComponent;
