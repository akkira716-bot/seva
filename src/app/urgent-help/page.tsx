'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  HeartHandshake, 
  Baby, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { EMERGENCY_PROTOCOLS } from '@/lib/db';

export default function UrgentHelpPage() {
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
          <span>Emergency & Urgent Clinical Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          When to Seek Immediate Medical Evaluation
        </h1>
        <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-3xl">
          Certain symptoms during pregnancy, postpartum recovery, or newborn infancy indicate acute medical emergencies such as preeclampsia, hemorrhage, severe neonatal infection, or postpartum crisis. Do not delay care.
        </p>

        {/* Emergency numbers rapid row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
          <a
            href="tel:911"
            className="p-4 rounded-xl bg-rose-800 hover:bg-rose-700 text-white flex items-center justify-between transition group"
          >
            <div>
              <div className="text-[11px] text-rose-300 font-medium">Life-Threatening Emergency</div>
              <div className="text-xl font-black">Call 911</div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:18339435746"
            className="p-4 rounded-xl bg-rose-800 hover:bg-rose-700 text-white flex items-center justify-between transition group"
          >
            <div>
              <div className="text-[11px] text-rose-300 font-medium">Maternal Health Hotline</div>
              <div className="text-sm font-black">1-833-9-HELP4MOMS</div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="tel:988"
            className="p-4 rounded-xl bg-rose-800 hover:bg-rose-700 text-white flex items-center justify-between transition group"
          >
            <div>
              <div className="text-[11px] text-rose-300 font-medium">Mental Health & Crisis Lifeline</div>
              <div className="text-xl font-black">Call / Text 988</div>
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
          All Urgent Signs
        </button>
        <button
          onClick={() => setActiveTab('maternal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'maternal'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Maternal & Postpartum Warning Signs
        </button>
        <button
          onClick={() => setActiveTab('infant')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'infant'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
          }`}
        >
          Infant Emergencies (0–12 Mo)
        </button>
        <button
          onClick={() => setActiveTab('mental_health')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'mental_health'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
          }`}
        >
          Emotional Distress & PMAD
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
                Critical Red Flag Symptoms
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
                <strong className="text-slate-900 font-bold block mb-0.5">Required Action:</strong>
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
          <p className="font-bold text-sm">Always Trust Caregiver Intuition</p>
          <p className="text-teal-800 leading-relaxed">
            If you feel that something is wrong with yourself or your baby, even if your specific symptom is not explicitly listed on this page, contact your healthcare provider, call the nursery triage line, or seek an evaluation. You are the closest observer of your health and your baby’s wellbeing.
          </p>
        </div>
      </div>
    </div>
  );
}
