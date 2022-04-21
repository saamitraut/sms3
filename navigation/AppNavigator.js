import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigation';
// import SubscriberScreen from '../screens/subscribers/Appl';
// import HomeScreen from '../screens/Home';
// import About from '../screens/About';
function AppNavigator() {
  return (
    <NavigationContainer>
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
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
        name="Subscribers"
        component={SubscriberScreen}
        options={{headerShown: true}}
      /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
