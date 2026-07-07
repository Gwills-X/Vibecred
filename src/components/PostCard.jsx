"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DeleteModal from "./DeleteModal";
import { useState, useEffect, useTransition, useOptimistic } from "react";
import { handleToggleLike } from "@/actions/posts";

export default function PostCard({ post, currentUserId }) {
  const path = usePathname();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticLikeState, setOptimisticLikeState] = useOptimistic(
    { liked: post.hasLiked || false, count: post.likesCount || 0 },
    (state, nextLikedState) => ({
      liked: nextLikedState,
      count: nextLikedState ? state.count + 1 : Math.max(0, state.count - 1),
    }),
  );

  // --- MEDIA RENDERING LOGIC ---
  const renderMedia = (post) => {
    if (post.fileType === "none" || !post.mediaUrl) return null;

    // Video Thumbnail (in your PostCard.jsx)
    if (post.fileType === "video") {
      return (
        <div
          onClick={() => setIsFullScreen(true)}
          className='relative w-full max-w-[240px] aspect-video cursor-pointer group rounded-xl overflow-hidden border border-slate-700 bg-black shadow-lg hover:ring-2 hover:ring-emerald-500/50 transition-all'>
          {/* Video preview with muted/no-controls for the thumbnail */}
          <video src={post.mediaUrl} className='w-full h-full object-cover' />

          {/* Cinematic Play Overlay */}
          <div className='absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all'>
            <div className='w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500/90 backdrop-blur-sm shadow-xl'>
              <svg
                className='w-6 h-6 text-slate-950 fill-current ml-1'
                viewBox='0 0 24 24'>
                <path d='M8 5v14l11-7z' />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // Document/Raw Download
    if (post.fileType === "raw") {
      return (
        <a
          href={post.mediaUrl}
          target='_blank'
          download
          className='flex items-center gap-2 p-2 w-fit bg-slate-800 border border-slate-700 text-emerald-400 rounded hover:bg-slate-700 transition-all text-xs font-mono uppercase'>
          📄 Download {post.format?.toUpperCase() || "File"}
        </a>
      );
    }

    // Image Thumbnail
    return (
      <div
        // onClick={() => setIsFullScreen(true)}
        className='w-30 h-auto overflow-hidden rounded-lg border border-slate-700 cursor-pointer hover:opacity-80 transition-opacity'>
        <img src={post.mediaUrl} alt='Thumbnail' className='w-full h-full ' />
      </div>
    );
  };

  useEffect(() => {
    setMounted(true);
    if (post.createdAt) {
      const createdDate = new Date(post.createdAt);
      const thirtyMinutesInMs = 30 * 60 * 1000;
      const timeDifference = new Date().getTime() - createdDate.getTime();
      setIsEditable(timeDifference >= 0 && timeDifference < thirtyMinutesInMs);
    }
  }, [post.createdAt]);

  const cardDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleLikeClick = async () => {
    if (!currentUserId)
      return alert(
        "Authorize your identity matrix to react to pulses. Please log in.",
      );
    const targetLikedState = !optimisticLikeState.liked;
    startTransition(async () => {
      setOptimisticLikeState(targetLikedState);
      const res = await handleToggleLike(post.id);
      if (!res?.success) alert("Transaction failed to sync.");
    });
  };

  return (
    <article className=' flex flex-col justify-between rounded-2xl bg-slate-900/40 backdrop-blur-md border-2 border-slate-900 p-4 shadow-xl hover:border-slate-800/80 transition-all group selection:bg-emerald-500/10 selection:text-emerald-400'>
      <div className='space-y-3'>
        <div className='flex items-center justify-between text-xs text-slate-500 font-medium font-mono'>
          <span>By @{post.authorName || "anonymous"}</span>
          {cardDate && <span>{cardDate}</span>}
        </div>

        <h3 className='text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 tracking-tight'>
          {post.title}
        </h3>

        {/* Media Thumbnail Section */}
        {renderMedia(post)}

        <p className='text-sm text-slate-400 line-clamp-4 leading-relaxed'>
          {post.content}
        </p>
      </div>

      {/* --- FOOTER CONTROLS --- */}
      <div className='pt-4 mt-5 border-t border-slate-900/60 flex flex-col justify-between gap-4'>
        <div className='flex items-center justify-between gap-4 text-xs font-mono font-bold select-none'>
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${optimisticLikeState.liked ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-950/40 border-slate-900/60 text-slate-500 hover:text-slate-300"}`}>
            <svg
              className={`w-4 h-4 ${optimisticLikeState.liked ? "fill-emerald-400 stroke-none" : "fill-none stroke-current"}`}
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
          <Link
            href={`/posts/show/${post.id}`}
            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/40 border border-slate-900/60 text-slate-500 hover:text-slate-300 transition-all'>
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
          </Link>
        </div>

        <div className='flex items-center gap-4 justify-between shrink-0'>
          <Link
            href={`/posts/show/${post.id}`}
            className='text-xs font-extrabold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors'>
            Read Pulse &rarr;
          </Link>
          {path === "/dashboard" && mounted && (
            <div className='inline-flex items-center pl-4 border-l border-slate-800/80'>
              {isEditable ? (
                <Link
                  href={`/posts/edit/${post.id}`}
                  className='text-xs font-mono font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-colors'>
                  Edit
                </Link>
              ) : (
                <span className='text-xs text-slate-600 cursor-not-allowed italic font-mono select-none'>
                  Locked
                </span>
              )}
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  console.log(post);
                }}
                className='text-xs font-mono font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors ml-4 cursor-pointer'>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isFullScreen && (
        <div
          className='fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-xl p-0'
          onClick={() => setIsFullScreen(false)}>
          {/* Close button - Top Right */}
          <button
            onClick={() => setIsFullScreen(false)}
            className='absolute top-6 right-6 z-[101] text-white/70 hover:text-white p-2 bg-white/10 rounded-full'>
            ✕
          </button>

          {/* Video Container: Fits screen perfectly */}
          <div
            className='relative w-full h-full flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}>
            <video
              src={post.mediaUrl}
              controls
              autoPlay
              playsInline // CRITICAL for iOS/Android to play without forcing full screen
              className='max-h-full w-full object-contain'
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <DeleteModal
        postId={post.id}
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        publicId={post.publicId} // Pass this from the database record
        fileType={post.fileType} // Pass this from the database record
      />
    </article>
  );
}
