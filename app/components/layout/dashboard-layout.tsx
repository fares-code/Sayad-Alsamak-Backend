'use client';

import { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-20'} hidden md:block`}>
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <Navbar />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}