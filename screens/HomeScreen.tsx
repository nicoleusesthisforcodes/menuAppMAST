import { MenuContext } from '../context/MenuContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useMenu } from '../context/MenuContext';

const HomeScreen = () => {
  const { getAveragePrice } = useMenu();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Average Prices</Text>
      <Text>Starters: ${getAveragePrice('starter').toFixed(2)}</Text>
      <Text>Mains: ${getAveragePrice('main').toFixed(2)}</Text>
      <Text>Desserts: ${getAveragePrice('dessert').toFixed(2)}</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});