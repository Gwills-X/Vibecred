"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();
  const tabs = [
    { name: "My Posts", href: "/dashboard" },
    { name: "Drafts", href: "/dashboard/drafts" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Media Vault", href: "/dashboard/media" },
    { name: "Network Pulse", href: "/dashboard/network" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <div className='flex flex-wrap gap-1 p-1 bg-slate-950/40 rounded-xl border border-white/5 w-fit'>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              isActive
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}>
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
