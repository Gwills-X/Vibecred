import PostCard from "@/components/PostCard";

import getAuthUser from "@/lib/getAuthUser";

import { dataEngine } from "@/services/dataEngine";

import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getAuthUser();

  const currentUserId = user ? String(user.userId) : null;

  const postsCollection = await dataEngine.getTimeline(currentUserId);

  const posts = postsCollection ? postsCollection.slice(0, 12) : [];

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12'>
      {/* SECTION 1: VIBECRED GLOBAL IMPACT ZONE */}

      <section className='relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 p-8 md:p-20 text-center space-y-8 shadow-2xl'>
        {/* Subtle Ambient Glows */}
        <div className='absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none'></div>
        <div className='absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none'></div>

        {/* Status Pill */}
        <span className='inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-emerald-500 border border-indigo-500/20 tracking-widest uppercase'>
          ✨ Open Community
        </span>

        {/* Heading */}
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.1]'>
          Where Ideas Meet{" "}
          <span className='text-emerald-500'>Different Perspectives.</span>
        </h1>

        {/* Description */}
        <p className='text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed'>
          Join a vibrant space for creators, thinkers, and professionals. Share
          your journey, exchange insights, and grow alongside people from all
          walks of life.
        </p>

        {/* CTA Buttons */}
        <div className='flex flex-wrap items-center justify-center gap-4 pt-4'>
          {user ? (
            <Link
              href='/posts/create'
              className='bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-full text-sm transition-all shadow-lg hover:shadow-emerald-500/20'>
              Share Your Thoughts
            </Link>
          ) : (
            <>
              <Link
                href='/login'
                className='bg-white hover:bg-slate-200 text-slate-950 font-bold px-8 py-4 rounded-full text-sm transition-all'>
                Join the Community
              </Link>
              <Link
                href='/register'
                className='bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-8 py-4 rounded-full text-sm border border-slate-700 transition-all'>
                Create an Account
              </Link>
            </>
          )}
        </div>
      </section>

      <section className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='flex items-center justify-between border-b border-slate-900 pb-4'>
            <div>
              <h2 className='text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                Live Activity Stream
              </h2>
            </div>
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
            <div className='min-h-[250px] flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10'>
              <h3 className='text-sm font-bold text-slate-300'>
                The Feed Matrix is Vacant
              </h3>
            </div>
          )}
        </div>

        <aside className='space-y-6 lg:sticky lg:top-6'>
          {/* NEW: PERSONAL IDENTITY PANEL */}

          {user && (
            <div className='p-6 rounded-2xl bg-slate-900/40 border border-emerald-500/20 space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-emerald-500/30'>
                  {user.profile_pic_url ? (
                    <img
                      src={user.profile_pic_url}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='font-bold text-emerald-400'>GW</span>
                  )}
                </div>

                <div>
                  <h3 className='font-bold text-white'>{user.name}</h3>

                  <p className='text-xs text-emerald-400 font-mono'>
                    {user.location || "Earth"}
                  </p>
                </div>
              </div>

              <p className='text-xs text-slate-400 leading-relaxed'>
                {user.bio || "No bio set yet."}
              </p>

              <Link
                href='/dashboard/settings'
                className='block w-full py-2 text-center text-xs font-bold bg-slate-800 hover:bg-slate-700 rounded-lg transition-all'>
                Edit Identity Matrix
              </Link>
            </div>
          )}

          {/* SYSTEM METRICS */}

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
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
