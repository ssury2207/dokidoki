# Email Confirmation Flow - Setup Guide

## ✅ What's Been Implemented

I've created a complete email confirmation flow that:

1. ✅ Shows a beautiful waiting screen after signup
2. ✅ Automatically checks every 3 seconds for email confirmation
3. ✅ Auto-logs in the user once email is confirmed
4. ✅ Creates user profile ONLY after email confirmation
5. ✅ Allows user to change email or go back to login
6. ✅ Persists pending user data if app is closed

## 📁 Files Created/Modified

### New Files:
- `frontend/src/components/Auth/EmailConfirmationScreen.tsx` - Confirmation waiting screen

### Modified Files:
- `frontend/src/components/Auth/SignupScreen.tsx` - Redirects to confirmation screen
- `frontend/src/navigation/AuthNavigator.tsx` - Added EmailConfirmation route

## 🚀 How to Enable Email Confirmation

### Step 1: Enable Email Confirmation in Supabase

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Click on your project
3. Navigate to: **Authentication** → **Providers** → **Email**
4. Find **"Confirm email"** toggle
5. **Turn it ON** (enable it)
6. Click **Save**

### Step 2: Remove the Old INSERT Policy

Since we now create profiles AFTER email confirmation, we need to update the RLS policy:

**Go to Supabase SQL Editor and run:**

```sql
-- Drop the old policy
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON users;

-- Create new policy that allows inserts for authenticated users
-- This works because after email confirmation, the user is authenticated
CREATE POLICY "Authenticated users can create profile" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id AND auth.jwt() IS NOT NULL);
```

## 🎯 How It Works

### User Journey:

```
1. User fills signup form
   ↓
2. Clicks "SIGN UP"
   ↓
3. Auth user created in Supabase (NO profile yet)
   ↓
4. Redirected to EmailConfirmationScreen
   ↓
5. User checks email and clicks confirmation link
   ↓
6. App detects confirmation (checks every 3 seconds)
   ↓
7. User profile created in 'users' table
   ↓
8. User automatically logged in (via AuthContext)
   ↓
9. Navigates to Dashboard
```

### Key Features:

#### ✅ Auto-Detection
- Checks for email confirmation every 3 seconds
- No need to manually refresh

#### ✅ Smart Navigation
- "Change Email" → Goes back to signup
- "Back to Login" → Goes to login screen
- "Resend Email" → Resends confirmation email

#### ✅ Persistence
- If user closes app before confirming
- Data saved in AsyncStorage
- (You can extend this to show confirmation screen on app restart)

## 🧪 Testing the Flow

### Test Steps:

1. **Delete any existing test users:**
   ```sql
   DELETE FROM auth.users WHERE email = 'test@example.com';
   ```

2. **Start the app and go to Signup**

3. **Fill form:**
   - Username: `testuser`
   - Phone: `1234567890`
   - Email: `your-real-email@gmail.com` (use your real email!)
   - Password: `Test123!`

4. **Click "SIGN UP"**

5. **You should see:**
   - Email confirmation screen
   - Message: "We've sent a confirmation email to your-real-email@gmail.com"
   - A spinner checking for confirmation

6. **Check your email inbox**

7. **Click the confirmation link**

8. **Switch back to app:**
   - Within 3 seconds, it should detect confirmation
   - Create your profile automatically
   - Log you in and navigate to Dashboard

## 🔍 Troubleshooting

### Issue: "User profile creation failed"

**Check:**
1. RLS policy is correct (see Step 2 above)
2. Email confirmation is enabled in Supabase
3. User clicked the confirmation link

### Issue: "Email not arriving"

**Solutions:**
1. Check spam folder
2. Click "Resend Confirmation Email" button
3. Verify email settings in Supabase → Authentication → Email Templates

### Issue: "Still showing confirmation screen after confirming"

**Debug:**
1. Check browser console for errors
2. Verify `auth.users` table in Supabase shows `email_confirmed_at` timestamp
3. Try logging out and back in

## 🎨 Customization

### Change Check Interval

In `EmailConfirmationScreen.tsx`, line 49:
```typescript
const interval = setInterval(() => {
  setCheckCount(prev => prev + 1);
  checkEmailConfirmation();
}, 3000); // Change 3000 to desired milliseconds
```

### Customize Email Template

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Click on **"Confirm signup"**
3. Customize the email content
4. Use variables like `{{ .ConfirmationURL }}`, `{{ .Email }}`

Example:
```html
<h2>Welcome to Dokidoki!</h2>
<p>Click the button below to confirm your email address:</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
```

## 🔐 Security Notes

1. ✅ User profiles are NOT created until email is confirmed
2. ✅ Prevents fake/spam signups
3. ✅ Ensures users provide valid email addresses
4. ✅ RLS policies protect user data

## 📊 Database State

### Before Email Confirmation:
- ✅ `auth.users` - User exists
- ❌ `public.users` - NO profile yet
- Status: User cannot login

### After Email Confirmation:
- ✅ `auth.users` - User exists + `email_confirmed_at` set
- ✅ `public.users` - Profile created
- Status: User can login and use app

## 🚀 Next Steps

1. ✅ Enable email confirmation in Supabase
2. ✅ Update RLS policy (SQL above)
3. ✅ Test the flow with your real email
4. ✅ Customize email template (optional)
5. ✅ Deploy and enjoy!

## 💡 Future Enhancements (Optional)

### 1. Show Confirmation Screen on App Restart

Add to `App.tsx` or `AuthNavigator`:

```typescript
useEffect(() => {
  const checkPendingConfirmation = async () => {
    const pending = await AsyncStorage.getItem('pending_user_data');
    if (pending) {
      const { email, username, phoneNumber } = JSON.parse(pending);
      navigation.replace('EmailConfirmation', { email, username, phoneNumber });
    }
  };
  checkPendingConfirmation();
}, []);
```

### 2. Add Timeout/Expiry

After 30 minutes, auto-redirect to signup with message:
```typescript
useEffect(() => {
  const timeout = setTimeout(() => {
    alert('Confirmation link expired. Please sign up again.');
    navigation.replace('Signup');
  }, 30 * 60 * 1000); // 30 minutes

  return () => clearTimeout(timeout);
}, []);
```

### 3. Deep Linking

Handle the confirmation link to open your app directly (requires expo-linking setup).

---

**You're all set!** 🎉 The email confirmation flow is now fully implemented and ready to use.

