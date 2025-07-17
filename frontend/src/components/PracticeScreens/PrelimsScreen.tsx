import { StyleSheet, ScrollView, View, Text, FlatList } from 'react-native';
import React, { act, useEffect, useState } from 'react';
import PrimaryButton from '../atoms/PrimaryButton';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import Data from '../../../fakeData/data';
import ExpectedPrelimsAnswer from './components/ExpectedPrelimsAnswer';
import PrelimsQuestionSection from './components/PrelimsQuestionSection';

import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import {
  setActualOption,
  setIsAttempted,
} from '@/store/slices/prelimsQuestionSlice';
import { addPoints, resetStreak, setStreak } from '@/store/userProgressSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

export default function PrelimsScreen({ navigation }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const answer = useSelector(
    (state: RootState) => state.prelimsQuestion.answer
  );
  const actualOption = useSelector(
    (state: RootState) => state.prelimsQuestion.actualOption
  );
  const expectedOption = useSelector(
    (state: RootState) => state.prelimsQuestion.expectedOption
  );
  const isAttempted = useSelector(
    (state: RootState) => state.prelimsQuestion.isAttempted
  );
  const points = useSelector(
    (state: RootState) => state.userProgress.totalPoints
  );
  const [buttonActive, setButtonActive] = useState(
    !isAttempted && actualOption === ''
  );

  const submitHandler = () => {
    //compare the result
    const result = actualOption === expectedOption;
    dispatch(setStreak());
    if (result) {
      dispatch(addPoints(points + 2));
    }
    navigation.navigate('Overlay', result);
    dispatch(setIsAttempted(true));
    setShowAnswer(true);
    // navigation.navigate('Overlay');
    setButtonActive(false);
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={styles.scroll}>
        <TitleAndSubtitleCard
          title="PRELIMS QUESTION"
          subtite="Select one correct option to keep streak alive and earn points!"
        />

        <UserStats />
        <Card>
          <PrelimsQuestionSection />
          <PrimaryButton
            isActive={buttonActive}
            submitHandler={submitHandler}
            title="Submit"
          />
          {isAttempted ? (
            <ExpectedPrelimsAnswer
              actualOption={actualOption}
              expectedOption={expectedOption}
              expectedAnswer={answer}
            />
          ) : (
            <></>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F0F3F6',
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
});
