"use client";

import { handleToggleLike } from "@/actions/posts";
import { useOptimistic, useTransition } from "react";

export default function LikeComments({ post, currentUserId }) {
  const [isPending, startTransition] = useTransition();

  // useOptimistic takes the base server state and a reducer function
  const [optimisticLikeState, setOptimisticLikeState] = useOptimistic(
    { liked: post.hasLiked || false, count: post.likesCount || 0 },
    (state, nextLikedState) => {
      return {
        liked: nextLikedState,
        count: nextLikedState ? state.count + 1 : Math.max(0, state.count - 1),
      };
    },
  );

  const handleLikeClick = async () => {
    if (!currentUserId) {
      return alert("Authorize your identity matrix to react to pulses.");
    }

    const targetLikedState = !optimisticLikeState.liked;

    // 1. Instantly trigger the visual transition state across renders
    startTransition(async () => {
      setOptimisticLikeState(targetLikedState);

      // 2. Wait for the server components cache to revalidate on the background thread
      const res = await handleToggleLike(post.id);
      if (!res?.success) {
        // If it fails, Next.js automatically discards the optimistic state back to base props!
        alert("Transaction failed to sync. Reverting matrix state.");
      }
    });
  };

  return (
    <div className='flex items-center gap-4 text-xs font-mono font-bold select-none'>
      {/* LIKE ACTION TARGET */}
      <button
        onClick={handleLikeClick}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
          optimisticLikeState.liked
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-slate-950/40 border-slate-900/60 text-slate-500 hover:text-slate-300 hover:border-slate-800"
        }`}>
        <svg
          className={`w-4 h-4 transition-transform active:scale-125 ${
            optimisticLikeState.liked
              ? "fill-emerald-400 stroke-none"
              : "fill-none stroke-current"
          }`}
          viewBox='0 0 24 24'
          strokeWidth='2'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
          />
        </svg>
        <span>{optimisticLikeState.count}</span>
      </button>

      {/* COMMENTS STATUS METER */}
      <div className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-slate-900/60 text-slate-500'>
        <svg
          className='w-4 h-4'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='2'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          />
        </svg>
        <span>{post.commentsCount || 0}</span>
      </div>
    </div>
  );
}
