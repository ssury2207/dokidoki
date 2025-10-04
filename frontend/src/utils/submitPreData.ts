import { supabase } from '../supabaseConfig';

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
  // 1. Fetch current user data
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();

  if (fetchError || !userData) {
    throw new Error('User doc missing');
  }

  // 2. Check if submission already exists
  const preSubmissions = userData.pre_submissions || {};
  if (preSubmissions[todays_date]) {
    throw new Error('Your submission was already recorded.');
  }

  // 3. Build submission payload
  const submissionPayload = {
    selected_option: user_selection,
    verdict: verdict ? 'correct' : 'incorrect',
    timestamp: new Date().toISOString(),
    question_snapshot: {
      question_id: questionId,
      Question,
      Answer,
      Options,
      Table,
      Explanation,
    },
  };

  // 4. Update JSONB fields
  const updatedPreSubmissions = {
    ...preSubmissions,
    [question_date]: submissionPayload,
  };

  const updatedPointsHistory = {
    ...(userData.points_history || {}),
    [question_date]: points_awarded,
  };

  const updatedDatesActive = {
    ...(userData.dates_active || {}),
    [question_date]: true,
  };

  // 5. Perform update
  const { error: updateError } = await supabase
    .from('users')
    .update({
      pre_submissions: updatedPreSubmissions,
      total_solved: (userData.total_solved || 0) + 1,
      total_points: total_points,
      points_history: updatedPointsHistory,
      current_streak: current_streak,
      longest_streak: Math.max(longest_streak, current_streak),
      last_active_date: question_date,
      dates_active: updatedDatesActive,
    })
    .eq('id', uid);

  if (updateError) {
    throw new Error(`Failed to submit data: ${updateError.message}`);
  }
}
