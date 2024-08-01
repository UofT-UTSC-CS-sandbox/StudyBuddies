import { StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const accountStyle = StyleSheet.create({
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#fff',
    backgroundColor: '#1c1c1e',
    textAlign: 'center',
    minHeight: screenHeight,
    flex: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  appContactDetail: {
    padding: 20,
    textAlign: 'left',
    flex: 1,
    justifyContent: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#444',
  },
  form: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  formGroupLabel: {
    fontWeight: 'bold',
    color: '#888',
  },
  formLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  formGroupInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    backgroundColor: '#1c1c1e',
    color: '#fff',
  },
  embeddedTextContainer: {
    backgroundColor: '#2c2c2e',
    padding: 10,
    borderRadius: 5,
  },
  textField: {
    color: '#fff',
  },
  editButton: {
    color: '#A259FF',
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#A259FF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: screenWidth / 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default accountStyle;
