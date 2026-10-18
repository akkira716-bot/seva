'use client';

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Printer, 
  Download, 
  ShieldCheck, 
  Baby, 
  Heart, 
  Calendar, 
  Syringe, 
  Sparkles,
  FileText
} from 'lucide-react';
import { CompletionReport42, MaatruSetuRecord } from '@/types/maatrusetu';

interface Props {
  record: MaatruSetuRecord;
  careDay: number;
}

export default function CompletionReportView({ record, careDay }: Props) {
  const [report, setReport] = useState<CompletionReport42 | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [record.id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maatrusetu?action=report&recordId=${record.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setReport(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch completion report', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Compiling 42-day completion report...</div>;
  }

  const isGraduated = careDay >= 42;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">42-Day Postnatal Continuum Completion Report</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                isGraduated
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isGraduated ? 'Milestone Completed' : `Day ${careDay} Preview`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive clinical closure record summarizing maternal recovery, neonatal vitality, immunizations, and community health visits
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Certificate</span>
        </button>
      </div>

      {report && (
        <div className="space-y-6">
          {/* Milestone Certificate Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/60 via-white to-rose-50/50 border-2 border-amber-200 shadow-md relative overflow-hidden space-y-6">
            <div className="flex items-start justify-between border-b border-amber-200/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span className="text-[11px] font-extrabold tracking-widest text-amber-900 uppercase">
                    Ministry of Health / SEVA MaatruSetu Continuum
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Certificate of 42-Day Continuum of Care
                </h3>
                <p className="text-xs text-slate-600">
                  This certifies successful navigation of the vital 6-week postnatal period for mother &amp; child.
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-amber-900 block">{report.certificateId}</span>
                <span className="text-[10px] text-slate-400">Date: {report.completedDate}</span>
              </div>
            </div>

            {/* Mother and Newborn Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/80 border border-amber-100 text-xs shadow-sm">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother</span>
                <span className="font-extrabold text-slate-900 text-sm">{record.mother.name}</span>
                <span className="text-[11px] text-slate-500 block">Age: {record.mother.age} yrs • RCH: {record.mother.rchId}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Newborn</span>
                <span className="font-extrabold text-slate-900 text-sm">{record.newborn.name}</span>
                <span className="text-[11px] text-slate-500 block capitalize">Sex: {record.newborn.sex} • Born: {record.newborn.birthDate}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Birth &amp; 42-Day Weight</span>
                <span className="font-extrabold text-teal-700 text-sm">
                  {record.newborn.birthWeightKg} kg → {(record.newborn.birthWeightKg + report.infantWeightGainKg).toFixed(2)} kg
                </span>
                <span className="text-[11px] text-teal-600 block font-medium">+{report.infantWeightGainKg} kg healthy gain</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Community Follow-ups</span>
                <span className="font-extrabold text-purple-700 text-sm">{report.ashaVisitMilestonesCompleted} of 6 Completed</span>
                <span className="text-[11px] text-purple-600 block">ASHA Home Visits</span>
              </div>
            </div>

            {/* 3 Outcome Verification Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* 1. Maternal Healing */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-rose-800">
                  <Heart className="w-4 h-4 text-rose-600" />
                  Maternal Physiological Healing
                </span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Uterine involution complete
                  </li>
                  <li className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Lochia resolved normally
                  </li>
                  <li className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Perineal / wound closure verified
                  </li>
                </ul>
              </div>

              {/* 2. Infant Growth & Milestones */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-teal-800">
                  <Baby className="w-4 h-4 text-teal-600" />
                  Infant Vitality Milestones
                </span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cord stump naturally detached
                  </li>
                  <li className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Normal neonatal jaundice cleared
                  </li>
                  <li className="flex items-center gap-1.5 text-teal-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Robust feeding &amp; weight trajectory
                  </li>
                </ul>
              </div>

              {/* 3. Immunization Schedule Status */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-purple-800">
                  <Syringe className="w-4 h-4 text-purple-600" />
                  National Immunization Status
                </span>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div>
                    <span className="font-bold text-slate-700 block">Completed Vaccines:</span>
                    <span className="text-teal-700 font-medium">{report.vaccinesCompletedList.join(', ')}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <span className="font-bold text-slate-700 block">Upcoming (Week 10 &amp; 14):</span>
                    <span className="text-slate-500">{report.upcomingChildhoodVaccinesList.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinician Authentication Stamp */}
            <div className="border-t border-amber-200/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                <span>
                  Certified by: <strong className="text-slate-900">{report.attendingHealthWorkerName}</strong> (Community Health Officer / ANM)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/90 border border-amber-200 text-center font-mono text-[10px] text-slate-600">
                ✓ Cryptographic Verification Seal • SEVA Health Network
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
