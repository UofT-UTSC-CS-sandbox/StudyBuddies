import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const GradeBreakdown: React.FC<{ grades: any }> = ({ grades }) => {
  const calculateCurrentGrade = () => {
    let totalGrade = 0;
    let totalWeight = 0;
    grades.forEach((grade: any) => {
      totalGrade += parseFloat(grade.grade) * (parseFloat(grade.weight) / 100);
      totalWeight += parseFloat(grade.weight);
    });
    return (totalGrade / totalWeight) * 100 || 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grade Breakdown</Text>
      <Text style={styles.currentGrade}>Current Grade: {calculateCurrentGrade().toFixed(2)}%</Text>
      {grades.map((grade: any, index: number) => (
        <Text key={index} style={styles.gradeText}>
          {grade.name} ({grade.weight}%): {grade.grade}%
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 80,
    height: 220,
    backgroundColor: '#2c2c2e',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  currentGrade: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  gradeText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
});

export default GradeBreakdown;
