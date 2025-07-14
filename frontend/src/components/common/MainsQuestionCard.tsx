import { StyleSheet, TouchableOpacity, View, Text, Animated } from 'react-native';
import React from 'react';
import TextLabel from '../atoms/TextLabel';
import NormalText from '../atoms/NormalText';

type MainsQuestionsProps = {
  fakeData: {
    que_type: string;
    year: number;
    paper: string;
    marks: number;
    question: string;
    answer: string;
    show_answer: boolean;
  };
}

type PrelimsQuestionsProps = {
  fakeData: {
    que_type: string;
    year: number;
    paper: string;
    question: string;
    options: string[];
    answer: string;
    show_answer: boolean;
  };
}

type Props = MainsQuestionsProps | PrelimsQuestionsProps;

const MainsQuestionCard: React.FC<Props> = ({ fakeData }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <NormalText text='Year :' />
        <NormalText text= {fakeData.year} />
      </View>

      <View style={styles.row}>
      <NormalText text='Paper :' />
      <NormalText text= {fakeData.paper} />
      </View>

      {'marks' in fakeData && (
        <View style={styles.row}>
          <NormalText text='Marks :' />
          <NormalText text= {fakeData.marks} />
        </View>
      )}

      <View style={styles.questionContainer}>
        <NormalText text= {fakeData.question} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    marginVertical:20,
  },
  row: {
    flexDirection: 'row',
    justifyContent:'flex-start'
  },
  label: {
    fontWeight: '500',
    margin: 2,
  },
  questionContainer: {
    marginVertical: 8,
  },
  questionText: {
    fontWeight: '400',
    fontStyle: 'italic',
    fontSize: 16,
  },
});

export default MainsQuestionCard;
