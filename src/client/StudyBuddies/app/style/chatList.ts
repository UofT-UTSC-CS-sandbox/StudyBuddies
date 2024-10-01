import { StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const chatList = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    paddingTop: 0, // Add padding to move content lower
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20, // Add margin to create space below the header
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#A259FF',
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatMessage: {
    fontSize: 14,
    color: '#aaa',
  },
  chatTime: {
    fontSize: 12,
    color: '#999', // Lighter grey text
  },
  searchBar: {
    backgroundColor: '#333',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    color: '#fff', // White text
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalItemText: {
    fontSize: 18,
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#A259FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalAddButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#A259FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalAddButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  leftAction: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'red',
    flex: 1,
    paddingHorizontal: 20,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default chatList;