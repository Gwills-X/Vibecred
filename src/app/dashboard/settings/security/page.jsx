export default function SecurityPage() {
  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-bold text-white'>Security & Access</h2>

      <div className='space-y-4'>
        {/* Password Change */}
        <div className='p-4 bg-slate-950/50 rounded-lg border border-white/5'>
          <label className='text-[10px] uppercase font-bold text-slate-500'>
            Current Password
          </label>
          <input
            type='password'
            placeholder='••••••••'
            className='w-full bg-transparent text-sm mt-1 text-white outline-none'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='p-4 bg-slate-950/50 rounded-lg border border-white/5'>
            <label className='text-[10px] uppercase font-bold text-slate-500'>
              New Password
            </label>
            <input
              type='password'
              className='w-full bg-transparent text-sm mt-1 text-white outline-none'
            />
          </div>
          <div className='p-4 bg-slate-950/50 rounded-lg border border-white/5'>
            <label className='text-[10px] uppercase font-bold text-slate-500'>
              Confirm Password
            </label>
            <input
              type='password'
              className='w-full bg-transparent text-sm mt-1 text-white outline-none'
            />
          </div>
        </div>
      </div>

      <button className='bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-2 rounded-lg text-sm font-bold transition-all'>
        Update Credentials
      </button>
    </div>
  );
}
