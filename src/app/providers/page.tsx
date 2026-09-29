'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Video, 
  ShieldCheck, 
  Star, 
  Filter, 
  CalendarPlus
} from 'lucide-react';
import { Provider } from '@/types';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, [searchQuery, selectedSpecialty, selectedLanguage, telehealthOnly]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (selectedSpecialty !== 'all') params.append('specialty', selectedSpecialty);
      if (selectedLanguage !== 'all') params.append('language', selectedLanguage);
      if (telehealthOnly) params.append('telehealth', 'true');

      const res = await fetch(`/api/providers?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setProviders(json.data);
      }
    } catch (e) {
      console.error('Error fetching providers', e);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    { id: 'all', label: 'All Specialties' },
    { id: 'Midwifery', label: 'Midwives & Birth Centers' },
    { id: 'Maternal-Fetal', label: 'OB-GYN & MFM' },
    { id: 'Lactation', label: 'Lactation Consultants (IBCLC)' },
    { id: 'Pediatric', label: 'Pediatricians' }
  ];

  const languages = ['all', 'English', 'Spanish', 'Hindi', 'Mandarin', 'Vietnamese'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Care Provider Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Verified Maternal & Pediatric Specialists
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Search certified nurse-midwives, high-risk obstetricians, lactation consultants, and pediatric clinics. Every listing is reviewed for active licensing and credential verification.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor, clinic, city or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Specialty Dropdown */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-700"
            >
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Language Dropdown */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-700"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l === 'all' ? 'All Languages' : `Language: ${l}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Telehealth toggle & results count */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={telehealthOnly}
              onChange={(e) => setTelehealthOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-teal-600" />
              <span>Telehealth / Video Consultations Available</span>
            </span>
          </label>

          <span className="text-slate-500">
            Showing <strong className="text-slate-800">{providers.length}</strong> verified provider{providers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          Searching care providers...
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <Compass className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No care providers match your filters</h3>
          <p className="text-xs text-slate-500">Try broadening your search term or language preference.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Header status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-slate-900">{provider.name}</h3>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold" title="Clinically verified listing">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" />
                        <span>Verified</span>
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-rose-600 mt-0.5">
                      {provider.specialty}
                    </p>
                    {provider.organization && (
                      <p className="text-[11px] text-slate-500">{provider.organization}</p>
                    )}
                  </div>

                  {provider.rating && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{provider.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Location & Contact */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {provider.location.address}, {provider.location.city}, {provider.location.state} {provider.location.zipCode}
                      {provider.location.distanceMiles && (
                        <strong className="text-slate-800 ml-1">({provider.location.distanceMiles} mi)</strong>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${provider.contactDetails.phone}`} className="hover:text-rose-600 transition font-medium">
                      {provider.contactDetails.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${provider.contactDetails.email}`} className="hover:text-rose-600 transition truncate">
                      {provider.contactDetails.email}
                    </a>
                  </div>
                </div>

                {/* Badges: Telehealth, Insurance, Languages */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {provider.telehealthAvailable && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-medium border border-teal-200/60">
                      <Video className="w-3 h-3 text-teal-600" /> Telehealth Available
                    </span>
                  )}
                  {provider.acceptsInsurance && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                      Insurance Accepted
                    </span>
                  )}
                  {provider.languages.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px]">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Services list */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1">Key Services:</div>
                  <div className="flex flex-wrap gap-1">
                    {provider.services.map((svc, idx) => (
                      <span key={idx} className="text-[11px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Verified {provider.verificationDate}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${provider.contactDetails.phone}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                  >
                    Call Office
                  </a>
                  <Link
                    href={`/organizer?providerId=${provider.id}&providerName=${encodeURIComponent(provider.name)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm transition"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Save to Visit Organizer</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
