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
import MapView from 'react-native-maps';
import GoogleMapsScreen from '@/components/GoogleMapsScreen';




const MapsScreen = () => {
  return (
    <GoogleMapsScreen />
  );
};



export default MapsScreen;
