import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import TextLabel from '../atoms/TextLabel';
import PrimaryButton from '../atoms/PrimaryButton';
import FooterText from '../atoms/FooterText';
import PracticeButton from '../common/PracticeButton';
import Data from '@/fakeData/data';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import {
  setYear,
  setPaper,
  setAnswer,
  setQuestion,
  setOptions,
  setExpectedOption,
  setActualOption,
} from '@/store/slices/prelimsQuestionSlice';
import { store } from '@/store/store';

type PracticeSelectScreenProps = {
  navigation: StackNavigationProp<any, any>;
};

export default function PracticeSelectScreen({
  navigation,
}: PracticeSelectScreenProps) {
  const [data, setData] = useState([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const dataItem = Data[0][0];
    setData(dataItem);
    dispatch(setQuestion(dataItem.question));
    dispatch(setOptions(dataItem.options));
    dispatch(setExpectedOption(dataItem.correctOption));
    dispatch(setAnswer(dataItem.answer));
    dispatch(setPaper(dataItem.paper));
    dispatch(setYear(dataItem.year));
  }, [Data]);
  const mainsButtonHandler = () => {
    navigation.navigate('MainsScreen');
  };
  const prelimsButtonHandler = () => {
    navigation.navigate('PrelimsScreen');
  };
  const reviseButtonHandler = () => {
    alert('Must Navigate to revise old question set');
  };
  return (
    <ScrollView style={styles.body}>
      <TitleAndSubtitleCard
        title="STAY ON TRACK"
        subtite="Answer today's question to keep your streak and earn points."
      />

      <UserStats />

      <Card>
        <TextLabel text="Todays Question" />
        <PracticeButton
          buttonHandler={prelimsButtonHandler}
          questionType="Prelims"
          points="2"
        />
        <PracticeButton
          buttonHandler={mainsButtonHandler}
          questionType="Mains"
          points="3"
        />
        <TextLabel text="Want to review a past question" />
        <PrimaryButton
          submitHandler={reviseButtonHandler}
          title="Revise a Random Question"
          isActive={true}
        />
        <FooterText text="Both the questions must be attempted to maintain your streak." />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F0F3F6',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
