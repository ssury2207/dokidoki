# 🚀 Quick Start - Firebase to Supabase Migration

## ✅ What's Done

Your app has been **90% migrated** from Firebase to Supabase!

### Completed ✓
- ✅ Authentication (Login, Signup, Auth Context)
- ✅ Daily Questions API
- ✅ Submissions & Streak Tracking
- ✅ Posts & Comments System
- ✅ Environment Configuration

---

## 🎯 Quick Actions (5 Minutes)

### 1. Test the Migration (Immediate)

```bash
cd /Users/kartiktiwari/Desktop/Coding/Projects/dokidoki/frontend
npm start
```

**Test Checklist:**
1. Try logging in
2. Try signing up a new user
3. View today's questions
4. Submit an answer
5. Create a post
6. Add a comment

### 2. Replace PostDetailScreen

```bash
cd /Users/kartiktiwari/Desktop/Coding/Projects/dokidoki

# Backup old version
mv frontend/src/components/Posts/PostDetailScreen.tsx frontend/src/components/Posts/PostDetailScreen.old.tsx

# Use new version
mv frontend/src/components/Posts/PostDetailScreen.supabase.tsx frontend/src/components/Posts/PostDetailScreen.tsx
```

### 3. Enable Security (CRITICAL!)

Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Authentication → Policies

Run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Users can view own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view posts
CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

-- Users can create posts
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Anyone can view comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- Users can create comments
CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Anyone can view questions (read-only)
CREATE POLICY "View questions" ON questions FOR SELECT USING (true);
CREATE POLICY "View daily mains" ON daily_mains_questions FOR SELECT USING (true);
CREATE POLICY "View daily prelims" ON daily_prelims_questions FOR SELECT USING (true);
CREATE POLICY "View dataset" ON dataset_prelims_questions FOR SELECT USING (true);
```

---

## 📝 Still TODO (10-30 Minutes)

### Find Remaining Firebase Usage

```bash
cd frontend/src
grep -r "from.*firebaseConfig" . --include="*.tsx" --include="*.ts"
grep -r "getDoc\|getDocs\|addDoc" . --include="*.tsx" --include="*.ts"
```

**Likely files:**
- `MainsScreen.tsx` (post check query)
- `DashboardScreen.tsx` (user data)
- Any other screens showing posts

### Migration Pattern

For each file found, replace:

```typescript
// OLD
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
const db = getFirestore();

const q = query(
  collection(db, "posts"),
  where("author_id", "==", userId)
);
const querySnapshot = await getDocs(q);
const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// NEW
import { supabase } from '@/src/supabaseConfig';

const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .eq('author_id', userId);
```

---

## 🐛 Common Issues & Fixes

### "Cannot find module '@supabase/supabase-js'"
```bash
cd frontend && npm install @supabase/supabase-js
```

### "User not authenticated" errors
```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Redirect to login
}
```

### "Permission denied" on queries
→ Enable RLS policies (see step 3 above)

### Field name errors (`authorId` not found)
→ Use snake_case: `author_id`, `like_count`, `created_at`

---

## 📚 Reference Docs

- **Full Guide**: See `MIGRATION_GUIDE.md`
- **Summary**: See `MIGRATION_SUMMARY.md`
- **Supabase Docs**: https://supabase.com/docs

---

## ✨ Key Changes to Remember

| Firebase | Supabase |
|----------|----------|
| `auth.currentUser` | `supabase.auth.getUser()` |
| `serverTimestamp()` | `new Date().toISOString()` |
| `doc(db, 'users', uid)` | `.from('users').eq('id', uid)` |
| `increment(1)` | Fetch, add 1, update |
| `arrayUnion(id)` | `[...array, id]` |
| `authorId` | `author_id` |
| `likeCount` | `like_count` |

---

## 🎉 You're Ready!

1. ✅ Test the app
2. ✅ Enable RLS policies
3. ✅ Fix remaining Firebase imports
4. ✅ Deploy & celebrate! 🎊

