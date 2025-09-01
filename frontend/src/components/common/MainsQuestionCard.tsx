import { StyleSheet, View } from 'react-native';
import React from 'react';
import NormalText from '../atoms/NormalText';

type MainsQuestionsProps = {
  fakeData: {
    Year: number;
    Paper: string;
    Marks: number;
    Question: string;
  };
};

type Props = MainsQuestionsProps;

const MainsQuestionCard: React.FC<Props> = ({ fakeData }) => {
  if (!fakeData) return <NormalText text="No question found for today." />;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <NormalText text="Year :" />
        <NormalText text={fakeData.Year.toString()} />
      </View>

      <View style={styles.row}>
        <NormalText text="Paper :" />
        <NormalText text={fakeData.Paper} />
      </View>

      {'Marks' in fakeData && (
        <View style={styles.row}>
          <NormalText text="Marks :" />
          <NormalText text={fakeData.Marks.toString()} />
        </View>
      )}

      <View style={styles.questionContainer}>
        <NormalText text={fakeData.Question} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'column',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
