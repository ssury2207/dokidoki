import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../components/Dashboard/DashboardScreen';
import PracticeSelectScreen from '../components/PracticeSelect/PracticeSelectScreen';
import MainsScreen from '../components/PracticeScreens/MainsScreen';
import PractisedQuestionsScreen from '../components/PractisedQuestions/PractisedQuestionsScreen';
import PrelimsScreen from '../components/PracticeScreens/PrelimsScreen';
import VerdictOverlay from '../components/PracticeScreens/VerdictOverlay';
import MainsVerdictOverlay from '../components/PracticeScreens/MainsVerdictOverlay';
import FullScreenImageViewer from '../components/common/FullScreenImageViewer';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerTitle: '',
        headerBackTitleVisible: false,
        headerTintColor: theme ? 'white' : 'black',
        headerStyle: {
          backgroundColor: theme ? '#393E46' : 'white',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PracticeSelect"
        component={PracticeSelectScreen}
        initialParams={{ caseType: null }}
      />
      <Stack.Screen name="MainsScreen" component={MainsScreen} />
      <Stack.Screen
        name="PractisedQuestions"
        component={PractisedQuestionsScreen}
      />
      <Stack.Screen name="PrelimsScreen" component={PrelimsScreen} />
      <Stack.Screen
        name="Overlay"
        component={VerdictOverlay}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MainsVerdictOverlay"
        component={MainsVerdictOverlay}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FullScreenImageViewer"
        component={FullScreenImageViewer}
      />
    </Stack.Navigator>
  );
}
