import { query } from "@/lib/db";

/**
 * Inserts a new top-level post or conversational thread reply into MySQL
 */

export async function insertMysqlPost({
  id,
  authorId,
  authorName,
  title,
  content,
  parentId,
}) {
  const sql = `
    INSERT INTO posts (id, authorId, author, title, content, parent_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await query(sql, [id, authorId, authorName, title, content, parentId]);
  return { success: true, insertId: id };
}
/**
 * Toggles an active post reaction state inside the MySQL junction table
 */
export async function toggleMysqlLike(userId, postId) {
  try {
    const rows = await query(
      "SELECT * FROM likes WHERE user_id = ? AND post_id = ?",
      [userId, postId],
    );

    if (rows && rows.length > 0) {
      await query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [
        userId,
        postId,
      ]);
      return { liked: false };
    } else {
      await query("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [
        userId,
        postId,
      ]);
      return { liked: true };
    }
  } catch (error) {
    console.error("❌ MySQL Like Operational Fault:", error.message);
    throw error;
  }
}

/**
 * Aggregates and filters the main top-level chronological home timeline
 */
export async function fetchMysqlTimeline(currentUserId) {
  try {
    const sql = `
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.authorId, 
        p.author AS authorName,
        p.created_at AS createdAt,
        COUNT(DISTINCT l.user_id, l.post_id) AS likesCount,
        SUM(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) AS hasLiked,
        -- 💬 Correlated Subquery to dynamically count child reply rows inside your posts registry
        (SELECT COUNT(*) FROM posts c WHERE c.parent_id = p.id) AS commentsCount
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.parent_id IS NULL
      GROUP BY 
        p.id, 
        p.title, 
        p.content, 
        p.authorId, 
        p.author,
        p.created_at
      ORDER BY p.created_at DESC
    `;
    const rows = await query(sql, [currentUserId]);

    return rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      content: row.content,
      authorId: row.authorId,
      authorName: row.authorName || "VibeCred Professional",
      createdAt: row.createdAt
        ? new Date(row.createdAt).toISOString()
        : new Date().toISOString(),
      parentId: null,
      isRepost: false,
      likesCount: Number(row.likesCount || 0),
      hasLiked: Boolean(row.hasLiked > 0),
      // 💎 Pass down the aggregated calculation key cleanly to your PostCard JSX
      commentsCount: Number(row.commentsCount || 0),
    }));
  } catch (error) {
    console.error("❌ MySQL Timeline Retrieval Fault:", error.message);
    throw error;
  }
}

/**
 * 🚀 UPDATED: Fetches a single post details along with live metrics for a specific user
 */
export async function fetchMysqlPostById(postId, currentUserId = null) {
  try {
    const sql = `
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.authorId, 
        p.author AS authorName, 
        p.created_at AS createdAt,
        COUNT(l.post_id) AS likesCount,
        SUM(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) AS hasLiked
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = ?
      GROUP BY 
        p.id, 
        p.title, 
        p.content, 
        p.authorId, 
        p.author, 
        p.created_at
      LIMIT 1
    `;
    const rows = await query(sql, [currentUserId, postId]);

    // 1. Return null safely if no matching record was found
    if (!rows || rows.length === 0 || rows[0].id === null) return null;

    const targetPost = rows[0];

    // 2. Shape the unified contract object perfectly for your page components
    return {
      id: String(targetPost.id),
      title: targetPost.title,
      content: targetPost.content,
      authorId: targetPost.authorId,
      authorName: targetPost.authorName || "VibeCred Professional",
      createdAt: targetPost.createdAt
        ? new Date(targetPost.createdAt).toISOString()
        : new Date().toISOString(),
      likesCount: Number(targetPost.likesCount || 0),
      hasLiked: Boolean(targetPost.hasLiked > 0),
      commentsCount: 0, // Hardcoded placeholder blueprint until comments engine initialization
    };
  } catch (error) {
    console.error("❌ MySQL Single Fetch Operational Fault:", error.message);
    throw error;
  }
}

/**
 * Modifies an existing post record inside your local table schema
 */
export async function modifyMysqlPost(postId, { title, content }) {
  try {
    const sql = "UPDATE posts SET title = ?, content = ? WHERE id = ?";
    return await query(sql, [title, content, postId]);
  } catch (error) {
    console.error("❌ MySQL Post Modification Fault:", error.message);
    throw error;
  }
}

/**
 * Removes an existing post record instantly via its unique index key
 */
export async function removeMysqlPost(postId) {
  try {
    return await query("DELETE FROM posts WHERE id = ?", [postId]);
  } catch (error) {
    console.error("❌ MySQL Post Deletion Fault:", error.message);
    throw error;
  }
}

export async function fetchMysqlComments() {
  try {
    // 💎 Fetches all conversational comment nodes so your front-end tree builder can link them
    const sql =
      "SELECT * FROM posts WHERE title IS NULL ORDER BY created_at ASC";
    const rows = await query(sql);
    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Comments Fetch Fault:", error.message);
    throw error;
  }
}

/**
 * 🌲 FETCH SINGLE POST TREE REPLIES ONLY
 * Safely isolates and climbs the comment tree for one specific post branch
 */
export async function fetchCommentsByPostId(postId) {
  try {
    const sql = `
      WITH RECURSIVE comment_tree AS (
        -- 1. Anchor: Get direct comments on this specific post
        SELECT * FROM posts 
        WHERE parent_id = ? AND title IS NULL
        
        UNION ALL
        
        -- 2. Recursive: Get sub-replies pointing to comments already in the tree
        SELECT p.* FROM posts p
        INNER JOIN comment_tree ct ON p.parent_id = ct.id
        WHERE p.title IS NULL
      )
      SELECT * FROM comment_tree ORDER BY created_at ASC;
    `;

    const rows = await query(sql, [postId]);
    return rows || [];
  } catch (error) {
    console.error("❌ MySQL Isolated Comments Fetch Fault:", error.message);
    throw error;
  }
}
