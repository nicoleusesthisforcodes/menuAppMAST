import { MenuContext } from '../context/MenuContext';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, } from 'react-native';
import { useMenu } from '../context/MenuContext';
import { Picker } from '@react-native-picker/picker';

console.log('AddItemsScreen component file loaded');

const AddItemsScreen= () => {
  const { addDish } = useMenu();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [course, setCourse] = useState<'starter' | 'main' | 'dessert'>('starter');

  const handleAdd = () => {
    if (!name || !price) return;
    addDish({ name, price: parseFloat(price), course });
    setName('');
    setPrice('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Dish</Text>
      <TextInput placeholder="Dish Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />
      <Picker selectedValue={course} onValueChange={value => setCourse(value)}>
        <Picker.Item label="Starter" value="starter" />
        <Picker.Item label="Main" value="main" />
        <Picker.Item label="Dessert" value="dessert" />
      </Picker>
      <Button title="Add Dish" onPress={handleAdd} />
    </View>
  );
};

export default AddItemsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});