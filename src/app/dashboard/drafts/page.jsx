import DashboardNav from "../DashboardNav";
import Link from "next/link";

export default function DraftsPage() {
  // Mock data - You can replace this with your dataEngine.getDrafts() call
  const drafts = [
    {
      id: 1,
      title: "Micro-service Architecture Notes",
      updated: "2 hours ago",
    },
    { id: 2, title: "Refactoring the Data Engine", updated: "1 day ago" },
  ];

  return (
    <div className='max-w-7xl mx-auto space-y-8 py-8 px-4'>
      <div className='flex flex-col gap-6'>
        <div>
          <h1 className='text-3xl font-black text-white'>Workspace Drafts</h1>
          <p className='text-emerald-500 font-mono text-sm mt-1'>
            Staging area for unpublished pulses and logic flows
          </p>
        </div>
        <DashboardNav />
      </div>

      <div className='glass-card p-6 border-emerald-500/10'>
        {drafts.length > 0 ? (
          <div className='space-y-3'>
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className='flex justify-between items-center p-4 bg-slate-950/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all'>
                <div>
                  <h3 className='font-bold text-slate-200'>{draft.title}</h3>
                  <p className='text-[10px] text-slate-500 font-mono'>
                    Last modified: {draft.updated}
                  </p>
                </div>
                <div className='flex gap-3'>
                  <button className='text-xs font-bold text-emerald-400 hover:text-emerald-300'>
                    Edit
                  </button>
                  <button className='text-xs font-bold text-red-400 hover:text-red-300'>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <p className='text-slate-500 font-mono'>
              No active drafts in the pipeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
