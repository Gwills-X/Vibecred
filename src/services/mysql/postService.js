import { query } from "@/lib/db";

/**
 * Inserts a new top-level post or conversational thread reply into MySQL.
 * Includes media_url support for images/attachments.
 */
export async function insertMysqlPost({
  id,
  authorId,
  authorName,
  title,
  content,
  parentId,
  media_url = null, // 🌟 Added media_url support
  file_type = "none", // Add this
  format = null, // Add this
}) {
  const sql = `
    INSERT INTO posts (id, authorId, author, title, content, parent_id, media_url, file_type, format) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await query(sql, [
    id,
    authorId,
    authorName,
    title,
    content,
    parentId,
    media_url,
    file_type,
    format,
  ]);
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
 * Aggregates and filters the main top-level chronological home timeline.
 * Now includes media_url.
 */
export async function fetchMysqlTimeline(currentUserId) {
  try {
    const sql = `
      SELECT 
        p.id, p.title, p.content, p.authorId, p.author AS authorName, 
        p.created_at AS createdAt, p.media_url AS mediaUrl, 
        p.file_type AS fileType, p.format AS format,
        COUNT(DISTINCT l.user_id, l.post_id) AS likesCount,
        SUM(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) AS hasLiked,
        (SELECT COUNT(*) FROM posts c WHERE c.parent_id = p.id) AS commentsCount
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.parent_id IS NULL
      GROUP BY p.id, p.title, p.content, p.authorId, p.author, p.created_at, p.media_url, p.file_type, p.format
      ORDER BY p.created_at DESC
    `;
    const rows = await query(sql, [currentUserId]);

    return rows.map((row) => ({
      ...row,
      id: String(row.id),
      // --- MAP THE NEW FIELDS ---
      fileType: row.fileType || "none",
      format: row.format,
      // --------------------------
      authorName: row.authorName || "VibeCred Professional",
      createdAt: row.createdAt
        ? new Date(row.createdAt).toISOString()
        : new Date().toISOString(),
      likesCount: Number(row.likesCount || 0),
      hasLiked: Boolean(row.hasLiked > 0),
      commentsCount: Number(row.commentsCount || 0),
    }));
  } catch (error) {
    console.error("❌ MySQL Timeline Retrieval Fault:", error.message);
    throw error;
  }
}
/**
 * Fetches a single post details along with live metrics.
 * Now includes media_url.
 */
export async function fetchMysqlPostById(postId, currentUserId = null) {
  try {
    const sql = `
      SELECT p.*, 
        COUNT(l.post_id) AS likesCount,
        SUM(CASE WHEN l.user_id = ? THEN 1 ELSE 0 END) AS hasLiked
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = ?
      GROUP BY p.id
      LIMIT 1
    `;
    const rows = await query(sql, [currentUserId, postId]);

    if (!rows || rows.length === 0 || rows[0].id === null) return null;

    const targetPost = rows[0];
    return {
      ...targetPost,
      id: String(targetPost.id),
      mediaUrl: targetPost.media_url, // 🌟 Map to clean object property
      fileType: targetPost.file_type, // 🌟 Map to clean object property
      format: targetPost.format, // 🌟 Map to clean object property
      createdAt: targetPost.created_at
        ? new Date(targetPost.created_at).toISOString()
        : new Date().toISOString(),
      likesCount: Number(targetPost.likesCount || 0),
      hasLiked: Boolean(targetPost.hasLiked > 0),
    };
  } catch (error) {
    console.error("❌ MySQL Single Fetch Operational Fault:", error.message);
    throw error;
  }
}

/**
 * Modifies an existing post record inside your local table schema.
 * Updated to allow updating media_url.
 */
export async function modifyMysqlPost(
  postId,
  { title, content, media_url = null, file_type = "none", format = null },
) {
  try {
    const sql =
      "UPDATE posts SET title = ?, content = ?, media_url = ?, file_type = ?, format = ? WHERE id = ?";
    return await query(sql, [
      title,
      content,
      media_url,
      file_type,
      format,
      postId,
    ]);
  } catch (error) {
    console.error("❌ MySQL Post Modification Fault:", error.message);
    throw error;
  }
}

/**
 * Removes an existing post record.
 */
export async function removeMysqlPost(postId) {
  try {
    return await query("DELETE FROM posts WHERE id = ?", [postId]);
  } catch (error) {
    console.error("❌ MySQL Post Deletion Fault:", error.message);
    throw error;
  }
}

/**
 * Fetches conversational comment nodes.
 */
export async function fetchMysqlComments() {
  try {
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
 * Fetches the comment tree for a specific post.
 */
export async function fetchCommentsByPostId(postId) {
  try {
    const sql = `
      WITH RECURSIVE comment_tree AS (
        SELECT * FROM posts WHERE parent_id = ? AND title IS NULL
        UNION ALL
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
