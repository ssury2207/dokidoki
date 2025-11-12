# Firebase Package Registration Guide

## Important: Package Names Changed!

Your Android package names have been updated to cleaner versions:

| Environment | Old Package | New Package |
|-------------|-------------|-------------|
| Development | `com.dokidoki.dev.dokidoki` | `com.dokidoki.dokidoki.dev` |
| Production | `com.dokidoki.dev.dokidoki` | `com.dokidoki.dokidoki` |

## Steps to Update Firebase Projects

### 1. Development Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **Development** project
3. Go to Project Settings (⚙️ icon)
4. Under "Your apps" section, find your Android app
5. Click on the app to edit it
6. Update the package name to: **`com.dokidoki.dokidoki.dev`**
7. Download the new `google-services.json`
8. Save it as `google-services-dev.json` in:
   ```
   frontend/android/app/google-services-dev.json
   ```

### 2. Production Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **Production** project
3. Go to Project Settings (⚙️ icon)
4. Under "Your apps" section, find your Android app
5. Click on the app to edit it
6. Update the package name to: **`com.dokidoki.dokidoki`**
7. Download the new `google-services.json`
8. Save it as `google-services.json` in:
   ```
   frontend/android/app/google-services.json
   ```

## File Placement

```
frontend/
└── android/
    └── app/
        ├── google-services.json        (Production)
        └── google-services-dev.json    (Development)
```

Both files are gitignored and will not be committed.

## Verification

After placing the files, verify they exist:

```bash
cd frontend/android/app
ls -la google-services*.json
```

Expected output:
```
google-services.json
google-services-dev.json
```

## Build System

The build system automatically uses the correct file:
- Development builds → `google-services-dev.json`
- Production builds → `google-services.json`

This is handled by the gradle task in `build.gradle`.
