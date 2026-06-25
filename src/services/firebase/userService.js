import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Persists a synchronized user profile document straight to Firestore NoSQL
 */
export async function insertFirebaseUser(userId, { name, email }) {
  const userDocRef = doc(db, "users", String(userId));
  await setDoc(userDocRef, {
    id: String(userId),
    name,
    email,
    createdAt: new Date(),
  });
  return { success: true };
}

/**
 * Fetches user profile document data directly from Firestore by Document ID
 */
export async function fetchFirebaseUserById(userId) {
  try {
    const docRef = doc(db, "users", String(userId));
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("❌ Firebase User Fetch Fault:", error.message);
    throw error;
  }
}
