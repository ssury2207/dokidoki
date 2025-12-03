const dotenv = require('dotenv');
const path = require('path');

// Determine which environment to load
const APP_ENV = process.env.APP_ENV || 'development';
const envFile = APP_ENV === 'production' ? '.env.production' : '.env.development';

// Load the appropriate .env file
dotenv.config({ path: path.resolve(__dirname, envFile) });

console.log(`📋 app.config.js: Loading ${envFile}`);
console.log(`📋 APP_ENV: ${APP_ENV}`);

const IS_DEV = APP_ENV === 'development';

module.exports = {
  expo: {
    name: IS_DEV ? 'DokiDoki Dev' : 'DokiDoki',
    slug: 'dokidoki',
    version: '1.5.0',
    orientation: 'portrait',
    icon: './assets/icon-dokidoki.png',
    scheme: 'frontend',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    entryPoint: './index.tsx',
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV
        ? 'com.dokidoki.dev'
        : 'com.dokidoki.prod'
    },
    android: {
      package: IS_DEV
        ? 'com.dokidoki.dev.dokidoki.dev'
        : 'com.dokidoki.dev.dokidoki',
      versionCode: 9,
      adaptiveIcon: {
        foregroundImage: './assets/icon-dokidoki.png',
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true,
      intentFilters: [
        {
          action: 'android.intent.action.VIEW',
          data: {
            scheme: 'mailto'
          }
        }
      ],
      permissions: ['NOTIFICATIONS'],
      googleServicesFile: IS_DEV
        ? './google-services-dev.json'
        : './google-services.json'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/icon-dokidoki.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/icon-dokidoki.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ],
      [
        'expo-notifications',
        {
          icon: './assets/icon-dokidoki.png',
          color: '#00ADB5'
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: '9ba5a170-c777-4ade-a551-bb0f536c53b2'
      }
    }
  }
};
