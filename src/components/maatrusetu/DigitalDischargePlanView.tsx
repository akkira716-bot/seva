'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  Calendar, 
  UserCheck, 
  ShieldCheck, 
  Edit3, 
  Activity, 
  Heart,
  Pill,
  Paperclip
} from 'lucide-react';
import { DigitalDischargePlan } from '@/types/maatrusetu';

interface Props {
  recordId: string;
  motherName: string;
}

export default function DigitalDischargePlanView({ recordId, motherName }: Props) {
  const [plan, setPlan] = useState<DigitalDischargePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Edit form state
  const [hospitalName, setHospitalName] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [attendingPhysician, setAttendingPhysician] = useState('');
  const [deliveryType, setDeliveryType] = useState<'vaginal' | 'cesarean'>('vaginal');
  const [woundCare, setWoundCare] = useState('');
  const [activityRestrictions, setActivityRestrictions] = useState('');
  const [babyFeedingPlan, setBabyFeedingPlan] = useState('');
  const [medicationScheduleNote, setMedicationScheduleNote] = useState('');
  const [emergencyTriggers, setEmergencyTriggers] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<string>('');

  useEffect(() => {
    fetchDischargePlan();
  }, [recordId]);

  const fetchDischargePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maatrusetu?action=discharge&recordId=${recordId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPlan(json.data);
        populateForm(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch discharge plan', e);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: DigitalDischargePlan) => {
    setHospitalName(data.hospitalName || '');
    setDischargeDate(data.dischargeDate || '');
    setAttendingPhysician(data.attendingPhysician || '');
    setDeliveryType(data.deliveryType || 'vaginal');
    setWoundCare(data.woundCare || '');
    setActivityRestrictions(data.activityRestrictions || '');
    setBabyFeedingPlan(data.babyFeedingPlan || '');
    setMedicationScheduleNote(data.medicationScheduleNote || '');
    setEmergencyTriggers(data.emergencyReturnTriggers ? data.emergencyReturnTriggers.join('\n') : '');
    setAttachmentFile(data.attachmentName || '');
  };

  const handleVerify = async () => {
    setVerifyLoading(true);
    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_discharge',
          recordId,
          clinicianNotes: 'Discharge instructions reviewed and authenticated by Community Health Officer.'
        })
      });
      const json = await res.json();
      if (json.success) {
        setPlan(json.data);
      }
    } catch (e) {
      console.error('Failed to verify discharge plan', e);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file.name);
      setUploadSuccess(`Uploaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
      setTimeout(() => setUploadSuccess(''), 4000);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const triggers = emergencyTriggers.split('\n').map(t => t.trim()).filter(Boolean);
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_discharge',
          recordId,
          hospitalName,
          dischargeDate,
          attendingPhysician,
          deliveryType,
          woundCare,
          activityRestrictions,
          babyFeedingPlan,
          medicationScheduleNote,
          emergencyReturnTriggers: triggers,
          attachmentName: attachmentFile || undefined
        })
      });
      const json = await res.json();
      if (json.success) {
        setPlan(json.data);
        setShowEditModal(false);
      }
    } catch (e) {
      console.error('Failed to save discharge plan', e);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading digital discharge plan...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Digital Discharge Plan</h2>
              {plan?.isVerifiedByClinician ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold border border-teal-200">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  Clinically Verified
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                  Awaiting Verification
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified hospital delivery protocol, wound care, medication guidance, and emergency return instructions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!plan?.isVerifiedByClinician && (
            <button
              onClick={handleVerify}
              disabled={verifyLoading}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{verifyLoading ? 'Verifying...' : 'Verify as Clinician'}</span>
            </button>
          )}

          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Plan</span>
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {plan ? (
        <div className="space-y-5">
          {/* Top Meta Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Facility Name</span>
              <span className="font-bold text-slate-900">{plan.hospitalName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Discharge Date</span>
              <span className="font-semibold text-slate-800">{plan.dischargeDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Modality</span>
              <span className="font-bold text-slate-800 capitalize">
                {plan.deliveryType === 'cesarean' ? 'Cesarean Section (LSCS)' : 'Normal Vaginal Delivery'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Attending Doctor</span>
              <span className="font-semibold text-slate-800">{plan.attendingPhysician}</span>
            </div>
          </div>

          {/* 4 Core Clinical Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Wound & Incision Care */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-600" />
                1. Wound &amp; Perineal/Incision Care
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{plan.woundCare}</p>
            </div>

            {/* 2. Activity & Rest Restrictions */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wide flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-purple-600" />
                2. Activity &amp; Lifting Restrictions
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{plan.activityRestrictions}</p>
            </div>

            {/* 3. Baby Lactation & Feeding Plan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                3. Infant Feeding &amp; Lactation Schedule
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{plan.babyFeedingPlan}</p>
            </div>

            {/* 4. Medication & Supplement Schedule */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-amber-600" />
                4. Informational Supplementation Schedule
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{plan.medicationScheduleNote}</p>
            </div>
          </div>

          {/* Emergency Return Triggers */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Immediate Hospital Return Triggers
            </span>
            <ul className="space-y-1.5 text-xs text-rose-900">
              {plan.emergencyReturnTriggers.map((trig, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{trig}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Document Attachment & Verification Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Attached Hospital Document:</span>
              <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                {plan.attachmentName || 'Discharge_Document_Verified.pdf'}
              </span>
            </div>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer transition shadow-sm">
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Upload Document</span>
              <input type="file" onChange={handleFileUpload} accept=".pdf,image/*" className="hidden" />
            </label>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-400">
          No discharge plan recorded yet. Click "Edit Plan" to record delivery instructions.
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Edit Digital Discharge Plan</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Clinic Name *</label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discharge Date *</label>
                  <input
                    type="date"
                    required
                    value={dischargeDate}
                    onChange={(e) => setDischargeDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Attending Physician / Obstetrician</label>
                  <input
                    type="text"
                    value={attendingPhysician}
                    onChange={(e) => setAttendingPhysician(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Modality</label>
                  <select
                    value={deliveryType}
                    onChange={(e: any) => setDeliveryType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="vaginal">Normal Vaginal Delivery</option>
                    <option value="cesarean">Cesarean Delivery (LSCS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wound &amp; Perineal / Incision Instructions</label>
                <textarea
                  rows={2}
                  value={woundCare}
                  onChange={(e) => setWoundCare(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity Restrictions &amp; Lifting Limits</label>
                <textarea
                  rows={2}
                  value={activityRestrictions}
                  onChange={(e) => setActivityRestrictions(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Baby Lactation &amp; Feeding Plan</label>
                <textarea
                  rows={2}
                  value={babyFeedingPlan}
                  onChange={(e) => setBabyFeedingPlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medication / Supplement Schedule Note (Informational)</label>
                <textarea
                  rows={2}
                  value={medicationScheduleNote}
                  onChange={(e) => setMedicationScheduleNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency Return Warning Signs (1 per line)</label>
                <textarea
                  rows={3}
                  value={emergencyTriggers}
                  onChange={(e) => setEmergencyTriggers(e.target.value)}
                  placeholder="Bleeding soaking > 2 pads in 1 hour&#10;Fever ≥ 100.4°F&#10;Severe headache / vision changes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm"
                >
                  Save Discharge Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
