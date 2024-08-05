import axios from 'axios';

// Example base URL; adjust according to your API documentation
const API_BASE_URL = 'https://api.studybuddies.com';

// Function to send a message
export const sendMessage = async (chatId, senderId, content) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, {
      chatId,
      senderId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to fetch messages
export const fetchMessages = async (chatId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/messages?chatId=${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
