import { StyleSheet, ScrollView, View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import PrimaryButton from '../atoms/PrimaryButton';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import Data from '../../../fakeData/data';
import ExpectedPrelimsAnswer from './components/ExpectedPrelimsAnswer';
import PrelimsQuestionSection from './components/PrelimsQuestionSection';
import { store } from '@/store/store';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import {
  setQuestion,
  setOptions,
  setExpectedOption,
} from '@/store/slices/prelimsQuestionSlice';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
export default function PrelimsScreen({ navigation }) {
  const [buttonActive, setButtonActive] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const question = useSelector(
    (state: RootState) => state.prelimsQuestion.question
  );
  const options = useSelector(
    (state: RootState) => state.prelimsQuestion.options
  );

  const actualOption = useSelector(
    (state: RootState) => state.prelimsQuestion.actualOption
  );
  const expectedOption = useSelector(
    (state: RootState) => state.prelimsQuestion.expectedOption
  );
  const submitHandler = () => {
    navigation.navigate('Overlay');
    setButtonActive(false);
    setShowAnswer(true);
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
          <PrelimsQuestionSection
            year={'data.year'}
            paper={'data.paper'}
            question={question}
            options={options}
          />
          <PrimaryButton
            isActive={true}
            submitHandler={submitHandler}
            title="Submit"
          />
          {showAnswer ? (
            <ExpectedPrelimsAnswer
              actualOption={actualOption}
              expectedOption={expectedOption}
              expectedAnswer={'data.answer'}
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
