import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
function RootNavigation() {
  const { user, loading } = useAuth();

  if (loading) return null; // Splash screen

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
