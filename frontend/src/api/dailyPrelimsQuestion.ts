import { supabase } from '../supabaseConfig';

export async function fetchTodaysPrelimsQuestion() {
  const today = new Date().toISOString().substring(0, 10);

  const { data, error } = await supabase
    .from('daily_prelims_questions')
    .select('*')
    .eq('date', today)
    .single();

  if (error) {
    console.error('Error fetching today\'s prelims question:', error);
    return null;
  }

  return data;
}
