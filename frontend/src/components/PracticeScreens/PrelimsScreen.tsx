import {
  StyleSheet,
  ScrollView,
  Text,
  Touchable,
  TouchableOpacity,
} from 'react-native';
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
import { supabase } from '@/src/supabaseConfig';
import FullScreenLoader from '../common/FullScreenLoader';
import { resetSelectedOption } from '@/store/slices/optionSelectorSlice';
import { checkSubmissions } from '@/src/api/checkTodaysSubmissions';

export default function PrelimsScreen({ navigation }) {
  const [prelimsubmissionData, setPrelimSubmissionData] = useState<{
    selected_option: string;
    verdict: string;
    timestamp: string;
    question_snapshot?: any;
  } | null>(null);
  const [mainssubmissionData, setMainsSubmissionData] = useState<any | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const theme = useSelector((state: RootState) => state.theme.isLight);
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [verdict, setVerdict] = useState('');

  const todays_date = new Date().toLocaleDateString('en-CA');

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

  // Get user ID on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUid(user?.id || null);
    };
    fetchUser();
  }, []);

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
            setPrelimSubmissionData(null);
            setButtonActive(false);
            setShowAnswer(false);
          }
          return;
        }
        const { pre_submitted_data, mains_submitted_data } =
          await checkSubmissions(); // object or null
        if (mains_submitted_data) {
          setMainsSubmissionData(mains_submitted_data);
        }

        // const pre_submitted_data = await fetchPrelimsSubmission(); // object or null

        if (cancelled) return;

        setPrelimSubmissionData(pre_submitted_data);

        if (pre_submitted_data) {
          // prior submission exists
          const submittedVerdict = pre_submitted_data.verdict;
          setVerdict(submittedVerdict === 'correct' ? 'Correct' : 'InCorrect');
          setButtonActive(false);
          setShowAnswer(true);
        } else {
          // no prior submission
          setButtonActive(true);
          setShowAnswer(false);
          dispatch(resetSelectedOption());
        }
      } catch (e) {
        if (cancelled) return;
        // allow user to proceed even if GET failed
        setPrelimSubmissionData(null);
        setButtonActive(true);
        setShowAnswer(false);
        dispatch(resetSelectedOption());
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

  // Update button active state when option is selected
  useEffect(() => {
    if (!showAnswer && selectedOption !== null) {
      setButtonActive(true);
    }
  }, [selectedOption, showAnswer]);

  const submitHandler = async () => {
    if (!uid) {
      alert('User not logged in');
      return;
    }

    if (!data) {
      alert('Opps, there seems be an issue at the backend');
      return;
    }

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
    const prelims_solved = prelimsubmissionData != null; // placeholder
    const mains_solved = mainssubmissionData != null; // placeholder

    // Disable button + show loader while submitting
    setButtonActive(false);
    setLoaderVisible(true);

    try {
      // Case 4: prelims already submitted
      if (prelims_solved) {
        alert('OOPS your submission was already recorded');
        navigation.navigate('Dashboard');
        return;
      }

      const payload = {
        uid,
        todays_date,
        user_selection: String(selectedIndex),
        verdict: isCorrect,
        total_points: isCorrect ? points + 2 : points,
        points_awarded: isCorrect ? 2 : 0,
        current_streak: !mains_solved ? curr_streak + 1 : curr_streak,
        longest_streak,
        question_date: data.date,
        questionId: data.questionId,
        Question: data.Question,
        Answer: data.Answer,
        Table: data.Table ?? [],
        Options: data.Options,
        Explanation: data.Explanation,
      };

      await submitData(payload);

      if (!mains_solved) {
        dispatch(setCurrentStreak(curr_streak + 1));
      }

      dispatch(setPoints(isCorrect ? points + 2 : points));
      setShowAnswer(true);
      setButtonActive(false);
      navigation.navigate('Overlay', isCorrect);
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
    <SafeAreaView
      style={[
        theme
          ? [styles.bodyBGDark, styles.body]
          : [styles.bodyBGLight, styles.body],
      ]}
    >
      <ScrollView
        style={[
          styles.scroll,
          theme
            ? { backgroundColor: '#222831' }
            : { backgroundColor: '#F5F5F5' },
        ]}
      >
        <TitleAndSubtitleCard
          title="PRELIMS QUESTION"
          subtite="Select one correct option to keep streak alive and earn points!"
        />
        <UserStats />

        <Card>
          <PrelimsQuestionSection
            initialSelection={
              prelimsubmissionData
                ? parseInt(prelimsubmissionData.selected_option, 10)
                : null
            }
            isLocked={showAnswer}
          />

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
});
