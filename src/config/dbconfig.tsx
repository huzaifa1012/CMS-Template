// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyDMv1oJveoWhwI5WzQsnklqs_v5cdEX7hg',
//   authDomain: 'imperiallook-spa.firebaseapp.com',
//   projectId: 'imperiallook-spa',
//   storageBucket: 'imperiallook-spa.appspot.com',
//   messagingSenderId: '241078312480',
//   appId: '1:241078312480:web:75a6c69454c509ec3e6645',
// };

const firebaseConfig = {
  apiKey: "AIzaSyCdKZN8Mcdx2VtyenMtoQi9nMl1qYfcyAU",
  authDomain: "imperial-look-saloon.firebaseapp.com",
  projectId: "imperial-look-saloon",
  storageBucket: "imperial-look-saloon.appspot.com",
  messagingSenderId: "641255691136",
  appId: "1:641255691136:web:59d13457c08c7d98afa765"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
