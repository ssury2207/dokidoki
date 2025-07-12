import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './components/Dashboard/DashboardScreen';
import PracticeSelectScreen from './components/PracticeSelect/PracticeSelectScreen';
import MainsScreen from './components/PracticeScreens/MainsScreen';
import PractisedQuestionsScreen from './components/PractisedQuestions/PractisedQuestionsScreen';
import PrelimsScreen from './components/PracticeScreens/PrelimsScreen';
import VerdictOverlay from './components/PracticeScreens/VerdictOverlay';
import MainsVerdictOverlay from './components/PracticeScreens/MainsVerdictOverlay';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFF', // Header background color
          },
          headerTintColor: 'black', // Header text and back button color
          headerTitleStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: 'black',
          },
          headerTitleAlign: 'left', // Title alignment
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="PracticeSelect"
          options={{ headerTitle: '' }}
          component={PracticeSelectScreen}
        />
        <Stack.Screen
          name="MainsScreen"
          options={{ title: "Main's Question Set" }}
          component={MainsScreen}
        />
        <Stack.Screen
          name="PractisedQuestions"
          component={PractisedQuestionsScreen}
        />
        <Stack.Screen
          name="Overlay"
          component={VerdictOverlay}
          options={{
            presentation: 'transparentModal', // or 'modal' on iOS
            animation: 'fade',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MainsOverlay"
          component={MainsVerdictOverlay}
          options={{
            presentation: 'transparentModal', // or 'modal' on iOS
            animation: 'fade',
            headerShown: false,
          }}
        />
        <Stack.Screen name="PrelimsScreen" component={PrelimsScreen} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
