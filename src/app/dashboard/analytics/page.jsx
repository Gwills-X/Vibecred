import DashboardNav from "../DashboardNav";

export default function AnalyticsPage() {
  return (
    <div className='max-w-7xl mx-auto space-y-8 py-8 px-4'>
      <div className='flex flex-col gap-6'>
        <div>
          <h1 className='text-3xl font-black text-white'>Growth Insights</h1>
          <p className='text-emerald-500 font-mono text-sm mt-1'>
            Understand what resonates with your audience
          </p>
        </div>
        <DashboardNav />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 1. KEY IMPACT STATS */}
        <div className='lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            { label: "Total Views", val: "2,408" },
            { label: "Engagement", val: "14.2%" },
            { label: "New Followers", val: "48" },
            { label: "Best Time", val: "6:00 PM" },
          ].map((stat) => (
            <div
              key={stat.label}
              className='glass-card p-6 border-emerald-500/10'>
              <p className='text-[10px] uppercase font-bold text-slate-500'>
                {stat.label}
              </p>
              <p className='text-2xl font-black text-white mt-1'>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* 2. CONTENT PERFORMANCE */}
        <div className='glass-card p-6 lg:col-span-2 border-emerald-500/10'>
          <h2 className='text-sm font-bold text-slate-200 mb-6'>
            Top Performing Posts
          </h2>
          <div className='space-y-4'>
            {[
              { title: "Building Digital Futures: The Guide", views: "842" },
              { title: "React Performance Tuning", views: "512" },
              { title: "My 2026 Dev Stack", views: "340" },
            ].map((post) => (
              <div
                key={post.title}
                className='flex justify-between items-center p-4 bg-slate-950/50 rounded-lg border border-white/5'>
                <span className='text-sm text-slate-300 font-medium'>
                  {post.title}
                </span>
                <span className='text-emerald-400 font-bold text-sm'>
                  {post.views} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AUDIENCE TIPS (The "Useful" Part) */}
        <div className='glass-card p-6 border-emerald-500/10'>
          <h2 className='text-sm font-bold text-slate-200 mb-4'>Growth Tips</h2>
          <div className='text-xs text-slate-400 space-y-4 leading-relaxed'>
            <p>
              • Your post{" "}
              <span className='text-emerald-400'>"React Performance"</span> is
              getting 20% more engagement than usual.
            </p>
            <p>
              • Posting <span className='text-emerald-400'>on Tuesdays</span>{" "}
              tends to double your interaction rate.
            </p>
            <p>
              • 70% of your audience is reading from{" "}
              <span className='text-emerald-400'>Nigeria</span>. Keep your local
              insights flowing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
