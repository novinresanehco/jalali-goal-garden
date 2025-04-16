
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { toast } from "sonner";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Check if we have proper Firebase configuration
const isFirebaseConfigured = () => {
  const { apiKey, projectId } = firebaseConfig;
  return (
    apiKey && 
    apiKey !== "YOUR_API_KEY" && 
    !apiKey.includes("your_api_key") &&
    projectId && 
    projectId !== "YOUR_PROJECT_ID" &&
    !projectId.includes("your_project_id")
  );
};

// Initialize Firestore and export
let db;

try {
  if (!isFirebaseConfigured()) {
    console.error("Firebase configuration is missing or using placeholder values.");
    toast.error("تنظیمات Firebase ناقص است. لطفا راهنمای نصب را مطالعه کنید.");
  }
  db = getFirestore(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
  toast.error("خطا در راه‌اندازی Firebase");
}

export { db };
export default app;
