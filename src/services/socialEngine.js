// Change this:
// import db from "@/lib/db";

// To this (because you exported `query` as a named export):
import { query } from "@/lib/db";

export const socialEngine = {
  async getFollowStats(userId) {
    // Now use the `query` function directly
    const rows = await query(
      `SELECT 
        (SELECT COUNT(*) FROM follows WHERE followed_id = ?) as followers,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ?) as following`,
      [userId, userId],
    );
    return rows[0];
  },

  async toggleFollow(followerId, targetId) {
    const existing = await query(
      "SELECT id FROM follows WHERE follower_id = ? AND followed_id = ?",
      [followerId, targetId],
    );

    if (existing.length > 0) {
      await query("DELETE FROM follows WHERE id = ?", [existing[0].id]);
      return { status: "unfollowed" };
    } else {
      await query(
        "INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)",
        [followerId, targetId],
      );
      return { status: "followed" };
    }
  },
  // Add this method to your existing socialEngine object
  // src/services/socialEngine.js

  // src/services/socialEngine.js

  async getSuggestedUsers(currentUserId, limit = 5) {
    const numericLimit = parseInt(limit, 10);

    // This query finds users who have no match in the 'follows' table
    // where the current user is the follower.
    return await query(
      `SELECT u.id, u.name 
     FROM users u
     LEFT JOIN follows f ON u.id = f.followed_id AND f.follower_id = ?
     WHERE u.id != ? AND f.id IS NULL
     ORDER BY RAND() 
     LIMIT ?`,
      [currentUserId, currentUserId, numericLimit],
    );
  },
};
