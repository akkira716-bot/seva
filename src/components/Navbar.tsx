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
  Globe,
  ClipboardList,
  Check,
  ChevronDown,
  Sparkles,
  Users
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth, ROLE_PRESETS } from '@/context/AuthContext';
import { SupportedLanguage } from '@/locales/translations';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const pathname = usePathname();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { currentUser, activeRole, switchRolePreset } = useAuth();

  const navLinks = [
    { href: '/maatrusetu', label: 'MaatruSetu 42-Day', icon: HeartPulse, badge: 'Care' },
    { href: '/asha', label: 'ASHA Worker', icon: ClipboardList, badge: 'Field' },
    { href: '/articles', label: t('nav_articles'), icon: BookOpen },
    { href: '/providers', label: t('nav_providers'), icon: Compass },
    { href: '/urgent-help', label: t('nav_urgent'), icon: AlertCircle, badge: 'Urgent' },
    { href: '/organizer', label: t('nav_organizer'), icon: Calendar },
    { href: '/tracker', label: t('nav_tracker'), icon: Activity },
    { href: '/admin', label: t('nav_admin'), icon: ShieldCheck },
  ];

  const currentLangObj = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];
  const activePreset = ROLE_PRESETS.find(p => p.role === activeRole) || ROLE_PRESETS[0];

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const handleLanguageChange = (code: SupportedLanguage) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  const handleSelectRole = (presetId: string) => {
    switchRolePreset(presetId);
    setRoleModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Unified Logo & Brand */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-rose-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-rose-200 transition transform group-hover:scale-105">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800">
                    MaatruSetu
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-rose-100 to-teal-100 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200">
                    SEVA Platform
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Maternal, Newborn & Community Continuum
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden 2xl:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      active
                        ? 'bg-rose-50 text-rose-700 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                        link.badge === 'Urgent' 
                          ? 'bg-rose-100 text-rose-700' 
                          : link.badge === 'Field'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Bar: Role Switcher & Language Selector */}
            <div className="flex items-center gap-2">
              {/* Role-Based Access & User Switcher Button */}
              <button
                onClick={() => setRoleModalOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-2xs"
                title="Switch active user role"
              >
                <div className={`w-5 h-5 rounded-md ${activePreset.avatarBg} text-white flex items-center justify-center text-[10px] font-extrabold`}>
                  {activePreset.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[11px] font-extrabold text-slate-800 leading-tight">
                    {currentUser?.name || activePreset.name}
                  </p>
                  <p className="text-[9px] text-teal-700 font-bold leading-tight">
                    {activePreset.badge}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Global 12-Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition"
                  aria-label="Switch Language"
                  aria-expanded={langDropdownOpen}
                >
                  <Globe className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">{currentLangObj.flag} {currentLangObj.nativeName}</span>
                  <span className="sm:hidden font-mono uppercase text-[10px]">{currentLangObj.code}</span>
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

              {/* Mobile hamburger button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="2xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="2xl:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setRoleModalOpen(true);
                }}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left"
              >
                <p className="text-[10px] text-slate-400 font-bold uppercase">Role Persona</p>
                <p className="text-xs font-extrabold text-slate-800">{activePreset.badge}</p>
              </button>

              <button
                onClick={() => {
                  const currentIndex = supportedLanguages.findIndex(l => l.code === language);
                  const nextLang = supportedLanguages[(currentIndex + 1) % supportedLanguages.length].code;
                  setLanguage(nextLang);
                }}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left"
              >
                <p className="text-[10px] text-slate-400 font-bold uppercase">Language</p>
                <p className="text-xs font-extrabold text-slate-800">{currentLangObj.flag} {currentLangObj.nativeName}</p>
              </button>
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
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                      active ? 'bg-rose-50 text-rose-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="bg-rose-100 text-rose-700 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
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

      {/* Role & Shared Authentication Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Switch Unified Role & Identity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Experience all 26 features through verified healthcare roles & access tiers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {ROLE_PRESETS.map((preset) => {
                const isSelected = activePreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectRole(preset.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${preset.avatarBg} text-white font-extrabold flex items-center justify-center text-sm shadow shrink-0 mt-0.5`}>
                      {preset.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {preset.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          preset.role === 'mother' 
                            ? 'bg-rose-100 text-rose-800'
                            : preset.role === 'asha'
                            ? 'bg-emerald-100 text-emerald-800'
                            : preset.role === 'doctor'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {preset.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>Shared Session Security:</strong> Changing role immediately updates access privileges across the Maternal Continuum, ASHA field monitor, and Clinical Admin.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
