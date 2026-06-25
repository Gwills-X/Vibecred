import { query } from "@/lib/db";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function migrateMysqlToFirebase() {
  try {
    console.log("🚀 Initializing Global Database Synchronization...");

    // 1. MIGRATE USERS
    const mysqlUsers = await query(
      "SELECT id, name, email, created_at AS createdAt FROM users",
    );
    console.log(`📦 Found ${mysqlUsers.length} users in MySQL. Migrating...`);

    for (const user of mysqlUsers) {
      const userDocRef = doc(db, "users", String(user.id));
      await setDoc(userDocRef, {
        id: String(user.id),
        username: user.name,
        email: user.email,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : new Date().toISOString(),
      });
    }

    // 2. MIGRATE POSTS
    const mysqlPosts = await query(
      "SELECT id, title, content, authorId, author AS authorName, created_at AS createdAt FROM posts",
    );
    console.log(`📦 Found ${mysqlPosts.length} posts in MySQL. Migrating...`);

    for (const post of mysqlPosts) {
      const postDocRef = doc(db, "posts", String(post.id));
      await setDoc(postDocRef, {
        id: String(post.id),
        title: post.title || null,
        content: post.content,
        authorId: String(post.authorId),
        authorName: post.authorName || "VibeCred Member",
        createdAt: post.createdAt
          ? new Date(post.createdAt).toISOString()
          : new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
      });
    }

    // 3. MIGRATE LIKES (🚀 Removed 'id' from query selection)
    const mysqlLikes = await query(
      "SELECT user_id AS userId, post_id AS postId FROM likes",
    );
    console.log(
      `📦 Found ${mysqlLikes.length} relational reactions. Syncing junctions...`,
    );

    for (const like of mysqlLikes) {
      const likeDocId = `${like.userId}_${like.postId}`;
      const likeDocRef = doc(db, "likes", likeDocId);
      await setDoc(likeDocRef, {
        userId: String(like.userId),
        postId: String(like.postId),
      });
    }

    // 4. MIGRATE FOLLOWS (🚀 Removed 'id' from query selection)
    const mysqlFollows = await query(
      "SELECT follower_id AS followerId, following_id AS followingId FROM follows",
    );
    console.log(
      `📦 Found ${mysqlFollows.length} follow relationships. Syncing...`,
    );

    for (const follow of mysqlFollows) {
      const followDocId = `${follow.followerId}_${follow.followingId}`;
      const followDocRef = doc(db, "follows", followDocId);
      await setDoc(followDocRef, {
        followerId: String(follow.followerId),
        followingId: String(follow.followingId),
      });
    }

    console.log(
      "✅ Database Sync Complete! All 4 core schemas fully copied to Firestore.",
    );
    return {
      success: true,
      usersMigrated: mysqlUsers.length,
      postsMigrated: mysqlPosts.length,
      likesMigrated: mysqlLikes.length,
      followsMigrated: mysqlFollows.length,
    };
  } catch (error) {
    console.error(
      "❌ Migration Engine registered a critical failure:",
      error.message,
    );
    return { success: false, error: error.message };
  }
}
