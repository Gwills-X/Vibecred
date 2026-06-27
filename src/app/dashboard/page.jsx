import PostCard from "@/components/PostCard";
import DashboardNav from "./DashboardNav";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getAuthUser();
  if (!user) return redirect("/login");

  const postsCollection = await dataEngine.getTimeline(String(user.userId));
  const filteredPosts = postsCollection.filter(
    (post) => user.userId == post.authorId,
  );
  const hasPosts = filteredPosts.length > 0;

  return (
    <div className='max-w-7xl mx-auto space-y-8 py-8 px-4'>
      {/* HEADER SECTION */}
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-black text-white tracking-tight'>
              Creator Dashboard
            </h1>
            <p className='text-sm text-slate-400 mt-1 font-mono'>
              Session: <span className='text-emerald-400'>#{user.name}</span> |
              Workspace Active
            </p>
          </div>
          <Link
            href='/posts/create'
            className='bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-500/20'>
            + Create New Post
          </Link>
        </div>

        {/* SUB-NAVIGATION */}
        <DashboardNav />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className='glass-card p-6 border-white/5'>
        {hasPosts ? (
          <div className='space-y-6'>
            <div className='flex justify-between items-center border-b border-white/5 pb-4'>
              <h2 className='text-sm font-bold text-slate-200'>
                Published Artifacts ({filteredPosts.length})
              </h2>
            </div>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className='bg-slate-950/40 border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all'>
                  <PostCard post={post} currentUserId={String(user.userId)} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='text-center py-20'>
            <div className='mx-auto w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500 mb-4'>
              !
            </div>
            <h3 className='text-lg font-bold text-white'>Matrix Vacant</h3>
            <p className='text-sm text-slate-500 mt-2 mb-6'>
              No authored content detected in this sector.
            </p>
            <Link
              href='/posts/create'
              className='text-emerald-400 text-sm font-bold hover:underline'>
              + Author Your First Pulse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
