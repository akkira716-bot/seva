'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Calendar, 
  Activity, 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Lock,
  HeartPulse
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();

  const stages = [
    { 
      id: 'pregnancy', 
      label: t('home_stage_pregnancy'), 
      desc: t('home_stage_pregnancy_desc'), 
      icon: '🤰', 
      color: 'from-amber-500/20 to-rose-500/20 border-rose-200' 
    },
    { 
      id: 'postpartum', 
      label: t('home_stage_postpartum'), 
      desc: t('home_stage_postpartum_desc'), 
      icon: '🌸', 
      color: 'from-purple-500/20 to-pink-500/20 border-purple-200' 
    },
    { 
      id: 'baby_care', 
      label: t('home_stage_baby'), 
      desc: t('home_stage_baby_desc'), 
      icon: '👶', 
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-200' 
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-teal-50/30 to-slate-50 pt-12 pb-20 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero_badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t('hero_title_1')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-teal-600">
                {t('hero_title_accent')}
              </span>{' '}
              {t('hero_title_2')}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              {t('hero_desc')}
            </p>

            {/* Quick Search & Explore Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/maatrusetu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold shadow-lg shadow-teal-200 transition transform hover:-translate-y-0.5"
              >
                <HeartPulse className="w-4 h-4" />
                <span>{t('nav_maatrusetu')} (42-Day Care)</span>
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold shadow-lg shadow-rose-200 transition transform hover:-translate-y-0.5"
              >
                <span>{t('hero_btn_guides')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/providers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold shadow-sm transition"
              >
                <Search className="w-4 h-4 text-teal-600" />
                <span>{t('hero_btn_providers')}</span>
              </Link>
            </div>

            {/* Privacy Promise Badge */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-teal-700 font-medium">
                <Lock className="w-3.5 h-3.5" /> {t('hero_privacy_point')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> {t('hero_reviewed_point')}
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
              <h2 className="text-base font-bold text-white">{t('home_urgent_strip_title')}</h2>
              <p className="text-xs text-rose-200 mt-0.5">
                {t('home_urgent_strip_desc')}
              </p>
            </div>
          </div>
          <Link
            href="/urgent-help"
            className="shrink-0 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide transition shadow"
          >
            {t('home_urgent_strip_btn')}
          </Link>
        </div>
      </section>

      {/* Clinical Stages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('home_stages_heading')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('home_stages_subheading')}
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
                <span>{t('home_stage_explore')}</span>
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
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">{t('home_featured_tag')}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('home_featured_heading')}</h2>
          </div>
          <Link href="/articles" className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            {t('home_featured_view_all')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <article className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">{t('home_stage_pregnancy')}</span>
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 5 {t('articles_min_read')}</span>
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
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-semibold">{t('home_stage_postpartum')}</span>
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 6 {t('articles_min_read')}</span>
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
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-semibold">{t('home_stage_baby')}</span>
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 7 {t('articles_min_read')}</span>
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

          <div className="relative z-10 max-w-4xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">{t('home_modular_tag')}</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {t('home_modular_heading')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('home_modular_desc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <Link
                href="/maatrusetu"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-400 transition block text-left group"
              >
                <HeartPulse className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">{t('nav_maatrusetu')}</h4>
                <p className="text-xs text-slate-400 mt-1">42-day maternal and newborn care continuum.</p>
              </Link>

              <Link
                href="/organizer"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-rose-400 transition block text-left group"
              >
                <Calendar className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">{t('home_card_organizer_title')}</h4>
                <p className="text-xs text-slate-400 mt-1">{t('home_card_organizer_desc')}</p>
              </Link>

              <Link
                href="/tracker"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-400 transition block text-left group"
              >
                <Activity className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">{t('home_card_tracker_title')}</h4>
                <p className="text-xs text-slate-400 mt-1">{t('home_card_tracker_desc')}</p>
              </Link>

              <Link
                href="/admin"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-purple-400 transition block text-left group"
              >
                <ShieldCheck className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">{t('home_card_admin_title')}</h4>
                <p className="text-xs text-slate-400 mt-1">{t('home_card_admin_desc')}</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
