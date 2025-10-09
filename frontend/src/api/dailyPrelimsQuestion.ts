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

  // Parse table_name if it's a string (JSON text or Python-style dict)
  let tableData = questionData.table_name;
  if (typeof tableData === 'string' && tableData.trim()) {
    try {
      // Replace Python-style single quotes with double quotes for valid JSON
      const jsonString = tableData.replace(/'/g, '"');
      tableData = JSON.parse(jsonString);
    } catch (e) {
      console.log('Failed to parse table_name:', e);
      tableData = null;
    }
  }

  return {
    id: questionData.id,
    date: questionData.date,
    questionId: questionData.question_id,
    Question: questionData.question,
    Chapters: questionData.chapters,
    Answer: questionData.answer,
    Explanation: questionData.explanation,
    Options: questionData.options,
    Section: questionData.section,
    Table: tableData,
    Year: questionData.year?.toString() || '',
  };
}
