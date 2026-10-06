'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Baby, 
  User, 
  Calendar, 
  Syringe, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  PlusCircle, 
  Clock, 
  Scale, 
  CalendarCheck, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  Phone,
  Layers,
  Check
} from 'lucide-react';
import { MaatruSetuRecord, computeCareDay } from '@/types/maatrusetu';
import { t } from '@/lib/maatrusetu/translations';

export default function MaatruSetuPage() {
  const [records, setRecords] = useState<MaatruSetuRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCheckInToast, setShowCheckInToast] = useState(false);

  // Form State for Register Mother + Newborn
  const [motherName, setMotherName] = useState('');
  const [motherAge, setMotherAge] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [rchId, setRchId] = useState('');
  const [newbornName, setNewbornName] = useState('');
  const [newbornSex, setNewbornSex] = useState<'female' | 'male' | 'other'>('female');
  const [birthDate, setBirthDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [birthWeightKg, setBirthWeightKg] = useState('3.00');
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState('39');
  const [healthStatus, setHealthStatus] = useState<'stable' | 'attention_needed' | 'critical'>('stable');
  const [healthStatusNote, setHealthStatusNote] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [nextFollowUpType, setNextFollowUpType] = useState('Day 3-7 Postnatal Home Visit - ASHA');
  const [nextFollowUpWorker, setNextFollowUpWorker] = useState('Primary Health Center Staff');
  const [nextVaccinationName, setNextVaccinationName] = useState('OPV-1 + Pentavalent-1 + Rotavirus-1');
  const [nextVaccinationDate, setNextVaccinationDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 35);
    return d.toISOString().split('T')[0];
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async (selectIdAfterLoad?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/maatrusetu');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setRecords(json.data);
        if (selectIdAfterLoad) {
          setSelectedRecordId(selectIdAfterLoad);
        } else if (!selectedRecordId) {
          setSelectedRecordId(json.data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load MaatruSetu records', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedRecord = records.find((r) => r.id === selectedRecordId) || records[0];
  const careDay = selectedRecord ? computeCareDay(selectedRecord.newborn.birthDate) : null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !motherName.trim() ||
      !motherAge ||
      !newbornName.trim() ||
      !birthDate ||
      !birthWeightKg ||
      !gestationalAgeWeeks ||
      !nextFollowUpDate ||
      !nextFollowUpType ||
      !nextVaccinationName ||
      !nextVaccinationDate
    ) {
      setFormError(t('form_validation_error'));
      return;
    }

    try {
      const payload = {
        motherName,
        motherAge: Number(motherAge),
        motherPhone: motherPhone || undefined,
        rchId: rchId || undefined,
        newbornName,
        newbornSex,
        birthDate,
        birthWeightKg: Number(birthWeightKg),
        gestationalAgeWeeks: Number(gestationalAgeWeeks),
        healthStatus,
        healthStatusNote: healthStatusNote || undefined,
        nextFollowUpDate,
        nextFollowUpType,
        nextFollowUpWorker: nextFollowUpWorker || undefined,
        nextVaccinationName,
        nextVaccinationDate
      };

      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        setShowRegisterModal(false);
        // Reset form inputs
        setMotherName('');
        setMotherAge('');
        setMotherPhone('');
        setRchId('');
        setNewbornName('');
        setHealthStatusNote('');
        // Reload and focus on newly created record
        await loadRecords(json.data.id);
      } else {
        setFormError(json.error || 'Failed to register pair.');
      }
    } catch (err) {
      console.error('Registration failed', err);
      setFormError('Network error while registering pair.');
    }
  };

  const handleCheckInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCheckInToast(true);
    setTimeout(() => setShowCheckInToast(false), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-rose-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span>{t('hero_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            {t('page_title')}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {t('page_subtitle')}
          </p>
        </div>

        {/* Action Button: Register Mother & Newborn */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('register_new_button')}</span>
          </button>
        </div>
      </div>

      {/* Check-in Trigger Notification Toast */}
      {showCheckInToast && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs shadow-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <span className="font-bold">{t('start_checkin_button')} Triggered:</span>{' '}
              <span>{t('checkin_link_notice')}</span>
            </div>
          </div>
          <span className="text-[10px] text-teal-700 font-semibold uppercase bg-teal-100 px-2 py-0.5 rounded">
            Stage 4 Gateway
          </span>
        </div>
      )}

      {/* Profile Selector Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Layers className="w-4 h-4 text-rose-600" />
            <span>{t('select_pair_label')} ({records.length})</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click to view maternal-newborn dashboard
          </span>
        </div>

        {/* Pair Pills */}
        <div className="flex flex-wrap gap-2">
          {records.map((rec) => {
            const isSelected = rec.id === (selectedRecord?.id);
            const babyDay = computeCareDay(rec.newborn.birthDate);
            return (
              <button
                key={rec.id}
                onClick={() => setSelectedRecordId(rec.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition ${
                  isSelected
                    ? 'bg-rose-50/90 border-rose-300 text-rose-900 shadow-sm ring-1 ring-rose-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${rec.healthStatus === 'stable' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                <span className="font-bold">{rec.mother.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{rec.newborn.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-white text-[10px] text-slate-500 font-semibold border border-slate-200">
                  Day {babyDay.currentDay}/42
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading || !selectedRecord ? (
        <div className="text-center py-16 text-slate-500 text-xs">
          Loading MaatruSetu dashboard...
        </div>
      ) : (
        <div className="space-y-6">
          {/* TOP HIGHLIGHT BAR: Care Day Out of 42 & Health Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Care Day Out of 42 Card */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4">
              <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {t('care_day_card_title')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-teal-300 text-xs font-semibold">
                    {careDay?.isWithinWindow ? t('care_day_days_remaining', { count: careDay.daysRemaining }) : t('care_day_completed')}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {t('care_day_counter', { current: careDay?.currentDay || 1, total: 42 })}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">
                    ({careDay?.progressPercent}% of postnatal continuum)
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  {t('care_day_description')}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10 space-y-1.5 pt-2">
                <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 via-teal-400 to-teal-300 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${careDay?.progressPercent || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Day 1 (Birth)</span>
                  <span>Day 7 (Early Check)</span>
                  <span>Day 14 (Neonatal)</span>
                  <span>Day 28 (Infancy)</span>
                  <span>Day 42 (Postnatal Milestone)</span>
                </div>
              </div>
            </div>

            {/* 2. Health Status & Check-in CTA Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {t('health_status_title')}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide ${
                    selectedRecord.healthStatus === 'stable'
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : selectedRecord.healthStatus === 'attention_needed'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {selectedRecord.healthStatus === 'stable' ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      {selectedRecord.healthStatus === 'stable'
                        ? t('status_stable')
                        : selectedRecord.healthStatus === 'attention_needed'
                        ? t('status_attention_needed')
                        : t('status_critical')}
                    </span>
                  </span>
                </div>

                {selectedRecord.healthStatusNote && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block text-[11px] mb-0.5">{t('status_note_label')}:</strong>
                    {selectedRecord.healthStatusNote}
                  </div>
                )}
              </div>

              {/* Prominent "Start Check-in" Button */}
              <div className="pt-2">
                <Link
                  href="#check-in"
                  onClick={handleCheckInClick}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5 text-center group"
                >
                  <Activity className="w-4 h-4 text-rose-200 group-hover:scale-110 transition-transform" />
                  <span>{t('start_checkin_button')}</span>
                  <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-[10px] text-slate-400 text-center mt-1.5">
                  {t('start_checkin_description')}
                </p>
              </div>
            </div>
          </div>

          {/* MAIN 4-COLUMN DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD 1: Mother Profile */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t('mother_profile_title')}</h3>
                  <span className="text-[10px] text-slate-400">Postpartum Caregiver</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{t('mother_name_label')}</span>
                  <span className="text-sm font-bold text-slate-800">{selectedRecord.mother.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">{t('mother_age_label')}:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedRecord.mother.age} {t('years_old')}
                  </span>
                </div>

                {selectedRecord.mother.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Contact:</span>
                    <span className="font-mono text-slate-700">{selectedRecord.mother.phone}</span>
                  </div>
                )}

                {selectedRecord.mother.rchId && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-400 text-[10px]">{t('rch_id_label')}:</span>
                    <span className="font-mono text-[11px] text-teal-700 font-semibold">{selectedRecord.mother.rchId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: Newborn Profile */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t('newborn_profile_title')}</h3>
                  <span className="text-[10px] text-slate-400">Infant Clinical Record</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{t('newborn_name_label')}</span>
                  <span className="text-sm font-bold text-slate-800">{selectedRecord.newborn.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">{t('newborn_sex_label')}:</span>
                  <span className="font-semibold capitalize text-slate-800">
                    {selectedRecord.newborn.sex === 'female' ? t('sex_female') : selectedRecord.newborn.sex === 'male' ? t('sex_male') : t('sex_other')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">{t('birth_date_label')}:</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.newborn.birthDate}</span>
                </div>

                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Chronological Age:</span>
                  <span className="font-bold text-rose-600">
                    {t('baby_age_in_days', { day: careDay?.currentDay || 1 })}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: Birth Weight & Gestational Age */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t('birth_metrics_title')}</h3>
                  <span className="text-[10px] text-slate-400">Neonatal Anthropometry</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">{t('birth_weight_label')}:</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {selectedRecord.newborn.birthWeightKg.toFixed(2)} {t('birth_weight_unit')}
                    </span>
                  </div>
                  <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    selectedRecord.newborn.birthWeightKg < 2.5
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {selectedRecord.newborn.birthWeightKg < 2.5 ? t('low_birth_weight_badge') : t('normal_birth_weight_badge')}
                  </span>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">{t('gestational_age_label')}:</span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {selectedRecord.newborn.gestationalAgeWeeks} {t('gestational_age_unit')}
                    </span>
                  </div>
                  <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    selectedRecord.newborn.gestationalAgeWeeks < 37
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {selectedRecord.newborn.gestationalAgeWeeks < 37 ? t('preterm_badge') : t('term_badge')}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 4: Next Follow-Up & Vaccination */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Visits &amp; Immunization</h3>
                  <span className="text-[10px] text-slate-400">Scheduled Clinical Events</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {/* Follow up */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">{t('next_followup_title')}</span>
                    <span className="font-semibold text-rose-600 text-[11px]">{selectedRecord.nextFollowUp.date}</span>
                  </div>
                  <p className="font-bold text-slate-800 mt-0.5 leading-snug">{selectedRecord.nextFollowUp.type}</p>
                  {selectedRecord.nextFollowUp.providerOrWorker && (
                    <span className="text-[10px] text-slate-500 block">{selectedRecord.nextFollowUp.providerOrWorker}</span>
                  )}
                </div>

                {/* Vaccination */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                      <Syringe className="w-3 h-3 text-teal-600" />
                      {t('next_vaccination_title')}
                    </span>
                    <span className="font-semibold text-teal-700 text-[11px]">{selectedRecord.nextVaccination.dueDate}</span>
                  </div>
                  <p className="font-bold text-slate-800 mt-0.5 leading-snug">{selectedRecord.nextVaccination.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL: Register Mother + Newborn */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {t('form_modal_title')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('form_modal_subtitle')}
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs">
              {/* Section 1: Mother */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                  {t('form_section_mother')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_mother_name')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('form_mother_name_placeholder')}
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_mother_age')}</label>
                    <input
                      type="number"
                      min="15"
                      max="55"
                      required
                      placeholder={t('form_mother_age_placeholder')}
                      value={motherAge}
                      onChange={(e) => setMotherAge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_mother_phone')}</label>
                    <input
                      type="tel"
                      placeholder={t('form_mother_phone_placeholder')}
                      value={motherPhone}
                      onChange={(e) => setMotherPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_rch_id')}</label>
                    <input
                      type="text"
                      placeholder={t('form_rch_id_placeholder')}
                      value={rchId}
                      onChange={(e) => setRchId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Newborn */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                  {t('form_section_newborn')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_newborn_name')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('form_newborn_name_placeholder')}
                      value={newbornName}
                      onChange={(e) => setNewbornName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_newborn_sex')}</label>
                    <select
                      value={newbornSex}
                      onChange={(e: any) => setNewbornSex(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 font-medium"
                    >
                      <option value="female">{t('sex_female')}</option>
                      <option value="male">{t('sex_male')}</option>
                      <option value="other">{t('sex_other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_birth_date')}</label>
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_birth_weight')}</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="7.0"
                      required
                      placeholder={t('form_birth_weight_placeholder')}
                      value={birthWeightKg}
                      onChange={(e) => setBirthWeightKg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_gestational_age')}</label>
                    <input
                      type="number"
                      min="24"
                      max="44"
                      required
                      placeholder={t('form_gestational_age_placeholder')}
                      value={gestationalAgeWeeks}
                      onChange={(e) => setGestationalAgeWeeks(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_health_status')}</label>
                    <select
                      value={healthStatus}
                      onChange={(e: any) => setHealthStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 font-medium"
                    >
                      <option value="stable">{t('status_stable')}</option>
                      <option value="attention_needed">{t('status_attention_needed')}</option>
                      <option value="critical">{t('status_critical')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('form_health_note')}</label>
                  <input
                    type="text"
                    placeholder={t('form_health_note_placeholder')}
                    value={healthStatusNote}
                    onChange={(e) => setHealthStatusNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Section 3: Follow-Up & Vaccination */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
                  {t('form_section_clinical')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_followup_type')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('form_followup_type_placeholder')}
                      value={nextFollowUpType}
                      onChange={(e) => setNextFollowUpType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_followup_date')}</label>
                    <input
                      type="date"
                      required
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_vaccine_name')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('form_vaccine_name_placeholder')}
                      value={nextVaccinationName}
                      onChange={(e) => setNextVaccinationName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t('form_vaccine_date')}</label>
                    <input
                      type="date"
                      required
                      value={nextVaccinationDate}
                      onChange={(e) => setNextVaccinationDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  {t('form_cancel_button')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold shadow-sm transition"
                >
                  {t('form_submit_button')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
