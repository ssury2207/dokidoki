import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Reconstruct __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve path to the Firebase service account key
const serviceAccountPath = resolve(__dirname, 'config/firebase-key.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function assignDailyPrelimsQuestion() {
  const today = new Date().toISOString().substring(0, 10);

  // Check if today's daily question exists
  const todayDoc = await db
    .collection('daily_prelims_questions')
    .doc(today)
    .get();

  if (todayDoc.exists) {
    console.log('A Prelims question is already assigned for today.');
    return;
  }

  // Gather all used questionIds
  const usedDocs = await db.collection('daily_prelims_questions').get();
  const usedIds = usedDocs.docs.map((doc) => doc.data().questionId);

  // Get all possible questions
  const allQs = (await db.collection('dataset/prelims/questions').get()).docs;

  // Filter out used questions
  const candidates = allQs.filter((q) => !usedIds.includes(q.id));
  if (!candidates.length) {
    throw new Error('No unused questions remaining!');
  }

  // Select a random question
  const qDoc = candidates[Math.floor(Math.random() * candidates.length)];
  const qData = qDoc.data();

  // Create the day's doc in daily_prelims_questions
  await db.collection('daily_prelims_questions').doc(today).set({
    date: today,
    questionId: qDoc.id,
    Question: qData['Question and Year'],
    Year: qData.Year,
    Chapters: qData.Chapters,
    Answer: qData.Answer,
    Explanation: qData.Explanation,
    Options: qData.Options,
    Section: qData.Section,
    Table: qData.Table,
  });

  console.log('Assigned new prelims daily question for', today, ':', qDoc.id);
}

assignDailyPrelimsQuestion().catch(console.error);
