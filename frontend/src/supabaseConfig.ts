import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Log environment (helps debugging)
console.log(`🔧 Running in ${process.env.EXPO_PUBLIC_APP_ENV || 'unknown'} mode`);
console.log(`🔗 Connecting to: ${supabaseUrl}`);

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Type definitions for database tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          phone_number: string | null;
          longest_streak: number;
          current_streak: number;
          last_active_date: string | null;
          dates_active: Record<string, any>;
          total_solved: number;
          pre_submissions: Record<string, any>;
          mains_answer_copies: Record<string, any>;
          total_points: number;
          points_history: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          phone_number?: string | null;
          longest_streak?: number;
          current_streak?: number;
          last_active_date?: string | null;
          dates_active?: Record<string, any>;
          total_solved?: number;
          pre_submissions?: Record<string, any>;
          mains_answer_copies?: Record<string, any>;
          total_points?: number;
          points_history?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          phone_number?: string | null;
          longest_streak?: number;
          current_streak?: number;
          last_active_date?: string | null;
          dates_active?: Record<string, any>;
          total_solved?: number;
          pre_submissions?: Record<string, any>;
          mains_answer_copies?: Record<string, any>;
          total_points?: number;
          points_history?: Record<string, any>;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          username: string;
          question: string;
          year: string | null;
          paper: string | null;
          question_id: string | null;
          is_anonymous: boolean;
          images: string[];
          like_count: number;
          comment_count: number;
          liked_by: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          username: string;
          question: string;
          year?: string | null;
          paper?: string | null;
          question_id?: string | null;
          is_anonymous?: boolean;
          images?: string[];
          like_count?: number;
          comment_count?: number;
          liked_by?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          username?: string;
          question?: string;
          year?: string | null;
          paper?: string | null;
          question_id?: string | null;
          is_anonymous?: boolean;
          images?: string[];
          like_count?: number;
          comment_count?: number;
          liked_by?: string[];
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          author_username: string;
          content: string;
          is_anonymous: boolean;
          is_edited: boolean;
          like_count: number;
          dislike_count: number;
          liked_by: string[];
          disliked_by: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          author_username: string;
          content: string;
          is_anonymous?: boolean;
          is_edited?: boolean;
          like_count?: number;
          dislike_count?: number;
          liked_by?: string[];
          disliked_by?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          author_username?: string;
          content?: string;
          is_anonymous?: boolean;
          is_edited?: boolean;
          like_count?: number;
          dislike_count?: number;
          liked_by?: string[];
          disliked_by?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          question: string;
          paper: string | null;
          year: number | null;
          marks: number | null;
          code: string | null;
          date_added: string;
        };
      };
      dataset_prelims_questions: {
        Row: {
          id: string;
          question_and_year: string;
          year: number | null;
          chapters: string | null;
          answer: string | null;
          explanation: string | null;
          options: any;
          section: string | null;
          table_name: string | null;
          date_added: string;
        };
      };
      daily_mains_questions: {
        Row: {
          id: string;
          date: string;
          question_id: string | null;
          question: string;
          paper: string | null;
          year: number | null;
          marks: number | null;
          code: string | null;
        };
      };
      daily_prelims_questions: {
        Row: {
          id: string;
          date: string;
          question_id: string | null;
          question: string;
          year: number | null;
          chapters: string | null;
          answer: string | null;
          explanation: string | null;
          options: any;
          section: string | null;
          table_name: string | null;
        };
      };
    };
  };
};
