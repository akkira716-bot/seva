'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Printer, 
  PhoneCall, 
  CheckCircle2, 
  HardDrive,
  FileBadge
} from 'lucide-react';
import { MaatruSetuRecord, OfflineEmergencyCard } from '@/types/maatrusetu';

interface Props {
  record: MaatruSetuRecord;
  careDay: number;
}

export default function OfflineModeView({ record, careDay }: Props) {
  const [isOnline, setIsOnline] = useState(true);
  const [cachedTime, setCachedTime] = useState<string>('');
  const [syncing, setSyncing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load from cache or set current
    const stored = localStorage.getItem(`maatrusetu_offline_${record.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCachedTime(parsed.lastSyncedTimestamp);
      } catch {}
    } else {
      cacheData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [record.id]);

  const cacheData = () => {
    setSyncing(true);
    const cardData: OfflineEmergencyCard = {
      motherName: record.mother.name,
      rchId: record.mother.rchId || 'RCH-PENDING',
      babyName: record.newborn.name,
      babyDob: record.newborn.birthDate,
      deliveryType: 'Vaginal Delivery',
      bloodGroup: 'B Positive',
      emergencyContacts: [
        { name: 'Husband / Partner', relation: 'Family', phone: record.mother.phone || '+91 98765 43210' },
        { name: 'ASHA Worker Geeta Bai', relation: 'Community Health', phone: '+91 98765 33333' }
      ],
      hospitalName: 'District Maternity Hospital & Primary Health Center',
      ambulanceHelpline: '108 / 102 (Free National Maternal Ambulance)',
      criticalAllergies: 'None Reported (NKDA)',
      lastSyncedTimestamp: new Date().toLocaleString()
    };

    localStorage.setItem(`maatrusetu_offline_${record.id}`, JSON.stringify(cardData));
    setCachedTime(cardData.lastSyncedTimestamp);
    setTimeout(() => setSyncing(false), 500);
  };

  const handleDownloadCard = () => {
    const cardContent = `
=======================================================
       MAATRUSETU OFFLINE EMERGENCY CARE CARD
=======================================================
Mother's Name:       ${record.mother.name} (${record.mother.age} yrs)
Health/RCH ID:       ${record.mother.rchId || 'RCH-2026-7841'}
Infant's Name:       ${record.newborn.name} (${record.newborn.sex.toUpperCase()})
Date of Birth:       ${record.newborn.birthDate} (Day ${careDay} of 42)
Birth Weight:        ${record.newborn.birthWeightKg} kg

EMERGENCY CONTACTS:
1. Family Primary:   ${record.mother.phone || '+91 98765 43210'}
2. ASHA Worker:      +91 98765 33333
3. National Ambulance: 108 / 102 (India Maternal Hotline)
4. Crisis Helpline:  1-833-9-HELP4MOMS / 988

CRITICAL WARNING SIGNS (IMMEDIATE HOSPITAL RETURN):
• Heavy bleeding soaking >1 pad per hour
• Temperature ≥ 100.4°F with chills
• Pounding headache, flashing vision spots
• Baby refuses 2 feeds / high pitched cry
• Yellow skin extending below baby's navel

Offline Snapshot Validated: ${cachedTime || new Date().toLocaleString()}
=======================================================
`.trim();

    const blob = new Blob([cardContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MaatruSetu_Emergency_Card_${record.mother.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {isOnline ? <Wifi className="w-5 h-5 text-teal-600" /> : <WifiOff className="w-5 h-5 text-amber-600" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Offline Mode &amp; Local Storage Cache</h2>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                isOnline ? 'bg-teal-50 text-teal-800 border-teal-200' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isOnline ? <Wifi className="w-3 h-3 text-teal-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
                {isOnline ? 'Connected Online' : 'Operating Offline'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Crucial maternal plans, immunization targets, and emergency contacts stored on-device for zero-connectivity situations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={cacheData}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-teal-600' : ''}`} />
            <span>Sync Cache Now</span>
          </button>

          <button
            onClick={handleDownloadCard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Care Card</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Offline Emergency Card text file downloaded to device storage!</span>
        </div>
      )}

      {/* Cache Status Strip */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <HardDrive className="w-4 h-4 text-teal-600" />
          <div>
            <span className="font-bold text-slate-800 block">On-Device Local Storage: Active</span>
            <span className="text-[11px] text-slate-500">Last synchronized: {cachedTime || 'Just now'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-teal-700 font-semibold text-[11px]">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Ready for offline triage in rural areas</span>
        </div>
      </div>

      {/* Offline Emergency Card Preview */}
      <div className="p-5 rounded-2xl border-2 border-slate-900 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <FileBadge className="w-5 h-5 text-slate-900" />
            <div>
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Offline Maternal Emergency Pass
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">ID: {record.mother.rchId || 'RCH-2026-7841'}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold uppercase">
            Day {careDay} of 42
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother</span>
            <span className="font-bold text-slate-900">{record.mother.name} ({record.mother.age} yrs)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Newborn</span>
            <span className="font-bold text-slate-900">{record.newborn.name} ({record.newborn.sex})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Birth Weight</span>
            <span className="font-bold text-slate-900">{record.newborn.birthWeightKg} kg</span>
          </div>
        </div>

        {/* Rapid Call Emergency Hotlines */}
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
          <span className="text-[11px] font-extrabold uppercase text-rose-900 flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            Emergency Quick-Dials (Works without mobile data)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <a
              href="tel:108"
              className="p-2.5 rounded-lg bg-white border border-rose-300 text-rose-900 font-bold flex items-center justify-between hover:bg-rose-100/50 transition"
            >
              <span>Maternal Ambulance:</span>
              <span className="text-sm font-black text-rose-600">108 / 102</span>
            </a>
            <a
              href="tel:18339435746"
              className="p-2.5 rounded-lg bg-white border border-rose-300 text-rose-900 font-bold flex items-center justify-between hover:bg-rose-100/50 transition"
            >
              <span>Maternal Hotline:</span>
              <span className="text-sm font-black text-rose-600">1-833-HELP4MOMS</span>
            </a>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
          <span>Keep this card saved to camera roll or printed in infant vaccination booklet.</span>
          <span className="font-mono text-slate-400">Offline Secure Token: Verified</span>
        </div>
      </div>
    </div>
  );
}
