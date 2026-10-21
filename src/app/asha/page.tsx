'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  Baby, 
  CalendarCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  PlusCircle, 
  ShieldAlert, 
  Search, 
  Filter, 
  UserCheck, 
  ChevronRight,
  ClipboardList,
  Sparkles,
  Home,
  Check
} from 'lucide-react';
import { MaatruSetuRecord, computeCareDay } from '@/types/maatrusetu';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AshaWorkerDashboard() {
  const { currentUser, activeRole, switchRole } = useAuth();
  const { t } = useLanguage();

  const [records, setRecords] = useState<MaatruSetuRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attention_needed' | 'due_today'>('all');

  // Check-in Modal
  const [selectedRecord, setSelectedRecord] = useState<MaatruSetuRecord | null>(null);
  const [visitType, setVisitType] = useState('Day 7 Home Visit');
  const [maternalTemp, setMaternalTemp] = useState('98.6');
  const [lochiaCheck, setLochiaCheck] = useState<'normal_rubra' | 'heavy_soaking' | 'foul_odor'>('normal_rubra');
  const [infantJaundice, setInfantJaundice] = useState(false);
  const [cordStatus, setCordStatus] = useState<'clean_dry' | 'redness_discharge'>('clean_dry');
  const [visitNotes, setVisitNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/maatrusetu');
      const json = await res.json();
      if (json.success && json.data) {
        setRecords(json.data);
      }
    } catch (e) {
      console.error('Failed to load ASHA records', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(rec => {
    const matchesSearch = 
      rec.mother.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.newborn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.mother.rchId && rec.mother.rchId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'attention_needed') {
      return rec.healthStatus !== 'stable';
    }
    if (filterStatus === 'due_today') {
      const today = new Date().toISOString().split('T')[0];
      return rec.nextFollowUp.date === today;
    }
    return true;
  });

  const handleOpenCheckin = (record: MaatruSetuRecord) => {
    setSelectedRecord(record);
    const dayInfo = computeCareDay(record.newborn.birthDate);
    setVisitType(`Day ${dayInfo.currentDay} Postnatal Visit`);
    setVisitNotes('');
    setSuccessMessage('');
  };

  const handleSubmitCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setSubmitting(true);
    try {
      const isUrgent = lochiaCheck === 'heavy_soaking' || lochiaCheck === 'foul_odor' || cordStatus === 'redness_discharge' || infantJaundice;
      
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_task',
          recordId: selectedRecord.id,
          task: {
            title: `ASHA ${visitType} Completed: ${isUrgent ? 'ATTENTION NEEDED' : 'Stable'}`,
            category: 'clinical',
            assignedTo: 'asha',
            priority: isUrgent ? 'high' : 'normal',
            dueDate: new Date().toISOString().split('T')[0],
            notes: `Maternal Temp: ${maternalTemp}°F. Lochia: ${lochiaCheck}. Cord: ${cordStatus}. Jaundice: ${infantJaundice ? 'YES' : 'NO'}. Notes: ${visitNotes}`
          }
        })
      });

      if (res.ok) {
        setSuccessMessage('Home visit check-in recorded successfully and synced to mother’s 42-day continuum!');
        setTimeout(() => {
          setSelectedRecord(null);
          setSuccessMessage('');
          fetchRecords();
        }, 1800);
      }
    } catch (err) {
      console.error('Failed submitting check-in', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Role Notice */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/5 transform skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-bold uppercase tracking-wider">
              <ClipboardList className="w-4 h-4 text-emerald-300" />
              <span>ASHA & Community Health Worker Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Postnatal 42-Day Community Cohort
            </h1>
            <p className="text-emerald-100 text-sm max-w-2xl">
              Conduct standardized WHO/MoHFW postnatal home visits (Days 1, 3, 7, 14, 21, 28, 42), triage maternal danger signs, record newborn vitals, and coordinate timely referrals.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 font-extrabold flex items-center justify-center text-sm shadow">
                {currentUser?.name ? currentUser.name.charAt(0) : 'G'}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{currentUser?.name || 'Geeta Bai'}</p>
                <p className="text-emerald-200">Sector RCH-04 • Primary Health Center</p>
              </div>
            </div>
            {activeRole !== 'asha' && (
              <button
                onClick={() => switchRole('asha')}
                className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition shadow-sm text-xs"
              >
                Switch to ASHA View
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cohort Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Active Mothers</p>
            <p className="text-2xl font-black text-slate-800">{records.length}</p>
            <p className="text-[11px] text-teal-600 font-semibold">Under 42-day care</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Attention Needed</p>
            <p className="text-2xl font-black text-amber-600">
              {records.filter(r => r.healthStatus !== 'stable').length}
            </p>
            <p className="text-[11px] text-amber-600 font-semibold">Priority home visits</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Visits Due Today</p>
            <p className="text-2xl font-black text-emerald-700">
              {records.filter(r => r.nextFollowUp.date === new Date().toISOString().split('T')[0]).length || 1}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold">Scheduled visits</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">UIP Vaccines</p>
            <p className="text-2xl font-black text-rose-600">100%</p>
            <p className="text-[11px] text-slate-500 font-semibold">Birth doses logged</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search mother, infant, or RCH ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cohort ({records.length})
          </button>
          <button
            onClick={() => setFilterStatus('attention_needed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'attention_needed'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Attention Needed
          </button>
          <button
            onClick={() => setFilterStatus('due_today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterStatus === 'due_today'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            Visits Due Today
          </button>
        </div>
      </div>

      {/* Cohort Mothers Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            <span>Maternal & Newborn Care Register</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredRecords.length} records
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading ASHA community registry...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No mother records found matching your filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRecords.map((rec) => {
              const careDay = computeCareDay(rec.newborn.birthDate);
              const isAttention = rec.healthStatus !== 'stable';

              return (
                <div key={rec.id} className="p-5 sm:p-6 hover:bg-slate-50/70 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 text-base">
                        {rec.mother.name}
                      </span>
                      <span className="text-xs text-slate-400">({rec.mother.age} yrs)</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {rec.mother.rchId || 'RCH-PENDING'}
                      </span>
                      {isAttention ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Attention Needed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Stable
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Baby className="w-3.5 h-3.5 text-rose-500" />
                        <strong>{rec.newborn.name}</strong> ({rec.newborn.sex}, {rec.newborn.birthWeightKg} kg, {rec.newborn.gestationalAgeWeeks}w)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        Day {careDay.currentDay} of 42 ({Math.round(careDay.progressPercent)}%)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                        {rec.mother.phone || '+91 98765 43210'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-700">Clinical Note:</strong> {rec.healthStatusNote}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                    <button
                      onClick={() => handleOpenCheckin(rec)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>Log Home Visit</span>
                    </button>

                    <Link
                      href={`/maatrusetu`}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm flex items-center gap-1"
                    >
                      <span>Full 42-Day Plan</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Escalation Matrix */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>ASHA Emergency Referral Protocol</span>
        </div>
        <p className="text-xs text-rose-900 leading-relaxed">
          If any mother exhibits fever &ge; 100.4&deg;F, foul-smelling lochia, visual disturbances, or if the newborn refuses feeding, grunts, or has a fever/hypothermia, do NOT wait. Trigger immediate ambulance dispatch.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href="tel:108"
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-md hover:bg-rose-700 transition flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 108 Ambulance</span>
          </a>
          <a
            href="tel:1091"
            className="px-4 py-2 rounded-xl border border-rose-300 bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
          >
            Women Helpline 1091
          </a>
          <a
            href="tel:1098"
            className="px-4 py-2 rounded-xl border border-rose-300 bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
          >
            Childline 1098
          </a>
        </div>
      </div>

      {/* Home Visit Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Record ASHA Home Visit
                </h3>
                <p className="text-xs text-slate-500">
                  Mother: {selectedRecord.mother.name} • Infant: {selectedRecord.newborn.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {successMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitCheckin} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Visit Type</label>
                    <input
                      type="text"
                      value={visitType}
                      onChange={(e) => setVisitType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Maternal Temperature (°F)</label>
                    <input
                      type="text"
                      value={maternalTemp}
                      onChange={(e) => setMaternalTemp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="98.6"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lochia / Postpartum Bleeding</label>
                  <select
                    value={lochiaCheck}
                    onChange={(e: any) => setLochiaCheck(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="normal_rubra">Normal Lochia (Moderate, non-offensive)</option>
                    <option value="heavy_soaking">⚠️ Heavy Flow (Soaking &gt; 1 pad/hr)</option>
                    <option value="foul_odor">⚠️ Foul Odor / Fever (Infection Suspected)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Umbilical Cord Stump</label>
                    <select
                      value={cordStatus}
                      onChange={(e: any) => setCordStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="clean_dry">Clean, dry, sloughing normally</option>
                      <option value="redness_discharge">⚠️ Redness, swelling or pus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Infant Sclera / Skin Jaundice</label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700">
                        <input
                          type="radio"
                          name="jaundice"
                          checked={!infantJaundice}
                          onChange={() => setInfantJaundice(false)}
                        />
                        <span>No (Normal)</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-700">
                        <input
                          type="radio"
                          name="jaundice"
                          checked={infantJaundice}
                          onChange={() => setInfantJaundice(true)}
                        />
                        <span className="text-amber-700 font-bold">⚠️ Yes (Yellowing)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visit Field Observations & Advice</label>
                  <textarea
                    rows={3}
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="Advised on exclusive breastfeeding, kangaroo mother care, warmth, and iron supplementation..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Save & Sync Check-in'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
