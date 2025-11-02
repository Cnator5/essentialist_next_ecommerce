'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import UserMenu from '../../components/UserMenu';

const DashboardLayout = ({ children }) => {
  const user = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="bg-white min-h-screen">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold text-lg">Dashboard</div>
        <button
          type="button"
          className="p-2 rounded-md border border-gray-200"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open dashboard menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile overlay */}
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } lg:hidden`}
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close dashboard menu overlay"
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r shadow-lg transition-transform transform lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ transition: 'transform 0.2s ease-in-out' }}
        aria-label="Dashboard navigation"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold text-lg">
            {user?.name ? `${user.name}'s Menu` : 'Menu'}
          </div>
          <button
            type="button"
            className="p-2 rounded-md border border-gray-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close dashboard menu"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          <UserMenu onSelect={() => setMobileMenuOpen(false)} />
        </div>
      </aside>

      {/* Desktop layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
        <div className="grid  lg:grid-cols-[160px,2fr]">
          <aside className="hidden lg:block border border-slate-200 rounded-lg shadow-sm">
            <div className="p-4 sticky top-20 max-h-[calc(100vh-160px)] overflow-y-auto">
              <UserMenu />
            </div>
          </aside>

          <main className="min-h-[70vh]">
            {children}
          </main>
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;