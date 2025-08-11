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
};

export default function PracticeSelectScreen({
  navigation,
}: PracticeSelectScreenProps) {
  const mainsButtonHandler = () => {
    navigation.navigate('MainsScreen');
  };
  const prelimsButtonHandler = () => {
    navigation.navigate('PrelimsScreen');
  };
  const reviseButtonHandler = () => {
    // (navigation as any).navigate('PractisedQuestions', { data });
    // navigation.navigate('PractisedQuestions');
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
        <TextLabel text="Want to know what you missed?" />
        <PrimaryButton
          submitHandler={reviseButtonHandler}
          title="Previous Questions"
          isActive={true}
        />
        <FooterText text="Attempt any one Question to maintain your streak." />
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
