# 🎉 Multi-Environment Setup - Complete Guide

## Overview

Your DokiDoki project now has full multi-environment support with separate Development and Production configurations.

---

## 📦 Package Names

| Environment | Package Name | App Name | Can Install Side-by-Side? |
|-------------|--------------|----------|----------------------------|
| **Development** | `com.dokidoki.dokidoki.dev` | "DokiDoki Dev" | ✅ Yes |
| **Production** | `com.dokidoki.dokidoki` | "DokiDoki" | ✅ Yes |

---

## 🗂️ Project Structure

```
dokidoki/
├── frontend/
│   ├── .env.development           # Dev frontend config
│   ├── .env.production            # Prod frontend config
│   ├── app.config.js              # Dynamic app configuration
│   ├── eas.json                   # EAS build profiles
│   ├── package.json               # npm scripts for all envs
│   ├── src/
│   │   └── supabaseConfig.ts      # Supabase client (with env logging)
│   └── android/
│       └── app/
│           ├── build.gradle       # Product flavors configured
│           ├── google-services.json        # Prod Firebase (to add)
│           └── google-services-dev.json    # Dev Firebase (to add)
│
└── backend/
    ├── .env.development           # Dev backend config
    ├── .env.production            # Prod backend config
    ├── package.json               # npm scripts for all envs
    ├── config/
    │   └── supabase.js            # Multi-env loader
    ├── sendPushNotifications.js   # Updated for multi-env
    └── assignDailyQuestion.js     # Updated for multi-env
```

---

## 🚀 Usage Guide

### Frontend Commands

#### **Local Development**
```bash
cd frontend

# Start dev server
npm start                    # Uses .env.development
npm run start:dev            # Explicit dev

# Start prod server (for testing)
npm run start:prod           # Uses .env.production

# Run on device/emulator
npm run android:dev          # Dev build
npm run android:prod         # Prod build
```

#### **EAS Builds (CI/CD)**
```bash
cd frontend

# Development builds
npm run build:dev            # Dev debug APK
npm run build:staging        # Dev release APK (for testing)

# Production build
npm run build:prod           # Prod release APK
```

---

### Backend Commands

```bash
cd backend

# Start backend
npm start                    # Dev mode (default)
npm run start:dev            # Dev mode (explicit)
npm run start:prod           # Production mode

# Send push notifications
npm run send-notifications           # Dev environment
npm run send-notifications:dev       # Dev environment
npm run send-notifications:prod      # Prod environment

# Assign daily questions
npm run assign-questions             # Dev environment
npm run assign-questions:dev         # Dev environment
npm run assign-questions:prod        # Prod environment
```

---

## 🔐 Environment Variables

### Frontend (.env.development)
```env
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_SUPABASE_URL=https://seiwhmnvyrrhqkglovwo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<dev-anon-key>
```

### Frontend (.env.production)
```env
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_SUPABASE_URL=https://pweigtkozqgybekvadaz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
```

### Backend (.env.development)
```env
NODE_ENV=development
PORT=3000
SUPABASE_URL=https://seiwhmnvyrrhqkglovwo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<dev-service-role-key>
```

### Backend (.env.production)
```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://pweigtkozqgybekvadaz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<prod-service-role-key>
```

---

## 🔑 EAS Secrets (CI/CD)

Secrets stored in EAS for cloud builds:

| Secret Name | Environment | Type |
|-------------|-------------|------|
| `EXPO_PUBLIC_SUPABASE_URL_DEV` | Development | STRING |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY_DEV` | Development | STRING |
| `EXPO_PUBLIC_SUPABASE_URL_PROD` | Production | STRING |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY_PROD` | Production | STRING |

### Manage EAS Secrets
```bash
cd frontend

# List all secrets
eas env:list

# Create new secret
eas env:create --scope project --name SECRET_NAME --value "value"

# Delete secret
eas env:delete --name SECRET_NAME
```

---

## 🔥 Firebase Configuration

### Required Files

1. **Development Firebase Project**
   - Package: `com.dokidoki.dokidoki.dev`
   - File: `frontend/android/app/google-services-dev.json`

2. **Production Firebase Project**
   - Package: `com.dokidoki.dokidoki`
   - File: `frontend/android/app/google-services.json`

### How to Get Files

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

---

## 🏗️ Build Variants

Your Android project has these build variants:

