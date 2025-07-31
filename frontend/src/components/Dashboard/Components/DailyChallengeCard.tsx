import { Text, View, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigation } from 'expo-router';
import PointsIcon from '../../atoms/PointsIcon';
import NoPointsIcon from '../../atoms/NoPointsIcon';
import PrimaryButton from '../../atoms/PrimaryButton';

const streakBlack = require('../../../../assets/streak-Black.png');
const streakLight = require('../../../../assets/streak-Light.png');

const DailyChallengeCard = () => {
  const navigation = useNavigation();
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const streakCount = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const pointsCount = useSelector(
    (state: RootState) => state.userProgress.totalPoints
  );

  const buttonHander = () => {
    navigation.navigate('PracticeSelect');
  };
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme ? '#393E46' : '#FFFF',
          shadowColor: theme ? '#FFFFFF' : '#000',
        },
      ]}
    >
      <View style={[styles.sectionFullWidth]}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme ? '#EEEEEE' : '#000000' },
          ]}
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
          style={[styles.infoText, { color: theme ? '#EEEEEE' : '#000000' }]}
        >
          {streakCount
            ? streakCount > 1
              ? `${streakCount} days : Keep it Up`
              : `${streakCount} day : Keep it Up`
            : 'Let’s start today'}
        </Text>
      </View>

      <View style={styles.rowCenter}>
        {pointsCount == 0 ? <NoPointsIcon /> : <PointsIcon />}

        <Text
          style={[styles.infoText, { color: theme ? '#EEEEEE' : '#000000' }]}
        >
          {pointsCount === 0
            ? 'Ready to earn points?'
            : `${pointsCount} pts : Earn More`}
        </Text>
      </View>

      <PrimaryButton
        submitHandler={buttonHander}
        isActive={true}
        title="START CHALLENGE"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionFullWidth: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  rowCenter: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  streakIconSmall: {
    width: 50,
    height: 50,
  },

  infoText: {
    fontSize: 16,
    fontWeight: 'normal',
    marginVertical: 8,
  },
  startButton: {
    width: '100%',
    backgroundColor: '#00ADB5',
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
  },
  startButtonText: {
    color: '#EEEEEE',
    fontWeight: 'bold',
  },
});

export default DailyChallengeCard;
