import { MenuContext } from '../context/MenuContext';
import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useMenu } from '../context/MenuContext';
import type { Dish } from '../context/MenuContext';

const CourseFilterScreen= () => {
  const { menu, removeDish } = useMenu();
  const [filter, setFilter] = useState<'starter' | 'main' | 'dessert'>('starter');

  const filteredDishes = menu.filter(d => d.course === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Course</Text>
      <View style={styles.filterButtons}>
        <Button title="Starters" onPress={() => setFilter('starter')} />
        <Button title="Mains" onPress={() => setFilter('main')} />
        <Button title="Desserts" onPress={() => setFilter('dessert')} />
      </View>
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - ${item.price.toFixed(2)}</Text>
            <Button title="Remove" onPress={() => removeDish(item.name)} />
          </View>
        )}
      />
    </View>
  );
};

export default CourseFilterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  filterButtons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  item: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
});