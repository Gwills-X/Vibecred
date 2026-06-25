"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks = ({ label, href, className = "" }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Isolate active vs inactive base classes so custom parent styles don't conflict
  const dynamicStyles = isActive
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
    : className
      ? "" // If a custom parent style block is passed for a state (like Register), bypass defaults
      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50";

  return (
    <Link
      href={href}
      className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ease-in-out ${dynamicStyles} ${className}`}>
      {label}
    </Link>
  );
};

export default NavLinks;
