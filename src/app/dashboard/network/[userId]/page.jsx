import { socialEngine } from "@/services/socialEngine";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Heart } from "lucide-react";
import getAuthUser from "@/lib/getAuthUser";

export default async function UserProfilePage({ params }) {
  const { userId } = await params;
  const authUser = await getAuthUser();

  if (!authUser) return <div>Please log in.</div>;

  const user = await socialEngine.getUserFullProfile(userId);
  if (!user) return notFound();

  const posts = await socialEngine.getUserPosts(userId);
  const stats = await socialEngine.getFollowStats(userId);

  // FIX: Check the status from the database before rendering
  const isFollowing = await socialEngine.checkIfFollowing(
    authUser.userId,
    userId,
  );

  return (
    <div className='max-w-3xl mx-auto py-12 px-4'>
      {/* Back Button */}
      <Link
        href='/dashboard/network'
        className='text-slate-500 hover:text-white flex items-center gap-2 mb-8 text-xs font-mono uppercase'>
        <ArrowLeft size={16} /> Back to Network
      </Link>

      {/* Header Section */}
      <div className='bg-slate-900/50 p-8 rounded-3xl border border-slate-800 mb-8'>
        <div className='flex items-center gap-6 max-lg:flex-col'>
          <div className='flex justify-start items-center gap-1.5 max-lg:justify-between max-lg:w-full'>
            <img
              src={user.profile_pic_url || "/user.png"}
              className='w-24 h-24 rounded-full border-4 border-slate-800'
            />
            <div className='flex-1'>
              <h1 className='text-3xl font-black max-lg:text-2xl'>
                {user.name}
              </h1>
              <p className='text-slate-400 mt-2'>{user.bio}</p>
            </div>
          </div>
          <FollowButton
            currentUserId={authUser?.userId}
            targetId={userId}
            isInitiallyFollowing={isFollowing}
          />
        </div>

        {/* Stats Bar */}
        <div className='flex gap-8 mt-8 border-t border-slate-800 pt-6'>
          <div>
            <div className='text-xl font-black text-emerald-400'>
              {stats.followers}
            </div>
            <div className='text-[10px] text-slate-500 uppercase'>
              Followers
            </div>
          </div>
          <div>
            <div className='text-xl font-black text-emerald-400'>
              {stats.following}
            </div>
            <div className='text-[10px] text-slate-500 uppercase'>
              Following
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <h2 className='font-black text-xl mb-6'>Recent Posts</h2>
      <div className='space-y-4'>
        {posts.map((post) => (
          <Link
            href={`/posts/${post.id}`}
            key={post.id}
            className='block p-6 bg-slate-900/30 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all'>
            <p className='text-slate-300 line-clamp-3 mb-4'>{post.content}</p>
            <div className='flex gap-6 text-slate-500'>
              <button className='flex items-center gap-1 hover:text-rose-500 transition-colors'>
                <Heart size={16} /> <span className='text-xs'>Like</span>
              </button>
              <button className='flex items-center gap-1 hover:text-emerald-500 transition-colors'>
                <MessageSquare size={16} />{" "}
                <span className='text-xs'>Comment</span>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
