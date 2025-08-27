import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";

const db = getFirestore();
const ARCHIVE_MAINS_KEY = 'archive_mains_questions';
const ARCHIVE_PRELIMS_KEY = 'archive_prelims_questions';
const ARCHIVE_META = 'archive_questions_meta';

export async function getArchiveQuestions() {
  const today = new Date().toISOString().substring(0, 10);

  // Get local meta: { maxDate, lastCheckedDate }
  const metaRaw = await AsyncStorage.getItem(ARCHIVE_META);
  let meta = { maxDate: '', lastCheckedDate: '' };
  if (metaRaw) meta = JSON.parse(metaRaw);

  // If we already checked Firestore today, just use cached questions
  if (meta.lastCheckedDate === today) {
    const cachedMains = await AsyncStorage.getItem(ARCHIVE_MAINS_KEY);
    const cachedPrelims = await AsyncStorage.getItem(ARCHIVE_PRELIMS_KEY);
    if(cachedMains && cachedPrelims){
      return {
        mains: JSON.parse(cachedMains),
        prelims: JSON.parse(cachedPrelims),
      };
    }
    
    // If for some reason cache is missing, fall through to Firestore fetch
  }

  // Else, fetch fresh from Firestore
  // Fetch Mains
  const mainsQ = query(collection(db, "daily_mains_questions"), orderBy("date", "desc"));
  const mainsSnap = await getDocs(mainsQ);
  const mainsResult = mainsSnap.empty ? [] : mainsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const newestMains = mainsSnap.empty ? '' : mainsSnap.docs[0].data().date;

  // Fetch Prelims
  const prelimsQ = query(collection(db, "daily_prelims_questions"), orderBy("date", "desc"));
  const prelimsSnap = await getDocs(prelimsQ);
  const prelimsResult = prelimsSnap.empty ? [] : prelimsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const newestPrelims = prelimsSnap.empty ? '' : prelimsSnap.docs[0].data().date;

  // Save results and update meta with today's lastCheckedDate
  await AsyncStorage.setItem(ARCHIVE_MAINS_KEY, JSON.stringify(mainsResult));
  await AsyncStorage.setItem(ARCHIVE_PRELIMS_KEY, JSON.stringify(prelimsResult));
  await AsyncStorage.setItem(ARCHIVE_META, JSON.stringify({
    maxDate: {
      mains: newestMains,
      prelims: newestPrelims,
    },
    lastCheckedDate: today
  }));

  return {
    mains: mainsResult,
    prelims: prelimsResult,
  };
}
