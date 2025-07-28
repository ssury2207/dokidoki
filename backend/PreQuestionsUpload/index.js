import { db } from '../config/firebase.js';
import fs from 'fs';

async function verifyConnection() {
  try {
    const snap = await db.collection('questions').limit(1).get();
    console.log(`✅ Connection to Firestore established.`);
    if (snap.empty) {
      console.log("Collection doesn't exists or empty");
    } else {
      console.log('You are on collection DB now');
      snap.forEach((doc) => {
        if (doc.id == '03MqMZ9WOz30jQZeluxC') {
          const myData = doc.data();
          console.log(myData);
        }
      });
    }
  } catch (err) {
    console.log(`Error has occurred ${err} inside connection Block`);
  }
}

// const rawData = fs.readFileSync('./Data/PrelimsData/CDS_PRE1.json');
// const jsonData = JSON.parse(rawData);
// const prelimsCollection = db
//   .collection('dataset')
//   .doc('prelims')
//   .collection('questions');

async function uploadJSON() {
  try {
    for (const entry of jsonData) {
      const docRef = prelimsCollection.doc(); // auto-ID
      await docRef.set({
        ...entry,
        id: docRef.id,
        dateAdded: Date.now(),
      });
      console.log(`✅ Uploaded: ${docRef.id}`);
    }

    console.log(`🎉 Done uploading ${jsonData.length} document(s).`);
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

async function main() {
  verifyConnection();
}
main();
