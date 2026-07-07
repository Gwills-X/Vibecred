import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <Link
      href='/'
      className='inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8'>
      <ArrowLeft size={16} /> Back to Dashboard
    </Link>
  );
}
