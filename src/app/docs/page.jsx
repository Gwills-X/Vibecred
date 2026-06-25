import React from "react";
import Link from "next/link";

export default function DocsPage() {
  const systemProtocols = [
    { id: "intro", label: "01 // Introduction" },
    { id: "terminology", label: "02 // Core Terminology" },
    { id: "grace-window", label: "03 // The Grace Window" },
    { id: "architecture", label: "04 // Dual-Engine Data Layer" },
    { id: "engagement", label: "05 // Engagement Loops" },
  ];

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
      {/* HEADER SECTION */}
      <div className='border-b border-slate-900 pb-8 mb-12 space-y-2 relative'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none'></div>
        <span className='text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase'>
          VibeCred System Manual v1.0.0
        </span>
        <h1 className='text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent'>
          Engine Core & Protocol Docs
        </h1>
        <p className='text-sm text-slate-400 max-w-2xl leading-relaxed'>
          Technical reference specifications for navigating the VibeCred
          micro-network layout, data contracts, and operational state variables.
        </p>
      </div>

      {/* CORE TWO-COLUMN DOCUMENTATION LAYOUT */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-12 items-start'>
        {/* LEFT COLUMN: STICKY SIDEBAR INDEX */}
        <aside className='hidden lg:block lg:sticky lg:top-24 space-y-4'>
          <h3 className='text-xs font-mono font-bold uppercase tracking-wider text-slate-500 pl-2'>
            System Index
          </h3>
          <nav className='flex flex-col gap-1 border-l border-slate-900'>
            {systemProtocols.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className='text-xs font-mono font-bold py-2.5 pl-4 -ml-[1px] border-l border-transparent hover:border-slate-700 text-slate-400 hover:text-emerald-400 transition-all block tracking-tight'>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* RIGHT COLUMN: HIGH-DENSITY DOCUMENTATION BODY */}
        <div className='lg:col-span-3 space-y-16 max-w-3xl font-sans text-slate-300 leading-relaxed text-sm'>
          {/* SECTION 1: INTRODUCTION */}
          <section id='intro' className='scroll-mt-24 space-y-4'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>01 /</span> Introduction
            </h2>
            <p>
              VibeCred is an asynchronous developer micro-hub designed to move
              away from standard, formal blogging architectures. It merges
              high-performance digital asset delivery with rapid social feedback
              vectors.
            </p>
            <p>
              The system functions as a decoupled stack utilizing unified logic
              repositories capable of altering its target database interface
              dynamically without changing view-layer components.
            </p>
          </section>

          <hr className='border-slate-900' />

          {/* SECTION 2: CORE TERMINOLOGY */}
          <section id='terminology' className='scroll-mt-24 space-y-6'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>02 /</span> Core Terminology
            </h2>
            <p>
              To maintain structural alignment with the platform brand
              guidelines, developers must preserve the following lexicon
              transformations within technical context structures:
            </p>

            <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4'>
              <div className='p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-2'>
                <h4 className='font-mono text-xs font-black text-emerald-400 uppercase tracking-wider'>
                  📡 The Pulse
                </h4>
                <p className='text-xs text-slate-400 leading-normal'>
                  A fast broadcast event mapping directly to our content tables.
                  Represents micro-posts, logs, snippet analysis, and general
                  announcements.
                </p>
              </div>

              <div className='p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-2'>
                <h4 className='font-mono text-xs font-black text-emerald-400 uppercase tracking-wider'>
                  🛡️ Vibe Credibility
                </h4>
                <p className='text-xs text-slate-400 leading-normal'>
                  The mathematical evaluation of structural interactions across
                  identity matrices, driven by client engagement values.
                </p>
              </div>

              <div className='p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-2'>
                <h4 className='font-mono text-xs font-black text-amber-500 uppercase tracking-wider'>
                  🔒 Matrix State Locking
                </h4>
                <p className='text-xs text-slate-400 leading-normal'>
                  The security runtime routine responsible for calculating
                  absolute operational lifespan metrics before restricting
                  mutation endpoints.
                </p>
              </div>

              <div className='p-4 rounded-xl bg-slate-900/40 border border-slate-900 space-y-2'>
                <h4 className='font-mono text-xs font-black text-rose-500 uppercase tracking-wider'>
                  🛑 Kill_Session
                </h4>
                <p className='text-xs text-slate-400 leading-normal'>
                  The destruction routine mapping over standard logouts to
                  immediately terminate cryptographic signatures and purge local
                  session state keys.
                </p>
              </div>
            </div>
          </section>

          <hr className='border-slate-900' />

          {/* SECTION 3: THE GRACE WINDOW */}
          <section id='grace-window' className='scroll-mt-24 space-y-4'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>03 /</span> The Grace Window
            </h2>
            <p>
              VibeCred introduces a structural mutation constraint model to
              protect chronological timeline contexts. When a user creates a new
              Pulse, a programmatic grace window calculation activates
              immediately.
            </p>

            <blockquote className='p-4 rounded-xl bg-slate-900/30 border-l-2 border-amber-500 text-slate-400 text-xs font-mono space-y-1'>
              <p className='font-bold text-slate-300'>
                ⚠️ MUTATION RULES ENGINE SPECIFICATION:
              </p>
              <p>Grace Window Duration: 30 Minutes (1,800,000 ms)</p>
              <p>
                Allowed Mutations: Edit (Allowed), Delete (Permanently Unlocked)
              </p>
            </blockquote>

            <p className='pt-2'>
              Upon expiration of the 30-minute metric wrapper calculated
              dynamically in the client view layer via epoch timestamp
              differences (`currentMs - createdAtMs`), the edit route drops into
              an unalterable **Locked state**. This preserves real-time records
              against retroactive value shifting.
            </p>
          </section>

          <hr className='border-slate-900' />

          {/* SECTION 4: DUAL-ENGINE DATA LAYER */}
          <section id='architecture' className='scroll-mt-24 space-y-4'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>04 /</span> Dual-Engine Data
              Layer
            </h2>
            <p>
              The platform implements a unique architecture layer driven by a
              centralized interface module known as the `dataEngine`. This
              decouples standard data flows from rigid schema implementations,
              permitting painless hot-swaps between two distinct operational
              platforms:
            </p>

            <div className='overflow-x-auto pt-2'>
              <table className='w-full text-left font-mono text-xs border border-slate-900 rounded-xl overflow-hidden'>
                <thead>
                  <tr className='bg-slate-900 border-b border-slate-800 text-slate-400 [&_th]:p-3'>
                    <th>Driver Module</th>
                    <th>Database Engine Type</th>
                    <th>ID Resolution Strategy</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-900 [&_td]:p-3 text-slate-300'>
                  <tr>
                    <td className='text-emerald-400 font-bold'>MySQL Driver</td>
                    <td>Relational Storage Layer</td>
                    <td>Auto-Increment String cast IDs</td>
                  </tr>
                  <tr>
                    <td className='text-emerald-400 font-bold'>
                      Firebase Driver
                    </td>
                    <td>NoSQL Document Collections</td>
                    <td>Unique Alphanumeric Doc Strings</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className='pt-2'>
              All responses from individual queries pass through object
              normalization transformers to guarantee property consistency
              (`id`, `title`, `content`, `authorId`, `authorName`, `createdAt`)
              across the consuming client views.
            </p>
          </section>

          <hr className='border-slate-900' />

          {/* SECTION 5: ENGAGEMENT LOOPS */}
          <section id='engagement' className='scroll-mt-24 space-y-4'>
            <h2 className='text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2 font-mono'>
              <span className='text-emerald-400'>05 /</span> Engagement Loops
            </h2>
            <p>
              Every pulse on VibeCred features integrated tracking modules
              designed to manage community interaction hooks cleanly without
              causing major UI layout shifts:
            </p>
            <ul className='list-disc list-inside pl-2 space-y-2 text-slate-400 text-xs sm:text-sm'>
              <li>
                <strong className='text-slate-200 font-mono'>
                  Like Junction Mappings:
                </strong>{" "}
                Employs compound index references combining user identities with
                post document pointers to avoid bulk record processing scans.
              </li>
              <li>
                <strong className='text-slate-200 font-mono'>
                  Comment Vectors (Blueprint):
                </strong>{" "}
                Prepared layout placeholders allowing chronological messaging
                trees to link seamlessly underneath core parent tracking IDs.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
