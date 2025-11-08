import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { supabase } from '@/src/supabaseConfig';
import LogoutIcon from '../../atoms/LogoutIcon';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import MoonIcon from '../../atoms/Moon';
import { setTheme, toggleTheme } from '@/store/slices/themeSlice';
import SunIcon from '../../atoms/SunIcon';
import ShimmerPlaceholder from '../../common/ShimmerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardHeader = () => {
  const userName = useSelector(
    (state: RootState) => state.userProgress.userName
  );
  const user = userName;
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const themeBtnHandler = async () => {
    dispatch(toggleTheme());
    const newSavedTheme = !theme;
    await AsyncStorage.setItem('APP_THEME', JSON.stringify(newSavedTheme));
  };

  const signOutButtonHandler = () => {
    Alert.alert('Log Out', 'You will be logged out', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            // Clear user-specific AsyncStorage data
            await AsyncStorage.multiRemove([
              'PENDING_USER_KEY',
              'archive_mains_questions',
              'archive_prelims_questions',
              'archive_questions_meta',
              'archive_cache_version'
            ]);
            // Note: APP_THEME is kept as it's a device preference

            // Reset Redux store (keeps theme only)
            dispatch({ type: 'RESET_STORE' });

            const { error } = await supabase.auth.signOut();
            if (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          } catch (err) {
            console.error('Logout error:', err);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        }
      },
    ]);
  };

  return (
    <View style={styles.headerCard}>
      {/* Column 1: Greeting */}

      <View style={styles.columnLeft}>
        <ShimmerPlaceholder
          visible={!!user}
          containerStyle={styles.greetingShimmer}
        >
          <Text style={theme ? styles.userTextDark : styles.userTextLight}>
            Hi, {user}
          </Text>

          <Text
            style={theme ? styles.userTextDescDark : styles.userTextDescLight}
          >
            Let's, start Learning
          </Text>
        </ShimmerPlaceholder>
      </View>
      {/* Column 2: Theme + Logout */}
      <View style={styles.columnRight}>
        <TouchableOpacity onPress={themeBtnHandler}>
          {theme ? <SunIcon /> : <MoonIcon />}
        </TouchableOpacity>
        <TouchableOpacity onPress={signOutButtonHandler} style={styles.button}>
          <LogoutIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnLeft: {},
  columnRight: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  greetingShimmer: {
    // marginBottom: 8,
  },
  userTextDark: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EEEEEE',
    paddingBottom: 10,
  },
  userTextLight: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    paddingBottom: 10,
  },
  userTextDescDark: {
    fontSize: 22,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  userTextDescLight: {
    fontSize: 22,
    fontWeight: '500',
    color: '#393E46',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default DashboardHeader;
