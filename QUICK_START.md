# 🚀 Quick Start Guide - DokiDoki Multi-Environment Setup

## ⚡ TL;DR - What You Need to Do Now

### 1. Update Firebase Projects (REQUIRED)

Your package names changed. Update Firebase:

**Development Firebase Project:**
- Old package: `com.dokidoki.dev.dokidoki`
- **New package: `com.dokidoki.dokidoki.dev`** ⬅️ Update this in Firebase
- Download new `google-services.json` → save as `frontend/android/app/google-services-dev.json`

**Production Firebase Project:**
- Old package: `com.dokidoki.dev.dokidoki`
- **New package: `com.dokidoki.dokidoki`** ⬅️ Update this in Firebase
- Download new `google-services.json` → save as `frontend/android/app/google-services.json`

### 2. Place Firebase Files

```bash
# Expected file locations:
frontend/android/app/google-services.json        # Production
frontend/android/app/google-services-dev.json    # Development
```

### 3. Test Build

```bash
cd frontend

# Test development build
npm run build:dev

# Test production build
npm run build:prod
```

---

## 📋 Common Commands

### Frontend
```bash
npm start                    # Start dev server
npm run build:dev            # Build dev APK
npm run build:prod           # Build prod APK
```

### Backend
```bash
npm run start:dev            # Start dev backend
npm run start:prod           # Start prod backend
npm run send-notifications   # Send notifications (dev)
npm run assign-questions     # Assign questions (dev)
```

---

## ✅ Verification

### Check Build Output
The build log will show:
```
✅ Using google-services-dev.json for development build
✅ Using google-services.json for production build
```

### Check Package Names
After successful build:
```bash
cd frontend/android
aapt dump badging app/build/outputs/apk/development/release/*.apk | grep "package:"
# Should show: package: name='com.dokidoki.dokidoki.dev'

aapt dump badging app/build/outputs/apk/production/release/*.apk | grep "package:"
# Should show: package: name='com.dokidoki.dokidoki'
```

---

## 📚 Full Documentation

- [Complete Setup Guide](./MULTI_ENV_SETUP_COMPLETE.md)
- [Firebase Setup Instructions](./FIREBASE_SETUP.md)

---

## ❓ Quick Troubleshooting

**Build fails with "No matching client found for package name"**
→ You haven't updated Firebase with the new package name yet. See step 1 above.

**Wrong environment loading**
→ Check console output for "🔧 Running in X mode" to see which environment is active.

**Can't find .env files**
→ They exist! Check `frontend/.env.development` and `backend/.env.development`

---

## 🎉 Status

✅ Multi-environment configuration complete
✅ Package names updated to clean format
✅ Build system configured
✅ Scripts ready
⏳ **Waiting for**: Firebase package name updates + google-services files

**Once Firebase is updated, you're 100% done!** 🚀
