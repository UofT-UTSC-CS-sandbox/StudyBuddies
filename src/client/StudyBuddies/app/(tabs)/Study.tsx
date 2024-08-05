import StudyScreen from '@/components/StudyScreen';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CourseScreen from '@/components/CourseScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Study">
        <Stack.Screen
          name="Study"
          component={StudyScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Course"
          component={CourseScreen}
          options={({ route }) => ({
            title: route.params?.courseName || 'Course Details',
            headerStyle: {
              backgroundColor: '#1c1c1e', // Change the header background color
            },
            headerTintColor: '#fff', // Change the text color of the header title
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
