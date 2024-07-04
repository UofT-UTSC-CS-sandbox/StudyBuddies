import React, { useState, useEffect } from 'react';
import GoogleMapsScreen from '@/components/GoogleMapsScreen';
import SwipeUpDown from 'react-native-swipe-up-down';
import SwipeUpMenu from '@/components/SwipeUpMenu'
import { View, Text } from 'react-native';



const MapsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <GoogleMapsScreen />
      <SwipeUpMenu />
    </View>
  );
};



export default MapsScreen;
