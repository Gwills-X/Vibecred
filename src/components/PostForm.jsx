"use client";

import { useActionState, useState, useRef } from "react";
// Import your storage services and actions
import { uploadMedia } from "@/services/storageService";
import { deleteMediaAction } from "@/actions/storageActions";

export default function BlogPostForm({ handler }) {
  // Initialize state action for form submission tracking
  const [state, formAction, isPending] = useActionState(handler, {
    title: "",
    content: "",
    errors: {},
  });

  // State elements to capture Cloudinary upload metadata
  const [mediaUrl, setMediaUrl] = useState(null);
  const [publicId, setPublicId] = useState(null); // 🌟 State to hold the publicId
  const [fileType, setFileType] = useState("none");
  const [format, setFormat] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Refs to manage DOM elements and asset tracking
  const publicIdRef = useRef(null);
  const formRef = useRef(null);

  /**
   * Handles the background file upload processing instantly upon selection
   */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Destructure data keys directly from your updated storageService layer
      const {
        url,
        publicId: uploadedPublicId, // 🌟 Renamed for clarity
        fileType: uploadedType,
        format: uploadedFormat,
      } = await uploadMedia(file);

      // Save to component state
      setMediaUrl(url);
      setPublicId(uploadedPublicId); // 🌟 Update state with publicId
      setFileType(uploadedType || "none");
      setFormat(uploadedFormat || null);

      setUploading(false);
      publicIdRef.current = uploadedPublicId; // Track in Ref for reliable deletion

      // 🌟 Explicit console log to verify capture
      console.log("File uploaded successfully. Metadata captured:", {
        url,
        publicId: uploadedPublicId,
        uploadedType,
        uploadedFormat,
      });
    } catch (error) {
      console.error("Error uploading file to Cloudinary pipeline:", error);
      setUploading(false);
    }
  };

  /**
   * Disposes of the uploaded asset from Cloudinary and flushes local state
   */
  const handleRemoveImage = async () => {
    if (publicIdRef.current) {
      await deleteMediaAction(publicIdRef.current, fileType);
    }
    setMediaUrl(null);
    setPublicId(null); // 🌟 Clear state
    setFileType("none");
    setFormat(null);
    publicIdRef.current = null;
  };

  /**
   * Intercepts standard form actions to manually force injection of metadata fields
   */
  const handleSubmit = async (formData) => {
    // Inject metadata fields including publicId into FormData
    formData.set("mediaUrl", mediaUrl || "");
    formData.set("publicId", publicId || ""); // 🌟 Ensure this is sent to the server action
    formData.set("fileType", fileType || "none");
    formData.set("format", format || "");

    console.log("Transmitting complete payload state metadata package:", {
      title: formData.get("title"),
      publicId: formData.get("publicId"), // 🌟 Log verification
      mediaUrl: formData.get("mediaUrl"),
      fileType: formData.get("fileType"),
      format: formData.get("format"),
    });

    await formAction(formData);
  };

  /**
   * Dynamic Runtime Conditional UI Preview Grid Component
   */
  const renderPreview = () => {
    if (!mediaUrl) return null;

    if (fileType === "video") {
      return (
        <video
          src={mediaUrl}
          controls
          className='max-h-40 max-w-full rounded-lg border border-slate-700 shadow-lg bg-black'
        />
      );
    }

    if (fileType === "raw") {
      return (
        <div className='flex items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-lg'>
          <span className='text-xl'>📄</span>
          <div className='flex flex-col'>
            <span className='text-xs text-slate-400 font-mono uppercase font-bold tracking-wider'>
              Document Ready
            </span>
            <span className='text-xs text-emerald-400 font-mono'>
              {format?.toUpperCase() || "RAW"} ATTACHMENT
            </span>
          </div>
        </div>
      );
    }

    return (
      <img
        src={mediaUrl}
        alt='Preview'
        className='max-h-40 rounded shadow-lg object-contain border border-slate-800'
      />
    );
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className='max-w-2xl mx-auto pt-4 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 space-y-6'>
      <div className='space-y-1 px-6'>
        <h2 className='text-2xl font-bold tracking-tight text-slate-100'>
          Create New Post
        </h2>
        <p className='text-sm text-slate-400'>
          Share your latest insights and technical updates
        </p>
      </div>
      {state?.errors?.server && (
        <div className='mx-6 p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-mono'>
          {state.errors.server[0]}
        </div>
      )}
      {/* Title Input Field */}
      <div className='flex flex-col space-y-1.5 px-6'>
        <label htmlFor='title' className='text-sm font-medium text-slate-300'>
          Title
        </label>
        <input
          type='text'
          id='title'
          name='title'
          defaultValue={state?.title || ""}
          disabled={isPending}
          className='w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50'
          placeholder='Enter post title'
        />
      </div>
      {/* Content Input Field */}
      <div className='flex flex-col space-y-1.5 px-6'>
        <label htmlFor='content' className='text-sm font-medium text-slate-300'>
          Content
        </label>
        <textarea
          id='content'
          name='content'
          rows='6'
          defaultValue={state?.content || ""}
          disabled={isPending}
          className='w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm resize-none disabled:opacity-50'
          placeholder='Write your post content here...'></textarea>
      </div>
      {/* --- HIDDEN INJECTIONS FOR THE DATA PIPELINE BACKEND SYNC --- */}
      <input type='hidden' name='mediaUrl' value={mediaUrl || ""} />
      <input type='hidden' name='publicId' value={publicId || ""} />{" "}
      {/* 🌟 Added hidden input */}
      <input type='hidden' name='fileType' value={fileType || "none"} />
      <input type='hidden' name='format' value={format || ""} />
      {/* File Upload Configuration Layer */}
      <div className='space-y-2 px-6'>
        <label className='text-sm font-medium text-slate-300'>
          Attach File
        </label>
        <input
          type='file'
          accept='image/*, video/mp4, video/x-m4v, video/quicktime, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          onChange={handleFileChange}
          disabled={uploading || isPending}
          className='text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 file:transition-colors file:cursor-pointer disabled:opacity-50'
        />

        {uploading && (
          <p className='text-emerald-500 text-xs animate-pulse font-mono'>
            Uploading to cloud matrix...
          </p>
        )}

        {mediaUrl && (
          <div className='mt-4 p-4 border border-slate-800 bg-slate-950/40 rounded-xl transition-all duration-300'>
            <p className='text-xs text-emerald-400 font-mono font-bold tracking-wider mb-2.5 uppercase'>
              Payload Preview:
            </p>

            {renderPreview()}

            <button
              type='button'
              onClick={handleRemoveImage}
              className='mt-3 block text-xs text-rose-400 hover:text-rose-300 underline font-mono cursor-pointer transition-colors'>
              Remove Attachment
            </button>
          </div>
        )}
      </div>
      {/* Submission Control Core */}
      <div className='pt-2 px-6 pb-6'>
        <button
          type='submit'
          disabled={isPending || uploading}
          className='w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-semibold rounded-lg shadow-md transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase font-mono tracking-wider'>
          {isPending ? "Transmitting..." : "Create Post"}
        </button>
      </div>
    </form>
  );
}
