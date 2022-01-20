// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSYPVaoJya0ypZB0VAlrsX2tG8rwnr0S4",
  authDomain: "fir-react-upload-308e0.firebaseapp.com",
  projectId: "fir-react-upload-308e0",
  storageBucket: "fir-react-upload-308e0.appspot.com",
  messagingSenderId: "76235303487",
  appId: "1:76235303487:web:0bb9b9b3f1c5a2527fa68a",
  measurementId: "G-ZNJL3LLEL0"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);

// Export storage
const storage = getStorage(firebase);
export { storage, firebase as default };