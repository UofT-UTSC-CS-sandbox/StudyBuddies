import React, { PropsWithChildren, useState, } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import {useAuth0, Auth0Provider} from 'react-native-auth0';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


export default function App() {

  const LoginButton = () => {
    const {authorize} = useAuth0();

    const onPress = async () => {
        try {
            await authorize();
        } catch (e) {
            console.log(e);
        }
    };

    return <Button onPress={onPress} title="Log in" />
}

  return (
    <Auth0Provider domain='dev-b5grqf3saaizzpim.us.auth0.com' clientId='rytSm1ChNsc22WcrguxPUCyGi7s3HYgS'>
    <View style={styles.container}>
      <Text style={styles.title}>StudyBuddies</Text>
      <View style={styles.buttonContainer}>
        <LoginButton />
      </View>
    </View>
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-between',
    marginVertical: 10,
  }
});
