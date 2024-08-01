import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import accountStyle from '../app/style/account';

const { width: screenWidth } = Dimensions.get('window');

type Contact = {
  firstName: string;
  lastName: string;
  bio: string;
};

const ContactDetail = ({
  contact,
  handleChange,
  handleSave,
  editingField,
  setEditingField,
  editingValue,
  setEditingValue,
}) => {
  return (
    <View style={accountStyle.appContactDetail}>
      <View style={accountStyle.profileImageContainer}>
        <Image source={require('../assets/images/lebronjames.png')} style={accountStyle.profileImage} />
      </View>
      <View style={accountStyle.form}>
        <View style={accountStyle.formGroup}>
          <View style={accountStyle.formLabelContainer}>
            <Text style={accountStyle.formGroupLabel}>First name</Text>
            <TouchableOpacity onPress={() => {
              setEditingField('firstName');
              setEditingValue(contact.firstName);
            }}>
              <Text style={accountStyle.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          {editingField === 'firstName' ? (
            <TextInput
              style={accountStyle.formGroupInput}
              id="firstName"
              name="firstName"
              value={editingValue}
              onChangeText={(text) => setEditingValue(text)}
              required
            />
          ) : (
            <View style={accountStyle.embeddedTextContainer}>
              <Text style={accountStyle.textField}>{contact.firstName || 'test'}</Text>
            </View>
          )}
        </View>
        <View style={accountStyle.formGroup}>
          <View style={accountStyle.formLabelContainer}>
            <Text style={accountStyle.formGroupLabel}>Last name</Text>
            <TouchableOpacity onPress={() => {
              setEditingField('lastName');
              setEditingValue(contact.lastName);
            }}>
              <Text style={accountStyle.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          {editingField === 'lastName' ? (
            <TextInput
              style={accountStyle.formGroupInput}
              id="lastName"
              name="lastName"
              value={editingValue}
              onChangeText={(text) => setEditingValue(text)}
              required
            />
          ) : (
            <View style={accountStyle.embeddedTextContainer}>
              <Text style={accountStyle.textField}>{contact.lastName || 'test'}</Text>
            </View>
          )}
        </View>
        <View style={accountStyle.formGroup}>
          <View style={accountStyle.formLabelContainer}>
            <Text style={accountStyle.formGroupLabel}>Bio</Text>
            <TouchableOpacity onPress={() => {
              setEditingField('bio');
              setEditingValue(contact.bio);
            }}>
              <Text style={accountStyle.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          {editingField === 'bio' ? (
            <TextInput
              style={accountStyle.formGroupInput}
              id="bio"
              name="bio"
              value={editingValue}
              onChangeText={(text) => setEditingValue(text)}
              multiline
            />
          ) : (
            <View style={accountStyle.embeddedTextContainer}>
              <Text style={accountStyle.textField}>{contact.bio || 'test'}</Text>
            </View>
          )}
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={accountStyle.saveButton} onPress={handleSave}>
            <Text style={accountStyle.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function AccountPage() {
  const [contact, setContact] = useState<Contact>({
    firstName: 'test',
    lastName: 'test',
    bio: 'test'
  });

  const [editingField, setEditingField] = useState<string>('');
  const [editingValue, setEditingValue] = useState<string>('');

  const handleChange = (name: string, value: string) => {
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSave = () => {
    handleChange(editingField, editingValue);
    console.log('Contact Saved:', contact);
    setEditingField('');
  };

  return (
    <ScrollView contentContainerStyle={accountStyle.app}>
      <ContactDetail
        contact={contact}
        handleChange={handleChange}
        handleSave={handleSave}
        editingField={editingField}
        setEditingField={setEditingField}
        editingValue={editingValue}
        setEditingValue={setEditingValue}
      />
    </ScrollView>
  );
}
