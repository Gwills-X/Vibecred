import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  increment,
} from "firebase/firestore";

/**
 * Persists content strings straight to Cloud Firestore NoSQL
 * Supports an optional explicit id for historical MySQL data syncing pipelines
 */

/**
 * Persists content strings straight to Cloud Firestore NoSQL
 * Atomically manages parent metrics if creating a reply node thread
 */
export async function insertFirebasePost({
  id = null,
  forcedId = null,
  authorId,
  title = null,
  content,
  parentId = null,
  authorName = null,
}) {
  try {
    const postsCollectionRef = collection(db, "posts");
    const effectiveId = forcedId || id;

    const docRef = effectiveId
      ? doc(postsCollectionRef, String(effectiveId))
      : doc(postsCollectionRef);

    const payload = {
      id: docRef.id,
      authorId,
      authorName: authorName || "VibeCred Professional",
      title,
      content,
      parentId: parentId ? String(parentId) : null, // Ensure parentId string mapping matches queries
      isRepost: false,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
    };

    // 1. Write the current Post/Comment document record
    await setDoc(docRef, payload);

    // 2. 🌟 CRITICAL REPAIR: If it's a comment, atomically bump the parent counter!
    if (parentId) {
      const parentPostDocRef = doc(db, "posts", String(parentId));
      await updateDoc(parentPostDocRef, {
        commentsCount: increment(1),
      }).catch((err) => {
        console.warn(
          "⚠️ Parent post record target omitted during atomic tracking loop:",
          err.message,
        );
      });
    }

    return { success: true, insertId: docRef.id };
  } catch (error) {
    console.error("❌ Firebase Document Insertion Fault:", error);
    throw error;
  }
}

/**
 * Fast-toggles explicit item tracking keys and atomically updates total counter metrics
 */
export async function toggleFirebaseLike(userId, postId) {
  try {
    const uniqueLikeId = `${userId}_${postId}`;
    const likeDocRef = doc(db, "likes", uniqueLikeId);
    const postDocRef = doc(db, "posts", String(postId));

    const docSnapshot = await getDoc(likeDocRef);

    if (docSnapshot.exists()) {
      // Revert interaction state atomically
      await deleteDoc(likeDocRef);
      await updateDoc(postDocRef, { likesCount: increment(-1) });
      return { liked: false };
    } else {
      // Write new interaction junction document mapping
      await setDoc(likeDocRef, {
        userId: String(userId),
        postId: String(postId),
        createdAt: new Date(),
      });
      await updateDoc(postDocRef, { likesCount: increment(1) });
      return { liked: true };
    }
  } catch (error) {
    console.error("❌ Firebase Toggle Engine Fault:", error);
    throw error;
  }
}

/**
 * Fetches and flattens your document matrices into the standard object contract shape
 */
export async function fetchFirebaseTimeline(currentUserId = null) {
  try {
    const q = query(
      collection(db, "posts"),
      where("parentId", "==", null),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const unifiedPosts = [];

    for (const postDoc of querySnapshot.docs) {
      const data = postDoc.data();
      const postId = postDoc.id;
      let hasLiked = false;

      // 1. Double check like interactions safely
      if (currentUserId) {
        const likeDocRef = doc(db, "likes", `${currentUserId}_${postId}`);
        const likeSnapshot = await getDoc(likeDocRef).catch(() => null);
        hasLiked = likeSnapshot ? likeSnapshot.exists() : false;
      }

      // 2. 🌟 SAFELY PARSE FIRESTORE TIMESTAMPS OR PLAIN DATES
      let formattedDate = new Date().toISOString();
      if (data.createdAt) {
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          formattedDate = data.createdAt.toDate().toISOString();
        } else if (data.createdAt && data.createdAt.seconds) {
          // Fallback if it's a raw serialised JSON timestamp object
          formattedDate = new Date(data.createdAt.seconds * 1000).toISOString();
        } else {
          // Fallback if it's already a standard string or Date object
          formattedDate = new Date(data.createdAt).toISOString();
        }
      }

      unifiedPosts.push({
        id: String(postId),
        title: data.title || "Untitled Pulse",
        content: data.content || "",
        authorId: data.authorId || "Unknown",
        authorName: data.authorName || "VibeCred Professional",
        createdAt: formattedDate,
        parentId: null,
        isRepost: !!data.isRepost,
        likesCount: Number(data.likesCount || 0),
        commentsCount: Number(data.commentsCount || 0), // 🚀 Feeds your live comment metrics directly!
        hasLiked: hasLiked,
      });
    }

    return unifiedPosts;
  } catch (error) {
    console.error("❌ Firebase Timeline Processing Fault:", error);
    return []; // Return empty array instead of crashing your whole UI page layout
  }
}
/**
 * Fetches a single post instance out of Cloud Firestore by its Document ID with live user tracking checked updates
 */
export async function fetchFirebasePostById(postId, currentUserId = null) {
  try {
    const docRef = doc(db, "posts", String(postId));
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) return null;

    const data = docSnapshot.data();
    let hasLiked = false;

    if (currentUserId) {
      const likeDocRef = doc(db, "likes", `${currentUserId}_${postId}`);
      const likeSnapshot = await getDoc(likeDocRef);
      hasLiked = likeSnapshot.exists();
    }

    let formattedDate = new Date().toISOString();
    if (data.createdAt) {
      formattedDate =
        typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : new Date(data.createdAt).toISOString();
    }

    return {
      id: String(docSnapshot.id),
      title: data.title || null,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName || "VibeCred Professional",
      createdAt: formattedDate,
      likesCount: Number(data.likesCount || 0),
      hasLiked: hasLiked,
      commentsCount: Number(data.commentsCount || 0),
    };
  } catch (error) {
    console.error("❌ Firebase Single Fetch Operational Fault:", error.message);
    throw error;
  }
}

/**
 * Modifies an existing post document field mapping inside Cloud Firestore
 */
export async function modifyFirebasePost(postId, { title, content }) {
  try {
    const docRef = doc(db, "posts", String(postId));
    await setDoc(docRef, { title, content }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("❌ Firebase Document Modification Fault:", error.message);
    throw error;
  }
}

/**
 * Removes an existing post document instantly by its unique reference path
 */
export async function removeFirebasePost(postId) {
  try {
    const docRef = doc(db, "posts", String(postId));
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("❌ Firebase Document Deletion Fault:", error.message);
    throw error;
  }
}

export async function fetchFirebaseComments(parentId) {
  try {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("parentId", "==", String(parentId)),
      orderBy("createdAt", "asc"),
    );

    const snapshot = await getDocs(q);
    const comments = [];
    snapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error("❌ Firebase Comments Fetch Fault:", error);
    throw error;
  }
}
