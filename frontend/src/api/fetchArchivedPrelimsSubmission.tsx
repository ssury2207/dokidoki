import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const db = getFirestore();

export async function fetchArchivedPrelimsSubmission(date: string) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not logged in');

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return null;

    // Access the nested map value
    const submission = userSnap.get(`submissions.pre.${date}`);
    return submission || null;
  } catch (error) {
    console.error('Error fetching prelims submission:', error);
    throw error; // Let the screen handle the error
  }
}
