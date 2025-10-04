# Firebase to Supabase Migration Guide

## Migration Status

### ✅ Completed
1. **Environment Setup**
   - Created `.env` files for frontend and backend
   - Installed `@supabase/supabase-js` package
   - Created Supabase configuration files

2. **Authentication**
   - ✅ `AuthContext.tsx` - Migrated to Supabase auth
   - ✅ `LoginScreen.tsx` - Using `supabase.auth.signInWithPassword()`
   - ✅ `SignupScreen.tsx` - Using `supabase.auth.signUp()` + user table insert

3. **API Layer**
   - ✅ `dailyPrelimsQuestion.ts` - Migrated to Supabase query
   - ✅ `dailyMainsQuestion.ts` - Migrated to Supabase query
   - ✅ `checkTodaysSubmissions.ts` - Migrated to Supabase
   - ✅ `fetchArchiveQuestions.ts` - Migrated to Supabase

4. **Utilities**
   - ✅ `submitMainsData.ts` - Migrated to Supabase with JSONB updates
   - ✅ `submitPreData.ts` - Migrated to Supabase with JSONB updates

5. **Components**
   - ✅ `CreatePostOverlay.tsx` - Migrated to Supabase

### ⚠️ Requires Manual Migration

The following components still need migration from Firestore to Supabase:

#### Critical Components:

1. **PostDetailScreen.tsx** (`frontend/src/components/Posts/PostDetailScreen.tsx`)
   - Replace all Firestore imports with Supabase
   - Update post fetching: `getDoc()` → `supabase.from('posts').select().eq('id', postId).single()`
   - Update like toggle: `updateDoc()` with `increment()` → Supabase RPC or optimistic updates
   - Update comments: `addDoc(collection(db, 'comments'))` → `supabase.from('comments').insert()`
   - Update comment queries: `getDocs(query(...))` → `supabase.from('comments').select()`

2. **MainsScreen.tsx** (`frontend/src/components/PracticeScreens/MainsScreen.tsx`)
   - Replace `getFirestore()` with `supabase`
   - Update post check query: `getDocs(query(collection(db, "posts"), where(...)))` → Supabase query

3. **OthersAnswersListScreen.tsx** (if exists)
   - Migrate post fetching to Supabase

4. **DashboardScreen.tsx** (`frontend/src/components/Dashboard/DashboardScreen.tsx`)
   - Update user data fetching to Supabase

#### Backend Scripts:

1. **assignDailyQuestion.js** (`backend/assignDailyQuestion.js`)
   - Replace Firebase Admin SDK with Supabase
   - Update daily question assignment logic

2. **index.js** (`backend/index.js`)
   - Replace Firestore collection references
   - Update data upload logic for prelims questions

### 🔧 PostDetailScreen Migration Example

Here's how to migrate the PostDetailScreen (the most complex component):

```typescript
// OLD (Firebase)
import { doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { firestore as db } from '@/src/firebaseConfig';

const postDoc = await getDoc(doc(db, "posts", postId));
const data = postDoc.data();

await updateDoc(postRef, {
  likeCount: increment(1),
  likedBy: arrayUnion(currentUser.uid),
});

// NEW (Supabase)
import { supabase } from '@/src/supabaseConfig';

const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('id', postId)
  .single();

// For likes, you need to fetch current data first, then update
const { data: post } = await supabase
  .from('posts')
  .select('like_count, liked_by')
  .eq('id', postId)
  .single();

await supabase
  .from('posts')
  .update({
    like_count: post.like_count + 1,
    liked_by: [...post.liked_by, currentUser.id]
  })
  .eq('id', postId);
```

### 📝 Key Migration Patterns

#### 1. Firestore Document Reference → Supabase Query
```typescript
// Firebase
const docRef = doc(db, 'collection', 'docId');
const snap = await getDoc(docRef);
const data = snap.exists() ? snap.data() : null;

// Supabase
const { data, error } = await supabase
  .from('collection')
  .select('*')
  .eq('id', 'docId')
  .single();
```

#### 2. Firestore Collection Query → Supabase Query
```typescript
// Firebase
const q = query(
  collection(db, 'posts'),
  where('author_id', '==', userId),
  orderBy('created_at', 'desc')
);
const querySnapshot = await getDocs(q);
const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// Supabase
const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .eq('author_id', userId)
  .order('created_at', { ascending: false });
```

#### 3. Firestore Add Document → Supabase Insert
```typescript
// Firebase
const docRef = await addDoc(collection(db, 'posts'), postData);
const postId = docRef.id;

// Supabase
const { data, error } = await supabase
  .from('posts')
  .insert([postData])
  .select()
  .single();
const postId = data.id;
```

#### 4. Firestore Update with Increment → Supabase Update
```typescript
// Firebase
await updateDoc(docRef, {
  likeCount: increment(1),
  likedBy: arrayUnion(userId)
});

// Supabase (fetch first, then update)
const { data: current } = await supabase
  .from('posts')
  .select('like_count, liked_by')
  .eq('id', postId)
  .single();

await supabase
  .from('posts')
  .update({
    like_count: current.like_count + 1,
    liked_by: [...current.liked_by, userId]
  })
  .eq('id', postId);
```

#### 5. Firestore serverTimestamp() → Supabase
```typescript
// Firebase
createdAt: serverTimestamp()

// Supabase
created_at: new Date().toISOString()
// OR let Postgres handle it with DEFAULT NOW()
```

#### 6. Auth User Reference
```typescript
// Firebase
import { auth } from './firebaseConfig';
const user = auth.currentUser;
const uid = user?.uid;

// Supabase
import { supabase } from './supabaseConfig';
const { data: { user } } = await supabase.auth.getUser();
const uid = user?.id;
```

### 🔐 Important Notes

1. **Field Name Changes**: Firestore uses camelCase, but we use snake_case in Postgres:
   - `authorId` → `author_id`
   - `likeCount` → `like_count`
   - `createdAt` → `created_at`
   - `isAnonymous` → `is_anonymous`

2. **JSONB Fields**: For nested data (submissions, points_history, dates_active), we use JSONB:
   ```typescript
   // Update JSONB field
   const updated = {
     ...userData.pre_submissions,
     [date]: newSubmission
   };
   await supabase.from('users').update({ pre_submissions: updated }).eq('id', uid);
   ```

3. **Array Operations**: Supabase doesn't have `arrayUnion`/`arrayRemove`. You must:
   - Fetch current array
   - Modify in JavaScript
   - Update with new array

4. **Transactions**: Firestore `runTransaction()` doesn't exist in Supabase client.
   - Use Postgres transactions via RPC if needed
   - Or handle with optimistic updates

### 🚀 Next Steps

1. **Migrate PostDetailScreen** - This is the most critical remaining component
2. **Migrate remaining screens** that fetch user data or posts
3. **Migrate backend scripts** for daily question assignment
4. **Test thoroughly** - Especially auth flow, submissions, and posts/comments
5. **Data Migration** - If you have existing Firebase data, you'll need to migrate it to Supabase tables

### 📚 Resources

- Supabase Docs: https://supabase.com/docs
- Supabase JS Client: https://supabase.com/docs/reference/javascript
- Postgres JSONB: https://www.postgresql.org/docs/current/datatype-json.html

