// assignDailyQuestion.js (ESM-safe, Firestore upload)

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Construct __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account from firebase-key.json
const serviceAccountPath = resolve(__dirname, 'config/firebase-key.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase if not already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function assignDailyQuestion() {
  const today = new Date().toISOString().substring(0, 10);

  const todayDoc = await db
    .collection('daily_mains_questions')
    .doc(today)
    .get();

  if (todayDoc.exists) {
    console.log('A question is already assigned for today.');
    return;
  }

  const usedDocs = await db.collection('daily_mains_questions').get();
  const usedIds = usedDocs.docs.map((doc) => doc.data().questionId);

  const allQs = (await db.collection('questions').get()).docs;
  const candidates = allQs.filter((q) => !usedIds.includes(q.id));

  if (!candidates.length) {
    throw new Error('No unused questions remaining!');
  }

  const qDoc = candidates[Math.floor(Math.random() * candidates.length)];
  const qData = qDoc.data();

  await db.collection('daily_mains_questions').doc(today).set({
    date: today,
    questionId: qDoc.id,
    Question: qData.Question,
    Paper: qData.Paper,
    Year: qData.Year,
    Marks: qData.Marks,
    Code: qData.Code,
  });

  console.log('Assigned new daily question for', today, ':', qDoc.id);
}

assignDailyQuestion().catch(console.error);
