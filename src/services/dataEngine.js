import crypto from "crypto";
import * as mysqlRepo from "./mysql/postService";

const DRIVER_TOKEN = process.env.DATABASE_PROVIDER || "MYSQL";

export const dataEngine = {
  /**
   * 📝 CREATE POST OR COMMENT WITH OPTIONAL MEDIA
   */
  createPost: async (
    payload,
    mediaData = {
      mediaUrl: null,
      fileType: "none",
      format: null,
      publicId: null,
    },
  ) => {
    // Generate a unified UUID for the node before executing the transaction
    const generatedPostId = crypto.randomUUID();

    const unifiedPayload = {
      ...payload,
      id: generatedPostId,
      forcedId: generatedPostId,
      authorName: payload.authorName || "Godswill Eguavoen",
    };

    // If configured for Firebase, handle the post AND the media attachment
    if (DRIVER_TOKEN === "FIREBASE") {
      const firebaseRepo = require("./firebase/socialMediaHandles");

      // 1. Insert the post content
      const result = await firebaseRepo.insertFirebasePost(unifiedPayload);

      // 2. If a media URL was provided (from our instant upload), sync it to the Firebase posts collection
      if (mediaData.mediaUrl) {
        const { db } = require("@/lib/firebase");
        const { doc, setDoc } = require("firebase/firestore");
        await setDoc(
          doc(db, "posts", generatedPostId),
          {
            mediaUrl: mediaData.mediaUrl,
            updatedAt: new Date(),
          },
          { merge: true },
        );
      }

      return result;
    }
    if (DRIVER_TOKEN !== "FIREBASE") {
      // Explicitly add media_url to the payload so the repository can see it
      const mysqlPayload = {
        ...unifiedPayload,
        media_url: mediaData.mediaUrl,
        public_id: mediaData.publicId,
        file_type: mediaData.fileType, // Send this to MySQL
        format: mediaData.format, // Send this to MySQL
      };

      await mysqlRepo.insertMysqlPost(mysqlPayload);
      return { success: true, insertId: generatedPostId };
    }

    // // Default to dynamic MySQL connection
    // await mysqlRepo.insertMysqlPost(unifiedPayload);
    // return { success: true, insertId: generatedPostId };
  },

  /**
   * ❤️ TOGGLE LIKE
   */
  toggleLike: async (userId, postId) => {
    if (DRIVER_TOKEN === "FIREBASE") {
      const firebaseRepo = require("./firebase/socialMediaHandles");
      return await firebaseRepo.toggleFirebaseLike(userId, postId);
    }
    return await mysqlRepo.toggleMysqlLike(userId, postId);
  },

  /**
   * 📬 GET TIMELINE FEEDS
   */
  getTimeline: async (userId) => {
    if (DRIVER_TOKEN === "FIREBASE") {
      const firebaseRepo = require("./firebase/socialMediaHandles");
      return await firebaseRepo.fetchFirebaseTimeline(userId);
    }
    return await mysqlRepo.fetchMysqlTimeline(userId);
  },

  /**
   * 🔍 FETCH SINGLE RECORD BY ID
   */
  getPostById: async (postId) => {
    if (DRIVER_TOKEN === "FIREBASE") {
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const docRef = doc(db, "posts", String(postId));
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    }

    // Dynamic MySQL Selection Engine
    const { query } = await import("@/lib/db");
    const rows = await query("SELECT * FROM posts WHERE id = ?", [postId]);
    if (!rows || rows.length === 0) return null;
    return rows[0];
  },

  /**
   * 💬 FETCH COMMENTS AND SUB-REPLIES
   */
  getComments: async (parentId) => {
    if (DRIVER_TOKEN === "FIREBASE") {
      const firebaseRepo = require("./firebase/socialMediaHandles");
      return await firebaseRepo.fetchFirebaseComments(parentId);
    }
    return await mysqlRepo.fetchMysqlComments(parentId);
  },

  /**
   * 🗑️ CLEAN RELATIONAL DELETION ENGINE
   */
  async deletePostOrComment(id) {
    try {
      if (DRIVER_TOKEN === "FIREBASE") {
        const { db: firebaseDb } = require("@/lib/firebase");
        const { doc, deleteDoc } = require("firebase/firestore");
        await deleteDoc(doc(firebaseDb, "posts", id));
        return { success: true };
      }

      // Handle pure relational table drops (No more crashing on missing commentsCount column!)
      const { query } = require("@/lib/db");
      await query("DELETE FROM posts WHERE id = ?", [id]);

      return { success: true };
    } catch (err) {
      console.error("❌ DataEngine Deletion Pipeline Failure:", err.message);
      throw new Error(`Engine Deletion Write Failure: ${err.message}`);
    }
  },

  /**
   * 🔍 FETCH COMMENTS FOR A SPECIFIC POST ONLY
   */
  getPostComments: async (postId) => {
    if (DRIVER_TOKEN === "FIREBASE") {
      const firebaseRepo = require("./firebase/socialMediaHandles");
      return await firebaseRepo.fetchFirebaseComments(postId);
    }
    return await mysqlRepo.fetchCommentsByPostId(postId);
  },

  // Add this to your dataEngine
  tagUserInPost: async (postId, mentionedUserId) => {
    if (DRIVER_TOKEN === "FIREBASE") {
      const { db } = require("@/lib/firebase");
      const { doc, setDoc } = require("firebase/firestore");
      // Create a mention document in Firebase
      await setDoc(doc(db, "mentions", `${postId}_${mentionedUserId}`), {
        postId,
        mentionedUserId,
        createdAt: new Date(),
      });
    }
    // MySQL logic can be skipped for mentions if you prefer speed
  },
};
