-- ============================================
-- FIX: Allow user signup (INSERT into users table)
-- ============================================

-- This policy allows users to INSERT their own profile during signup
-- The auth.uid() matches the id being inserted
CREATE POLICY "Users can insert own profile during signup" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- COMPLETE RLS SETUP (run all of these)
-- ============================================

-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_mains_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_prelims_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_prelims_questions ENABLE ROW LEVEL SECURITY;

-- 2. USERS TABLE POLICIES
-- Allow users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile during signup (THIS WAS MISSING!)
CREATE POLICY "Users can insert own profile during signup" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. POSTS TABLE POLICIES
-- Anyone can view posts
CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own posts (like counts, etc)
CREATE POLICY "Users can update any post" ON posts
  FOR UPDATE USING (true);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = author_id);

-- 4. COMMENTS TABLE POLICIES
-- Anyone can view comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Anyone can update comments (for like/dislike counts)
CREATE POLICY "Anyone can update comments" ON comments
  FOR UPDATE USING (true);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- 5. QUESTIONS TABLES (Read-only for everyone)
CREATE POLICY "Anyone can view questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view daily mains questions" ON daily_mains_questions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view daily prelims questions" ON daily_prelims_questions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view dataset prelims questions" ON dataset_prelims_questions
  FOR SELECT USING (true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'posts', 'comments', 'questions', 'daily_mains_questions', 'daily_prelims_questions', 'dataset_prelims_questions');

-- Check all policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
