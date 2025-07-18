import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./environment";
import logger from "./logger";

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (getApps().length === 0) {
      const serviceAccount = {
        projectId: env.FIREBASE_PROJECT_ID,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
      };

      initializeApp({
        credential: cert(serviceAccount),
        projectId: env.FIREBASE_PROJECT_ID,
      });

      logger.info("Firebase Admin SDK initialized successfully");
    }
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
};

initializeFirebase();

export const firebaseAuth = getAuth();

export default firebaseAuth;
