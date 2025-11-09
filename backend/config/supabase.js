import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment-specific variables
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `.env.${nodeEnv}`
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Log environment (helps debugging)
console.log(`🔧 Backend running in ${nodeEnv} mode`);
console.log(`🔗 Backend connecting to: ${supabaseUrl}`);

// Create Supabase admin client with service role key
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
