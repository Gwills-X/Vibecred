"use server";

import getAuthUser from "@/lib/getAuthUser";
import { BlogPostFormScheme } from "@/lib/rules";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dataEngine } from "@/services/dataEngine";

/**
 * Server Action to handle new blog post submissions and nested thread replies.
 */
export async function createPosts(prevState, formData) {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  // 1. Secure context extraction supporting both raw standard objects & FormData wrappers
  const parentId =
    formData && typeof formData.get === "function"
      ? formData.get("parent_id") || null
      : null;
  const content =
    formData && typeof formData.get === "function"
      ? formData.get("content")
      : null;
  const title = parentId
    ? null
    : formData && typeof formData.get === "function"
      ? formData.get("title") || null
      : null;

  // 2. Conditional Schema Validation Rules
  if (!parentId) {
    // Standard validation route for standalone timeline posts
    const validatedFields = BlogPostFormScheme.safeParse({ title, content });
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        title: title || "", // 🌟 Fallback to empty string instead of null
        content: content || "", // 🌟 Fallback to empty string instead of null
      };
    }
  } else {
    // Dynamic text constraint matching for comments
    if (!content || content.trim() === "") {
      return {
        success: false,
        errors: {
          content: ["Reply matrix arrays cannot be transmitted empty."],
        },
        content,
      };
    }
  }

  try {
    const fallbackAuthorName =
      user.name || user.username || "Anonymous Creator";

    // 3. Persist record across active driver channels
    await dataEngine.createPost({
      authorId: String(user.userId || user.id),
      authorName: fallbackAuthorName,
      title: title, // Saves as NULL cleanly inside altered schema fields
      content: content,
      parentId: parentId, // Correctly pins child arrays to parent post UUIDs
    });
  } catch (error) {
    console.error("Database Processing Error:", error);
    return {
      success: false,
      errors: {
        server: ["Something went wrong with the active database environment."],
      },
    };
  }

  // 4. Targeted Caching Operations & Routing Swaps
  revalidatePath("/");
  revalidatePath("/dashboard");

  if (parentId) {
    revalidatePath(`/posts/show/${parentId}`);
    return { success: true }; // Anchors caller cleanly inside the current thread view state
  } else {
    redirect("/dashboard");
  }
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
    const post = await dataEngine.getPostById(postId);
    if (!post) {
      return {
        success: false,
        errors: { server: ["The targeted post instance does not exist."] },
      };
    }

    // 30-Minute Grace Period Shield Logic
    const createdAtTime = new Date(post.createdAt || post.created_at).getTime();
    const currentTime = new Date().getTime();
    const thirtyMinutesInMs = 30 * 60 * 1000;

    if (currentTime - createdAtTime > thirtyMinutesInMs) {
      return {
        success: false,
        errors: { server: ["The 30-minute edit window has expired."] },
      };
    }

    if (String(post.authorId) !== String(user.userId || user.id)) {
      return {
        success: false,
        errors: { server: ["Access denied. Ownership validation failed."] },
      };
    }

    await dataEngine.updatePost(postId, { title, content });
  } catch (error) {
    console.error("Database Modification Error:", error);
    return {
      success: false,
      errors: { server: ["Overwriting database record failed."] },
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
    const post = await dataEngine.getPostById(postId);
    if (!post) {
      return {
        success: false,
        errors: { server: ["The targeted post instance does not exist."] },
      };
    }

    if (String(post.authorId) !== String(user.userId || user.id)) {
      return {
        success: false,
        errors: { server: ["Access denied. Ownership validation failed."] },
      };
    }

    await dataEngine.deletePost(postId);
  } catch (error) {
    console.error("Database Deletion Error:", error);
    return {
      success: false,
      errors: { server: ["Removing historical record failed."] },
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
    if (!user) return { success: false, error: "Authentication required." };

    const result = await dataEngine.toggleLike(
      String(user.userId || user.id),
      postId,
    );

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/posts/show/${postId}`);

    return { success: true, liked: result.liked };
  } catch (error) {
    console.error("Action error processing interaction:", error.message);
    return { success: false, error: "Database interaction sequence failed." };
  }
}
