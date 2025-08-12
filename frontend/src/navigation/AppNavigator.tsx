import { store } from '@/store/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider } from 'react-redux';
import DashboardScreen from '../components/Dashboard/DashboardScreen';
import MainsScreen from '../components/PracticeScreens/MainsScreen';
import MainsVerdictOverlay from '../components/PracticeScreens/MainsVerdictOverlay';
import PrelimsScreen from '../components/PracticeScreens/PrelimsScreen';
import VerdictOverlay from '../components/PracticeScreens/VerdictOverlay';
import PracticeSelectScreen from '../components/PracticeSelect/PracticeSelectScreen';
import PractisedQuestionsScreen from '../components/PractisedQuestions/PractisedQuestionsScreen';
import FullScreenImageViewer from '../components/common/FullScreenImageViewer';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Provider store={store}>
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
        <Stack.Screen
          name="Dashboard"
          options={{ headerShown: false }}
          component={DashboardScreen}
        />
        <Stack.Screen
          name="PracticeSelect"
          options={{ headerTitle: '' }}
          component={PracticeSelectScreen}
        />
        <Stack.Screen
          name="MainsScreen"
          options={{ title: '' }}
          component={MainsScreen}
        />
        <Stack.Screen
          name="PractisedQuestions"
          component={PractisedQuestionsScreen}
        />
        <Stack.Screen
          name="PrelimsScreen"
          options={{ title: '' }}
          component={PrelimsScreen}
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
          name="MainsVerdictOverlay"
          component={MainsVerdictOverlay}
          options={{
            presentation: 'transparentModal', // or 'modal' on iOS
            animation: 'fade',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FullScreenImageViewer"
          component={FullScreenImageViewer}
        />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </Provider>
  );
}
