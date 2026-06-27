// components/FollowButton.jsx
"use client";
import { useState } from "react";
import { toggleFollowAction } from "@/actions/socialActions"; // Import the Action

export default function FollowButton({
  currentUserId,
  targetId,
  isInitiallyFollowing,
}) {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

  const handleToggle = async () => {
    setIsFollowing(!isFollowing);
    // Call the server action instead of the direct database service
    await toggleFollowAction(currentUserId, targetId);
  };

  return (
    <button onClick={handleToggle}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
