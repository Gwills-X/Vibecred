import LikeComments from "@/components/LikeComments";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";

export default async function PostPage({ params }) {
  // 1. Resolve Next.js URL routing parameters
  const { id } = await params;
  const user = await getAuthUser();
  const currentUserId = user?.userId || user?.id || null;

  // 2. Pass currentUserId down so the engine checks if THIS user liked it before rendering
  const post = await dataEngine.getPostById(id, currentUserId);

  // 404 Fallback Container
  if (!post) {
    return (
      <div className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4'>
        <div className='relative max-w-md w-full bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 rounded-2xl text-center space-y-5 shadow-2xl'>
          <div className='mx-auto w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-sm font-bold font-mono'>
            404
          </div>
          <div className='space-y-1'>
            <h1 className='text-xl font-bold tracking-tight text-slate-100'>
              Pulse Missing
            </h1>
            <p className='text-sm text-slate-400 leading-relaxed'>
              The pulse record has been altered, deleted, or does not exist
              inside the active database registry.
            </p>
          </div>
          <Link
            href='/'
            className='inline-flex w-full items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-700/60'>
            &larr; Return to Core Hub
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className='relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-300'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-[140px] pointer-events-none' />

      <div className='max-w-3xl mx-auto space-y-10 relative z-10'>
        {/* Navigation Header */}
        <div className='flex items-center justify-between'>
          <Link
            href='/'
            className='inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors group space-x-2'>
            <span className='text-sm transform group-hover:-translate-x-1 transition-transform duration-200'>
              &larr;
            </span>
            <span>Back to Timeline</span>
          </Link>

          <div className='flex items-center space-x-2 text-xs font-mono text-slate-500'>
            <span>ENGINE STATUS: ACTIVE</span>
            <span className='text-slate-700'>/</span>
            <span className='text-emerald-500'>ID_{post.id}</span>
          </div>
        </div>

        {/* Content Card Wrapper */}
        <article className='bg-slate-900/30 backdrop-blur-sm border border-slate-800/70 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl space-y-8'>
          <header className='space-y-4 border-b border-slate-800/80 pb-8'>
            <div className='flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400'>
              <span className='flex items-center px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/50 text-slate-300 font-mono text-[11px]'>
                Author: {post.authorName || "Anonymous"}
              </span>
              {formattedDate && (
                <>
                  <span className='text-slate-700 font-normal'>|</span>
                  <span className='text-slate-400 font-medium normal-case font-mono'>
                    {formattedDate}
                  </span>
                </>
              )}
            </div>

            <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-[1.15] bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text'>
              {post.title}
            </h1>
          </header>

          <main className='text-base sm:text-lg text-slate-300 leading-relaxed font-normal tracking-wide whitespace-pre-wrap break-words space-y-8'>
            <p className='text-slate-300/90'>{post.content}</p>

            {/* Reactive Engagement Toolbar */}
            <div className='pt-4 border-t border-slate-900 max-w-[240px]'>
              <LikeComments post={post} currentUserId={currentUserId} />
            </div>
          </main>

          <footer className='border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 tracking-tight'>
            <div className='flex items-center space-x-2'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
              <p>System Layer: GW-TECK SOLUTIONS Hub</p>
            </div>
            <p className='bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800/80'>
              UUID:{" "}
              {post.authorId
                ? `USR_DATA_00${post.authorId}`
                : "UNASSIGNED_GUEST"}
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
