import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import {Provider} from 'react-redux';

import AppNavigator from './navigation/AppNavigator';
import BottomTabNavigator from './navigation/BottomTabNavigation';
// import store from './redux/store';
//

export default function App() {
  return <BottomTabNavigator />;
}
//

const styles = StyleSheet.create({});
