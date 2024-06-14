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
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

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
        />
      </View>
    );
  
  }