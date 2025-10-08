import { supabase } from '../supabaseConfig';

export async function fetchPrelimsSubmission() {
  try {
    const today = new Date().toISOString().substring(0, 10);
    const { data: { user } } = await supabase.auth.getUser();
    const uid = user?.id;

    if (!uid) throw new Error('User not logged in');

    const { data, error } = await supabase
      .from('users')
      .select('pre_submissions')
      .eq('id', uid)
      .single();

    if (error) {
      console.log('Error fetching prelims submission:', error);
      return null;
    }

    if (!data || !data.pre_submissions) return null;

    // Access the JSONB field for today's date
    const submission = data.pre_submissions[today];
    return submission || null;
  } catch (error) {
    console.log('Error fetching prelims submission:', error);
    return null; // Return null gracefully instead of throwing
  }
}
