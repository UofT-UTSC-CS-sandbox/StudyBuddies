import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { Auth0Provider, useAuth0 } from 'react-native-auth0';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

    
    return (
      <View style={styles.container}>
        <MapView 
          
          style={styles.map} 
          region={{
            latitude: 43.841420,
            longitude: -79.003680,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          >
      
          <Marker
            coordinate={{
              latitude: 43.841420,
              longitude: -79.003680,
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
      </View>
    );
  
  }

  