import { supabase } from '../supabaseConfig';

export async function fetchTodaysPrelimsQuestion() {
  const today = new Date().toISOString().substring(0, 10);

  // Don't use .single() to avoid error when no question exists
  const { data, error } = await supabase
    .from('daily_prelims_questions')
    .select('*')
    .eq('date', today);

  // Only log actual errors, not "no rows found"
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching today\'s prelims question:', error);
    return null;
  }

  // If no data or empty array, return null (no question for today)
  if (!data || data.length === 0) {
    return null;
  }

  // Transform Supabase snake_case to PascalCase for component compatibility
  const questionData = data[0];
  return {
    id: questionData.id,
    date: questionData.date,
    Question: questionData.question,
    Chapters: questionData.chapters,
    Answer: questionData.answer,
    Explanation: questionData.explanation,
    Options: questionData.options,
    Section: questionData.section,
    Table: questionData.table_name,
    Year: questionData.year?.toString() || '',
  };
}
