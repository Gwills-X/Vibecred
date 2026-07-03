import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  increment,
} from "firebase/firestore";

/**
 * 1. User Profile Setup (Social State)
 */
export async function updateUserProfile(userId, { name, profilePicUrl }) {
  const userDocRef = doc(db, "users", String(userId));
  await setDoc(
    userDocRef,
    {
      name,
      profilePicUrl, // The pointer to Firebase Storage
      updatedAt: new Date(),
    },
    { merge: true },
  );
}

/**
 * 2. Post Social State & Media Tracking
 */
export async function syncPostMedia(postId, { mediaUrls = [] }) {
  const postDocRef = doc(db, "posts", String(postId));
  await setDoc(
    postDocRef,
    {
      mediaUrls, // Array of strings: ["gs://...", "url1", "url2"]
      likesCount: 0,
      commentsCount: 0,
    },
    { merge: true },
  );
}

/**
 * 3. Follow/Unfollow Engine
 */
export async function toggleFollow(followerId, targetUserId) {
  const followDocRef = doc(db, "follows", `${followerId}_${targetUserId}`);
  const snap = await getDoc(followDocRef);

  if (snap.exists()) {
    await deleteDoc(followDocRef);
    return { following: false };
  } else {
    await setDoc(followDocRef, {
      followerId,
      targetUserId,
      createdAt: new Date(),
    });
    return { following: true };
  }
}
