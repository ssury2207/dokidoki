import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '../firebaseConfig';

export type SubmitMainsArgs = {
  uid: string;
  todays_date: string;
  total_points: number;
  points_awarded: number;
  current_streak: number;
  longest_streak: number;
  question_date: string;
  questionId: string;
  Question: string;
  submission_uri: string[]; // Cloudinary URLs or similar
};

export default async function submitMainsData({
  uid,
  todays_date,
  total_points,
  points_awarded,
  current_streak,
  longest_streak,
  question_date,
  questionId,
  Question,
  submission_uri,
}: SubmitMainsArgs) {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', uid);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists()) throw new Error('User doc missing');

    const data = snap.data() as any;

    const alreadyHasMains = !!data?.submissions?.mains?.[todays_date];
    if (alreadyHasMains)
      throw new Error('Your mains submission was already recorded.');

    const submissionPayload = {
      timestamp: serverTimestamp(),
      question_snapshot: {
        question_id: questionId,
        Question,
      },
      submission_uri,
    };

    const updates: Record<string, any> = {
      [`submissions.mains.${question_date}`]: submissionPayload,
      'submissions.total_solved': (data?.submissions?.total_solved || 0) + 1,
      'points.total_points': total_points,
      [`points.history.${question_date}`]: points_awarded,
      'streak.current_streak': current_streak,
      'streak.longest_streak': Math.max(longest_streak, current_streak),
      'streak.last_active_date': question_date,
      [`streak.dates_active.${question_date}`]: true,
    };

    tx.update(userRef, updates);
  });
}
