import { initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBrsvb3JFXkbeYzMPjdcTOyFB749_gYh0s',
  authDomain: 'dokidoki-3d9ea.firebaseapp.com',
  projectId: 'dokidoki-3d9ea',
  storageBucket: 'dokidoki-3d9ea.firebasestorage.app',
  messagingSenderId: '594818514981',
  appId: '1:594818514981:web:40b3a5db81fa67fdd43fcc',
  measurementId: 'G-75RKX9M952',
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
const getReactNativePersistence = (firebaseAuth as any)
  .getReactNativePersistence;

export const auth = (firebaseAuth as any).initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
