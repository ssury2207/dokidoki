import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export async function fetchTodaysQuestion(date?: string) {
  const targetDate: string = date || new Date().toISOString().substring(0, 10);
  const docRef = doc(db, "daily_mains_questions", targetDate);
  const dailyDoc = await getDoc(docRef);
  return dailyDoc.exists() ? { id: dailyDoc.id, ...dailyDoc.data() } : null;
}