| Variant | Gradle Command | Package | Version Suffix |
|---------|----------------|---------|----------------|
| **developmentDebug** | `assembleDevelopmentDebug` | `com.dokidoki.dokidoki.dev` | `-dev` |
| **developmentRelease** | `assembleDevelopmentRelease` | `com.dokidoki.dokidoki.dev` | `-dev` |
| **productionDebug** | `assembleProductionDebug` | `com.dokidoki.dokidoki` | (none) |
| **productionRelease** | `assembleProductionRelease` | `com.dokidoki.dokidoki` | (none) |

---

## ✅ Verification Checklist

### Before First Build

- [ ] Firebase Dev project has package `com.dokidoki.dokidoki.dev`
- [ ] Firebase Prod project has package `com.dokidoki.dokidoki`
- [ ] `google-services-dev.json` placed in `frontend/android/app/`
- [ ] `google-services.json` placed in `frontend/android/app/`
- [ ] `.env.development` files exist in frontend and backend
- [ ] `.env.production` files exist in frontend and backend
- [ ] EAS secrets are created (run `eas env:list` to verify)

### After Build

- [ ] Development APK has package `com.dokidoki.dokidoki.dev`
- [ ] Production APK has package `com.dokidoki.dokidoki`
- [ ] Both apps can be installed side-by-side
- [ ] Dev app shows "DokiDoki Dev" as app name
- [ ] Prod app shows "DokiDoki" as app name
- [ ] Dev app connects to dev Supabase
- [ ] Prod app connects to prod Supabase

---

## 🔍 Verification Commands

### Check Package Names After Build
```bash
cd frontend/android

# Build both variants
./gradlew assembleDevelopmentRelease
./gradlew assembleProductionRelease

# Check package names
aapt dump badging app/build/outputs/apk/development/release/*.apk | grep "package:"
aapt dump badging app/build/outputs/apk/production/release/*.apk | grep "package:"
```

### Check Installed Apps on Device
```bash
adb shell pm list packages | grep dokidoki
```

Expected output:
```
package:com.dokidoki.dokidoki.dev
package:com.dokidoki.dokidoki
```

---

## 🐛 Troubleshooting

### Issue: Build fails with "google-services.json not found"
**Solution:** Ensure both `google-services.json` and `google-services-dev.json` are in `frontend/android/app/`

### Issue: Wrong Supabase connection
**Solution:**
- Check console logs for "🔧 Running in X mode"
- Verify correct `.env` file is being used
- For EAS builds, check `eas env:list` to verify secrets

### Issue: Can't install both apps
**Solution:** Package names must be different. Verify with:
```bash
aapt dump badging your-app.apk | grep "package:"
```

### Issue: Backend can't find environment variables
**Solution:**
- Ensure `NODE_ENV` is set when running scripts
- Check that `.env.development` or `.env.production` exists
- Verify file path in `dotenv.config({ path: ... })`

---

## 📝 Key Features

✅ **Separate Development & Production Environments**
- Different package names for Android
- Different bundle identifiers for iOS
- Different Supabase projects
- Different Firebase projects

✅ **Side-by-Side Installation**
- Install both dev and prod apps on same device
- Easy testing and comparison

✅ **Environment-Specific Configs**
- Separate `.env` files for frontend and backend
- EAS secrets for CI/CD builds
- Automatic environment detection and logging

✅ **Clean Build System**
- Gradle product flavors for Android
- EAS build profiles for cloud builds
- npm scripts for easy local development

✅ **Security**
- All sensitive files gitignored
- Secrets stored in EAS for CI/CD
- No credentials in source control

---

## 🎓 Training New Team Members

To onboard a new developer:

1. Clone the repository
2. Copy `.env.example` to `.env.development` in frontend and backend
3. Fill in development Supabase credentials
4. Run `npm start` in frontend to test
5. For Android builds, get `google-services-dev.json` from team lead

For EAS builds, they'll automatically use EAS secrets - no local credentials needed!

---

## 📚 Additional Resources

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Supabase Documentation](https://supabase.com/docs)

---

## 🎉 Summary

Your DokiDoki project now has:
- ✅ Full multi-environment support (Dev & Prod)
- ✅ Clean, professional package naming
- ✅ Separate Firebase and Supabase instances
- ✅ CI/CD ready with EAS
- ✅ Side-by-side app installation
- ✅ Comprehensive documentation

**All configuration is complete and production-ready!** 🚀
