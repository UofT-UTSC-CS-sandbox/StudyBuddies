import React, { useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width-60}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
      >
        {React.Children.map(children, (child, index) => (
          <View key={index} style={styles.childContainer}>
            {child}
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {React.Children.map(children, (_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  childContainer: {
    width: width - 60, // Adjust width to fit your design
    marginHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  inactiveIndicator: {
    backgroundColor: 'gray',
  },
});

export default Carousel;
