// server/testConnection.ts

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

// Load environment-specific variables
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), `../.env.${nodeEnv}`)
});

// Reconstruct __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Firebase key path from environment variable
const firebaseKeyPath = process.env.FIREBASE_KEY_PATH || './firebase-key-dev.json';
const serviceAccountPath = resolve(__dirname, firebaseKeyPath);

console.log(`🔧 Firebase: Loading config from ${firebaseKeyPath} (${nodeEnv} mode)`);

// Read and parse service account
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
} catch (error) {
  console.error(`❌ Error loading Firebase config from ${serviceAccountPath}:`, error.message);
  throw new Error(`Firebase configuration file not found: ${serviceAccountPath}`);
}

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log(`✅ Firebase initialized for project: ${serviceAccount.project_id}`);
}

const db = admin.firestore();
export { db, admin };
