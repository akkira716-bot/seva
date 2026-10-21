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

            {/* Unified 8-Portal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <Link
                href="/maatrusetu"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-400 transition block text-left group"
              >
                <HeartPulse className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">MaatruSetu 42-Day</h4>
                <p className="text-xs text-slate-400 mt-1">Personalized postnatal continuum &amp; 9 clinical features.</p>
              </Link>

              <Link
                href="/asha"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-emerald-400 transition block text-left group"
              >
                <Activity className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">ASHA Worker Portal</h4>
                <p className="text-xs text-slate-400 mt-1">Community cohort triage, home visit checklist &amp; alerts.</p>
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
                <Clock className="w-5 h-5 text-teal-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">{t('home_card_tracker_title')}</h4>
                <p className="text-xs text-slate-400 mt-1">{t('home_card_tracker_desc')}</p>
              </Link>

              <Link
                href="/providers"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-400 transition block text-left group"
              >
                <Search className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Verified Providers</h4>
                <p className="text-xs text-slate-400 mt-1">Obstetricians, pediatricians &amp; lactation consultants.</p>
              </Link>

              <Link
                href="/urgent-help"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-red-400 transition block text-left group"
              >
                <AlertOctagon className="w-5 h-5 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Urgent Red Flags</h4>
                <p className="text-xs text-slate-400 mt-1">Triage matrix, emergency hotlines &amp; ambulance speed-dial.</p>
              </Link>

              <Link
                href="/articles"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400 transition block text-left group"
              >
                <Sparkles className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Clinical Guidance</h4>
                <p className="text-xs text-slate-400 mt-1">Peer-reviewed pregnancy, postpartum &amp; baby articles.</p>
              </Link>

              <Link
                href="/admin"
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-purple-400 transition block text-left group"
              >
                <ShieldCheck className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-bold text-white">Clinical Admin</h4>
                <p className="text-xs text-slate-400 mt-1">Reviewer workflows, audit logs &amp; FHIR R4 endpoints.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Unified 26-Feature Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Complete Integrated Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All 26 Features Under One Unified MaatruSetu URL
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Unifying maternal care, ASHA field supervision, clinical review, and patient privacy under one continuous architecture with shared authentication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category 1 */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>Maternal Care Continuum</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" /> <strong>1. Continuum Profile:</strong> Day 1-42 tracker &amp; health triage</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" /> <strong>2. Postnatal Check-ins:</strong> ANM/ASHA home visit alerts</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" /> <strong>3. Onboarding Registration:</strong> Mother &amp; newborn registry</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" /> <strong>4. MaatruAI:</strong> Daily maternal guidance &amp; non-diagnostic Q&amp;A</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" /> <strong>5. Family Care Mode:</strong> Caregiver role task allocation</li>
              </ul>
            </div>

            {/* Category 2 */}
            <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Clinical &amp; Recovery Intelligence</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" /> <strong>6. Digital Discharge:</strong> 4-quadrant verified care instructions</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" /> <strong>7. Recovery Journal:</strong> 0-10 pain, lochia, temp &amp; mood log</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" /> <strong>8. Doctor Summary:</strong> Consolidated clinical briefing &amp; export</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" /> <strong>9. Family Explainer:</strong> Medical jargon translator (Do vs Don't)</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" /> <strong>10. Offline Mode:</strong> Emergency care pass &amp; cached records</li>
              </ul>
            </div>

            {/* Category 3 */}
            <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
              <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Care Circle &amp; Milestones</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" /> <strong>11. Care Circle:</strong> Revocable caregiver permissions</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" /> <strong>12. 42-Day Graduation:</strong> 6-week report &amp; printable certificate</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" /> <strong>13. Evidence Articles:</strong> Peer-reviewed pregnancy &amp; baby library</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" /> <strong>14. Stage Filtered Reader:</strong> Trimester-specific reading lists</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" /> <strong>15. Care Providers Directory:</strong> Verified OB/GYN &amp; pediatrician finder</li>
              </ul>
            </div>

            {/* Category 4 */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Personal Vault &amp; Tracker</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> <strong>16. Visit Scheduler:</strong> Appointment notes &amp; reminders</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> <strong>17. Doctor Questions Vault:</strong> Pre-populated stage checklists</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> <strong>18. Daily Vitals Tracker:</strong> Feeding, diaper, sleep &amp; growth</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> <strong>19. Urgent Red Flags:</strong> Maternal &amp; neonatal triage matrices</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> <strong>20. Emergency Speed Dial:</strong> 108, 988, 1091, 1098 1-tap call</li>
              </ul>
            </div>

            {/* Category 5 */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Community &amp; Supervision</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> <strong>21. ASHA Field Portal:</strong> Community cohort home visit register</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> <strong>22. Content Lifecycle:</strong> Draft ➔ Review ➔ Editorial ➔ Publish</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> <strong>23. Provider Credentialing:</strong> Medical license verification workflow</li>
              </ul>
            </div>

            {/* Category 6 */}
            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Interoperability &amp; Governance</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> <strong>24. HL7 FHIR R4:</strong> Patient &amp; Appointment interoperability</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> <strong>25. WHO Audit Trails:</strong> Privacy-preserving PII-sanitized logs</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" /> <strong>26. Shared Auth &amp; RBAC:</strong> Role switcher, Portability &amp; Erasure</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
