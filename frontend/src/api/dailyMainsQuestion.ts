import { supabase } from "../supabaseConfig";

export async function fetchTodaysQuestion(date?: string) {
  const targetDate: string = date || new Date().toISOString().substring(0, 10);

  const { data, error } = await supabase
    .from("daily_mains_questions")
    .select("*")
    .eq("date", targetDate)
    .single();

  if (error) {
    console.error("Error fetching today's mains question:", error);
    return null;
  }

  return data;
}
