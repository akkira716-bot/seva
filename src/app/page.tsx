'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Baby, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Calendar, 
  Activity, 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Lock
} from 'lucide-react';
import { Stage } from '@/types';

export default function HomePage() {
  const [selectedStage, setSelectedStage] = useState<Stage | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stages = [
    { id: 'pregnancy', label: 'Pregnancy & Prenatal', desc: 'Weeks 1–40 milestones, prenatal nutrition, trimester warning signs', icon: '🤰', color: 'from-amber-500/20 to-rose-500/20 border-rose-200' },
    { id: 'postpartum', label: 'Fourth Trimester (Postpartum)', desc: 'Preeclampsia awareness, lochia & incision healing, mental health support', icon: '🌸', color: 'from-purple-500/20 to-pink-500/20 border-purple-200' },
    { id: 'baby_care', label: 'Newborn & Infant Care', desc: 'Safe sleep protocols, breastfeeding latch, diaper counts, vaccinations', icon: '👶', color: 'from-teal-500/20 to-emerald-500/20 border-teal-200' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-teal-50/30 to-slate-50 pt-12 pb-20 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Based & Clinically Reviewed Guidance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Compassionate care for <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-teal-600">mothers, babies</span> & every caregiver.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Explore trusted maternal health information, discover verified local care providers, organize prenatal and pediatric appointments, and track baby feeding and sleep—with total privacy.
            </p>

            {/* Quick Search & Explore Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold shadow-lg shadow-rose-200 transition transform hover:-translate-y-0.5"
              >
                <span>Read Reviewed Guides</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/providers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold shadow-sm transition"
              >
                <Search className="w-4 h-4 text-teal-600" />
                <span>Find Providers Near You</span>
              </Link>
            </div>

            {/* Privacy Promise Badge */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-teal-700 font-medium">
                <Lock className="w-3.5 h-3.5" /> No account required for public browsing
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Reviewed by Obstetricians & Pediatricians
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Warning Quick Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-800/80 text-rose-200 shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Know the Critical Maternal & Infant Red Flags</h2>
              <p className="text-xs text-rose-200 mt-0.5">
                Headaches with visual changes, heavy bleeding, chest tightness, or infant rectal fever &ge;100.4°F in newborns need emergency triage.
              </p>
            </div>
          </div>
          <Link
            href="/urgent-help"
            className="shrink-0 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide transition shadow"
          >
            Access Emergency Matrix &rarr;
          </Link>
        </div>
      </section>

      {/* Clinical Stages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Guided by Stage: From Conception to Infancy
          </h2>
          <p className="text-sm text-slate-600">
            Select your current journey stage to view tailored clinical advice, checklists, and symptom guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((st) => (
            <Link
              key={st.id}
              href={`/articles?stage=${st.id}`}
              className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-300 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">{st.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition">
                  {st.label}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {st.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform">
                <span>Explore stage guidance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Clinical Guidance Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Clinical Library</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Articles & Protocols</h2>
          </div>
          <Link href="/articles" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            Browse all reviewed articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <article className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">Pregnancy</span>
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 hover:text-rose-600 transition">
                <Link href="/articles/first-trimester-essentials-nutrition-and-warning-signs">
                  First Trimester Care: Nutrition, Early Milestones & Warning Signs
                </Link>
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                Essential dietary guidelines, prenatal vitamin recommendations, common bodily changes, and symptoms requiring prompt clinical triage.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1 text-teal-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dr. Sarah Lin, MD (FACOG)</span>
              </div>
              <span className="text-slate-400">Aug 2026</span>
            </div>
          </article>

          {/* Card 2 */}
          <article className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold">Postpartum</span>
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 6 min read</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 hover:text-rose-600 transition">
                <Link href="/articles/postpartum-preeclampsia-and-fourth-trimester-recovery">
                  The Fourth Trimester: Physical Healing & Recognizing Postpartum Preeclampsia
                </Link>
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                Physical recovery after vaginal or cesarean birth, pelvic floor restoration, and identifying signs of late-onset preeclampsia.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1 text-teal-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dr. Marcus Vance, MD</span>
              </div>
              <span className="text-slate-400">Jul 2026</span>
            </div>
          </article>

          {/* Card 3 */}
          <article className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold">Baby Care</span>
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 7 min read</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 hover:text-rose-600 transition">
                <Link href="/articles/safe-infant-sleep-and-early-breastfeeding-latch">
                  Newborn Safe Sleep Guidelines (AAP 2026) & Establishing a Comfortable Latch
                </Link>
              </h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                The ABCs of safe infant sleep to reduce SIDS risk, latch mechanics for nursing parents, and daily wet/dirty diaper benchmarks.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1 text-teal-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dr. Kenneth Reed, FAAP</span>
              </div>
              <span className="text-slate-400">Sep 2026</span>
            </div>
          </article>
        </div>
      </section>

      {/* Modular Platform Capabilities Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Modular Architecture</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              An all-in-one suite designed around parent convenience and data dignity.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              SEVA unites public educational guidance with private, account-level organizers. Keep your medical questions ready for doctor appointments and record baby sleep and feeding—with zero third-party tracking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Link
                href="/organizer"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-rose-400 transition block text-left group"
              >
                <Calendar className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Visit Organizer</h4>
                <p className="text-xs text-slate-400 mt-1">Save upcoming visits & prepare questions for your doctor.</p>
              </Link>

              <Link
                href="/tracker"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-400 transition block text-left group"
              >
                <Activity className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Daily Care Tracker</h4>
                <p className="text-xs text-slate-400 mt-1">Optional logs for baby feeding, naps, and diaper counts.</p>
              </Link>

              <Link
                href="/admin"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-purple-400 transition block text-left group"
              >
                <ShieldCheck className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Clinical Review</h4>
                <p className="text-xs text-slate-400 mt-1">Multi-stage editorial approval & credential verification.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
