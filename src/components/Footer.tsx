'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Shield, PhoneCall, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

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
              <span className="text-xl font-bold text-white tracking-tight">{t('nav_brand_title')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-teal-400">
              <Lock className="w-3.5 h-3.5" />
              <span>{t('footer_zero_tracking')}</span>
            </div>
          </div>

          {/* Clinical Stages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">{t('footer_stages_heading')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/maatrusetu" className="text-teal-400 font-semibold hover:text-teal-300 transition">
                  {t('nav_maatrusetu')} (42-Day Care)
                </Link>
              </li>
              <li>
                <Link href="/articles?stage=pregnancy" className="hover:text-rose-300 transition">
                  {t('home_stage_pregnancy')}
                </Link>
              </li>
              <li>
                <Link href="/articles?stage=postpartum" className="hover:text-rose-300 transition">
                  {t('home_stage_postpartum')}
                </Link>
              </li>
              <li>
                <Link href="/articles?stage=baby_care" className="hover:text-rose-300 transition">
                  {t('home_stage_baby')}
                </Link>
              </li>
              <li>
                <Link href="/urgent-help" className="text-rose-400 font-semibold hover:text-rose-300 transition">
                  {t('banner_view_matrix')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Directory & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">{t('footer_resources_heading')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/providers" className="hover:text-rose-300 transition">
                  {t('nav_providers')}
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:text-rose-300 transition">
                  {t('nav_organizer')}
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="hover:text-rose-300 transition">
                  {t('nav_tracker')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-rose-300 transition">
                  {t('nav_admin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical & Privacy Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{t('footer_gov_heading')}</h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1 text-slate-300 font-semibold">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>{t('footer_who_label')}</span>
              </div>
              <p>{t('footer_who_desc')}</p>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-[11px] text-rose-300">
              <div className="flex items-center gap-1 font-semibold mb-1">
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('footer_support_label')}</span>
              </div>
              <p>Maternal Mental Health: <strong>1-833-943-5746</strong></p>
              <p>Crisis Lifeline: <strong>Call/Text 988</strong></p>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 leading-relaxed">
          <p className="mb-2">
            <strong className="text-slate-400">{t('footer_disclaimer_label')}</strong> {t('footer_disclaimer_text')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} {t('footer_copyright')}</span>
            <div className="flex items-center gap-4">
              <Link href="/urgent-help" className="hover:underline">{t('nav_urgent')}</Link>
              <Link href="/organizer" className="hover:underline">{t('organizer_tab_privacy')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
