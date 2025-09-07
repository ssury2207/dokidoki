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
import {
  getFirestore,
  doc,
  updateDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { auth } from '@/src/firebaseConfig';

type QuestionItem = {
  Question: string;
  Year: string;
  Table: any;
  Options: string[];
  date: string;
  questionId: string;
  Answer: string;
  Explanation: string;
};

type ParamList = {
  PrelimsArchived: {
    question: QuestionItem;
  };
};

export default function PrelimsArchivedScreen() {
  const route = useRoute<RouteProp<ParamList, 'PrelimsArchived'>>();
  const { question } = route.params;

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
      question.Answer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    const isCorrect = selectedIndex === expectedOptionIDX;

    setVerdict(isCorrect ? 'Correct' : 'Incorrect');
    setButtonActive(false);
    setLoaderVisible(true);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('User not logged in');

      const db = getFirestore();
      const userRef = doc(db, 'users', uid);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef);
        if (!snap.exists()) throw new Error('User doc missing');

        const data = snap.data() as any;
        const alreadyHasPre = !!data?.submissions?.pre?.[question.date];
        if (alreadyHasPre)
          throw new Error('Your submission was already recorded.');

        const submissionPayload = {
          selected_option: String(selectedIndex),
          verdict: isCorrect ? 'correct' : 'incorrect',
          timestamp: serverTimestamp(),
          question_snapshot: {
            question_id: question.questionId,
            Question: question.Question,
            Answer: question.Answer,
            Options: question.Options,
            Table: question.Table ?? [],
            Explanation: question.Explanation,
          },
        };

        const updates: Record<string, any> = {
          [`submissions.pre.${question.date}`]: submissionPayload,
          'submissions.total_solved':
            (data?.submissions?.total_solved || 0) + 1,
        };

        tx.update(userRef, updates);
      });

      setSelectedOption(selectedIndex);
      setShowAnswer(true);
      setButtonActive(false);
    } catch (e: any) {
      alert(e?.message || 'Failed to submit');
      console.error(e?.message);
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
            data={question}
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
              actualOption={question.Options[selectedOption]}
              expectedOption={question.Answer}
              explainatation={question.Explanation}
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
