import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import QuestionCard from './Components/QuestionCard';
import { FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import NormalText from '../atoms/NormalText';
import PrimaryButton from '../atoms/PrimaryButton';
import { useNavigation } from 'expo-router';
import TextLabel from '../atoms/TextLabel';
import Card from '../atoms/Card';
import Title from '../atoms/Title';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';

type renderItemProps = {
  Question: string;
  Year: number;
  Paper: string;
  Marks: number;
  date: string;
};

type PractisedQuestionsScreenRouteProp = RouteProp<
  { params: { data: renderItemProps[] } },
  'params'
>;

export default function PractisedQuestionsScreen({
  route,
}: {
  route: PractisedQuestionsScreenRouteProp;
}) {
  const { data } = route.params;
  const navigation = useNavigation();
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const renderItem = ({ item }: { item: renderItemProps }) => (
    <QuestionCard
      question={item.Question}
      year={item.Year}
      paper={item.Paper}
      marks={item.Marks}
      date={item.date}
    />
  );

  return (
    <View style={[styles.body, theme ? styles.bodyBGDark : styles.bodyBGLight]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, idx) => idx.toString()}
        ListHeaderComponent={
          <TitleAndSubtitleCard
            title={'MISSED QUESTIONS'}
            subtite={
              'Catch up on questions you skipped in your daily challenges'
            }
          />
        }
        ListEmptyComponent={
          <View style={styles.noQuestionCard}>
            <TextLabel text="No Questions Here" />
            <PrimaryButton
              submitHandler={() => navigation.navigate('Dashboard')}
              isActive={true}
              title="Dashboard"
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingBottom: 40,
  },
  bodyBGDark: {
    backgroundColor: '#222831',
  },
  bodyBGLight: {
    backgroundColor: '#F5F5F5',
  },
  noQuestionCard: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
