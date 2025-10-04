import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types/navigation';

type QuestionCardProps = {
  question: string;
  year: number;
  paper: string | null;
  marks: number | null;
  date: string;
  questionType: string;
  questionData: null | [];
};

export default function QuestionCard(props: QuestionCardProps) {
  const isLight = useSelector((state: RootState) => state.theme.isLight);
  const questionType = props.questionType;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const date = props.date;
  const questionData = props.questionData;
  const buttonHandler = () => {
    if (questionType === 'pre') {
      const matchedQuestion = questionData?.find((q) => q.date === date);

      if (!matchedQuestion) {
        alert('No question found for this date');
        return;
      }

      navigation.navigate('PrelimsArchived', {
        question: matchedQuestion,
      });
    } else {
      // alert(`Mains navigation`);
      navigation.navigate('MainsScreen', { date });
    }
  };

  return (
    <TouchableOpacity
      onPress={buttonHandler}
      style={[
        styles.container,
        !isLight ? styles.bgLight : styles.bgDark,
        !isLight ? styles.borderLight : styles.borderDark,
      ]}
      activeOpacity={0.8}
    >
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={!isLight ? styles.titleLight : styles.titleDark}
      >
        {props.question}
      </Text>

      <View style={styles.row}>
        <Text style={!isLight ? styles.metaLight : styles.metaDark}>
          Date: {props.date}
        </Text>
        <Text style={!isLight ? styles.metaLight : styles.metaDark}>
          Year: {props.year}
        </Text>
      </View>
      {props.paper && props.marks ? (
        <View style={styles.row}>
          <Text style={!isLight ? styles.metaLight : styles.metaDark}>
            Paper: {props.paper}
          </Text>
          <Text style={!isLight ? styles.metaLight : styles.metaDark}>
            Marks: {props.marks}
          </Text>
        </View>
      ) : (
        <></>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  bgLight: { backgroundColor: '#FFF' },
  bgDark: { backgroundColor: '#393E46' },
  borderLight: { borderColor: '#B3B4B7' },
  borderDark: { borderColor: '#108174' },

  titleLight: {
    color: '#50555C',
    fontSize: 18,
    fontWeight: '400',
  },
  titleDark: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '400',
  },

  metaLight: {
    color: '#393E46',
    fontSize: 14,
    fontWeight: '300',
  },
  metaDark: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '300',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
