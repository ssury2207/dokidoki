import { supabase } from '../supabaseConfig';

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
  const mainsAnswerCopies = userData.mains_answer_copies || {};
  if (mainsAnswerCopies[question_date]) {
    throw new Error('Your mains submission was already recorded.');
  }

  // 3. Build submission payload
  const submissionPayload = {
    timestamp: new Date().toISOString(),
    question_snapshot: {
      question_id: questionId,
      Question,
    },
    submission_uri,
  };

  // 4. Update JSONB fields
  const updatedMainsAnswerCopies = {
    ...mainsAnswerCopies,
    [question_date]: submissionPayload,
  };

  const updatedPointsHistory = {
    ...(userData.points_history || {}),
    [question_date]: todays_date === question_date ? points_awarded : 0,
  };

  const updatedDatesActive = {
    ...(userData.dates_active || {}),
    [question_date]:
      todays_date === question_date
        ? true
        : userData.dates_active?.[question_date] || false,
  };

  // 5. Perform update
  const { error: updateError } = await supabase
    .from('users')
    .update({
      mains_answer_copies: updatedMainsAnswerCopies,
      total_solved: (userData.total_solved || 0) + 1,
      total_points: total_points,
      points_history: updatedPointsHistory,
      current_streak: current_streak,
      longest_streak: Math.max(longest_streak, current_streak),
      last_active_date:
        todays_date === question_date
          ? question_date
          : userData.last_active_date,
      dates_active: updatedDatesActive,
    })
    .eq('id', uid);

  if (updateError) {
    throw new Error(`Failed to submit mains data: ${updateError.message}`);
  }
}
