import { query } from "@/lib/db";

export const socialEngine = {
  // 1. Get statistics for the dashboard/network page
  async getFollowStats(userId) {
    const rows = await query(
      `SELECT 
        (SELECT COUNT(*) FROM follows WHERE followed_id = ?) as followers,
        (SELECT COUNT(*) FROM follows WHERE follower_id = ?) as following`,
      [userId, userId],
    );
    return rows[0] || { followers: 0, following: 0 };
  },

  // 2. Toggle follow status
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

  // 3. Get suggested users (excludes current user)
  async getSuggestedUsers(currentUserId, limit = 5) {
    return await query(
      `SELECT u.id, u.name, u.bio, u.profile_pic_url,
       EXISTS(SELECT 1 FROM follows WHERE follower_id = ? AND followed_id = u.id) as isFollowing
       FROM users u
       WHERE u.id != ?
       ORDER BY RAND() 
       LIMIT ?`,
      [currentUserId, currentUserId, parseInt(limit, 10)],
    );
  },

  // 4. Get full profile details for the dedicated profile page
  async getUserFullProfile(userId) {
    const rows = await query(
      "SELECT id, name, bio, profile_pic_url FROM users WHERE id = ?",
      [userId],
    );
    return rows[0] || null;
  },

  // 5. Get posts for the dedicated profile page
  async getUserPosts(userId) {
    return await query(
      "SELECT id, content, created_at FROM posts WHERE authorId = ? ORDER BY created_at DESC",
      [userId],
    );
  },

  async checkIfFollowing(followerId, targetId) {
    const rows = await query(
      "SELECT id FROM follows WHERE follower_id = ? AND followed_id = ?",
      [followerId, targetId],
    );
    return rows.length > 0; // Returns true if a record exists
  },
};
