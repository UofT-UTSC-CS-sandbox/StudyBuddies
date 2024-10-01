// navigation/StudyNavigator.js
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudyScreen from '../StudyScreen'; // Adjust the path based on your project structure
import StudyTimerScreen from './StudyTimerScreen';
import GoalSettingScreen from './GoalSettingScreen';
import TrackProgressScreen from './TrackProgressScreen';

const Stack = createStackNavigator();

export default function StudyNavigator() {
  return (
    <Stack.Navigator initialRouteName="Study">
      <Stack.Screen name="Study" component={StudyScreen} />
      <Stack.Screen name="StudyTimer" component={StudyTimerScreen} />
      <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
      <Stack.Screen name="TrackProgress" component={TrackProgressScreen} />
    </Stack.Navigator>
  );
}
