import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  timer: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  startButton: {
    backgroundColor: '#a259ff',
    padding: 10,
    borderRadius: 5,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#a259ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 10,
    right: 10,
    top: -10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  gradeScrollView: {
    maxHeight: 200,
    marginTop: 10,
  },
  gradeContainer: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 1,
  },
  gradeText: {
    fontSize: 18,
    color: '#fff',
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%', // Ensure buttons fit within the height of the row
  },
  editButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Adjusted width to fit better
    height: 50, // Ensure the height fits within the row
    borderRadius: 10,
    marginVertical: 5, // Add vertical margin for spacing
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Adjusted width to fit better
    height: 50, // Ensure the height fits within the row
    borderRadius: 10,
    marginVertical: 5, // Add vertical margin for spacing
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#3a3a3c',
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#a259ff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  viewPager: {
    height: 300, // Adjust the height as needed
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  currentGradeText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
});

export default styles;
