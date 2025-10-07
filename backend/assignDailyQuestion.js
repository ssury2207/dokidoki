// assignDailyQuestion.js (Supabase version)

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function assignDailyQuestion() {
  try {
    // Get IST date (UTC + 5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(now.getTime() + istOffset);
    const today = istDate.toISOString().substring(0, 10);

    console.log('Checking for existing mains question for date:', today);

    // Check if today's question already exists (don't use .single() to avoid errors)
    const { data: existingQuestions, error: checkError } = await supabase
      .from('daily_mains_questions')
      .select('id')
      .eq('date', today);

    if (checkError) {
      throw new Error(`Error checking existing question: ${checkError.message}`);
    }

    if (existingQuestions && existingQuestions.length > 0) {
      console.log('A mains question is already assigned for today.');
      return;
    }

    // Get all used question IDs from daily_mains_questions
    const { data: usedQuestions, error: usedError } = await supabase
      .from('daily_mains_questions')
      .select('question_id');

    if (usedError) {
      throw new Error(`Error fetching used questions: ${usedError.message}`);
    }

    const usedIds = (usedQuestions || []).map((q) => q.question_id).filter(id => id != null);
    console.log('Used question IDs:', usedIds.length);

    // Get all questions from the questions table
    const { data: allQuestions, error: questionsError } = await supabase
      .from('questions')
      .select('*');

    if (questionsError) {
      throw new Error(`Error fetching questions: ${questionsError.message}`);
    }

    if (!allQuestions || allQuestions.length === 0) {
      throw new Error('No questions found in the questions table!');
    }

    // Filter out already used questions
    const candidates = allQuestions.filter((q) => !usedIds.includes(q.id));

    if (!candidates.length) {
      throw new Error('No unused mains questions remaining!');
    }

    console.log('Available unused questions:', candidates.length);

    // Select a random question
    const selectedQuestion = candidates[Math.floor(Math.random() * candidates.length)];

    // Insert the daily question
    const { error: insertError } = await supabase
      .from('daily_mains_questions')
      .insert([{
        date: today,
        question_id: selectedQuestion.id,
        question: selectedQuestion.question,
        paper: selectedQuestion.paper,
        year: selectedQuestion.year,
        marks: selectedQuestion.marks,
        code: selectedQuestion.code,
      }]);

    if (insertError) {
      throw new Error(`Error inserting daily question: ${insertError.message}`);
    }

    console.log('✅ Assigned new mains daily question for', today, ':', selectedQuestion.id);
    console.log('   Question:', selectedQuestion.question.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Error in assignDailyQuestion:', error.message);
    throw error;
  }
}

async function assignDailyPrelimsQuestion() {
  try {
    // Get IST date (UTC + 5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const istDate = new Date(now.getTime() + istOffset);
    const today = istDate.toISOString().substring(0, 10);

    console.log('Checking for existing prelims question for date:', today);

    // Check if today's question already exists (don't use .single() to avoid errors)
    const { data: existingQuestions, error: checkError } = await supabase
      .from('daily_prelims_questions')
      .select('id')
      .eq('date', today);

    if (checkError) {
      throw new Error(`Error checking existing prelims question: ${checkError.message}`);
    }

    if (existingQuestions && existingQuestions.length > 0) {
      console.log('A prelims question is already assigned for today.');
      return;
    }

    // Get all used question IDs from daily_prelims_questions
    const { data: usedQuestions, error: usedError } = await supabase
      .from('daily_prelims_questions')
      .select('question_id');

    if (usedError) {
      throw new Error(`Error fetching used prelims questions: ${usedError.message}`);
    }

    const usedIds = (usedQuestions || []).map((q) => q.question_id).filter(id => id != null);
    console.log('Used prelims question IDs:', usedIds.length);

    // Get all questions from the dataset_prelims_questions table
    const { data: allQuestions, error: questionsError } = await supabase
      .from('dataset_prelims_questions')
      .select('*');

    if (questionsError) {
      throw new Error(`Error fetching prelims questions: ${questionsError.message}`);
    }

    if (!allQuestions || allQuestions.length === 0) {
      throw new Error('No questions found in the dataset_prelims_questions table!');
    }

    // Filter out already used questions
    const candidates = allQuestions.filter((q) => !usedIds.includes(q.id));

    if (!candidates.length) {
      throw new Error('No unused prelims questions remaining!');
    }

    console.log('Available unused prelims questions:', candidates.length);

    // Select a random question
    const selectedQuestion = candidates[Math.floor(Math.random() * candidates.length)];

    // Insert the daily prelims question
    const { error: insertError } = await supabase
      .from('daily_prelims_questions')
      .insert([{
        date: today,
        question_id: selectedQuestion.id,
        question: selectedQuestion.question_and_year,
        year: selectedQuestion.year,
        chapters: selectedQuestion.chapters,
        answer: selectedQuestion.answer,
        explanation: selectedQuestion.explanation,
        options: selectedQuestion.options,
        section: selectedQuestion.section,
        table_name: selectedQuestion.table_name,
      }]);

    if (insertError) {
      throw new Error(`Error inserting daily prelims question: ${insertError.message}`);
    }

    console.log('✅ Assigned new prelims daily question for', today, ':', selectedQuestion.id);
    console.log('   Question:', selectedQuestion.question_and_year.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Error in assignDailyPrelimsQuestion:', error.message);
    throw error;
  }
}

assignDailyQuestion().catch(console.error);
assignDailyPrelimsQuestion().catch(console.error);
