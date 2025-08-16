import { StyleSheet, View } from 'react-native';
import React from 'react';
import Card from '../atoms/Card';
import TextLabel from '../atoms/TextLabel';
import NormalText from '../atoms/NormalText';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const UserStats = () => {
  const streakCount = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const pointsCount = useSelector(
    (state: RootState) => state.userProgress.totalPoints
  );

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.streak}>
          <TextLabel text="STREAK: " />
          <NormalText text={`${streakCount} Days`} />
        </View>
        <View style={styles.points}>
          <TextLabel text="TOTAL POINTS: " />
          <NormalText text={pointsCount.toString()} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streak: {
    flexDirection: 'row',
  },
  points: {
    flexDirection: 'row',
  },
});

export default UserStats;
