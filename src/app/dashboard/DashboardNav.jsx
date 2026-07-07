"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  const tabs = [
    { name: "My Posts", href: "/dashboard" },
    { name: "Chats", href: "/dashboard/chats" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Media Vault", href: "/dashboard/media" },
    { name: "Network", href: "/dashboard/network" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    // 'flex-row' for mobile/horizontal, 'lg:flex-col' for desktop sidebar
    <nav className='flex flex-row lg:flex-col gap-1 p-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl w-full lg:w-64 shadow-2xl overflow-x-auto lg:overflow-visible'>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 whitespace-nowrap ${
              isActive
                ? "text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}>
            {tab.name}
            {/* Active Indicator: Side bar on desktop, Bottom underline on mobile */}
            {isActive && (
              <span className='absolute lg:left-0 lg:top-3 lg:bottom-3 lg:w-1 lg:h-auto lg:rounded-r-full bottom-1 left-4 right-4 h-0.5 rounded-full bg-emerald-500 animate-in fade-in zoom-in duration-300' />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
