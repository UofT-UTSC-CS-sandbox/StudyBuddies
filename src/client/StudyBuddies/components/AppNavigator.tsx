import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '@/components/ChatListPage';
import MessagingPage from '@/components/MessagingPage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="ChatList">
        <Stack.Screen 
          name="ChatList" 
          component={ChatListScreen} 
          options={{ 
            title: '',
            headerStyle: {
              backgroundColor: '#1c1c1e', // Match the background color
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="MessagingPage" 
          component={MessagingPage} 
          options={{ 
            title: 'Messages',
            headerStyle: {
              backgroundColor: '#1c1c1e', // Match the background color
            },
            headerTintColor: '#fff',
            headerBackTitleVisible: false, // Optionally hide the back button text
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
