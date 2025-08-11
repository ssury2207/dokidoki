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
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

type PracticeSelectScreenProps = {
  navigation: StackNavigationProp<any, any>;
  route: {
    params: {
      caseType: boolean | null;
    };
  };
};

export default function PracticeSelectScreen({
  navigation, route
}: PracticeSelectScreenProps) {

  const { caseType } = route.params

  
  const mainsButtonHandler = () => {
    caseType ? alert('Show previous mains questions') : navigation.navigate('MainsScreen');
  };
  const prelimsButtonHandler = () => {
    caseType ? alert('Show previous prelims questions') : navigation.navigate('PrelimsScreen');
    
  };
  const reviseOrPracticeButtonHandler = () => {
    caseType ? navigation.navigate('PracticeSelect') : (navigation as any).navigate('PracticeSelect', { caseType : true });
  };
  return (
    <ScrollView style={styles.body}>
      <TitleAndSubtitleCard
        title={caseType ? "Missed Questions" : "STAY ON TRACK"}
        subtite={caseType ? "Catch up on questions you skipped in your daily challenges" : "Answer today's question to keep your streak and earn points."}
      />

      <UserStats />

      <Card>
        <TextLabel text={caseType ? "Previous Questions" : "Todays Question"} />
        <PracticeButton
          buttonHandler={prelimsButtonHandler}
          questionType="Prelims"
          points="2"
          context={caseType}
        />
        <PracticeButton
          buttonHandler={mainsButtonHandler}
          questionType="Mains"
          points="3"
          context={caseType}
        />
        <TextLabel text={caseType ? "Want to attempt Daily Challenge?" : "Want to review a past question?"} />
        <PrimaryButton
          submitHandler={reviseOrPracticeButtonHandler}
          title={caseType ? "Start Challenge" : "Revise a Random Question"}
          isActive={true}
        />
        <FooterText text={caseType ? "Revisit missed questions and strengthen your confidence" : "Both the questions must be attempted to maintain your streak."} />
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
