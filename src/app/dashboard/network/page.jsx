// app/dashboard/network/page.jsx
import { socialEngine } from "@/services/socialEngine";
import FollowButton from "@/components/FollowButton";
import getAuthUser from "@/lib/getAuthUser"; // Assuming this is your auth helper
import DashboardNav from "../DashboardNav";

export default async function NetworkPage() {
  const user = await getAuthUser();
  if (!user) return <div>Please log in.</div>;

  const suggestions = await socialEngine.getSuggestedUsers(user.userId);
  // Add a helper to get your OWN stats
  const myStats = await socialEngine.getFollowStats(user.userId);

  return (
    <div className='max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* LEFT COLUMN: Stats & Profile */}
      <div className='lg:col-span-1 space-y-6'>
        <div className='glass-card p-6 bg-slate-900/50 rounded-2xl border border-slate-800'>
          <h2 className='text-lg font-bold text-white'>My Network</h2>
          <div className='flex gap-4 mt-4'>
            <div className='text-center'>
              <div className='text-xl font-black text-emerald-400'>
                {myStats.following}
              </div>
              <div className='text-xs text-slate-400 uppercase'>Following</div>
            </div>
            <div className='text-center'>
              <div className='text-xl font-black text-emerald-400'>
                {myStats.followers}
              </div>
              <div className='text-xs text-slate-400 uppercase'>Followers</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Suggestions */}
      <div className='lg:col-span-2'>
        <h1 className='text-2xl font-black text-white mb-6'>Discover People</h1>
        <div className='space-y-4'>
          {suggestions.map((person) => (
            <div
              key={person.id}
              className='flex items-center justify-between p-5 bg-slate-900/40 border border-slate-800 hover:border-emerald-500/30 transition-all rounded-xl'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white'>
                  {person.name[0]}
                </div>
                <div>
                  <h3 className='font-bold text-white'>{person.name}</h3>
                  <p className='text-xs text-slate-400'>
                    Shared 3 posts recently
                  </p>
                </div>
              </div>
              <FollowButton
                currentUserId={user.userId}
                targetId={person.id}
                isInitiallyFollowing={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
