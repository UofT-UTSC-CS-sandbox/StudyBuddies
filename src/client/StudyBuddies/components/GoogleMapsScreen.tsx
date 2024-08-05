import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default function GoogleMapsScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      {location ? (
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
          />

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
        </MapView>
      ) : (
        <Text>{text}</Text>
      )}
    </View>
  );
}
