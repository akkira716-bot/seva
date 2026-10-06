'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  HeartHandshake
} from 'lucide-react';
import { EMERGENCY_PROTOCOLS } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

export default function UrgentHelpPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'maternal' | 'infant' | 'mental_health'>('all');

  const filtered = activeTab === 'all' 
    ? EMERGENCY_PROTOCOLS 
    : EMERGENCY_PROTOCOLS.filter(p => p.category === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Urgent Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-900 text-rose-50 border-2 border-rose-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-300 font-extrabold uppercase tracking-wider text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>{t('urgent_banner_badge')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t('urgent_page_title')}
        </h1>
        <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-3xl">
          {t('urgent_page_desc')}
        </p>

        {/* Emergency numbers rapid row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <a
            href="tel:911"
            className="p-4 rounded-xl bg-rose-800 hover:bg-rose-700 text-white flex items-center justify-between transition group"
          >
            <div>
              <div className="text-[11px] text-rose-300 font-medium">{t('urgent_label_911')}</div>
              <div className="text-xl font-black">{t('urgent_call_911')}</div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:18339435746"
            className="p-4 rounded-xl bg-rose-800 hover:bg-rose-700 text-white flex items-center justify-between transition group"
          >
            <div>
              <div className="text-[11px] text-rose-300 font-medium">{t('urgent_label_hotline')}</div>
              <div className="text-sm font-black">{t('urgent_call_hotline')}</div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:988"
            className="p-4 rounded-xl bg-rose-800 hover:bg-rose-700 text-white flex items-center justify-between transition group"
          >
            <div>
              <div className="text-[11px] text-rose-300 font-medium">{t('urgent_label_988')}</div>
              <div className="text-xl font-black">{t('urgent_call_988')}</div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" role="tablist">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('urgent_tab_all')}
        </button>
        <button
          onClick={() => setActiveTab('maternal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'maternal'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          {t('urgent_tab_maternal')}
        </button>
        <button
          onClick={() => setActiveTab('infant')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'infant'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
          }`}
        >
          {t('urgent_tab_infant')}
        </button>
        <button
          onClick={() => setActiveTab('mental_health')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'mental_health'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
          }`}
        >
          {t('urgent_tab_mental')}
        </button>
      </div>

      {/* Protocols Grid */}
      <div className="space-y-6">
        {filtered.map((protocol) => (
          <section
            key={protocol.id}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl text-white ${
                  protocol.category === 'maternal'
                    ? 'bg-rose-600'
                    : protocol.category === 'infant'
                    ? 'bg-teal-600'
                    : 'bg-purple-600'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">{protocol.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{protocol.description}</p>
                </div>
              </div>
            </div>

            {/* Red flags list */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">
                {t('articles_urgent_indicators')}
              </div>
              <ul className="space-y-2">
                {protocol.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100/60">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span className="font-medium leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action and Hotline */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-slate-900 font-bold block mb-0.5">{t('urgent_req_action')}</strong>
                <span className="text-slate-600">{protocol.actionRequired}</span>
              </div>
              <div className="shrink-0 p-2 rounded-lg bg-white border border-slate-200 text-teal-900 font-semibold text-[11px] shadow-sm">
                {protocol.hotline}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Trust & Safe Sleep Reminder */}
      <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200 flex items-start gap-3">
        <HeartHandshake className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 space-y-1">
          <p className="font-bold text-sm">{t('urgent_trust_intuition_title')}</p>
          <p className="text-teal-800 leading-relaxed">
            {t('urgent_trust_intuition_desc')}
          </p>
        </div>
      </div>
    </div>
  );
}
