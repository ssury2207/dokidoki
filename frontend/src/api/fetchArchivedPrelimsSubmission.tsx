import { supabase } from '../supabaseConfig';

export async function fetchArchivedPrelimsSubmission(date: string) {
  try {
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

    // Access the JSONB field for the specific date
    const submission = data.pre_submissions[date];
    return submission || null;
  } catch (error) {
    console.log('Error fetching prelims submission:', error);
    return null; // Return null gracefully instead of throwing
  }
}
