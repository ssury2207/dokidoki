import { StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import PrimaryButton from '../atoms/PrimaryButton';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExpectedPrelimsAnswer from './components/ExpectedPrelimsAnswer';
import PrelimsQuestionSection from './components/PrelimsQuestionSection';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { selectDailyPrelimsQuestion } from '@/store/slices/prelimsQuestionSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setCurrentStreak, setPoints } from '@/store/userProgressSlice';
import submitData from '@/src/utils/submitPreData';
import { auth } from '@/src/firebaseConfig';
export default function PrelimsScreen({ navigation }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectDailyPrelimsQuestion);
  const selectedOption = useSelector(
    (state: RootState) => state.optionSelector.actionOption
  );

  const [buttonActive, setButtonActive] = useState(true);
  const todays_date = new Date().toLocaleDateString('en-CA');
  const points = useSelector(
    (state: RootState) => state.userProgress.totalPoints
  );
  const curr_streak = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const longest_streak = useSelector(
    (state: RootState) => state.userProgress.longest_streak
  );
  const uid = auth.currentUser?.uid;

  const submitHandler = async () => {
    if (!data) return;

    // Must choose an option
    if (selectedOption == null) {
      alert('Please select a valid option');
      return;
    }

    // Normalize types
    const selectedIndex =
      typeof selectedOption === 'string'
        ? parseInt(selectedOption, 10)
        : selectedOption;
    //date Guard
    if (todays_date != data.date) {
      alert(
        'opps to late for the submission, solve recently updated question to maintain streak'
      );
      // navigation.navigate('Dashboard');
      return;
    }
    // Grade
    const expectedOptionIDX =
      data.Answer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    const isCorrect = selectedIndex === expectedOptionIDX;

    // Replace these with real checks
    const prelims_solved = false;
    const mains_solved = false;

    setButtonActive(false);
    try {
      if (!prelims_solved && !mains_solved) {
        // Case 1: no pre, no mains -> streak + points

        await submitData({
          uid, // from your auth state
          todays_date, // 'YYYY-MM-DD' en-CA
          user_selection: String(selectedIndex),
          verdict: isCorrect,
          total_points: isCorrect ? points + 2 : points,
          points_awarded: isCorrect ? 2 : 0,
          current_streak: curr_streak + 1,
          longest_streak, // selector value
          question_date: data.date, // UI guard already done elsewhere
          questionId: data.questionId,
          Question: data.Question,
          Answer: data.Answer,
          Table: data.Table ?? [],
          Options: data.Options,
          Explanation: data.Explanation,
        });

        // Now reflect persisted values in Redux
        dispatch(setCurrentStreak(curr_streak + 1));
        dispatch(setPoints(isCorrect ? points + 2 : points));
        setShowAnswer(true);
        return;
      }

      if (!prelims_solved && mains_solved) {
        // Case 3: mains exists, pre does not -> points only
        await submitData({
          uid,
          todays_date,
          user_selection: String(selectedIndex),
          verdict: isCorrect,
          total_points: isCorrect ? points + 2 : points,
          points_awarded: isCorrect ? 2 : 0,
          current_streak: curr_streak, // streak unchanged
          longest_streak,
          question_date: data.date,
          questionId: data.questionId,
          Question: data.Question,
          Answer: data.Answer,
          Table: data.Table ?? [],
          Options: data.Options,
          Explanation: data.Explanation,
        });

        dispatch(setPoints(isCorrect ? points + 2 : points));
        setShowAnswer(true);
        return;
      }

      // Case 4 / invalid Case 2: prelims already submitted
      if (prelims_solved) {
        alert('OOPS your submission was already recorded');
        navigation.navigate('Dashboard');
        return;
      }
    } catch (e: any) {
      setButtonActive(true);
      alert(e?.message || 'Failed to submit.');
      console.log(e?.message);
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <ScrollView style={styles.scroll}>
        <TitleAndSubtitleCard
          title="PRELIMS QUESTION"
          subtite="Select one correct option to keep streak alive and earn points!"
        />

        <UserStats />
        <Card>
          <PrelimsQuestionSection />
          <PrimaryButton
            isActive={buttonActive}
            submitHandler={submitHandler}
            title="Submit"
          />
          {data && showAnswer && (
            <ExpectedPrelimsAnswer
              actualOption={
                selectedOption == null ? '' : data.Options[selectedOption]
              }
              expectedOption={data.Answer}
              explainatation={data.Explanation}
            />
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#F0F3F6',
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
});
