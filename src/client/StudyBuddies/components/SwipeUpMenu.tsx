import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, StyleSheet } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';

type Student = {
  name: string;
  image: any;
  isOnline: boolean;
  course: string;
};

type Room = {
  id: number;
  roomNumber: number;
  building: string;
  capacity: number;
  students: Student[];
  occupancy: number;
};

type Building = {
  name: string;
  rooms: Room[];
};

const initialBuildings: Building[] = [
  {
    name: 'Building A',
    rooms: [
      {
        id: 1,
        roomNumber: 101,
        building: 'A',
        capacity: 5,
        students: [{ name: 'Alice', image: null, isOnline: true, course: 'Math101' }],
        occupancy: 1,
      },
      {
        id: 2,
        roomNumber: 102,
        building: 'A',
        capacity: 8,
        students: [{ name: 'Bob', image: null, isOnline: true, course: 'CS102' }],
        occupancy: 1,
      },
    ],
  },
  {
    name: 'Building B',
    rooms: [
      {
        id: 3,
        roomNumber: 201,
        building: 'B',
        capacity: 10,
        students: [{ name: 'Dave', image: null, isOnline: true, course: 'CS101' }],
        occupancy: 1,
      },
      {
        id: 4,
        roomNumber: 202,
        building: 'B',
        capacity: 6,
        students: [],
        occupancy: 0,
      },
    ],
  },
];

const App = () => {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [swipeHeight, setSwipeHeight] = useState<number>(94);

  const currentUser = { name: 'TestUser' }; // Replace with actual user object

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleJoinLeaveRoom = () => {
    if (!selectedRoom) return;

    const updatedBuildings = buildings.map((building) => {
      const updatedRooms = building.rooms.map((room) => {
        if (room.id === selectedRoom.id) {
          const isStudentInRoom = room.students.some((student) => student.name === currentUser.name);

          if (isStudentInRoom) {
            // Leave room
            const updatedStudents = room.students.filter((student) => student.name !== currentUser.name);
            const updatedOccupancy = updatedStudents.length;
            console.log(`Room ${room.roomNumber} now has ${updatedOccupancy} students.`);
            return { ...room, students: updatedStudents, occupancy: updatedOccupancy };
          } else {
            // Join room
            const newStudent: Student = { name: currentUser.name, image: null, isOnline: true, course: 'CSCC01' }; // Replace with actual student data
            const updatedStudents = [...room.students, newStudent];
            const updatedOccupancy = updatedStudents.length;
            console.log(`Room ${room.roomNumber} now has ${updatedOccupancy} students.`);
            return { ...room, students: updatedStudents, occupancy: updatedOccupancy };
          }
        }
        return room;
      });
      return { ...building, rooms: updatedRooms };
    });

    setBuildings(updatedBuildings);
    setSelectedRoom(null); // Close modal after join/leave
  };

  return (
    <SwipeUpDown
      itemMini={(show) => (
        <View style={styles.itemMini}>
          <Text>Swipe up for more</Text>
        </View>
      )}
      itemFull={(hide) => (
        <View style={styles.itemFull}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {buildings.map((building) => (
              <View key={building.name}>
                <Text style={styles.buildingTitle}>{building.name}</Text>
                {building.rooms.map((room) => (
                  <TouchableOpacity key={room.id} onPress={() => handleRoomClick(room)}>
                    <View style={styles.card}>
                      <Text style={styles.cardTitle}>{`Room ${room.roomNumber}`}</Text>
                      <Text>{`Capacity: ${room.capacity}`}</Text>
                      <Text>{`Occupancy: ${room.occupancy}`}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
          <Modal visible={!!selectedRoom} transparent animationType="slide">
            <View style={styles.modalBackground}>
              {selectedRoom && (
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{`Room ${selectedRoom.roomNumber}`}</Text>
                  <Text>{`Capacity: ${selectedRoom.capacity}`}</Text>
                  <ScrollView style={styles.detailsScrollView}>
                    {selectedRoom.students.map((student, index) => (
                      <View key={index} style={styles.detailCard}>
                        <Text>{student.name}</Text>
                        <Text>{student.course}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity style={styles.joinLeaveButton} onPress={handleJoinLeaveRoom}>
                    <Text style={styles.joinLeaveButtonText}>
                      {selectedRoom.students.some(student => student.name === currentUser.name) ? 'Leave Room' : 'Join Room'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedRoom(null)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  buildingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  detailsScrollView: {
    marginTop: 10,
    maxHeight: '50%',
  },
  detailCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  joinLeaveButton: {
    backgroundColor: 'rgba(162, 89, 255, 0.5)', // Translucent #A259FF
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  joinLeaveButtonText: {
    color: '#fff',
    fontSize: 16,
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
