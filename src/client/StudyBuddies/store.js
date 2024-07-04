import { configureStore, createSlice } from '@reduxjs/toolkit';

const chatListSlice = createSlice({
  name: 'chatList',
  initialState: [
    { id: '1', name: 'Person 1', message: '', time: '11:41' },
  ],
  reducers: {},
});

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    '1': [
      { text: 'um hi ^_^', isSender: true },
      { text: 'uwu', isSender: false },
    ],
    '2': [{ text: 'um hi ^_^', isSender: true },
        { text: 'uwu', isSender: false },],
    '3': [],
    '4': [],
  },
  reducers: {
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      state[chatId].push(message);
    },
  },
});

export const { addMessage } = messageSlice.actions;

const store = configureStore({
  reducer: {
    chatList: chatListSlice.reducer,
    messages: messageSlice.reducer,
  },
});

export default store;
