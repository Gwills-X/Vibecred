"use server";

import { authEngine } from "@/services/authEngine";
import { compare } from "bcrypt"; // 🌟 Changed from 'bcryptjs' to 'bcrypt'
import getAuthUser from "@/lib/getAuthUser";

export async function updateProfileAction(prevState, formData) {
  const user = await getAuthUser();

  if (!user) return { errors: { server: ["Unauthorized"] } };

  const currentPassword = formData.get("currentPassword");

  // Verify password using 'bcrypt'
  const isValid = await compare(currentPassword, user.password);
  if (!isValid) return { errors: { server: ["Incorrect password"] } };

  try {
    // Route through your Engine
    const updateData = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      github_handle: formData.get("github"),
      website_url: formData.get("website"),
      location: formData.get("location"),
      profile_pic_url: formData.get("profile_pic_url"), // Ensure this is captured
    };

    // 🔍 DEBUG: See what is being sent to the engine
    console.log("userId", user.userId, user);
    console.log("Action: Sending data to Engine:", updateData);

    await authEngine.updateUserProfile(user.userId, updateData);
    return { success: true };
  } catch (err) {
    console.error("Profile update error:", err);
    return { errors: { server: ["Failed to update profile"] } };
  }
}
