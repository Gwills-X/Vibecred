import PostCard from "@/components/PostCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";

export default async function Home() {
  // 1. Fetch active session state for contextual action layers
  const user = await getAuthUser();
  const currentUserId = user ? String(user.userId) : null;

  // 2. Stream recent chronological feed directly via the decoupled engine
  const postsCollection = await dataEngine.getTimeline(currentUserId);

  // Keep a clean boundary slice for optimized initial paint viewport performance
  const posts = postsCollection ? postsCollection.slice(0, 12) : [];

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12'>
      {/* SECTION 1: VIBECRED GLOBAL IMPACT ZONE */}
      <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/80 p-8 md:p-14 text-center space-y-6 shadow-2xl'>
        {/* Deep Tech Blur Glow Accents */}
        <div className='absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none'></div>
        <div className='absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none'></div>

        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-widest uppercase font-mono'>
          📡 VibeCred Network Matrix Active
        </span>

        <h1 className='text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-emerald-400 bg-clip-text text-transparent max-w-3xl mx-auto leading-tight'>
          Amplify Your Code. Assert Your Vibe.
        </h1>

        <p className='text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed'>
          The decentralized developer micro-hub for deployment logs, instant
          feature breakdowns, and real-time social credit validation loops.
        </p>

        {/* Action Layer Logic Mapping */}
        <div className='flex flex-wrap items-center justify-center gap-4 pt-2'>
          {user ? (
            <Link
              href='/posts/create'
              className='bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 tracking-tight'>
              + Broadcast New Pulse
            </Link>
          ) : (
            <>
              <Link
                href='/login'
                className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-md'>
                Connect Identity Matrix
              </Link>
              <Link
                href='/register'
                className='bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-6 py-3 rounded-xl text-sm border border-slate-800 transition-all'>
                Initialize Free Key
              </Link>
            </>
          )}
        </div>
      </section>

      {/* SECTION 2: THE MAIN MATRIX TIMELINE FEED */}
      <section className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
        {/* LEFT & CENTER COUMNS: DYNAMIC INTERACTIVE STREAM */}
        <div className='lg:col-span-2 space-y-6'>
          <div className='flex items-center justify-between border-b border-slate-900 pb-4'>
            <div>
              <h2 className='text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                Live Activity Stream
              </h2>
              <p className='text-xs text-slate-500 mt-0.5 font-mono'>
                Asynchronous state verification via unified abstraction engines.
              </p>
            </div>

            {user && (
              <Link
                href='/posts/create'
                className='text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg'>
                + Share Insight
              </Link>
            )}
          </div>

          {posts.length > 0 ? (
            <div className='grid gap-4 grid-cols-1'>
              {posts.map((post) => (
                <PostCard
                  post={post}
                  key={post.id}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          ) : (
            /* Empty Core State Fallback Container */
            <div className='min-h-[250px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 space-y-3'>
              <div className='w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs'>
                Ø
              </div>
              <div className='space-y-1 max-w-sm'>
                <h3 className='text-sm font-bold text-slate-300'>
                  The Feed Matrix is Vacant
                </h3>
                <p className='text-xs text-slate-500 leading-relaxed'>
                  No deployment logs or conversational thread signatures found
                  across the active driver schema.
                </p>
              </div>
              {!user && (
                <Link
                  href='/login'
                  className='mt-2 inline-flex bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all border border-emerald-500/20'>
                  Authorize Matrix To Post
                </Link>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REVENUE & SYSTEM STATUS PANEL PANEL */}
        <aside className='space-y-6 lg:sticky lg:top-6'>
          {/* VIBECRED SYSTEM ENGAGEMENT PANEL */}
          <div className='p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 space-y-4'>
            <h3 className='text-xs font-bold tracking-widest uppercase text-slate-400 font-mono'>
              System Metrics
            </h3>

            <div className='space-y-3 font-mono text-xs text-slate-400'>
              <div className='p-3 rounded-xl bg-slate-950/60 border border-slate-800/40 flex justify-between items-center'>
                <span>Engine Protocol</span>
                <span className='text-emerald-400 font-bold'>RPC-READY</span>
              </div>
              <div className='p-3 rounded-xl bg-slate-950/60 border border-slate-800/40 flex justify-between items-center'>
                <span>Telemetry Status</span>
                <span className='text-emerald-400 font-bold'>OPTIMIZED</span>
              </div>
              <div className='p-3 rounded-xl bg-slate-950/60 border border-slate-800/40 flex justify-between items-center'>
                <span>Interactive Layers</span>
                <span className='text-slate-300'>Likes, Comments</span>
              </div>
            </div>
          </div>

          {/* SECONDARY NOT-LOGGED-IN CTA CARD */}
          {!user && (
            <div className='p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/10 space-y-3 shadow-lg shadow-emerald-950/10'>
              <h4 className='text-sm font-bold text-slate-200'>
                Ready to evaluate network content?
              </h4>
              <p className='text-xs text-slate-400 leading-relaxed'>
                Authenticate your profile securely to register your engagement
                hashes, build real-time authority metrics, and execute native
                thread operations.
              </p>
              <div className='pt-2 flex gap-3'>
                <Link
                  href='/register'
                  className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2 rounded-lg transition-colors'>
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
