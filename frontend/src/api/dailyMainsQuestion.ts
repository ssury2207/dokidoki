import { supabase } from "../supabaseConfig";

export async function fetchTodaysQuestion(date?: string) {
  const targetDate: string = date || new Date().toISOString().substring(0, 10);

  // Don't use .single() to avoid error when no question exists
  const { data, error } = await supabase
    .from("daily_mains_questions")
    .select("*")
    .eq("date", targetDate);

  // Only log actual errors, not "no rows found"
  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching today's mains question:", error);
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
    questionId: questionData.question_id, // ID from questions table
    Year: questionData.year,
    Paper: questionData.paper,
    Marks: questionData.marks,
    Question: questionData.question,
    Code: questionData.code,
    date: questionData.date,
  };
}
