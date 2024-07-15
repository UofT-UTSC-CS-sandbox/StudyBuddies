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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  form: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    flex: 1,
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
    width: screenWidth / 2.5, 
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 5,
    backgroundColor: '#3a3a3c',
    color: '#fff',
    marginTop: 10, 
  },
  pickerItem: {
    fontSize: 14,
    color: '#fff'
  },
  formSubmitButton: {
    width: screenWidth - 200, 
    padding: 10,
    backgroundColor: '#A259FF"',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center', 
    marginLeft: -150,
  },
  formSubmitButtonText: {
    color: '#fff',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  selectedCoursesContainer: {
    flex: 1,
    paddingRight: 10,
  },
  pickerContainer: {
    flex: 1,
    paddingLeft: 10,
    alignItems: 'flex-end', 
  },
  selectedCourseItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  selectedCourseItem: {
    color: '#fff',
    flex: 1, 
  },
  removeCourseButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    marginRight: 10, 
  },
  removeCourseButtonText: {
    color: '#fff',
  },
  addCourseButton: {
    paddingHorizontal: 10,
    paddingVertical: 8, 
    backgroundColor: '#A259FF',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCourseButtonText: {
    color: '#fff',
    fontSize: 14, 
  },
  fullWidthButtonContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default styles;
