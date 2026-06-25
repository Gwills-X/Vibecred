import crypto from "crypto";
import * as mysqlRepo from "./mysql/postService";
import * as firebaseRepo from "./firebase/postService";

const DRIVER_TOKEN = process.env.DATABASE_PROVIDER || "MYSQL";

export const dataEngine = {
  createPost: async (payload) => {
    // 🚀 Generate a unified UUID for the post before writing anywhere
    const generatedPostId = crypto.randomUUID();

    const unifiedPayload = {
      ...payload,
      id: generatedPostId,
      forcedId: generatedPostId,
      authorName: payload.authorName || "Godswill Eguavoen",
    };

    if (DRIVER_TOKEN === "DUAL_WRITE") {
      await mysqlRepo.insertMysqlPost(unifiedPayload);
      try {
        await firebaseRepo.insertFirebasePost(unifiedPayload);
        console.log(
          `🟢 DataEngine: Synced Post ID ${generatedPostId} to Firebase.`,
        );
      } catch (err) {
        console.error("❌ DataEngine: Firebase sync dropped:", err.message);
      }
      return { success: true, insertId: generatedPostId };
    }

    if (DRIVER_TOKEN === "FIREBASE") {
      return await firebaseRepo.insertFirebasePost(unifiedPayload);
    }

    // Default to MYSQL standalone
    await mysqlRepo.insertMysqlPost(unifiedPayload);
    return { success: true, insertId: generatedPostId };
  },

  toggleLike: async (userId, postId) => {
    // Standard string operations pass cleanly across drivers now
    if (DRIVER_TOKEN === "DUAL_WRITE") {
      const [mysqlResult] = await Promise.all([
        mysqlRepo.toggleMysqlLike(userId, postId),
        firebaseRepo.toggleFirebaseLike(userId, postId),
      ]);
      return mysqlResult;
    }
    if (DRIVER_TOKEN === "FIREBASE")
      return await firebaseRepo.toggleFirebaseLike(userId, postId);
    return await mysqlRepo.toggleMysqlLike(userId, postId);
  },

  getTimeline: async (userId) => {
    if (DRIVER_TOKEN === "FIREBASE")
      return await firebaseRepo.fetchFirebaseTimeline(userId);
    return await mysqlRepo.fetchMysqlTimeline(userId);
  },
};
