import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import TitleAndSubtitleCard from '../common/TitleAndSubtitleCard';
import UserStats from '../common/UserStats';
import Card from '../atoms/Card';
import PrimaryButton from '../atoms/PrimaryButton';
import PrelimsArchivedQuestionSection from './PrelimsArchievedQuestionSection';
import ExpectedArchievedPrelimsAnswer from './ExpectedArchievedPrelimsAnswer';
import FullScreenLoader from '../common/FullScreenLoader';
import { fetchArchivedPrelimsSubmission } from '@/src/api/fetchArchivedPrelimsSubmission';
import { supabase } from '@/src/supabaseConfig';

type QuestionItem = {
  question: string;
  year: string;
  table_name?: any;
  options: string[];
  date: string;
  question_id: string;
  answer: string;
  explanation: string;
  chapters?: string[];
  section?: string;
};

type ParamList = {
  PrelimsArchived: {
    question: QuestionItem;
  };
};

export default function PrelimsArchivedScreen() {
  const route = useRoute<RouteProp<ParamList, 'PrelimsArchived'>>();
  const { question } = route.params;

  // Parse table_name same as PYQs
  let tableData = question.table_name;
  if (typeof tableData === 'string' && tableData.trim()) {
    try {
      const jsonString = tableData.replace(/'/g, '"');
      tableData = JSON.parse(jsonString);
    } catch (e) {
      console.log('Failed to parse table_name:', e);
      tableData = null;
    }
  }

  const theme = useSelector((state: RootState) => state.theme.isLight);

  const [verdict, setVerdict] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [initialSelection, setInitialSelection] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [buttonActive, setButtonActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setLoaderVisible(true);
      setButtonActive(false);
      setShowAnswer(false);

      try {
        const submission = await fetchArchivedPrelimsSubmission(question.date);
        if (cancelled) return;

        if (submission) {
          const selectedIdx = parseInt(submission.selected_option, 10);
          const submittedVerdict = submission.verdict;

          setInitialSelection(selectedIdx);
          setSelectedOption(selectedIdx);
          setVerdict(submittedVerdict);
          setShowAnswer(true);
          setButtonActive(false);
        } else {
          setInitialSelection(null);
          setSelectedOption(null);
          setShowAnswer(false);
          setButtonActive(true);
        }
      } catch (e) {
        if (!cancelled) {
          console.error('Failed to fetch archived submission:', e);
          setInitialSelection(null);
          setSelectedOption(null);
          setShowAnswer(false);
          setButtonActive(true);
        }
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
  }, [question.date]);

  const submitHandler = async () => {
    if (!question) {
      alert('Oops, question data missing');
      return;
    }

    if (initialSelection == null) {
      alert('Please select a valid option');
      return;
    }

    const selectedIndex =
      typeof initialSelection === 'string'
        ? parseInt(initialSelection, 10)
        : initialSelection;

    const expectedOptionIDX =
      question.answer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    const isCorrect = selectedIndex === expectedOptionIDX;

    setVerdict(isCorrect ? 'Correct' : 'Incorrect');
    setButtonActive(false);
    setLoaderVisible(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = user?.id;

      if (!uid) throw new Error('User not logged in');

      // First, fetch current user data to check for existing submission
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('pre_submissions, total_solved')
        .eq('id', uid)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch user data');
      }

      // Check if submission already exists for this date
      if (userData?.pre_submissions?.[question.date]) {
        throw new Error('Your submission was already recorded.');
      }

      const submissionPayload = {
        selected_option: String(selectedIndex),
        verdict: isCorrect ? 'correct' : 'incorrect',
        timestamp: new Date().toISOString(),
        question_snapshot: {
          question_id: question.question_id,
          question: question.question,
          answer: question.answer,
          options: question.options,
          table_name: question.table_name ?? null,
          explanation: question.explanation,
        },
      };

      // Update the JSONB field with the new submission
      const updatedPreSubmissions = {
        ...(userData?.pre_submissions || {}),
        [question.date]: submissionPayload,
      };

      const { error: updateError } = await supabase
        .from('users')
        .update({
          pre_submissions: updatedPreSubmissions,
          total_solved: (userData?.total_solved || 0) + 1,
        })
        .eq('id', uid);

      if (updateError) {
        throw new Error('Failed to submit answer');
      }

      setSelectedOption(selectedIndex);
      setShowAnswer(true);
      setButtonActive(false);
    } catch (e: any) {
      alert(e?.message || 'Failed to submit');
      console.log('Submission error:', e?.message);
      setButtonActive(true);
    } finally {
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
        contentContainerStyle={{
          paddingTop: 16,
        }}
      >
        <TitleAndSubtitleCard
          title="MISSED PRELIMS QUESTION"
          subtite="Select one correct option to keep your memory sharp !!"
        />
        <UserStats />
        <Card>
          <PrelimsArchivedQuestionSection
            data={{...question, table_name: tableData}}
            isLocked={showAnswer}
            initialSelection={initialSelection}
            onSelectOption={(idx) => setInitialSelection(idx)}
          />
          <PrimaryButton
            isActive={buttonActive}
            submitHandler={submitHandler}
            title="Submit"
          />
          {question && showAnswer && selectedOption != null && (
            <ExpectedArchievedPrelimsAnswer
              actualOption={question.options[selectedOption]}
              expectedOption={question.answer}
              explainatation={question.explanation}
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
