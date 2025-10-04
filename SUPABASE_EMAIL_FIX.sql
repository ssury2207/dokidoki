-- ============================================
-- FIX: Auto-create user profile after email confirmation
-- Using Supabase Database Trigger
-- ============================================

-- This function will automatically create a user profile
-- when a user's email is confirmed
CREATE OR REPLACE FUNCTION public.handle_new_user_confirmation()
RETURNS TRIGGER AS $$
DECLARE
  pending_data JSONB;
BEGIN
  -- Only proceed if email_confirmed_at was just set (not null now, was null before)
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN

    -- Check if user profile already exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN

      -- Create the user profile with default values
      INSERT INTO public.users (
        id,
        username,
        phone_number,
        longest_streak,
        current_streak,
        last_active_date,
        dates_active,
        total_solved,
        pre_submissions,
        mains_answer_copies,
        total_points,
        points_history,
        created_at
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)), -- Use metadata or email username
        COALESCE(NEW.raw_user_meta_data->>'phone_number', NULL),
        0,
        0,
        NULL,
        '{}'::jsonb,
        0,
        '{}'::jsonb,
        '{}'::jsonb,
        0,
        '{}'::jsonb,
        NOW()
      );

      RAISE LOG 'Created user profile for user %', NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;

-- Create trigger on auth.users table
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_confirmation();

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if trigger was created
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_email_confirmed';

-- Test: Check existing users
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.username
FROM auth.users u
LEFT JOIN public.users p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;
