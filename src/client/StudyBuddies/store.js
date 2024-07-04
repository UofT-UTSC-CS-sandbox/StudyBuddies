import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define chatListSlice
const chatListSlice = createSlice({
  name: 'chatList',
  initialState: [
    { id: '1', name: 'Person 1', message: '', time: '11:41' },
  ],
  reducers: {
    addChat: (state, action) => {
      state.push(action.payload);
    },
    deleteChat: (state, action) => {
      return state.filter(chat => chat.id !== action.payload);
    },
  },
});

// Define messageSlice
const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    '1': [
      { text: 'um hi ^_^', isSender: true },
      { text: 'uwu', isSender: false },
    ],
  },
  reducers: {
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state[chatId]) {
        state[chatId] = [];
      }
      state[chatId].push(message);
    },
    deleteMessagesForChat: (state, action) => {
      delete state[action.payload];
    },
  },
});

export const { addChat, deleteChat } = chatListSlice.actions;
export const { addMessage, deleteMessagesForChat } = messageSlice.actions;

const rootReducer = combineReducers({
  chatList: chatListSlice.reducer,
  messages: messageSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
