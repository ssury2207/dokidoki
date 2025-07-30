import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

const db = getFirestore();
const ARCHIVE_KEY = 'archive_questions';
const ARCHIVE_META = 'archive_questions_meta';

export async function getArchiveQuestions() {
  const today = new Date().toISOString().substring(0, 10);

  // Get local meta: { maxDate, lastCheckedDate }
  const metaRaw = await AsyncStorage.getItem(ARCHIVE_META);
  let meta = { maxDate: '', lastCheckedDate: '' };
  if (metaRaw) meta = JSON.parse(metaRaw);

  // If we already checked Firestore today, just use cached questions
  if (meta.lastCheckedDate === today) {
    const cached = await AsyncStorage.getItem(ARCHIVE_KEY);
    if (cached) return JSON.parse(cached);
    // If for some reason cache is missing, fall through to Firestore fetch
  }

  // Else, fetch fresh from Firestore
  const q = query(collection(db, "daily_mains_questions"), orderBy("date", "desc"));
  const qsnap = await getDocs(q);
  if (qsnap.empty) return [];

  const newest = qsnap.docs[0].data().date;
  const result = qsnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Save results and update meta with today's lastCheckedDate
  await AsyncStorage.setItem(ARCHIVE_KEY, JSON.stringify(result));
  await AsyncStorage.setItem(ARCHIVE_META, JSON.stringify({
    maxDate: newest,
    lastCheckedDate: today
  }));

  return result;
}
