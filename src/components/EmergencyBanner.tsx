'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Phone, X, ShieldAlert } from 'lucide-react';

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside 
      aria-label="Urgent medical assistance"
      className="bg-rose-900 text-rose-50 px-4 py-2 text-xs sm:text-sm font-medium border-b border-rose-800 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-300"></span>
          </span>
          <span className="flex items-center gap-1.5 font-bold tracking-wide uppercase text-rose-200">
            <ShieldAlert className="w-4 h-4 text-rose-300 inline" /> Urgent Help:
          </span>
          <span className="text-rose-100">
            Experiencing severe headache, vision changes, heavy bleeding, or infant fever &gt;100.4°F?
          </span>
        </div>
        
        <div className="flex items-center space-x-3 ml-auto">
          <Link
            href="/urgent-help"
            className="underline underline-offset-2 hover:text-white font-semibold text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-300 rounded"
          >
            View Red Flag Matrix
          </Link>
          <a
            href="tel:18339435746"
            className="inline-flex items-center gap-1 bg-rose-800 hover:bg-rose-700 text-white px-2.5 py-1 rounded text-xs transition"
          >
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">24/7 Hotline:</span> 1-833-9-HELP4MOMS
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss urgent warning alert"
            className="text-rose-300 hover:text-white p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
