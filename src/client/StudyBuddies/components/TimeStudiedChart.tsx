// components/StudyVsGradeChart.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const sampleData = {
  labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const StudyVsGradeChart: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Studied vs. Current Grade (All Students)</Text>
      <LineChart
        data={sampleData}
        width={width - 60} 
        height={220}
        chartConfig={{
          backgroundColor: '#2c2c1e',
          backgroundGradientFrom: '#2c2c2e',
          backgroundGradientTo: '#2c2c2e',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 300,
    backgroundColor: '#2c2c2e',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#fff',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StudyVsGradeChart;
