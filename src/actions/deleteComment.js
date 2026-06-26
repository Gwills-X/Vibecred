"use server";

import { dataEngine } from "@/services/dataEngine";
import { revalidatePath } from "next/cache";

export async function deleteCommentAction(commentId, postId, currentUserId) {
  try {
    // 1. Fetch target comment via the engine to verify ownership securely
    const targetComment = await dataEngine.getPostById(
      commentId,
      currentUserId,
    );

    if (!targetComment) {
      throw new Error("Target thread node could not be located.");
    }

    if (targetComment.authorId !== currentUserId) {
      throw new Error("Unauthorized security clearance violation.");
    }

    // 2. 🌟 ROUTE MUTATION ROUTING SAFELY THROUGH THE DATA ENGINE
    // We pass the comment's id, its parentId (if it's a sub-reply), and the main postId
    await dataEngine.deletePostOrComment(
      commentId,
      targetComment.parentId,
      postId,
    );

    // 3. Clear layout caches to force an instant UI redraw update
    revalidatePath(`/posts/show/${postId}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Server Action Deletion Intercept:", err.message);
    return { success: false, error: err.message };
  }
}
