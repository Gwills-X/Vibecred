"use server";

import getAuthUser from "@/lib/getAuthUser";
import { BlogPostFormScheme } from "@/lib/rules";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dataEngine } from "@/services/dataEngine";

/**
 * Server Action to handle new blog post submissions.
 */
export async function createPosts(state, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const title = formData.get("title");
  const content = formData.get("content");

  const validatedFields = BlogPostFormScheme.safeParse({ title, content });
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      title,
      content,
    };
  }

  try {
    const fallbackAuthorName = user.name || user.username || "Godswill Ayuba";

    const result = await dataEngine.createPost({
      authorId: String(user.userId),
      authorName: fallbackAuthorName, // 🚀 Verified property transfer
      title: title || null,
      content: content,
      parentId: null,
    });

    console.log("Post creation cycle finalized with ID:", result.insertId);
  } catch (error) {
    // ...
    console.error("Database Processing Error:", error);
    return {
      success: false,
      errors: {
        server: ["Something went wrong with the active database environment."],
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * Server Action to handle modifying existing blog posts.
 */
export async function updatePostAction(postId, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const title = formData.get("title");
  const content = formData.get("content");

  const validatedFields = BlogPostFormScheme.safeParse({ title, content });
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // 🌟 Replaced raw SELECT SQL with engine execution path
    const post = await dataEngine.getPostById(postId);

    if (!post) {
      return {
        success: false,
        errors: {
          server: [
            "The targeted post instance does not exist in the database.",
          ],
        },
      };
    }

    // 🕒 30-Minute Grace Period Validation
    const createdAtTime = new Date(post.createdAt).getTime();
    const currentTime = new Date().getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;

    if (currentTime - createdAtTime > thirtyMinutesInMs) {
      return {
        success: false,
        errors: {
          server: ["The 30-minute edit window for this post has expired."],
        },
      };
    }

    if (String(post.authorId) !== String(user.userId)) {
      return {
        success: false,
        errors: {
          server: [
            `Access denied. You do not have permission to modify this post.${post.authorId}`,
          ],
        },
      };
    }

    // 🌟 Replaced raw UPDATE SQL with engine execution path
    await dataEngine.updatePost(postId, { title, content });
  } catch (error) {
    console.error("Database Modification Processing Error:", error);
    return {
      success: false,
      errors: {
        server: ["Something went wrong while overwriting the database record."],
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/show/${postId}`);
  redirect(`/posts/show/${postId}`);
}

/**
 * Server Action to securely delete a blog post.
 */
export async function deletePostAction(postId) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  try {
    // 🌟 Replaced raw SELECT SQL with engine execution path
    const post = await dataEngine.getPostById(postId);

    if (!post) {
      return {
        success: false,
        errors: {
          server: [
            "The targeted post instance does not exist in the database.",
          ],
        },
      };
    }

    if (String(post.authorId) !== String(user.userId)) {
      return {
        success: false,
        errors: {
          server: [
            "Access denied. You do not have permission to delete this post.",
          ],
        },
      };
    }

    // 🌟 Replaced raw DELETE SQL with engine execution path
    await dataEngine.deletePost(postId);
  } catch (error) {
    console.error("Database Deletion Processing Error:", error);
    return {
      success: false,
      errors: {
        server: ["Something went wrong while modifying the database record."],
      },
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * Server Action to handle toggling a post like status securely
 */
export async function handleToggleLike(postId) {
  try {
    const user = await getAuthUser();
    if (!user)
      return {
        success: false,
        error: "Authentication required to like posts.",
      };

    const result = await dataEngine.toggleLike(String(user.userId), postId);

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, liked: result.liked };
  } catch (error) {
    console.error("Action error processing interaction:", error.message);
    return { success: false, error: "Database interaction sequence failed." };
  }
}
