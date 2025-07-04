import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './components/Dashboard/DashboardScreen';
import PracticeSelectScreen from './components/PracticeSelect/PracticeSelectScreen';
import MainsScreen from './components/MainsScreen/MainsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="PracticeSelect" component={PracticeSelectScreen} />
        <Stack.Screen name="MainsScreen" component={MainsScreen} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
