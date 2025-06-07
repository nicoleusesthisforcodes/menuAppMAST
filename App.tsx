import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View,Text,Button,StyleSheet,FlatList,SafeAreaView,TouchableOpacity,Image, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectList } from 'react-native-dropdown-select-list';


type RootStackParamList = {
  Home: undefined;
  AddItems: undefined;
  Filter: undefined;
};


type Course = 'starter' | 'main' | 'dessert';

type Dish = {
  id: string;
  name: string;
  price: number;
  course: Course;
  description:string;
};

type MenuContextType = {
  Menu: Dish[];
  AddDish: (dish: Omit<Dish, 'id'>) => void;
  RemoveDish: (id: string) => void;
  getAveragePrice: (course: Course) => number;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [Menu, setMenu] = useState<Dish[]>([]);

  const AddDish = (dish: Omit<Dish, 'id'>) => {
    const newDish: Dish = {
      id: Date.now().toString(),
      ...dish,
    };
    setMenu(prev => [...prev, newDish]);
  };

  const RemoveDish = (id: string) => {
    setMenu(prev => prev.filter(d => d.id !== id));
  };

  const getAveragePrice = (course: Course): number => {
    const filtered = Menu.filter(d => d.course === course);
    if (filtered.length === 0) return 0;
    const total = filtered.reduce((sum, d) => sum + d.price, 0);
    return total / filtered.length;
  };

  return (
    <MenuContext.Provider value={{ Menu, AddDish, RemoveDish, getAveragePrice }}>
      {children}
    </MenuContext.Provider>
  );
};

const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <MenuProvider>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddItems" component={AddItemsScreen} options={{ title: 'Add Dish' }} />
          <Stack.Screen name="Filter" component={CourseFilterScreen} options={{ title: 'Filter Menu' }} />
        </Stack.Navigator>
      </MenuProvider>
    </NavigationContainer>
  );
}

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const { Menu, getAveragePrice } = useMenu();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
    <Text style={styles.headerText}>Menu</Text>
  </View>
  <View style={styles.spacer}></View>
  <View style={styles.Image}>
      <Image style={styles.ImageSize}
        source={require('./assets/3courses.png')}/>
      </View>
  
  <View style={styles.spacer}></View>
      <View style={styles.TitleBox}>
      <Text style={styles.title}>Average Prices</Text>
      </View>

      <View style={styles.spacer}></View>
      <View style={styles.Box}>
      <Text style={{color:'white', fontFamily:'serif', textAlign:'center', fontWeight:'bold'}}>Starters: R{getAveragePrice('starter').toFixed(2)}</Text>
      <Text style={{color:'white', fontFamily:'serif', textAlign:'center', fontWeight:'bold'}}>Mains: R{getAveragePrice('main').toFixed(2)}</Text>
      <Text style={{color:'white', fontFamily:'serif', textAlign:'center', fontWeight:'bold'}}>Desserts: R{getAveragePrice('dessert').toFixed(2)}</Text>
       </View>

       <Text style={{ marginTop: 30, fontSize: 18, fontWeight: 'bold' }}>All Dishes:</Text>
      {Menu.length === 0 ? (
        <Text style={{ marginTop: 10 }}>No dishes yet.</Text>
      ) : (
        <FlatList
          style={{ marginTop: 10 }}
          data={Menu}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.dishRow}>
              <Text>{item.name} [{item.description}] - R{item.price.toFixed(2)} ({item.course})</Text>
            </View>
          )}
        />
      )}


      <TouchableOpacity
      style={styles.Button}
      onPress={() => navigation.navigate('AddItems')}
    >
      <Text style={styles.ButtonText}>Add Dish</Text>
    </TouchableOpacity>
        <TouchableOpacity
      style={styles.Button}
      onPress={() => navigation.navigate('Filter')}
    >
      <Text style={styles.ButtonText}>Filtered Course</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
};

const AddItemsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { AddDish } = useMenu();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('starter');
  const [selectedCourse, setSelectedCourse] =  useState<string>(""); //for the select list
 

  const handleAdd = () => {
    const priceNum = parseFloat(price);
    if (!name || isNaN(priceNum) ||!description) return;
    AddDish({ name, description, price: priceNum, course });
    setName('');
    setPrice('');
    setDescription('');
    navigation.goBack();
  };//function for adding a item
  
  const courseOptions = [
  { key: '1', value: 'Starter' },
  { key: '2', value: 'Main' },
  { key: '3', value: 'Dessert' },
]; //function for program to identify components in selection list

 



  return (
    <View style={styles.container}>
      <View style={styles.header}>
    <Text style={styles.headerText}>Menu</Text>
  </View>
  <View style={styles.spacer}></View>
  <View style={styles.Image}>
      <Image style={styles.ImageSize}
        source={require('./assets/courses.png')}/>
      </View>
      <View style={styles.spacer}></View>
      <View style={styles.TitleBox}>
      <Text style={styles.title}>Add Dish</Text>
      </View>
      <View style={styles.spacer}></View>
      
          <TextInput
            style={styles.input}
            placeholder="Enter Dish Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          
      <SelectList 
  setSelected={(val: string) => setSelectedCourse(val)} 
  data={courseOptions} 
  save="value"
  placeholder="Select a course"
  boxStyles={{ marginVertical: 10 , backgroundColor:'white'}}
/>
      <TouchableOpacity
      style={styles.Button}
      onPress={handleAdd}
    >
      <Text style={styles.ButtonText}>Add Dish</Text>
    </TouchableOpacity>
  
    </View>
  );
};

const CourseFilterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { Menu, RemoveDish } = useMenu();
  const [filter, setFilter] = useState<Course>('starter');

  const filtered = Menu.filter(d => d.course === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
    <Text style={styles.headerText}>Menu</Text>
  </View>
  <View style={styles.spacer}></View>
  <View style={styles.TitleBox}>
      <Text style={styles.title}>Filter by Course</Text>
      </View>
      <Picker selectedValue={filter} onValueChange={(v) => setFilter(v)}>
        <Picker.Item label="Starter" value="starter" />
        <Picker.Item label="Main" value="main" />
        <Picker.Item label="Dessert" value="dessert" />
      </Picker>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.dishRow}>
            <Text>{item.name} -  R{item.price.toFixed(2)}</Text>
            <Button title="Remove" onPress={() => RemoveDish(item.id)} color={'#BF0A31'} />
          </View>
        )}
      />

      <TouchableOpacity
      style={styles.Button}
      onPress={() => navigation.navigate('AddItems')}
    >
      <Text style={styles.ButtonText}>Add Dish</Text>
    </TouchableOpacity>
        <TouchableOpacity
      style={styles.Button}
      onPress={() => navigation.navigate('Filter')}
    >
      <Text style={styles.ButtonText}>Filtered Course</Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:
   { flex: 1, 
    padding: 20 , 
    backgroundColor:'#E3DEDB',
     },
  title: 
  { fontSize: 22,
     marginBottom: 0,
      textAlign: 'center',
       fontFamily:'serif',
      color:'white',
    alignSelf:'center',
  alignItems:'center'},
  input:
   { borderWidth: 2, 
    borderColor:'#44201C',
    padding: 10, 
    marginBottom: 15,
     borderRadius: 5 , 
     color:'#44201C' ,
      alignItems:'center',
    backgroundColor:'white',},
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,

  },
  header: {
    padding: 20,
    backgroundColor: '#C5C0AA',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
spacer:{
height: 18//this will create space between boxes
  },
Box:{
    width:300,
      height:70,
      backgroundColor:'#44201C',
      justifyContent:'center',
      alignItems: 'center',
      textAlign:'center',
      alignSelf:'center',
      borderRadius: 5,
  },
  Button: {
    width: 150,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#2B8C8C',
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 5,
    alignSelf:'center',
    justifyContent: 'space-between'
  },
  ButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ImageSize:{
  width: 200,
  height: 100,
},
Image:{
 paddingTop: 10,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor:'#E3DEDB'
},
TitleBox:{
    width:220,
      height:55,
      backgroundColor:'#2B8C8C',
      justifyContent:'center',
      alignItems: 'center',
      textAlign:'center',
      alignSelf:'center',
      borderColor: '#44201C',
      borderWidth: 2,
  }, 
  countText: { marginTop: 15, fontSize: 16, fontWeight: 'bold' }, 


  
  

});