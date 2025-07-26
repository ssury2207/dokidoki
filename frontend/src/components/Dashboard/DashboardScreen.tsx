import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from './Components/DashboardHeader';
import DailyChallengeCard from './Components/DailyChallengeCard';
import ProgressCard from './Components/ProgressCard';
import { RootState, AppDispatch } from '@/store/store';
import { setTheme } from '@/store/slices/themeSlice';

type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: undefined;
  PractisedQuestions: undefined;
};

type DashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const themeBtnHandler = () => {
    dispatch(setTheme(!theme));
  };

  return (
    <SafeAreaView style={theme ? styles.bodyDark : styles.bodyLight}>
      <ScrollView style={styles.scroll}>
        <DashboardHeader />
        <DailyChallengeCard />
        <ProgressCard />

        <TouchableOpacity
          style={styles.themeToggleButton}
          onPress={themeBtnHandler}
        >
          <Text style={styles.themeToggleText}>{theme ? 'Dark' : 'Light'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with</Text>
          <Image
            source={require('../../../assets/heart.png')}
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>
            by <Text style={styles.footerTeam}>dokidoki</Text> Team
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bodyDark: {
    flex: 1,
    backgroundColor: '#222831',
  },
  bodyLight: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  themeToggleButton: {
    backgroundColor: '#00ADB5',
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
  },
  themeToggleText: {
    color: '#EEEEEE',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    textAlign: 'center',
    color: '#2650BB',
    fontWeight: 'bold',
  },
  footerIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 4,
  },
  footerTeam: {
    color: '#FF8358',
    fontWeight: '900',
  },
});

export default DashboardScreen;
