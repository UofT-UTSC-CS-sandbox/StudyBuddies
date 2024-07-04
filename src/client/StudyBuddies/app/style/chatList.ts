import { StyleSheet } from 'react-native';

const chatListStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
  },
  searchBarContainer: {
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default chatListStyle;
