import { StyleSheet, ScrollView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { fetchPrelimsSubmission } from '@/src/api/fetchPrelimsSubmission';
import FullScreenLoader from '../common/FullScreenLoader';

export default function PrelimsScreen({ navigation }) {
  const [submissionData, setSubmissionData] = useState<{ id: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [verdict, setVerdict] = useState('');

  const todays_date = new Date().toLocaleDateString('en-CA');
  const uid = auth.currentUser?.uid;

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectDailyPrelimsQuestion);

  const points = useSelector(
    (state: RootState) => state.userProgress.totalPoints
  );
  const curr_streak = useSelector(
    (state: RootState) => state.userProgress.current_streak
  );
  const longest_streak = useSelector(
    (state: RootState) => state.userProgress.longest_streak
  );
  const selectedOption = useSelector(
    (state: RootState) => state.optionSelector.actionOption
  );
  // guard for submission already exists
  useEffect(() => {
    let cancelled = false;

    // neutral UI while checking
    setLoading(true);
    setLoaderVisible(true);
    setButtonActive(false); // disabled during load
    setShowAnswer(false);

    const run = async () => {
      try {
        // if no user yet, treat as no submission and wait
        if (!uid) {
          if (!cancelled) {
            setSubmissionData(null);
            setButtonActive(false);
            setShowAnswer(false);
          }
          return;
        }

        const submittedData = await fetchPrelimsSubmission(); // object or null
        if (cancelled) return;

        setSubmissionData(submittedData);

        if (submittedData) {
          // prior submission exists
          setButtonActive(false);
          setShowAnswer(true);
        } else {
          // no prior submission
          setButtonActive(true);
          setShowAnswer(false);
        }
      } catch (e) {
        if (cancelled) return;
        // allow user to proceed even if GET failed
        setSubmissionData(null);
        setButtonActive(true);
        setShowAnswer(false);
        console.log('GET prelims failed:', e);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoaderVisible(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [uid, todays_date]);
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

    // Grade
    const expectedOptionIDX =
      data.Answer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    const isCorrect = selectedIndex === expectedOptionIDX;
    if (isCorrect) setVerdict('Correct');
    else if (!isCorrect) setVerdict('InCorrect');

    // These should come from state / GET
    const prelims_solved = false; // placeholder
    const mains_solved = false; // placeholder

    // Disable button + show loader while submitting
    setButtonActive(false);
    setLoaderVisible(true);

    try {
      if (!prelims_solved && !mains_solved) {
        // Case 1: no pre, no mains -> streak + points
        // await submitData({
        //   uid,
        //   todays_date,
        //   user_selection: String(selectedIndex),
        //   verdict: isCorrect,
        //   total_points: isCorrect ? points + 2 : points,
        //   points_awarded: isCorrect ? 2 : 0,
        //   current_streak: curr_streak + 1,
        //   longest_streak,
        //   question_date: data.date,
        //   questionId: data.questionId,
        //   Question: data.Question,
        //   Answer: data.Answer,
        //   Table: data.Table ?? [],
        //   Options: data.Options,
        //   Explanation: data.Explanation,
        // });

        dispatch(setCurrentStreak(curr_streak + 1));
        dispatch(setPoints(isCorrect ? points + 2 : points));
        setShowAnswer(true);
        setButtonActive(false);
        navigation.navigate('Overlay', isCorrect);
        return;
      }

      if (!prelims_solved && mains_solved) {
        // Case 3: mains exists, pre does not -> points only
        // await submitData({
        //   uid,
        //   todays_date,
        //   user_selection: String(selectedIndex),
        //   verdict: isCorrect,
        //   total_points: isCorrect ? points + 2 : points,
        //   points_awarded: isCorrect ? 2 : 0,
        //   current_streak: curr_streak, // streak unchanged
        //   longest_streak,
        //   question_date: data.date,
        //   questionId: data.questionId,
        //   Question: data.Question,
        //   Answer: data.Answer,
        //   Table: data.Table ?? [],
        //   Options: data.Options,
        //   Explanation: data.Explanation,
        // });

        dispatch(setPoints(isCorrect ? points + 2 : points));
        setShowAnswer(true);
        setButtonActive(false);
        navigation.navigate('Overlay', isCorrect);

        return;
      }

      // Case 4: prelims already submitted
      if (prelims_solved) {
        alert('OOPS your submission was already recorded');
        navigation.navigate('Dashboard');
        return;
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to submit.');
      console.log(e?.message);
      // Allow retry on failure
      setButtonActive(true);
    } finally {
      // Hide loader in all cases
      setLoaderVisible(false);
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
          <PrelimsQuestionSection
            initialSelection={
              submissionData
                ? parseInt(submissionData.selected_option, 10)
                : null
            }
            isLocked={showAnswer}
          />
          {selectedOption != null && selectedOption != undefined ? (
            <Text>{selectedOption}</Text>
          ) : (
            <></>
          )}

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
              verdict={verdict}
            />
          )}
        </Card>
      </ScrollView>
      <FullScreenLoader visible={loaderVisible || loading} />
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
