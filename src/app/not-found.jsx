// src/app/not-found.jsx
import Link from "next/link";
export const dynamic = "force-dynamic";
export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6'>
      <h2 className='text-6xl font-black text-emerald-500 mb-4'>404</h2>
      <p className='text-xl font-mono text-slate-400 mb-8'>
        Pulse signal lost. The requested data node does not exist.
      </p>
      <Link
        href='/'
        className='px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition'>
        Return to Home
      </Link>
    </div>
  );
}
