import { supabase } from '../supabaseConfig';

export async function checkSubmissions(date?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not logged in');
      throw new Error('User not logged in');
    }

    const submissionDate = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Fetch user data from users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('pre_submissions, mains_answer_copies')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn(`Error fetching user document for UID: ${user.id}`, error);
      return { pre_submitted_data: null, mains_submitted_data: null };
    }

    if (!userData) {
      console.warn(`User document not found for UID: ${user.id}`);
      return { pre_submitted_data: null, mains_submitted_data: null };
    }

    // Access nested data in JSONB fields
    const preData = userData.pre_submissions?.[submissionDate] ?? null;
    const mainsData = userData.mains_answer_copies?.[submissionDate] ?? null;

    return { pre_submitted_data: preData, mains_submitted_data: mainsData };
  } catch (error) {
    console.error(`Error checking submissions:`, error);
    throw error;
  }
}
