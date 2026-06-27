export default function PreferencesPage() {
  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-bold text-white'>App Preferences</h2>

      <div className='space-y-4'>
        <div className='flex justify-between items-center p-4 bg-slate-950/50 rounded-lg border border-white/5'>
          <div>
            <h3 className='text-sm font-bold text-slate-200'>
              Email Notifications
            </h3>
            <p className='text-[10px] text-slate-500'>
              Receive alerts when someone interacts with your pulse.
            </p>
          </div>
          <input
            type='checkbox'
            className='accent-emerald-500'
            defaultChecked
          />
        </div>

        <div className='flex justify-between items-center p-4 bg-slate-950/50 rounded-lg border border-white/5'>
          <div>
            <h3 className='text-sm font-bold text-slate-200'>Public Profile</h3>
            <p className='text-[10px] text-slate-500'>
              Make your activity feed visible to the public.
            </p>
          </div>
          <input type='checkbox' className='accent-emerald-500' />
        </div>
      </div>
    </div>
  );
}
