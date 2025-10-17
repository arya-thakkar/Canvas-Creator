import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCfzCfQ97YLo9e1Oaxp6BDSbPiolrKNCX0",
  authDomain: "interviewtask-3d2ca.firebaseapp.com",
  projectId: "interviewtask-3d2ca",
  storageBucket: "interviewtask-3d2ca.firebasestorage.app",
  messagingSenderId: "362202222457",
  appId: "1:362202222457:web:79eaab82c4eb6ddab4a9a8",
  measurementId: "G-H6M652E2LH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };