import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/firebaseConfig';
import LogoutIcon from '../../atoms/LogoutIcon';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import MoonIcon from '../../atoms/Moon';
import { useDispatch } from 'react-redux';
import { setTheme } from '@/store/slices/themeSlice';
import SunIcon from '../../atoms/SunIcon';

const DashboardHeader = () => {
  const userName = useSelector(
    (state: RootState) => state.userProgress.userName
  );
  const user = userName;
  const dispatch = useDispatch<AppDispatch>();
  const themeBtnHandler = () => {
    dispatch(setTheme(!theme));
  };
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const signOutButtonHandler = () => {
    Alert.alert('Log Out', 'You will be logged out', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => signOut(auth),
      },
    ]);
  };

  return (
    <View style={styles.headerCard}>
      <View>
        <Text style={theme ? styles.userTextDark : styles.userTextLight}>
          Hi, {user} 👋
        </Text>
        <Text
          style={theme ? styles.userTextDescDark : styles.userTextDescLight}
        >
          Let's, start Learning
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
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
    justifyContent: 'space-between',
    flexDirection: 'row',
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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
export default DashboardHeader;
