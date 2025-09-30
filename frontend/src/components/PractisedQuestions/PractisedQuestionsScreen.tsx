import { StyleSheet, View } from 'react-native';
import React from 'react';
import QuestionCard from './Components/QuestionCard';
import { FlatList } from 'react-native';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import PrimaryButton from '../atoms/PrimaryButton';
import TextLabel from '../atoms/TextLabel';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/types/navigation';

type renderItemProps = {
  questionId: string;
  Question: string;
  Year: number;
  Paper: string;
  Marks: number;
  date: string;
  questionData: [] | null;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PractisedQuestions'
>;

export default function PractisedQuestionsScreen({ route, navigation }: Props) {
  const params = route.params ?? {};
  const data = (params as any).data ?? [];
  const questionType = (params as any).questionType ?? 'pre';

  const theme = useSelector((state: RootState) => state.theme.isLight);
  const renderItem = ({ item }: { item: renderItemProps }) => (
    <QuestionCard
      question={item.Question}
      year={item.Year}
      paper={item.Paper}
      marks={item.Marks}
      date={item.date}
      questionData={data}
      questionType={questionType}
    />
  );

  return (
    <View style={[styles.body, theme ? styles.bodyBGDark : styles.bodyBGLight]}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.questionId}
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
