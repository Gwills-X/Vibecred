import PostCard from "@/components/PostCard";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine"; // 1. Import our master engine switchboard
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // 1. Fetch active authentication state
  const user = await getAuthUser();
  console.log("Authenticated User in Dashboard Page:", user);

  // Guard Clause: Securely bounce unauthorized traffic back to login view
  if (!user) {
    return redirect("/login");
  }

  // 2. Query filtered items using our data switchboard engine instead of raw SQL
  // This automatically fetches from local XAMPP or Cloud Firestore based on your .env.local
  const postsCollection = await dataEngine.getTimeline(String(user.userId));
  const filteredPosts = postsCollection.filter((post) => {
    return user.userId == post.authorId ? post : null;
  });

  const hasPosts = filteredPosts && filteredPosts.length > 0;

  return (
    <div className='space-y-8 py-4'>
      {/* Dashboard Top Heading Profile Block */}
      <div className='border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-slate-100'>
            Creator Dashboard
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Welcome back! Managing articles for account Username:{" "}
            <span className='text-emerald-400 font-mono font-semibold'>
              #{user.name}
            </span>
          </p>
        </div>

        <Link
          href='/posts/create'
          className='inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md self-start sm:self-auto'>
          + Create New Post
        </Link>
      </div>

      {/* 3. CONDITIONAL GRID INTERFACE */}
      {hasPosts ? (
        <div className='space-y-4'>
          <h2 className='text-lg font-semibold text-slate-300 px-1'>
            Your Published Work ({filteredPosts.length})
          </h2>

          {/* Layout Container Grid streaming child component cards cleanly */}
          <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {filteredPosts.map((post) => (
              <PostCard
                post={post}
                key={post.id}
                currentUserId={String(user.userId)} // Passed down to safely support the interaction wrappers
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty Fallback State Design Module */
        <div className='min-h-[calc(100vh-280px)] flex flex-col items-center justify-center text-center px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20'>
          <div className='max-w-sm space-y-3'>
            <div className='mx-auto w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800 text-xl font-bold'>
              !
            </div>
            <h3 className='text-xl font-bold tracking-tight text-slate-200'>
              No posts found
            </h3>
            <p className='text-sm text-slate-500 leading-relaxed'>
              You haven't written any blog content yet. Start sharing your
              digital future today!
            </p>
            <div className='pt-2'>
              <Link
                href='/posts/create'
                className='inline-block bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 text-emerald-400 hover:text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm'>
                Write Your First Article
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
