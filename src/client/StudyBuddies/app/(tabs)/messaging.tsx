import React, { useState, useEffect } from 'react';
import ChatListScreen from '@/components/ChatListPage';
import { Provider } from 'react-redux';
import store from '/Users/cgokhale/Desktop/chinmay/utsc_3year/c01/StudyBuddies/src/client/StudyBuddies/store.js';
import AppNavigator from '@/components/AppNavigator';


const ChatListScreen1 = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default ChatListScreen1;


