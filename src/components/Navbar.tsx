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
  UserCheck,
  HeartPulse,
  Globe
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/locales/translations';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

  const navLinks = [
    { href: '/maatrusetu', label: t('nav_maatrusetu'), icon: HeartPulse, badge: t('nav_badge_care') },
    { href: '/articles', label: t('nav_articles'), icon: BookOpen },
    { href: '/providers', label: t('nav_providers'), icon: Compass },
    { href: '/urgent-help', label: t('nav_urgent'), icon: AlertCircle, badge: t('nav_badge_urgent') },
    { href: '/organizer', label: t('nav_organizer'), icon: Calendar },
    { href: '/tracker', label: t('nav_tracker'), icon: Activity },
    { href: '/admin', label: t('nav_admin'), icon: ShieldCheck },
  ];

  const currentLangObj = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const handleLanguageChange = (code: SupportedLanguage) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-rose-200 transition transform group-hover:scale-105">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-800">{t('nav_brand_title')}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">{t('nav_brand_tag')}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{t('nav_brand_sub')}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    active
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-rose-100 text-rose-700 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar: Language Selector & Parent Portal */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Global Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition"
                aria-label="Switch Language"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-rose-600" />
                <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl py-1 z-50">
                  <div className="sticky top-0 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>{t('nav_switch_language')}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{supportedLanguages.length}</span>
                  </div>
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left transition ${
                        language === lang.code
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {language === lang.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/organizer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50/70 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('nav_parent_portal')}</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex xl:hidden items-center gap-2">
            {/* Quick language toggle for mobile */}
            <button
              onClick={() => {
                const currentIndex = supportedLanguages.findIndex(l => l.code === language);
                const nextLang = supportedLanguages[(currentIndex + 1) % supportedLanguages.length].code;
                setLanguage(nextLang);
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 flex items-center gap-1"
              title="Toggle language"
            >
              <span>{currentLangObj.flag}</span>
              <span className="text-[11px]">{currentLangObj.code.toUpperCase()}</span>
            </button>

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
        <div className="xl:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {/* Mobile Language Grid */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-600" />
                {t('nav_switch_language')}:
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">{supportedLanguages.length} Languages</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
              {supportedLanguages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    language === l.code
                      ? 'bg-rose-600 text-white font-bold shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{l.flag} {l.nativeName}</span>
                  {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-white ml-1 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
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
        </div>
      )}
    </header>
  );
}
