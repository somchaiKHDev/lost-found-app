import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBKSFGDJzhSdbDecCMBPnC6tIyadWzWvLY",
  authDomain: "lost-found-app-219be.firebaseapp.com",
  projectId: "lost-found-app-219be",
  storageBucket: "lost-found-app-219be.firebasestorage.app",
  messagingSenderId: "1049550669897",
  appId: "1:1049550669897:web:da670e96751b5c62969798",
  measurementId: "G-ZFQ43EKFXD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);