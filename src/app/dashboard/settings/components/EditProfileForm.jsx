"use client";

import { useState, useActionState, useRef, useEffect } from "react";
import { updateProfileAction } from "@/actions/userActions";
import { uploadMedia } from "@/services/storageService";

export default function EditProfileForm({ initialUser }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    {},
  );
  const [avatarUrl, setAvatarUrl] = useState(initialUser.profile_pic_url || "");
  // This ensures that if the server data finally loads, the state updates
  useEffect(() => {
    if (initialUser.profile_pic_url) {
      setAvatarUrl(initialUser.profile_pic_url);
    }
  }, [initialUser.profile_pic_url]);
  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Trigger Cloudinary upload immediately
    const result = await uploadMedia(file);
    if (result?.url) {
      setAvatarUrl(result.url); // Update local preview
    }
  };

  return (
    <form action={formAction} className='w-full max-w-lg mx-auto  space-y-6 '>
      {/* Responsive Avatar Section: Flex-row on all screens, better spacing */}
      <div className='flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/5'>
        <div className='w-20 h-20 shrink-0 rounded-2xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl overflow-hidden'>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt='Avatar'
              className='w-full h-full object-cover'
            />
          ) : (
            "GW"
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <button
            type='button'
            onClick={() => fileInputRef.current.click()}
            className='px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg hover:bg-emerald-500/20 transition-all'>
            {avatarUrl ? "Change Avatar" : "Upload Avatar"}
          </button>
          <p className='text-[9px] text-slate-500 font-mono'>
            JPG/PNG, max 2MB
          </p>
        </div>
      </div>

      {/* Grid: 1 column on mobile, 2 on desktop */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <input
          name='name'
          defaultValue={initialUser.name}
          className='w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-sm'
          placeholder='Display Name'
        />
        <input
          name='location'
          defaultValue={initialUser.location}
          className='w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-sm'
          placeholder='Location'
        />
        <input
          name='github'
          defaultValue={initialUser.github_handle}
          className='w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-sm'
          placeholder='GitHub Username'
        />
        <input
          name='website'
          defaultValue={initialUser.website_url}
          className='w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-sm'
          placeholder='Website URL'
        />
      </div>

      <textarea
        name='bio'
        defaultValue={initialUser.bio}
        className='w-full bg-slate-950 border border-white/5 p-4 rounded-xl text-sm h-28'
        placeholder='Write a short professional bio...'
      />

      <input
        type='password'
        name='currentPassword'
        required
        className='w-full bg-slate-950 border border-red-500/20 p-4 rounded-xl text-sm'
        placeholder='Confirm with password'
      />

      <button
        disabled={isPending}
        className='w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold text-sm tracking-wider uppercase'>
        {isPending ? "Syncing..." : "Save Updates"}
      </button>

      <input type='hidden' name='profile_pic_url' value={avatarUrl} />
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        onChange={handleAvatarChange}
        accept='image/*'
      />
    </form>
  );
}
