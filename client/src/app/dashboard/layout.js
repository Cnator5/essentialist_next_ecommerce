'use client'

import React, { useState } from 'react';
import UserMenu from '../../components/UserMenu';
import { useSelector } from 'react-redux';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const user = useSelector(state => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="bg-white">
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b">
        <div className="font-bold text-lg">Dashboard</div>
        <button
          className="p-2 rounded-md border border-gray-200"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${mobileMenuOpen ? 'block' : 'hidden'}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close menu overlay"
      ></div>
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg border-r transition-transform transform
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}
        style={{ transition: 'transform 0.2s' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-bold text-lg">Menu</div>
          <button
            className="p-2 rounded-md border border-gray-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <UserMenu onSelect={() => setMobileMenuOpen(false)} />
        </div>
      </aside>


        {/* Main content */}
        <main className="bg-white min-h-[75vh]">
          {children}
        </main>
    </section>
  );
};

export default DashboardLayout;