import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const db = getFirestore();

export async function checkSubmissions(date?: string) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error('User not logged in');
      throw new Error('User not logged in');
    }

    const submissionDate = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const prePath = `submissions.pre.${submissionDate}`;
    const mainsPath = `submissions.mains.${submissionDate}`;

    // console.log(`Fetching submissions for : ${submissionDate}`);

    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.warn(`User document not found for UID: ${uid}`);
      return { pre: null, mains: null };
    }

    const preData = snap.get(prePath) ?? null;
    const mainsData = snap.get(mainsPath) ?? null;

    // console.log(`Prelims data:`, preData);
    // console.log(`Mains data:`, mainsData);

    return { pre_submitted_data: preData, mains_submitted_data: mainsData };
  } catch (error) {
    console.error(`Error checking submissions:`, error);
    throw error;
  }
}
