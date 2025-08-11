import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export async function fetchTodaysPrelimsQuestion() {
  const today = new Date().toISOString().substring(0, 10);
  const docRef = doc(db, 'daily_prelims_questions', today);
  const dailyDoc = await getDoc(docRef);
  return dailyDoc.exists() ? { id: dailyDoc.id, ...dailyDoc.data() } : null;
}
