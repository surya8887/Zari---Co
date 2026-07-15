import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
      console.warn("FIREBASE_SERVICE_ACCOUNT environment variable is not set. Firebase Admin may not work correctly.");
    } else {
      const serviceAccount = JSON.parse(serviceAccountString);
      
      initializeApp({
        credential: cert(serviceAccount)
      });
      
      console.log("Firebase Admin initialized successfully.");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
}

export { getAuth };
