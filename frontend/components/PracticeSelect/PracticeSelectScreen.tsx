import React from 'react';
import { View, Text,Button, StyleSheet, ScrollView } from 'react-native';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import TextLabel from '../atoms/TextLabel';
import PrimaryButton from '../atoms/PrimaryButton';
import FooterText from '../atoms/FooterText';
import PracticeButton from '../common/PracticeButton';


import type { StackNavigationProp } from '@react-navigation/stack';

type PracticeSelectScreenProps = {
  navigation: StackNavigationProp<any, any>;
};

export default function PracticeSelectScreen({ navigation }: PracticeSelectScreenProps) {
  const mainsButtonHandler=()=>{
    navigation.navigate('MainsScreen')
  }
  const prelimsButtonHandler=()=>{
    navigation.navigate('PrelimsScreen')
  }
  const reviseButtonHandler=()=>{
    alert('Must Navigate to revise old question set')
  }
  return (
    <ScrollView style={styles.body}>
     
      <TitleAndSubtitleCard title='STAY ON TRACK' subtite= "Answer today's question to keep your streak and earn points." />
     
      <UserStats streak='5' points='100'/>
     
      <Card>
          <TextLabel text='Todays Question'   />
          <PracticeButton buttonHandler={prelimsButtonHandler} questionType='Prelims' points='2' />
          <PracticeButton buttonHandler={mainsButtonHandler} questionType='Mains' points='3' />
          <TextLabel text='Want to review a past question'   />
          <PrimaryButton submitHandler={reviseButtonHandler}  title='Revise a Random Question' isActive={true} />
          <FooterText text='Both the questions must be attempted to maintain your streak.' />
      </Card>   

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor:'#F0F3F6',                 
    paddingHorizontal:24,
    paddingVertical:40,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
