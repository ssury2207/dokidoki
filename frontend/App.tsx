import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setTheme } from './store/slices/themeSlice';

function RootNavigation() {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  const [readyTheme, setReadyTheme] = useState(false);
  useEffect(() => {
    const getTheme = async () => {
      const getSavedTheme = await AsyncStorage.getItem('APP_THEME');
      if (getSavedTheme != null) {
        dispatch(setTheme(JSON.parse(getSavedTheme)));
      }
      setReadyTheme(true);
    };
    getTheme();
  }, []);

  if (loading || !readyTheme) return null; // Splash screen

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
