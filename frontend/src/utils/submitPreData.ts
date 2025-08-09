import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { getFirestore } from 'firebase/firestore';
type submitArgs = {
  uid: string;
  todays_date: string;
  user_selection: string;
  verdict: boolean;
  total_points: number;
  points_awarded: number;
  current_streak: number;
  longest_streak: number;
  question_date: string;
  questionId: string;
  Question: string;
  Answer: string;
  Table: any[];
  Options: string[];
  Explanation: string;
};
export default async function submitData({
  uid,
  todays_date,
  user_selection,
  verdict,
  total_points,
  current_streak,
  points_awarded,
  longest_streak,
  question_date,
  questionId,
  Question,
  Answer,
  Table,
  Options,
  Explanation,
}: submitArgs) {
  const db = getFirestore(app);
  const userRef = doc(db, 'users', uid);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists()) throw new Error('User doc missing');

    const data = snap.data() as any;

    // Block if today's prelims submission already exists
    const alreadyHasPre = !!data?.submissions?.pre?.[todays_date];
    if (alreadyHasPre) throw new Error('Pre already submitted for today.');

    // Build submission snapshot (includes the question snapshot per your args)
    const submissionPayload = {
      question_id: questionId,
      selected_option: user_selection,
      verdict: verdict ? 'correct' : 'incorrect',
      timestamp: serverTimestamp(),
      question_snapshot: {
        Question,
        Answer,
        Options,
        Table,
        Explanation,
      },
    };

    // Atomic updates
    const updates: Record<string, any> = {
      // Save prelims submission for today
      [`submissions.pre.${todays_date}`]: submissionPayload,
      'submissions.total_solved': (data?.submissions?.total_solved || 0) + 1,

      // Points
      'points.total_points': total_points,
      [`points.history.${todays_date}`]: points_awarded,

      // Streaks
      'streak.current_streak': current_streak,
      'streak.longest_streak': Math.max(longest_streak, current_streak),
      'streak.last_active_date': todays_date,
      [`streak.dates_active.${todays_date}`]: true,
    };

    tx.update(userRef, updates);
  });
}
