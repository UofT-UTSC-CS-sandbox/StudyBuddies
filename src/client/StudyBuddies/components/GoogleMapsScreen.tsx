import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#A259FF',
    fontSize: 16,
  },
  markerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default function GoogleMapsScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [friends, setFriends] = useState([]);
  const [profileImage, setProfileImage] = useState('');

  const fetchFriendsLocations = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      console.log('Fetched Token:', token);

      if (!token) {
        console.error('No token found');
        setErrorMsg('No token found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/account/getFriendsLocations', {
        headers: {
          Authorization: token,
        },
      });
      console.log('Friends location response:', response.data);
      setFriends(response.data.locations || []);
    } catch (error) {
      console.error('Error fetching friends:', error.response ? error.response.data : error.message);
      setErrorMsg(error.response ? error.response.data.error : error.message);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get('http://localhost:8080/api/account/getProfileImage', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log("Profile Image RESPONSE: ", response.data)
      setProfileImage(response.data.img);
    } catch (error) {
      console.error('Error fetching profile image:', error);
      setErrorMsg(error.response ? error.response.data.error : error.message);
    }
  };

  const updateLocation = async (lat, long) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        console.error('No token found');
        setErrorMsg('No token found');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/account/updateLocation', null, {
        headers: {
          Authorization: token,
        },
        params: {
          lat: lat.toString(),
          long: long.toString(),
        },
      });
      console.log('Update location response:', response.data);
    } catch (error) {
      console.error('Error updating location:', error.response ? error.response.data : error.message);
      setErrorMsg(error.response ? error.response.data.error : error.message);
    }
  };

  const handleFetchFriendsAndUpdateLocation = async () => {
    if (location) {
      await updateLocation(location.latitude, location.longitude);
      await fetchFriendsLocations();
      await fetchProfileImage(); // Fetch profile image again
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Update user's location after getting the current location
      await updateLocation(loc.coords.latitude, loc.coords.longitude);

      // Fetch friends' locations and profile image after getting the current location
      await fetchFriendsLocations();
      await fetchProfileImage(); // Fetch profile image
    })();
  }, []);

  useEffect(() => {
    console.log("Profile Image URL: ", profileImage);
  }, [profileImage]);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Current Location"
              description="This is where you are."
            >
              {profileImage ? (
                <View style={styles.markerImageContainer}>
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.markerImage}
                  />
                </View>
              ) : null}
            </Marker>

            <Marker
              coordinate={{
                latitude: 43.786770,
                longitude: -79.189580,
              }}
              title="IC Building"
              description="Where the academic weapons come to work."
            />

            <Marker
              coordinate={{
                latitude: 43.783900,
                longitude: -79.186290,
              }}
              title="Library"
              description="Book a day keeps the bad grades away."
            />

            <Marker
              coordinate={{
                latitude: 43.790901,
                longitude: -79.194283,
              }}
              title="Pan Am Centre"
              description="Come Ball Up Fam."
            />

            {friends.map((friend, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: friend.lat,
                  longitude: friend.long,
                }}
                title={friend.name}
                description="Friend"
              >
                {friend.img ? (
                  <View style={styles.markerImageContainer}>
                    <Image
                      source={{ uri: friend.img }}
                      style={styles.markerImage}
                    />
                  </View>
                ) : null}
              </Marker>
            ))}
          </MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleFetchFriendsAndUpdateLocation}>
              <Text style={styles.buttonText}>Fetch Friends' Locations</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>{text}</Text>
      )}
    </View>
  );
}
