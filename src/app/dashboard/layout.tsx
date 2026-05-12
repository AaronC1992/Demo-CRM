'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UserPlus, Users, Wrench, FileText, Receipt,
  Bell, BarChart2, RefreshCw, Settings, Menu, X, ChevronRight, Phone
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/leads', icon: UserPlus, label: 'Leads' },
  { href: '/dashboard/customers', icon: Users, label: 'Customers' },
  { href: '/dashboard/jobs', icon: Wrench, label: 'Jobs' },
  { href: '/dashboard/quotes', icon: FileText, label: 'Quotes' },
  { href: '/dashboard/invoices', icon: Receipt, label: 'Invoices' },
  { href: '/dashboard/follow-ups', icon: Bell, label: 'Follow Ups' },
  { href: '/dashboard/reports', icon: BarChart2, label: 'Reports' },
  { href: '/dashboard/quickbooks', icon: RefreshCw, label: 'QuickBooks Sync' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function SidebarContent({ pathname, onLinkClick }: { pathname: string; onLinkClick?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-indigo-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Pinnacle CRM</p>
            <p className="text-indigo-300 text-xs">Home Services</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} size={18} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-indigo-300" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: view website link */}
      <div className="px-3 py-4 border-t border-indigo-700">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 text-sm transition-colors">
          <Phone size={16} />
          View Business Website
        </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-indigo-700 flex-col shrink-0">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-indigo-700 flex flex-col">
            <button
              className="absolute top-4 right-4 text-indigo-200 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
            <SidebarContent pathname={pathname} onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0 z-10">
          <button className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          {/* Demo banner */}
          <div className="flex-1 flex justify-center">
            <span className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
              Demo Mode: This dashboard uses sample data only.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              M
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
