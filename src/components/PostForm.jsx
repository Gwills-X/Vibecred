"use client";

import { useActionState } from "react";

export default function BlogPostForm({ handler }) {
  // Pass an object with empty strings as the initial state so defaultValue doesn't get undefined/null flags
  const [state, action, isPending] = useActionState(handler, {
    title: "",
    content: "",
    errors: {},
  });

  return (
    <form
      action={action}
      className='max-w-2xl mx-auto pt-4 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 space-y-6'>
      {/* Form Header */}
      <div className='space-y-1'>
        <h2 className='text-2xl font-bold tracking-tight text-slate-100'>
          Create New Post
        </h2>
        <p className='text-sm text-slate-400'>
          Share your latest insights and technical updates with the world
        </p>
      </div>

      {/* Global Server/Database Error Catch */}
      {state?.errors?.server && (
        <div className='p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-mono'>
          {state.errors.server[0]}
        </div>
      )}

      {/* Title Field */}
      <div className='flex flex-col space-y-1.5'>
        <label htmlFor='title' className='text-sm font-medium text-slate-300'>
          Title
        </label>
        <input
          type='text'
          id='title'
          name='title'
          defaultValue={state?.title || ""}
          disabled={isPending}
          className='w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-slate-100 outline-none placeholder-slate-600 transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50'
          placeholder='Enter post title'
        />
        {/* 🌟 FIXED: Pull the first error message string from the array safely */}
        {state?.errors?.title && (
          <p className='text-rose-500 text-xs mt-1 font-mono'>
            {Array.isArray(state.errors.title)
              ? state.errors.title[0]
              : state.errors.title}
          </p>
        )}
      </div>

      {/* Content Field */}
      <div className='flex flex-col space-y-1.5'>
        <label htmlFor='content' className='text-sm font-medium text-slate-300'>
          Content
        </label>
        <textarea
          id='content'
          name='content'
          rows='6'
          defaultValue={state?.content || ""}
          disabled={isPending}
          className='w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-slate-100 outline-none placeholder-slate-600 transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm resize-none disabled:opacity-50'
          placeholder='Write your post content here...'></textarea>
        {/* 🌟 FIXED: Pull the first error message string from the array safely */}
        {state?.errors?.content && (
          <p className='text-rose-500 text-xs mt-1 font-mono'>
            {Array.isArray(state.errors.content)
              ? state.errors.content[0]
              : state.errors.content}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className='pt-2'>
        <button
          type='submit'
          disabled={isPending}
          className='w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-semibold rounded-lg shadow-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono tracking-wider'>
          {isPending ? "Transmitting..." : "Create Post"}
        </button>
      </div>
    </form>
  );
}
