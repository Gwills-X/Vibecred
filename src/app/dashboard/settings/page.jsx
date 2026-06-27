export default function EditProfilePage() {
  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-bold text-white'>Edit Profile</h2>
      <div className='flex items-center gap-6'>
        <div className='w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold'>
          GW
        </div>
        <button className='text-xs text-emerald-400 font-bold hover:underline'>
          Change Picture
        </button>
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <input
          className='w-full bg-slate-950/50 border border-white/5 p-3 rounded-lg text-sm'
          placeholder='Display Name'
        />
        <input
          className='w-full bg-slate-950/50 border border-white/5 p-3 rounded-lg text-sm'
          placeholder='Email'
        />
      </div>
      <textarea
        className='w-full bg-slate-950/50 border border-white/5 p-4 rounded-lg text-sm'
        rows={3}
        placeholder='About me...'
      />
      <button className='bg-emerald-500 text-slate-950 px-6 py-2 rounded-lg text-sm font-bold'>
        Save Profile
      </button>
    </div>
  );
}
