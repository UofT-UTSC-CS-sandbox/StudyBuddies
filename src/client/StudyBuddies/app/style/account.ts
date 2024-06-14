import { StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#fff',
    backgroundColor: '#1c1c1e',
    textAlign: 'center',
    minHeight: screenHeight,
    paddingTop: 50,
    flex: 1,
  },
  appContactDetail: {
    padding: 20,
    textAlign: 'left',
    flex: 1,
    justifyContent: 'center',
  },
  contactPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#444',
    marginBottom: 20,
    alignSelf: 'center',
  },
  form: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  formGroupLabel: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#888',
  },
  formGroupInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    backgroundColor: '#3a3a3c',
    color: '#fff',
  },
  formGroupPicker: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    backgroundColor: '#3a3a3c',
    color: '#fff',
  },
  formSubmitButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 5,
    alignItems: 'center',
  },
  formSubmitButtonText: {
    color: '#fff',
  },
});

export default styles;
