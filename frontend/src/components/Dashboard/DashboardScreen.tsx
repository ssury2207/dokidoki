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
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';

import PrimaryButton from '../atoms/PrimaryButton';
import { RootState } from '@/store/store';
import { auth } from '@/src/firebaseConfig';
import TextLabel from '../atoms/TextLabel';
import NormalText from '../atoms/NormalText';
import GreenCheckIcon from '../atoms/GreenCheckIcon';

const streakBlack = require('../../../assets/streak-Black.png');
const streakLight = require('../../../assets/streak-Light.png');

type RootStackParamList = {
  Dashboard: undefined;
  PracticeSelect: undefined;
  PractisedQuestions: undefined;
};

type DashboardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Dashboard'>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const streakCount =
    useSelector((state: RootState) => state.userProgress.streak) + 1;
  const pointsCount =
    useSelector((state: RootState) => state.userProgress.totalPoints) + 1;
  const user = 'Maya';
  const questionSolved = '10';

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={styles.scroll}>
        <View style={styles.userCard}>
          <View>
            <Text style={styles.userText}>Hi, {user} 👋</Text>
            <Text style={styles.userTextDesc}>Let's, start Learning</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {/* <Image source={require('../../../assets/bell.png')} /> */}
            <View
              style={{
                backgroundColor: '#151718',
                padding: 20,
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: 50,
              }}
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require('../../../assets/logout.png')}
              />
            </View>
          </View>
        </View>

        {/* Daily Challenge */}
        <View style={styles.card}>
          <View style={styles.sectionFullWidth}>
            <Text
              style={{
                color: '#EEEEEE',
                fontSize: 16,
                fontWeight: 'bold',
                marginVertical: 8,
              }}
            >
              DAILY CHALLENGE
            </Text>
          </View>

          <View style={styles.rowCenter}>
            <Image
              source={streakCount ? streakLight : streakBlack}
              style={styles.streakIconSmall}
            />
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'normal',
                marginVertical: 8,
              }}
            >
              {streakCount
                ? streakCount > 1
                  ? `${streakCount} days : Keep it Up`
                  : `${streakCount} day : Keep it Up`
                : 'Let’s start today'}
            </Text>
          </View>

          <View style={styles.rowCenter}>
            <Image
              source={require('../../../assets/points.png')}
              style={styles.pointsIcon}
            />

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'normal',
                marginVertical: 8,
              }}
            >
              {pointsCount === 0
                ? 'Ready to earn points?'
                : `${pointsCount} pts : Earn More`}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#00ADB5',
              padding: 16,
              justifyContent: 'space-around',
              alignItems: 'center',
              borderRadius: 20,
            }}
            onPress={() => navigation.navigate('PracticeSelect')}
          >
            <Text style={{ color: '#EEEEEE', fontWeight: 'bold' }}>
              START CHALLENGE
            </Text>
          </TouchableOpacity>
          {/* <View style={styles.button}>
            <PrimaryButton
              title="Start Challenge"
              isActive={true}
              submitHandler={() => navigation.navigate('PracticeSelect')}
            />
          </View> */}
        </View>

        {/* Progress */}
        <View style={[styles.card, { backgroundColor: '#efe7bc' }]}>
          <View style={styles.sectionFullWidth}>
            <TextLabel text="PROGRESS" />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GreenCheckIcon />
                <NormalText text={`Total Questions: ${questionSolved}`} />
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#00ADB5',
                  padding: 16,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  borderRadius: 10,
                }}
                onPress={() => navigation.navigate('PractisedQuestions')}
              >
                <Text style={{ color: '#EEEEEE', fontWeight: 'bold' }}>
                  SEE ALL
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowCenter}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'flex-end',
                }}
              >
                {/* <PrimaryButton
                  title="See all"
                  isActive={true}
                  submitHandler={() =>
                    navigation.navigate('PractisedQuestions')
                  }
                /> */}
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with</Text>
          <Image
            source={require('../../../assets/heart.png')}
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>
            {' '}
            by <Text style={styles.footerTeam}>dokidoki</Text> Team
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#222831',
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  userCard: {
    marginBottom: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  userText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EEEEEE',
    paddingBottom: 10,
  },
  userTextDesc: {
    fontSize: 22,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  card: {
    backgroundColor: '#393E46',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#0000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    maxWidth: 350,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionFullWidth: {
    width: '100%',
  },
  rowCenter: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakIconSmall: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  pointsIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  button: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
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
