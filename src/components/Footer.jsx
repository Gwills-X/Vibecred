import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className='w-full bg-slate-950 border-t border-slate-900 text-slate-400 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Branding Section */}
          <div className='col-span-1 md:col-span-2 space-y-2'>
            <h5 className='font-bold text-white text-lg'>VibeCred</h5>
            <p className='text-sm text-slate-500 max-w-xs'>
              A professional collective for sharing insights, perspectives, and
              ideas across all disciplines.
            </p>
            <p className='text-xs pt-4'>
              Built by{" "}
              <span className='text-emerald-400 font-semibold'>GW-TECK</span>
            </p>
          </div>

          {/* Useful Links */}
          <div className='space-y-3'>
            <h6 className='text-xs font-bold text-slate-200 uppercase tracking-wider'>
              Community
            </h6>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/about'
                  className='hover:text-emerald-400 transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/guidelines'
                  className='hover:text-emerald-400 transition-colors'>
                  Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='hover:text-emerald-400 transition-colors'>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className='space-y-3'>
            <h6 className='text-xs font-bold text-slate-200 uppercase tracking-wider'>
              Legal
            </h6>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/privacy'
                  className='hover:text-emerald-400 transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='hover:text-emerald-400 transition-colors'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='hover:text-emerald-400 transition-colors'>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-600'>
          &copy; {new Date().getFullYear()} VibeCred Collective. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
