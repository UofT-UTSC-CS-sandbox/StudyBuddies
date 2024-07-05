// SwipeUpMenu.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';

// ItemMini Component
const ItemMini = ({ show }) => (
  <View style={styles.itemMini}>
    <Text>Mini Item</Text>
  </View>
);


type Room = {
    id: number 
    roomNumber: number
    building: string
    capacity: number
    occupancy: number
    students: Array<Student>
}

type Building = {
    name: string
    rooms: Array<Room>
}

type Student = {
    name: string
    img: string | null
    isStudying: boolean
    course: string | null
}

function NewStudent(name: string, img: string | null,  isStudying: boolean, course: string | null): Student {

    let returnImage = "<link-to-default-img>"
    let activeCourse = "Socializing"

    if (img != null) {
        returnImage = img
    }

    if (course != null) {
        activeCourse = course
    }

    return {
        name: name,
        img: returnImage,
        isStudying: isStudying,
        course: activeCourse,
    }
}


// ItemFull Component
const ItemFull = ({ hide, onCardClick }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  // Example effect to fetch cards from database (replace with your own fetch logic)
  useEffect(() => {
    fetchCardsFromDatabase(); // Assuming this function fetches cards from your database
  }, []);

  // Function to fetch cards from database (example)
  const fetchCardsFromDatabase = () => {
    // Replace with actual database fetch logic
    const fetchedCards = [
      NewStudent("jeff", "someurl", true, "CSCB09")
      { id: 2, title: 'Room 2', description: 'Description for Room 2', capacity: 8, details: ['Detail 4', 'Detail 5'] },
      { id: 3, title: 'Room 3', description: 'Description for Room 3', capacity: 10, details: ['Detail 6', 'Detail 7', 'Detail 8'] },
      { id: 4, title: 'Room 4', description: 'Description for Room 4', capacity: 6, details: ['Detail 9'] },
      { id: 5, title: 'Room 5', description: 'Description for Room 5', capacity: 4, details: ['Detail 10', 'Detail 11'] },
      // Add more rooms as needed
    ];
    setCards(fetchedCards);
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    const clickedCard = cards.find(card => card.id === cardId);
    setSelectedCard(clickedCard);
    onCardClick();
  };

  return (
    <View style={styles.itemFull}>
      <ScrollView>
        {cards.map((card) => (
          <TouchableOpacity key={card.id} onPress={() => handleCardClick(card.id)}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text>{card.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={selectedCard !== null} transparent>
        <View style={styles.modalBackground}>
          {selectedCard && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCard.title}</Text>
              <Text>Capacity: {selectedCard.capacity}</Text>
              <ScrollView style={styles.detailsScrollView}>
                {selectedCard.details.map((detail, index) => (
                  <View key={index} style={styles.detailCard}>
                    <Text>{detail}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedCard(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

// SwipeUpMenu Component
const SwipeUpMenu = () => {
  const [swipeHeight, setSwipeHeight] = useState(95);
  const [isFullView, setIsFullView] = useState(false);

  const toggleFullView = () => {
    setIsFullView(!isFullView);
    setSwipeHeight(isFullView ? 94 : Dimensions.get('window').height * 0.75);
  };

  return (
    <SwipeUpDown
      itemMini={(show) => <ItemMini show={show} />}
      itemFull={(hide) => <ItemFull hide={hide} onCardClick={toggleFullView} />}
      onShowMini={() => {
        console.log('mini');
        setSwipeHeight(94); // Update swipeHeight to 95 when onShowMini is triggered
      }}
      onShowFull={() => console.log('full')}
      animation="easeInEaseOut"
      disableSwipeIcon
      extraMarginTop={100} // Adjust this to move the swipe-up menu up when in mini item mode
      iconColor='yellow'
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
    backgroundColor: 'rgb(44,44,46)', // #2c2c2e
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -15, // Adjust this to move the mini item view up
  },
  itemFull: {
    padding: 20,
    backgroundColor: 'rgb(44,44,46)', // #2c2c2e
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Adjust this to move the full item view up
    zIndex: 1, // Ensure the full item view is above the background
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

export default SwipeUpMenu;
