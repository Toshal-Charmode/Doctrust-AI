import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import LiquidBackground from '../biometrics/LiquidBackground';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col font-sans selection:bg-[#FFC5AA]/40 selection:text-slate-900 relative">
      <LiquidBackground variant="pastel" />
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
