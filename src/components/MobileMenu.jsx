"use client";

import React, { useState } from "react";

export default function MobileMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='md:hidden flex items-center'>
      {/* Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type='button'
        className='inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all border border-transparent hover:border-slate-800'
        aria-controls='mobile-menu'
        aria-expanded={isOpen}>
        <span className='sr-only'>Open main menu</span>
        {isOpen ? (
          <svg
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        ) : (
          <svg
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        )}
      </button>

      {/* Slide-out Backdrop and Container */}
      {isOpen && (
        <div
          id='mobile-menu'
          className='absolute top-16 left-0 w-full bg-slate-950/95 backdrop-blur-lg border-b border-slate-900 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50 flex flex-col shadow-2xl'>
          <div className='flex flex-col gap-4' onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
