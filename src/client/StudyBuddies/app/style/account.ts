
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#fff',
    backgroundColor: '#1c1c1e',
    textAlign: 'center',
    minHeight: '100vh',
    paddingTop: 50,
  },
  appContactDetail: {
    padding: 20,
    textAlign: 'left',
  },
  contactPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#444',
    marginBottom: 20,
    marginHorizontal: 'auto',
  },
  form: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  formGroupLabel: {
    display: 'block',
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
  formSubmitButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007aff',
    border: 'none',
    borderRadius: 5,
    color: '#fff',
    cursor: 'pointer',
  },
  formSubmitButtonHover: {
    backgroundColor: '#005bb5',
  },
});

export default styles;
