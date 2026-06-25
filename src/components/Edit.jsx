"use client";

import React, { useState, useTransition } from "react"; // Hooked useTransition for seamless mutation pending tracks
import Link from "next/link";
import { updatePostAction } from "@/actions/posts"; // Kept mapped to your unified actions layer

export default function EditPost({ post }) {
  // Safe extraction of post properties with array fallback guards
  const targetPost = Array.isArray(post) ? post[0] : post;

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState(null);

  const [updatePost, setUpdatePost] = useState({
    title: targetPost?.title || "",
    content: targetPost?.content || "",
  });

  console.log("EditPost Component Rendered with Target Post:", targetPost);

  const handleSubmit = async () => {
    setServerError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", updatePost.title);
        formData.append("content", updatePost.content);

        const response = await updatePostAction(targetPost.id, formData);

        // If server execution fails explicitly without redirecting
        if (response && response.success === false) {
          setServerError(
            response.errors?.server?.[0] || "Failed to commit changes.",
          );
        }
      } catch (error) {
        console.error("Error during post update submission:", error);
        setServerError("A critical backend processing error occurred.");
      }
    });
  };

  return (
    <div className='relative min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8 overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-300'>
      {/* Background Ambient Lighting Glows */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-full blur-[120px] pointer-events-none' />

      {/* CORE FORM CARD WRAPPER */}
      <div className='relative z-10 w-full max-w-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6'>
        {/* FORM IDENTITY HEADER */}
        <div className='border-b border-slate-800/80 pb-4 flex items-center justify-between'>
          <div className='space-y-1'>
            <h1 className='text-2xl font-extrabold tracking-tight text-slate-100 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text'>
              Modify Article Instance
            </h1>
            <p className='text-xs text-slate-400 font-mono'>
              STAGING_TARGET: POST_ID_{targetPost?.id || "NULL"}
            </p>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${isPending ? "bg-emerald-500 animate-ping" : "bg-amber-500 animate-pulse"} shadow-[0_0_8px_rgba(245,158,11,0.5)]`}
          />
        </div>

        {/* SERVER ACTION PROCESSING ERROR BANNER */}
        {serverError && (
          <div className='p-3 text-xs font-mono bg-red-500/10 border border-red-500/20 rounded-xl text-red-400'>
            [ERR]: {serverError}
          </div>
        )}

        {/* INPUT INTERFACE SYSTEM */}
        <form
          className='space-y-5'
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
          {/* TITLE INPUT BLOCK */}
          <div className='space-y-2'>
            <label
              htmlFor='title'
              className='block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono'>
              Document Title
            </label>
            <input
              id='title'
              type='text'
              name='title'
              disabled={isPending}
              placeholder='Enter article title...'
              value={updatePost.title}
              onChange={(e) =>
                setUpdatePost({ ...updatePost, title: e.target.value })
              }
              className='w-full bg-slate-950/60 border border-slate-800/80 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600 font-medium shadow-inner disabled:opacity-40'
            />
          </div>

          {/* CONTENT TEXTAREA BLOCK */}
          <div className='space-y-2'>
            <label
              htmlFor='content'
              className='block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono'>
              Markdown Body Content
            </label>
            <textarea
              id='content'
              name='content'
              rows={8}
              disabled={isPending}
              placeholder='Write your technical logs here...'
              value={updatePost.content}
              onChange={(e) =>
                setUpdatePost({ ...updatePost, content: e.target.value })
              }
              className='w-full bg-slate-950/60 border border-slate-800/80 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600 font-normal leading-relaxed resize-y shadow-inner whitespace-pre-wrap disabled:opacity-40'
            />
          </div>

          {/* ACTION NAVIGATION BUTTON CONTROLS */}
          <div className='pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-end gap-3'>
            <Link
              href={`/posts/${targetPost?.id || ""}`} // Re-routed back to standard dynamic segment track
              className='w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all border border-transparent hover:border-slate-800/80'>
              Cancel
            </Link>

            <button
              type='submit'
              disabled={isPending}
              className='w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'>
              {isPending ? "Committing..." : "Commit Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
