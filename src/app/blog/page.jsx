import BackLink from "@/components/BackLink";

export default function BlogPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6'>
      <BackLink />
      <h1 className='text-4xl font-bold text-white mb-6'>Community Blog</h1>
      <div className='space-y-8'>
        <article className='border-b border-slate-800 pb-8'>
          <h2 className='text-2xl font-bold text-white mb-2'>
            The Future of Cross-Disciplinary Growth
          </h2>
          <p className='text-slate-500 text-sm mb-4'>
            July 2026 • By GW-TECK SOLUTIONS
          </p>
          <p className='text-slate-400'>
            Welcome to the VibeCred blog. Here, we share deep dives into how
            different fields can learn from each other to solve complex
            problems. Stay tuned for updates, platform announcements, and
            spotlights on our community members.
          </p>
        </article>
      </div>
    </main>
  );
}
