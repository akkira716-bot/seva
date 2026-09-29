'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HeartHandshake, 
  BookOpen, 
  Compass, 
  AlertCircle, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  Menu, 
  X,
  UserCheck
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/articles', label: 'Guidance & Articles', icon: BookOpen },
    { href: '/providers', label: 'Find Care Providers', icon: Compass },
    { href: '/urgent-help', label: 'Urgent Red Flags', icon: AlertCircle, badge: 'Urgent' },
    { href: '/organizer', label: 'My Appointments', icon: Calendar },
    { href: '/tracker', label: 'Care Tracker', icon: Activity },
    { href: '/admin', label: 'Clinical Portal', icon: ShieldCheck },
  ];

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-rose-200 transition transform group-hover:scale-105">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-800">SEVA</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">Health</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Mother & Child Care Platform</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Account / WHO Compliance indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/organizer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50/70 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Parent Portal</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
