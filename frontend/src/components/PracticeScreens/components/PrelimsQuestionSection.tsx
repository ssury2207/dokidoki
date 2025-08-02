import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import NormalText from '@/src/components/atoms/NormalText';
import AnswerItem from './AnswerItem';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { fetchDailyPrelimsQuestion, selectDailyPrelimsQuestion, selectDailyPrelimsQuestionError, selectDailyPrelimsQuestionLoading } from '@/store/slices/prelimsQuestionSlice';
import Table from '../../atoms/Table';

const PrelimsQuestionSection = () => {

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [isSelected, setIsSelected] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectDailyPrelimsQuestion);
  const isLoading = useSelector(selectDailyPrelimsQuestionLoading);
  const error = useSelector(selectDailyPrelimsQuestionError);

  useEffect(() => {
    dispatch(fetchDailyPrelimsQuestion());
  }, [dispatch]);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error fetching questions</Text>;
  if (!data) return <Text>Loading question data...</Text>;

  
  const buttonItemSelector = (index: number) => {
    setSelectedItemIndex(index);
    setIsSelected((isactive) => !isactive);
    // dispatch(setActualOption(options[index].option));
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <NormalText text="Year :" />
        <NormalText text={data.Year} />
      </View>

      <View style={styles.questionContainer}>
        <NormalText text={data.Question} />
      </View>
      <View style={styles.questionContainer}>
        <Table table={data.Table}/>
      </View>
      {data.Options &&
        data.Options.map((item, index) => {
          return (
            <TouchableOpacity
              disabled={false}
              key={index}
              onPress={() => buttonItemSelector(index)}
              style={[
                styles.section,
                selectedItemIndex === index
                  ? styles.selected
                  : styles.unselected,
              ]}
            >
              <AnswerItem text={item} />
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
