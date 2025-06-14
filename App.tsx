import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View,Text,Button,StyleSheet,FlatList,SafeAreaView,TouchableOpacity,Image, TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectList } from 'react-native-dropdown-select-list';
import { Alert } from 'react-native';


type RootStackParamList = {
  Home: undefined;
  AddItems: undefined;
  Filter: undefined;
}; //this enables navigation between screens


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
  };//function for removing a dish via button

  const getAveragePrice = (course: Course): number => {
    const filtered = Menu.filter(d => d.course === course);
    if (filtered.length === 0) return 0;
    const total = filtered.reduce((sum, d) => sum + d.price, 0);
    return total / filtered.length;
  }; //function for calculating the average prices of each course items

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
        <Text style={{ marginTop: 10 }}>No dishes yet.</Text>//this displays when no dishes are added
      ) : (
        <FlatList
          style={{ marginTop: 10 }}
          data={Menu}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.dishRow}>
              <Text>{item.name} [{item.description}] - R{item.price.toFixed(2)} ({item.course})</Text>
            </View>
          )} //flatlist displays all the menu items that have been added with their name, description and pricing
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
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

 const validate = () => { //function for error handling
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = 'Dish name is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Enter a valid price';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 const handleAdd = () => {
   if (!validate()) return; //validates error handling
    if (!name || !price) return;

    const newDish = {
      name,
      price: parseFloat(price),
      course,
      description,

      
    };

    console.log('Adding dish:', newDish);
    AddDish(newDish);


    //  to clear form 
  setName('');
  setPrice('');
  setDescription('');
  

//navogate back to home screen
   Alert.alert('Success!', 'Dish added to the menu!');//alert to tell user a dish has been added
  setTimeout(() => {
    navigation.goBack();
  }, 1000);

  };
 
  
  const courseOptions = [
  { key: '1', value: 'starter' },
  { key: '2', value: 'main' },
  { key: '3', value: 'dessert' },
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
           style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter Dish Name"
            value={name}
            onChangeText={setName}
            
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Enter Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            placeholder="Enter Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
           {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

          
      <SelectList 
  setSelected={(val: string) => {
    console.log('Selected:', val);
    setCourse(val as Course); // set course for new dish
  }}
  data={courseOptions} 
  save="value"
  placeholder="Select a course"
  boxStyles={{ marginVertical: 10 , backgroundColor:'white'}}//updated from picker to selectlist as required from feeback
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
const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  const confirmdelete = (dishId: string) => {
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this dish?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
        //Are you sure alert
          RemoveDish(dishId);

          //Remove alert!
          Alert.alert('Removed', ' ${item.name}  has been removed from the menu.');
        },
        style: 'destructive',
      },
    ]
  );
};

const courseOptions = [ 
  { key: '1', value: 'starter' },
  { key: '2', value: 'main' },
  { key: '3', value: 'dessert' },
];// function that holds the values of the courses

const filtered = selectedCourse
  ? Menu.filter(d => d.course === selectedCourse)
  : Menu; // show all if nothing selected


  return (
    <View style={styles.container}>
      <View style={styles.header}>
    <Text style={styles.headerText}>Menu</Text>
  </View>
  <View style={styles.spacer}></View>
  <View style={styles.TitleBox}>
      <Text style={styles.title}>Filter by Course</Text>
      </View>
  <SelectList
  data={courseOptions}
  setSelected={(val: string) => {
          console.log('Selected course:', val);
          setSelectedCourse(val);
        }}
  save="value"
  placeholder="Select a course"
  boxStyles={{ marginVertical: 10 }} //updated from picker to select list as well
/> 

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.dishRow}>
            <Text>{item.name} -  R{item.price.toFixed(2)}</Text>
            <Button
        title="Remove"
        onPress={() => {
          confirmdelete(item.id);
           Alert.alert('Removed', `${item.name} has been removed from the menu.`);
        }}//alert message when dish is removed
        color={'#BF0A31'}
      />
              
          </View>
        )} //this contains the necessary info about the added dishes as well as the button that holds the function to remove a dish
      />

      <TouchableOpacity
      style={styles.Button}
      onPress={() => navigation.navigate('AddItems')}
    >
      <Text style={styles.ButtonText}>Add Dish</Text>
    </TouchableOpacity>
        <TouchableOpacity
      style={styles.Button}
      onPress={() => navigation.navigate('Home')}
    >
      <Text style={styles.ButtonText}>Home</Text>
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
inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    marginLeft: 2,

  
  

}});