import { StyleSheet, TouchableOpacity, View, Text, Animated } from 'react-native';
import React from 'react';

type Props = {
  fakeData: {
    que_type: string;
    year: string;
    paper: string;
    marks: number;
    question: string;
    answer: string;
    show_answer: boolean;
  };
};

const MainsQuestionCard: React.FC<Props> = ({ fakeData }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Year :</Text>
        <Text style={styles.label}>{fakeData.year}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Paper :</Text>
        <Text style={styles.label}>{fakeData.paper}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Marks :</Text>
        <Text style={styles.label}>{fakeData.marks}</Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>"{fakeData.question}"</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    paddingHorizontal: 15,
    borderStyle: 'dotted',
    flexDirection: 'column',
    marginVertical:20,
    borderRadius:20
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
