import * as React from 'react';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import AppNavigator from './AppNavigator';
// import SubscriberNavigator from './SubscriberNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
//
import Subscribers from '../screens/subscribers/Appl';
import Calls from '../screens/home/Appl';

function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!.............</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Tab.Navigator> */}
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            iconName = 'call';

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
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#696969',
          tabBarInActiveTintColor: 'gray',
        })}>
        {/* <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Calls') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            } else if (route.name === 'Subscribers') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}> */}
        <Tab.Screen name="Home" component={HomeScreen} />
        {/* <Tab.Screen name="Calls" component={AppNavigator} /> */}
        <Tab.Screen name="Calls" component={Calls} />
        <Tab.Screen name="Subscribers" component={Subscribers} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
