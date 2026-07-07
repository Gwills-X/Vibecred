"use client";
import { useState } from "react";
import { updatePasswordAction } from "@/actions/auth";

export default function SecurityPage({ userId }) {
  const [status, setStatus] = useState({ message: "", type: "" });

  console.log("SecurityPage: Rendering with userId:", userId);
  async function handleSubmit(formData) {
    const current = formData.get("currentPassword");
    const newPass = formData.get("newPassword");
    const confirm = formData.get("confirmPassword");

    if (newPass !== confirm) {
      setStatus({ message: "Passwords do not match.", type: "error" });
      return;
    }

    const result = await updatePasswordAction(userId, current, newPass);

    if (result.error) {
      setStatus({ message: result.error, type: "error" });
    } else {
      setStatus({ message: result.success, type: "success" });
    }
  }

  return (
    <form action={handleSubmit} className='space-y-6'>
      <h2 className='text-lg font-bold text-white'>Security & Access</h2>

      {/* Notification Area */}
      {status.message && (
        <div
          className={`p-4 rounded-lg text-sm ${status.type === "error" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
          {status.message}
        </div>
      )}

      <div className='space-y-4'>
        <div className='p-4 bg-slate-950/50 rounded-lg border border-white/5'>
          <label className='text-[10px] uppercase font-bold text-slate-500'>
            Current Password
          </label>
          <input
            name='currentPassword'
            type='password'
            required
            className='w-full bg-transparent text-sm mt-1 text-white outline-none'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='p-4 bg-slate-950/50 rounded-lg border border-white/5'>
            <label className='text-[10px] uppercase font-bold text-slate-500'>
              New Password
            </label>
            <input
              name='newPassword'
              type='password'
              required
              className='w-full bg-transparent text-sm mt-1 text-white outline-none'
            />
          </div>
          <div className='p-4 bg-slate-950/50 rounded-lg border border-white/5'>
            <label className='text-[10px] uppercase font-bold text-slate-500'>
              Confirm Password
            </label>
            <input
              name='confirmPassword'
              type='password'
              required
              className='w-full bg-transparent text-sm mt-1 text-white outline-none'
            />
          </div>
        </div>
      </div>

      <button
        type='submit'
        className='bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-2 rounded-lg text-sm font-bold transition-all'>
        Update Credentials
      </button>
    </form>
  );
}
