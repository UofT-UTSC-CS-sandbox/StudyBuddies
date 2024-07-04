// SwipeUpMenu.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';

// ItemMini Component
const ItemMini = ({ show }) => (
  <View style={styles.itemMini}>
    <Text>Mini Item</Text>
  </View>
);

// ItemFull Component
const ItemFull = ({ hide }) => (
  <View style={styles.itemFull}>
    <Text>Full Item</Text>
  </View>
);

// SwipeUpMenu Component
const SwipeUpMenu = () => {
  return (
    <SwipeUpDown
      itemMini={(show) => <ItemMini show={show} />}
      itemFull={(hide) => <ItemFull hide={hide} />}
      onShowMini={() => console.log('mini')}
      onShowFull={() => console.log('full')}
      animation="easeInEaseOut"
      disableSwipeIcon
      extraMarginTop={-20} // Adjust this to move the swipe-up menu up when in mini item mode
      iconColor='yellow'
      iconSize={30}
      miniItemSize={100} // Adjust this to set the height of the mini item
      style={styles.swipeUpDown}
    />
  );
};

const styles = StyleSheet.create({
  swipeUpDown: {
    backgroundColor: 'rgba(162, 89, 255, 0.5)', // Translucent #A259FF
    position: 'absolute',
    bottom:0,
    width: '100%',
    marginBottom: 0, // Adjust to be above the nav bar
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  itemMini: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0, // Adjust this to move the mini item view up
  },
  itemFull: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 60, // Keep the full item view position as desired
  },
});

export default SwipeUpMenu;
