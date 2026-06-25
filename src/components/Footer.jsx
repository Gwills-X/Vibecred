import React from "react";

const Footer = () => {
  return (
    <footer className='w-full bg-slate-950 border-t border-slate-900 text-slate-400 mt-auto selection:bg-emerald-500/10 selection:text-emerald-400'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm'>
        {/* Left Side: VibeCred Platform Node Signature & Author Credit */}
        <div className='flex flex-col md:flex-row items-center gap-2 text-center md:text-left'>
          <h5 className='font-black text-slate-200 tracking-tighter text-base font-sans'>
            VibeCred
            <span className='text-emerald-400 font-mono text-xs ml-1'>
              //NET
            </span>
          </h5>
          <span className='hidden md:inline text-slate-800 font-mono'>|</span>
          <p className='text-xs text-slate-500 font-medium font-mono'>
            Engineered by{" "}
            <span className='text-slate-300 font-bold hover:text-emerald-400 transition-colors cursor-pointer'>
              GW-TECK
            </span>
          </p>
        </div>

        {/* Right Side: Structural Hash and Chronology Stamps */}
        <div className='flex flex-col sm:flex-row items-center gap-3 text-xs tracking-wider text-slate-600 font-mono font-semibold uppercase text-center sm:text-right'>
          <div>SYS_STATUS // ONLINE</div>
          <span className='hidden sm:inline text-slate-800'>•</span>
          <div>&copy; {new Date().getFullYear()} Matrix State Verified</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
