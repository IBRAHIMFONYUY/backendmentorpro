import { initializeApp, getApps, getApp } from "firebase/app";

// IMPORTANT: Do not import auth/firestore/analytics at module scope to avoid SSR errors
// Those SDKs should only be used in the browser. Consumers can import and call
// getAuth/getFirestore/getAnalytics within client components as needed.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize or reuse Firebase App instance (safe for SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
