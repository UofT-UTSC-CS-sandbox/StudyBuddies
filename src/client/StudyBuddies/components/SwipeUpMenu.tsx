import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Button } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';

type Room = {
  id: number;
  roomNumber: number;
  building: string;
  capacity: number;
  students: Array<Student>;
  occupancy: number; // Calculate occupancy dynamically
};

type Building = {
  name: string;
  rooms: Array<Room>;
};

type Student = {
  name: string;
  img: string | null;
  isStudying: boolean;
  course: string | null;
};

function NewStudent(name: string, img: string | null, isStudying: boolean, course: string | null): Student {
  let returnImage = "<link-to-default-img>";
  let activeCourse = "Socializing";

  if (img != null) {
    returnImage = img;
  }

  if (course != null) {
    activeCourse = course;
  }

  return {
    name: name,
    img: returnImage,
    isStudying: isStudying,
    course: activeCourse,
  };
}

const SwipeUpDownMenu = () => {
  const [swipeHeight, setSwipeHeight] = useState(95);
  const [isFullView, setIsFullView] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<Student>(NewStudent("Current User", null, true, "CS101"));
  const [fetchedBuildings, setFetchedBuildings] = useState<Building[]>([]);

  useEffect(() => {
    fetchBuildingsFromDatabase();
  }, []);

  useEffect(() => {
    // When selectedRoom changes (i.e., when the user joins or leaves a room),
    // update the occupancy in fetchedBuildings state
    if (selectedRoom) {
      setFetchedBuildings(prevBuildings =>
        prevBuildings.map(building =>
          building.name === selectedRoom.building
            ? {
                ...building,
                rooms: building.rooms.map(room => (room.id === selectedRoom.id ? selectedRoom : room)),
              }
            : building
        )
      );
    }
  }, [selectedRoom]);

  const fetchBuildingsFromDatabase = () => {
    const fetchedBuildings: Building[] = [
      {
        name: 'Building A',
        rooms: [
          { id: 1, roomNumber: 101, building: 'A', capacity: 5, students: [NewStudent('Alice', null, true, 'Math101'), NewStudent('Bob', null, true, 'CS102')], occupancy: 2 },
          { id: 2, roomNumber: 102, building: 'A', capacity: 8, students: [NewStudent('Charlie', null, true, 'CS103')], occupancy: 1 },
        ],
      },
      {
        name: 'Building B',
        rooms: [
          { id: 3, roomNumber: 201, building: 'B', capacity: 10, students: [NewStudent('Dave', null, true, 'CS101')], occupancy: 1 },
          { id: 4, roomNumber: 202, building: 'B', capacity: 6, students: [], occupancy: 0 },
        ],
      },
    ];

    // Add current user to each room's students list
    fetchedBuildings.forEach(building => {
      building.rooms.forEach(room => {
        if (!room.students.some(student => student.name === currentUser.name)) {
          room.students.push(currentUser);
          room.occupancy++;
        }
      });
    });

    setBuildings(fetchedBuildings);
    setFetchedBuildings(fetchedBuildings); // Initialize fetchedBuildings state
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleJoinLeaveRoom = () => {
    if (!selectedRoom) return;

    const isCurrentUserInRoom = selectedRoom.students.some(student => student.name === currentUser.name);

    const updatedRoom = {
      ...selectedRoom,
      students: isCurrentUserInRoom
        ? selectedRoom.students.filter(student => student.name !== currentUser.name)
        : [...selectedRoom.students, currentUser],
      occupancy: isCurrentUserInRoom ? selectedRoom.occupancy - 1 : selectedRoom.occupancy + 1,
    };

    setSelectedRoom(updatedRoom);
  };

  return (
    <SwipeUpDown
      itemMini={(show) => (
        <View style={styles.itemMini}>
          <Text> </Text>
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
                  <Button
                    title={selectedRoom.students.some(student => student.name === currentUser.name) ? 'Leave Room' : 'Join Room'}
                    onPress={handleJoinLeaveRoom}
                  />
                  <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedRoom(null)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Modal>
        </View>
      )}
      onShowMini={() => {
        console.log('mini');
        setSwipeHeight(94); // Update swipeHeight to 95 when onShowMini is triggered
      }}
      onShowFull={() => console.log('full')}
      animation="easeInEaseOut"
      disableSwipeIcon
      extraMarginTop={100} // Adjust this to move the swipe-up menu up when in mini item mode
      iconColor="yellow"
      iconSize={30}
      miniItemSize={100} // Adjust this to set the height of the mini item
      style={styles.swipeUpDown}
      swipeHeight={swipeHeight}
      swipeFullHeight={Dimensions.get('window').height * 0.75}
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
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default SwipeUpDownMenu;
