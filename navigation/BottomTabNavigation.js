import * as React from 'react';
import {Text, View, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Subscribers from '../screens/subscribers/Appl';
//
import Calls from '../screens/home/Appl';
import HomeScreen from '../screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
  return <Text>Logout</Text>;
};
const Tab = createBottomTabNavigator();

export default function App({navigation, route}) {
  const {loggedinDetails} = route.params;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }
          if (route.name === 'Calls') {
            iconName = focused ? 'call' : 'call-outline';
          }
          if (route.name === 'Subscribers') {
            //
            iconName = focused ? 'people' : 'people-outline';
          }
          if (route.name === 'Logout') {
            return <Icon2 name="logout" size={size} color={color} />;
          } else {
            return <Icon name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#6699CC',
        tabBarInActiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{loggedinDetails: loggedinDetails}}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        initialParams={{loggedinDetails: loggedinDetails}}
      />
      <Tab.Screen
        name="Subscribers"
        component={Subscribers}
        initialParams={{loggedinDetails: loggedinDetails}}
      />
      <Tab.Screen
        name="Logout"
        component={Logout}
        listeners={{
          tabPress: e => {
            e.preventDefault(); // Use this to navigate somewhere else
            AsyncStorage.removeItem('token')
              .then(() => {
                navigation.navigate('Login');
              })
              .catch(err => console.log(err));
          },
        }}
      />
    </Tab.Navigator>
  );
}
