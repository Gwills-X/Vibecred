import React from "react";
import NavLinks from "./NavLinks";
import { logout } from "@/actions/auth";
import MobileMenu from "./MobileMenu";
import getAuthUser from "@/lib/getAuthUser";
import { Home, FileText, PlusCircle, LogOut } from "lucide-react";
import Link from "next/link";

const NavBar = async () => {
  const authUser = await getAuthUser();
  const userRole = authUser?.role || "guest";

  const LinksMarkup = ({ isMobile = false }) => (
    <ul
      className={`${
        isMobile
          ? "flex flex-col gap-4 text-sm w-full"
          : "hidden md:flex items-center gap-6 text-sm"
      } font-medium text-slate-400 [&_li]:transition-colors [&_li]:duration-200`}>
      {/* MOBILE IDENTITY */}
      {isMobile && authUser && (
        <li className='flex items-center gap-3 border-b border-slate-900 pb-4 mb-2'>
          <div className='w-10 h-10 rounded-full border border-slate-800 overflow-hidden shrink-0'>
            {authUser?.profile_pic_url ? (
              <img
                src={authUser.profile_pic_url}
                alt='Avatar'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='flex items-center justify-center h-full bg-slate-800 text-xs font-bold text-slate-400'>
                {authUser.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className='text-white font-bold text-sm truncate'>
              {authUser?.name || "User"}
            </div>
            <div className='text-[10px] text-emerald-500 uppercase tracking-wider'>
              {userRole}
            </div>
          </div>
        </li>
      )}

      {authUser ? (
        <>
          {/* Desktop Profile Icon */}
          {!isMobile && (
            <li className='flex items-center'>
              <Link
                href='/dashboard/settings'
                className='w-8 h-8 rounded-full border border-slate-800 overflow-hidden hover:border-emerald-500 transition-all'>
                {authUser?.profile_pic_url ? (
                  <img
                    src={authUser.profile_pic_url}
                    alt='Avatar'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full bg-slate-800 text-xs font-bold text-emerald-500'>
                    {authUser.name?.charAt(0)}
                  </div>
                )}
              </Link>
            </li>
          )}

          <li className='hover:text-white'>
            <NavLinks label='Dashboard' href='/dashboard' />
          </li>
          <li className='hover:text-white'>
            <NavLinks label='New Post' href='/posts/create' />
          </li>
          <li>
            <form action={logout}>
              <button
                type='submit'
                className='text-rose-400 hover:text-rose-300 text-sm font-medium transition-colors'>
                Sign Out
              </button>
            </form>
          </li>
        </>
      ) : (
        <>
          <li className='hover:text-white'>
            <NavLinks label='Sign In' href='/login' />
          </li>
          <li>
            <NavLinks
              label='Create Account'
              href='/register'
              className='bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-lg font-bold transition-all block text-sm'
            />
          </li>
        </>
      )}
    </ul>
  );

  return (
    <header className='w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-2'>
            <img
              src='/vibe cred.png'
              alt='Logo'
              width='35'
              className='object-contain'
            />
            <span className='font-bold text-white text-lg tracking-tight'>
              VibeCred
            </span>
          </Link>

          <div className='hidden sm:flex items-center gap-6 text-sm text-slate-400'>
            <NavLinks
              href='/'
              label={
                <span className='hover:text-white transition-colors'>Home</span>
              }
            />
            <NavLinks
              href='/docs'
              label={
                <span className='hover:text-white transition-colors'>
                  Resources
                </span>
              }
            />
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
