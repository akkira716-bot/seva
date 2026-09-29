import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Shield, PhoneCall, ExternalLink, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-teal-400 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">SEVA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evidence-based maternal and infant care platform supporting families through pregnancy, birth, postpartum healing, and early childhood vitality.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-teal-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-tracking public browsing</span>
            </div>
          </div>

          {/* Clinical Stages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Care Stages</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/articles?stage=pregnancy" className="hover:text-rose-300 transition">
                  Pregnancy & Prenatal Care
                </Link>
              </li>
              <li>
                <Link href="/articles?stage=postpartum" className="hover:text-rose-300 transition">
                  Postpartum & Fourth Trimester
                </Link>
              </li>
              <li>
                <Link href="/articles?stage=baby_care" className="hover:text-rose-300 transition">
                  Newborn & Baby Care
                </Link>
              </li>
              <li>
                <Link href="/urgent-help" className="text-rose-400 font-semibold hover:text-rose-300 transition">
                  Urgent Red Flag Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Directory & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Resources & Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/providers" className="hover:text-rose-300 transition">
                  Verified Provider Directory
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:text-rose-300 transition">
                  Appointment Organizer
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="hover:text-rose-300 transition">
                  Daily Care Logs (Feed & Sleep)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-rose-300 transition">
                  Clinical Reviewer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical & Privacy Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Governance & Standards</h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1 text-slate-300 font-semibold">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>WHO Health Data Governance</span>
              </div>
              <p>Designed following WHO digital health privacy, user data ownership, and encryption principles.</p>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-[11px] text-rose-300">
              <div className="flex items-center gap-1 font-semibold mb-1">
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                <span>Immediate 24/7 Support</span>
              </div>
              <p>US Maternal Mental Health: <strong>1-833-943-5746</strong></p>
              <p>Crisis & Suicide Lifeline: <strong>Call/Text 988</strong></p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 leading-relaxed">
          <p className="mb-2">
            <strong className="text-slate-400">Medical Disclaimer:</strong> The content provided through SEVA is for educational and organizational purposes only and is not a substitute for professional medical advice, diagnosis, or clinical treatment. Always seek the advice of your obstetrician, pediatrician, midwife, or qualified healthcare professional with any questions regarding medical symptoms or emergency conditions.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} SEVA Platform. Architecture blueprint implementation.</span>
            <div className="flex items-center gap-4">
              <Link href="/urgent-help" className="hover:underline">Emergency Protocols</Link>
              <Link href="/organizer" className="hover:underline">Data Deletion & Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
