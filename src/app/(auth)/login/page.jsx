"use client";

import { login } from "@/actions/auth"; // Aligned with the unified actions path
import Link from "next/link";
import { useActionState } from "react";

export default function Login() {
  // useActionState handles server action form states.
  // 'state' holds the return data (errors, form values). 'isPending' tracks loading status.
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 selection:bg-emerald-500/10 selection:text-emerald-400'>
      <form
        action={action}
        className='w-full max-w-md space-y-6 rounded-2xl bg-slate-900 p-8 shadow-xl border border-slate-800/80 backdrop-blur-sm'>
        {/* Header Heading */}
        <div className='space-y-1'>
          <h1 className='text-center text-3xl font-extrabold tracking-tight text-slate-100 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text'>
            Welcome Back
          </h1>
          <p className='text-center text-sm text-slate-400'>
            Log in to manage your digital assets
          </p>
        </div>

        {/* Global Server Error Catch */}
        {state?.errors?.server && (
          <div className='p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono font-medium text-red-400 text-center leading-relaxed'>
            [ERR]:{" "}
            {Array.isArray(state.errors.server)
              ? state.errors.server[0]
              : state.errors.server}
          </div>
        )}

        {/* Email Field */}
        <div className='flex flex-col space-y-1.5'>
          <label
            htmlFor='email'
            className='text-xs font-bold uppercase tracking-wider text-slate-400 font-mono'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            name='email'
            defaultValue={state?.email}
            disabled={isPending}
            className='w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-slate-100 outline-none placeholder-slate-600 transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-40 disabled:cursor-not-allowed'
            placeholder='you@example.com'
          />
          {state?.errors?.email && (
            <p className='text-xs text-red-400 mt-1 font-medium font-mono'>
              {Array.isArray(state.errors.email)
                ? state.errors.email[0]
                : state.errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className='flex flex-col space-y-1.5'>
          <label
            htmlFor='password'
            className='text-xs font-bold uppercase tracking-wider text-slate-400 font-mono'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            disabled={isPending}
            className='w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-slate-100 outline-none placeholder-slate-600 transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-40 disabled:cursor-not-allowed'
            placeholder='••••••••'
          />
          {state?.errors?.password && (
            <p className='text-xs text-red-400 mt-1 font-medium font-mono'>
              {Array.isArray(state.errors.password)
                ? state.errors.password[0]
                : state.errors.password}
            </p>
          )}
        </div>

        {/* Actions Section */}
        <div className='flex flex-col space-y-4 pt-2'>
          <button
            disabled={isPending}
            type='submit'
            className='w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 px-5 py-2.5 font-bold text-slate-950 shadow-md tracking-wide transition-all disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-sm font-mono uppercase cursor-pointer'>
            {isPending ? "Authenticating..." : "Sign In"}
          </button>

          <div className='text-center'>
            <Link
              href='/register'
              className='text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors hover:underline font-mono'>
              Create an account &rarr;
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
