"use client";

import { deletePostAction } from "@/actions/posts"; // Verified path linkage
import { useState } from "react";
import { deleteMediaAction } from "@/actions/storageActions";
export default function DeleteModal({
  postId,
  publicId,
  fileType,
  show,
  setShow,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setServerError(null);

    try {
      // Only attempt Cloudinary deletion if a publicId exists
      if (publicId && publicId !== "null" && publicId !== "") {
        await deleteMediaAction(publicId, fileType);
      }
      // 2. Delete Database Record
      const response = await deletePostAction(postId);

      if (response && response.success === false) {
        setServerError(
          response.errors?.server?.[0] || "Failed to drop database record.",
        );
        setIsDeleting(false);
      }
    } catch (error) {
      if (
        error.message === "NEXT_REDIRECT" ||
        error.digest?.includes("NEXT_REDIRECT")
      ) {
        throw error;
      }
      console.error("Delete Post Action Error Log:", error);
      setServerError("A critical network handshake error occurred.");
      setIsDeleting(false);
    }
  };

  if (!show) return null;

  return (
    <div className=' relative bg-slate-950/80 backdrop-blur-sm flex items-center justify-center  p-4 animate-fade-in'>
      {/* GLOWING WARNING CORE BOX */}
      <div className='absolute -top-70 w-full max-w-md bg-slate-900/90 border border-slate-800/90 z-100 rounded-2xl p-4 sm:p-4 shadow-2xl space-y-5'>
        {/* HEADER IDENTITY */}
        <div className='flex items-center space-x-3 text-rose-400'>
          <div className='w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-mono font-bold text-lg'>
            !
          </div>
          <div>
            <h2 className='text-lg font-extrabold text-slate-100 tracking-tight'>
              Confirm Schema Destruction
            </h2>
            <p className='text-xs font-mono text-slate-500'>
              TARGET: POST_ID_{postId}
            </p>
          </div>
        </div>

        {/* DESCRIPTION MESSAGE */}
        <p className='text-sm text-slate-400 leading-relaxed font-normal'>
          Are you absolutely sure you want to drop this record from the database
          instance? This action cannot be reverted.
        </p>

        {/* DYNAMIC SERVER ERROR NOTIFICATION DRAWER */}
        {serverError && (
          <p className='p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-mono font-medium leading-normal'>
            [ERR]: {serverError}
          </p>
        )}

        {/* SYSTEM CONTROL ACTIONS */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className='flex flex-col sm:flex-row items-center justify-end gap-3 pt-2'>
          <button
            type='button'
            disabled={isDeleting}
            onClick={() => setShow(false)}
            className='w-full sm:w-auto text-center px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'>
            Abort Action
          </button>

          <button
            type='submit'
            disabled={isDeleting}
            className='w-full sm:w-auto text-center px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-slate-950 rounded-xl transition-colors disabled:bg-rose-900/40 disabled:text-rose-400/40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-rose-500/10'>
            {isDeleting ? "Purging Record..." : "Purge Record"}
          </button>
        </form>
      </div>
    </div>
  );
}
