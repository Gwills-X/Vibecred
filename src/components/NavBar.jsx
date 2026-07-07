import React from "react";
import NavLinks from "./NavLinks";
import { logout } from "@/actions/auth";
import MobileMenu from "./MobileMenu";
import getAuthUser from "@/lib/getAuthUser";
import { Home, FileText } from "lucide-react";
import Link from "next/link";

const NavBar = async () => {
  const authUser = await getAuthUser();

  // Default to 'guest' if not logged in
  const userRole = authUser?.role || "guest";

  const LinksMarkup = ({ isMobile = false }) => (
    <ul
      className={`${
        isMobile
          ? "flex flex-col gap-4 text-sm w-full"
          : "hidden md:flex items-center gap-6 text-xs"
      } font-mono uppercase tracking-wider text-slate-400 [&_li]:transition-colors [&_li]:duration-200`}>
      {/* MOBILE IDENTITY SNAPSHOT */}
      {isMobile && authUser && (
        <li className='flex items-center gap-3 border-b border-slate-900 pb-4 mb-2'>
          <div className='w-10 h-10 rounded-full border border-emerald-500/30 overflow-hidden shrink-0'>
            {authUser?.profile_pic_url ? (
              <img
                src={authUser.profile_pic_url}
                alt='Avatar'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='flex items-center justify-center h-full bg-slate-800 text-[10px] font-bold text-emerald-400'>
                GW
              </div>
            )}
          </div>
          <div>
            <div className='text-white font-bold text-sm truncate max-w-[150px]'>
              {authUser?.name || "User"}
            </div>
            <div className='text-[10px] text-emerald-400 uppercase tracking-widest'>
              {userRole}
            </div>
          </div>
        </li>
      )}

      {isMobile && (
        <li className='hover:text-slate-200 border-b border-slate-900 pb-2'>
          <NavLinks label='System Docs' href='/docs' />
        </li>
      )}

      {authUser ? (
        <>
          {/* Admin Indicator */}
          {userRole === "admin" && (
            <li className='text-amber-400 font-bold tracking-widest text-[10px]'>
              [ADMIN]
            </li>
          )}

          {/* Desktop Profile Icon */}
          {!isMobile && (
            <li className='flex items-center'>
              <Link
                href='/dashboard/settings'
                className='w-8 h-8 rounded-full border border-emerald-500/30 overflow-hidden hover:border-emerald-400 transition-all'>
                {authUser?.profile_pic_url ? (
                  <img
                    src={authUser.profile_pic_url}
                    alt='Avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full bg-slate-800 text-[10px] font-bold text-emerald-400'>
                    GW
                  </div>
                )}
              </Link>
            </li>
          )}

          <li className='hover:text-slate-200'>
            <NavLinks label='Dashboard' href='/dashboard' />
          </li>
          <li className='hover:text-slate-200'>
            <NavLinks label='Pulse' href='/posts/create' />
          </li>
          <li className={isMobile ? "pt-2 border-t border-slate-900" : ""}>
            <form action={logout} className='flex items-center w-full'>
              <button
                type='submit'
                className='bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-widest border border-rose-500/20 hover:border-rose-500 transition-all duration-200 cursor-pointer w-full text-center md:w-auto'>
                Kill_Session
              </button>
            </form>
          </li>
        </>
      ) : (
        <>
          <li className='text-slate-600 italic tracking-widest'>[GUEST]</li>
          <li className='hover:text-slate-200 flex items-center'>
            <NavLinks label='Login' href='/login' />
          </li>
          <li className={isMobile ? "w-full" : ""}>
            <NavLinks
              label='Join Network'
              href='/register'
              className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-lg font-bold shadow-md shadow-emerald-500/5 transition-all duration-200 block text-[11px] uppercase tracking-wider text-center'
            />
          </li>
        </>
      )}
    </ul>
  );

  return (
    <header className='w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 selection:bg-emerald-500/10 selection:text-emerald-400'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative'>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-1.5'>
            <img
              src='/vibe cred.png'
              alt='VibeCred Logo'
              width='45'
              className='object-contain'
            />
            <span className='font-black text-slate-100 tracking-tighter text-base font-sans hidden sm:block'>
              VibeCred
            </span>
          </div>

          <div className='flex items-center gap-4 text-slate-500'>
            <NavLinks
              href='/'
              label={
                <div className='flex items-center gap-2 hover:text-emerald-400 transition-colors'>
                  <Home size={18} />
                  <span className='hidden sm:inline font-mono text-xs uppercase tracking-wider'>
                    Home
                  </span>
                </div>
              }
            />
            <ul className='hidden sm:flex items-center text-xs font-mono uppercase tracking-wider hover:text-emerald-400 transition-colors duration-200'>
              <li>
                <NavLinks
                  label={
                    <div className='flex items-center gap-2'>
                      <FileText size={18} />
                      <span>// Docs</span>
                    </div>
                  }
                  href='/docs'
                />
              </li>
            </ul>
          </div>
        </div>

        <LinksMarkup isMobile={false} />

        <MobileMenu>
          <LinksMarkup isMobile={true} />
        </MobileMenu>
      </nav>
    </header>
  );
};

export default NavBar;
