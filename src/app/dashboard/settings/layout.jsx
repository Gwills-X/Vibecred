import Link from "next/link";

export default function SettingsLayout({ children }) {
  return (
    <div className='max-w-4xl mx-auto space-y-8 py-8 px-4'>
      <div className='flex flex-col gap-6'>
        <div>
          <h1 className='text-3xl font-black text-white'>Account Settings</h1>
          <p className='text-emerald-500 font-mono text-sm mt-1'>
            Manage your identity and account configuration
          </p>
        </div>
      </div>

      {/* Settings Sub-Nav */}
      <div className='flex gap-6 border-b border-white/5 pb-2'>
        <Link
          href='/dashboard/settings'
          className='text-xs font-bold text-slate-400 hover:text-emerald-400'>
          Edit Profile
        </Link>
        <Link
          href='/dashboard/settings/security'
          className='text-xs font-bold text-slate-400 hover:text-emerald-400'>
          Security
        </Link>
        <Link
          href='/dashboard/settings/preferences'
          className='text-xs font-bold text-slate-400 hover:text-emerald-400'>
          Preferences
        </Link>
      </div>

      {/* This renders the page.jsx of the specific sub-folder */}
      <div className='glass-card p-8 border-emerald-500/10'>{children}</div>
    </div>
  );
}
