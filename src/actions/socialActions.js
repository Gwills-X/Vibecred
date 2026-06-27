// src/actions/socialActions.js
"use server"; // This ensures this file only runs on the server
import { socialEngine } from "@/services/socialEngine";

export async function toggleFollowAction(currentUserId, targetId) {
  return await socialEngine.toggleFollow(currentUserId, targetId);
}
