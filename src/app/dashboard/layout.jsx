// src/app/dashboard/layout.jsx
import DashboardNav from "./DashboardNav";
export const dynamic = "force-dynamic";
export default function DashboardLayout({ children }) {
  return (
    <div className='flex flex-col lg:flex-row min-h-screen '>
      {/* Sidebar container - visible on desktop */}
      <aside className='hidden lg:block w-64 p-6 sticky top-10 h-screen'>
        <DashboardNav />
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-4 lg:pt-8'>
        {/* Mobile Nav - visible only on small screens */}
        <div className='lg:hidden mb-6'>
          <DashboardNav />
        </div>
        {children}
      </main>
    </div>
  );
}
