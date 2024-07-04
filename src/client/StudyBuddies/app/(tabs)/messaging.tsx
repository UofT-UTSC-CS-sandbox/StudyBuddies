import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '/Users/cgokhale/Desktop/chinmay/utsc_3year/c01/StudyBuddies/src/client/StudyBuddies/store';
import AppNavigator from '@/components/AppNavigator';

const ChatListScreen1 = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default ChatListScreen1;
