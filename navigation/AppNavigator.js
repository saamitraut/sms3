import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/home/Appl';
import SubscriberScreen from '../screens/subscribers/Appl';
import About from '../screens/About';
function AppNavigator() {
  return (
    // <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerLeft: null}}
      />
      {/* <Stack.Screen
        name="Subscribers"
        component={SubscriberScreen}
        options={{headerShown: true}}
      /> */}
    </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default AppNavigator;
