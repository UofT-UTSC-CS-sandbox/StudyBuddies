import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const LoginButton = ({ setAuth0ID, setIsAuthenticated, setIsRegistered }) => {
  const { authorize, getCredentials } = useAuth0();

  const login = async () => {
    try {
      await authorize({
        connection: 'google-oauth2',
         
      });

      const credentials = await getCredentials();
      if (!credentials) {
        console.error('No credentials received');
        return;
      }
      await SecureStore.setItemAsync('userToken', credentials.idToken);

      console.log("Credentials: ", credentials);
      const response = await axios.post('http://localhost:8080/api/account/auth/callback', null, {
        headers: {
          Authorization: `${credentials.idToken}`
        }
      });

      if (response.data.message === "New user, please register") {
        setAuth0ID(credentials.idToken);
        setIsAuthenticated(true);
        setIsRegistered(false);
        console.log('New user, please register');
      } else {
        setAuth0ID(credentials.idToken);
        setIsAuthenticated(true);
        setIsRegistered(true);
        console.log('User already registered');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onPress={login} title="Log in with Google" />;
};

const RegisterForm = ({ auth0ID, onRegisterComplete }) => {
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');

  const registerUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');

      const response = await axios.post('http://localhost:8080/api/account/register', {
        auth0_id: auth0ID,
        username: username,
        name: name
      }, {
        headers: {
          Authorization: `${token}`
        }
      });

      console.log(response.data);
      onRegisterComplete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Text style={styles.label}>Name:</Text>
      <TextInput
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Register" onPress={registerUser} />
    </View>
  );
};

const HomeScreen = ({ onLogout }) => (
  <View style={styles.homeContainer}>
    <Text style={styles.title}>Welcome to StudyBuddies!</Text>
    <Text>You are now logged in.</Text>
    <Button title="Logout" onPress={onLogout} />
  </View>
);

const App = () => {
  const [auth0ID, setAuth0ID] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const { getCredentials, clearSession } = useAuth0();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const response = await axios.post('http://localhost:8080/api/account/auth/callback', null, {
            headers: {
              Authorization: `${token}`
            }
          });

          if (response.data.message === "User already registered") {
            setAuth0ID(token);
            setIsAuthenticated(true);
            setIsRegistered(true);
            console.log('User already registered');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkSession();
  }, []);

  const handleRegisterComplete = () => {
    setIsRegistered(true);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await clearSession({ federated: true })
      await SecureStore.deleteItemAsync('userToken');
      setIsAuthenticated(false);
      setIsRegistered(false);
      setAuth0ID('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudyBuddies</Text>
      {!isAuthenticated ? (
        <View style={styles.buttonContainer}>
          <LoginButton setAuth0ID={setAuth0ID} setIsAuthenticated={setIsAuthenticated} setIsRegistered={setIsRegistered} />
        </View>
      ) : isRegistered ? (
        <HomeScreen onLogout={handleLogout} />
      ) : (
        <RegisterForm auth0ID={auth0ID} onRegisterComplete={handleRegisterComplete} />
      )}
    </View>
  );
};

export default function Root() {
  return (
    <Auth0Provider domain='dev-b5grqf3saaizzpim.us.auth0.com' clientId='rytSm1ChNsc22WcrguxPUCyGi7s3HYgS'>
      <App />
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
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  formContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
});
