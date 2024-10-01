import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnderConstruction: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚧</Text>
      <Text style={styles.text}>Under Construction</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  emoji: {
    fontSize: 80,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default UnderConstruction;
