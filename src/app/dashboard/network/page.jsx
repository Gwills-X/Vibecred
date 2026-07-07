import { socialEngine } from "@/services/socialEngine";
import FollowButton from "@/components/FollowButton";
import getAuthUser from "@/lib/getAuthUser";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const user = await getAuthUser();
  if (!user) return <div>Please log in.</div>;

  const suggestions = await socialEngine.getSuggestedUsers(user.userId);
  const myStats = await socialEngine.getFollowStats(user.userId);

  return (
    <div className='max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8'>
      {/* LEFT: Stats */}
      <div className='lg:col-span-1'>
        <div className='bg-slate-900/50 p-6 rounded-2xl border border-slate-800 sticky top-12'>
          <h2 className='text-sm font-bold text-slate-400 uppercase tracking-widest'>
            Your Network
          </h2>
          <div className='grid grid-cols-2 gap-4 mt-6'>
            <div className='bg-slate-950 p-3 rounded-lg border border-slate-800 text-center'>
              <div className='text-2xl font-black text-emerald-400'>
                {myStats.following}
              </div>
              <div className='text-[10px] text-slate-500 uppercase'>
                Following
              </div>
            </div>
            <div className='bg-slate-950 p-3 rounded-lg border border-slate-800 text-center'>
              <div className='text-2xl font-black text-emerald-400'>
                {myStats.followers}
              </div>
              <div className='text-[10px] text-slate-500 uppercase'>
                Followers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: User Directory */}
      <div className='lg:col-span-3'>
        <h1 className='text-xl font-black text-white mb-6'>
          Explore Developers
        </h1>
        <div className='grid gap-4'>
          {suggestions.map((person) => (
            <div
              key={person.id}
              className='flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-all'>
              <Link
                href={`/dashboard/network/${person.id}`}
                className='flex items-center gap-4 flex-1'>
                <div className='w-12 h-12 rounded-full overflow-hidden bg-slate-800'>
                  {person.profile_pic_url ? (
                    <img
                      src={person.profile_pic_url}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center font-bold text-emerald-400'>
                      {person.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className='font-bold text-white hover:text-emerald-400'>
                    {person.name}
                  </h3>
                  <p className='text-xs text-slate-500 truncate max-w-[200px]'>
                    {person.bio || "No bio set."}
                  </p>
                </div>
              </Link>

              <FollowButton
                currentUserId={user.userId}
                targetId={person.id}
                isInitiallyFollowing={person.isFollowing}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
