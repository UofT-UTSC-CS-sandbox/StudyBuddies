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
        <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: '' }} />
        <Stack.Screen name="MessagingPage" component={MessagingPage} options={{ title: 'Chat' }} />
      </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;
