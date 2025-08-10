import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../components/Dashboard/DashboardScreen';
import PracticeSelectScreen from '../components/PracticeSelect/PracticeSelectScreen';
import MainsScreen from '../components/PracticeScreens/MainsScreen';
import PractisedQuestionsScreen from '../components/PractisedQuestions/PractisedQuestionsScreen';
import PrelimsScreen from '../components/PracticeScreens/PrelimsScreen';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import VerdictOverlay from '../components/PracticeScreens/VerdictOverlay';
import MainsVerdictOverlay from '../components/PracticeScreens/MainsVerdictOverlay';
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
          options={{ title: "Main's Question Set" }}
          component={MainsScreen}
        />
        <Stack.Screen
          name="PractisedQuestions"
          component={PractisedQuestionsScreen}
        />
        <Stack.Screen name="PrelimsScreen" component={PrelimsScreen} />
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
