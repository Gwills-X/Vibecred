import Link from "next/link";

export default function NexusHub() {
  // Mock data representing your dynamic chat/connection channels
  // In the future, this will be populated via your dataEngine
  const connections = [
    {
      id: 1,
      name: "Core Architecture Team",
      lastMessage: "Can we refine the socket...",
      time: "2m ago",
      unread: 3,
      status: "online",
    },
    {
      id: 2,
      name: "Database Migrations",
      lastMessage: "Migration failed at 4:02 PM",
      time: "1h ago",
      unread: 0,
      status: "offline",
    },
    {
      id: 3,
      name: "Frontend Sync (Chayil)",
      lastMessage: "Looks great on mobile!",
      time: "3h ago",
      unread: 1,
      status: "online",
    },
  ];

  return (
    <div className='max-w-5xl mx-auto space-y-8 py-8 px-4'>
      <div className='flex justify-between items-end'>
        <div>
          <h1 className='text-3xl font-black text-white tracking-tight'>
            Nexus Hub (coming soon... Update on its way!)
          </h1>
          <p className='text-emerald-500 font-mono text-sm mt-1'>
            Active data streams and peer connections
          </p>
        </div>
        <button className='px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs rounded-lg hover:bg-emerald-500/20 transition-all'>
          + New Stream
        </button>
      </div>

      <div className='glass-card p-1 border-white/5 bg-slate-950/50 rounded-2xl'>
        {connections.length > 0 ? (
          <div className='divide-y divide-white/5'>
            {connections.map((conn) => (
              <div
                key={conn.id}
                className='flex justify-between items-center p-5 hover:bg-white/5 transition-colors cursor-pointer group'>
                <div className='flex items-center gap-4'>
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${conn.status === "online" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-700"}`}
                  />
                  <div>
                    <h3 className='font-bold text-slate-200 group-hover:text-white transition-colors'>
                      {conn.name}
                    </h3>
                    <p className='text-xs text-slate-500 font-mono mt-0.5'>
                      {conn.lastMessage}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-6'>
                  <span className='text-[10px] text-slate-600 font-mono'>
                    {conn.time}
                  </span>
                  {conn.unread > 0 && (
                    <span className='px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full'>
                      {conn.unread}
                    </span>
                  )}
                  <Link
                    href={`/nexus/${conn.id}`}
                    className='text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest'>
                    Enter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <p className='text-slate-500 font-mono'>
              No active communication streams.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
