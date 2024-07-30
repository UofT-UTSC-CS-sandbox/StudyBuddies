import React, { useState, useEffect } from 'react';
import StudyScreen from '@/components/StudyScreen'
import { View, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import GoalsMenu from '@/components/GoalsMenu'
import SwipeUpMenu2 from '@/components/SwipeUpMenu2'


const Study = () => {
  return (
    <View style={{ flex: 1 }}>
      <StudyScreen />
      <SwipeUpMenu2 />

    </View>
  );
};



export default Study;

