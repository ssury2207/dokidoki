import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import PrimaryButton from '../atoms/PrimaryButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
const streakBlack = require('../../assets/streak-Black.png');
const streakLight = require('../../assets/streak-Light.png');

type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: undefined;
  PractisedQuestions: undefined;
};

type DashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {

  // const [streakCount, setStreakCount] = useState(1);
  const streakCount = useSelector((state: RootState) => state.userProgress.streak);
  const pointsCount = useSelector((state: RootState) => state.userProgress.totalPoints);

  return (

    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.streakRow}>
          <Image
            source={streakCount ? streakLight : streakBlack}
            style={styles.streakIcon}
          />
          <Text style={styles.streakText}>
            {streakCount ? (streakCount > 1 ? `${streakCount} days : Keep it Up` : `${streakCount} day : Keep it Up`) : 'Lets start today'}
          </Text>
        </View>
        <View style={styles.button}>
          <PrimaryButton title="Questions Practised Till Now" isActive={true} submitHandler={() => navigation.navigate('PractisedQuestions')} />
        </View>
        <View style={styles.button}>
          <PrimaryButton title="Practise Today" isActive={true} submitHandler={() => navigation.navigate('PracticeSelect')} />
        </View>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // or a very light gray for subtle contrast
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    maxWidth: 350,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  streakIcon: {
    width: 56,
    height: 56,
    marginRight: 16,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default DashboardScreen;
