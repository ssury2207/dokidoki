import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import TextLabel from '../atoms/TextLabel';
import PrimaryButton from '../atoms/PrimaryButton';
import FooterText from '../atoms/FooterText';
import PracticeButton from '../common/PracticeButton';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootState, AppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import {
  selectArchivedPrelimsQuestions,
  selectArchivedQuestions,
} from '@/store/slices/archivedQuestionsSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

type PracticeSelectScreenProps = {
  navigation: StackNavigationProp<any, any>;
  route: {
    params: {
      caseType: boolean | null;
    };
  };
};

export default function PracticeSelectScreen({
  navigation,
  route,
}: PracticeSelectScreenProps) {
  const theme = useSelector((state: RootState) => state.theme.isLight);

  const { caseType } = route.params;
  const data = useSelector(selectArchivedQuestions);
  const prelimsData = useSelector(selectArchivedPrelimsQuestions);

  const mainsButtonHandler = () => {
    caseType
      ? (navigation as any).navigate('PractisedQuestions', { data })
      : navigation.navigate('MainsScreen');
  };
  const prelimsButtonHandler = () => {
    caseType
      ? (navigation as any).navigate('PractisedQuestions', {
          data: prelimsData,
          questionType: 'prelims',
        })
      : navigation.navigate('PrelimsScreen');
  };

  const reviseOrPracticeButtonHandler = () => {
    caseType
      ? navigation.navigate('PracticeSelect')
      : (navigation as any).navigate('PracticeSelect', { caseType: true });
  };
  return (
    <SafeAreaView
      style={[
        theme
          ? [styles.bodyBGDark, styles.body]
          : [styles.bodyBGLight, styles.body],
      ]}
    >
      <ScrollView style={styles.scroll}>
        <TitleAndSubtitleCard
          title={caseType ? 'MISSED QUESTIONS' : 'STAY ON TRACK'}
          subtite={
            caseType
              ? 'Catch up on questions you skipped in your daily challenges'
              : "Answer today's question to keep your streak and earn points."
          }
        />

        <UserStats />

        <Card>
          <TextLabel
            text={caseType ? 'Previous Questions' : 'Todays Question'}
          />
          <PracticeButton
            buttonHandler={prelimsButtonHandler}
            questionType="Prelims"
            points="2"
            context={caseType}
          />
          <PracticeButton
            buttonHandler={mainsButtonHandler}
            questionType="Mains"
            points="5"
            context={caseType}
          />

          <TextLabel
            text={
              caseType
                ? 'Want to attempt Daily Challenge?'
                : 'Want to review a past question?'
            }
          />
          <PrimaryButton
            submitHandler={reviseOrPracticeButtonHandler}
            title={caseType ? 'Start Challenge' : 'Revise a Missed Question'}
            isActive={true}
          />
          <FooterText
            text={
              caseType
                ? 'Revisit missed questions and strengthen your confidence'
                : 'Attempt any question to maintain your current streak.'
            }
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  bodyBGDark: {
    backgroundColor: '#222831',
  },
  bodyBGLight: {
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
