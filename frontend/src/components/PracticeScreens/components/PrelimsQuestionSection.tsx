import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import NormalText from '@/src/components/atoms/NormalText';
import AnswerItem from './AnswerItem';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import {
  setActualOption,
  setExpectedOption,
  setIsAttempted,
} from '@/store/slices/prelimsQuestionSlice';
import { store } from '@/store/store';

import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const PrelimsQuestionSection = () => {
  const question = useSelector(
    (state: RootState) => state.prelimsQuestion.question
  );
  const options = useSelector(
    (state: RootState) => state.prelimsQuestion.options
  );
  const isAttempted = useSelector(
    (state: RootState) => state.prelimsQuestion.isAttempted
  );
  const paper = useSelector((state: RootState) => state.prelimsQuestion.paper);
  const year = useSelector((state: RootState) => state.prelimsQuestion.year);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();

  const [isSelected, setIsSelected] = useState(false);
  const buttonItemSelector = (index: number) => {
    setSelectedItemIndex(index);
    setIsSelected((isactive) => !isactive);
    dispatch(setActualOption(options[index].option));
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <NormalText text="Year :" />
        <NormalText text={year} />
      </View>

      <View style={styles.row}>
        <NormalText text="Paper :" />
        <NormalText text={paper} />
      </View>

      <View style={styles.questionContainer}>
        <NormalText text={question} />
      </View>
      {options &&
        options.map((item, index) => {
          return (
            <TouchableOpacity
              disabled={isAttempted}
              key={index}
              onPress={() => buttonItemSelector(index)}
              style={[
                styles.section,
                selectedItemIndex === index
                  ? styles.selected
                  : styles.unselected,
              ]}
            >
              <AnswerItem option={item.option} text={item.text} />
            </TouchableOpacity>
          );
        })}
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

  section: {
    borderRadius: 10,
    borderWidth: 1,
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  selected: {
    backgroundColor: '#CBDFE1',
    borderColor: '#37B9C5',
  },
  incorrect: {
    backgroundColor: '#E8D8D8',
    borderColor: '#FF5A5A',
  },
  unselected: {
    backgroundColor: '#F0F3F6',
    borderColor: '#50555C',
  },
});

export default PrelimsQuestionSection;
