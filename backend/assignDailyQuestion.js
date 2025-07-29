// const admin = require('firebase-admin');
import admin from 'firebase-admin';
// const serviceAccount = require('./config/config.json'); // Download from Firebase Console
import serviceAccount from './config/config.json' with { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

async function assignDailyQuestion() {
  const today = new Date().toISOString().substring(0, 10);

  // Check if today's daily question exists
  const todayDoc = await db.collection('daily_mains_questions').doc(today).get();
  if (todayDoc.exists) {
    console.log('A question is already assigned for today.');
    return;
  }

  // Gather all used questionIds
  const usedDocs = await db.collection('daily_mains_questions').get();
  const usedIds = usedDocs.docs.map(doc => doc.data().questionId);

  // Get all possible questions
  const allQs = (await db.collection('questions').get()).docs;

  // Filter out used questions
  const candidates = allQs.filter(q => !usedIds.includes(q.id));
  if (!candidates.length) {
    throw new Error('No unused questions remaining!');
  }

  // Select a random question
  const qDoc = candidates[Math.floor(Math.random() * candidates.length)];
  const qData = qDoc.data();

  // Create the day's doc in daily_mains_questions
  await db.collection('daily_mains_questions').doc(today).set({
    date: today,
    questionId: qDoc.id,
    Question: qData.Question,
    Paper: qData.Paper,
    Year: qData.Year,
    Marks: qData.Marks,
    Code: qData.Code
  });

  console.log('Assigned new daily question for', today, ':', qDoc.id);
}
assignDailyQuestion().catch(console.error);
