'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Copy, 
  Printer, 
  Edit3, 
  Check, 
  HelpCircle, 
  Activity, 
  Stethoscope, 
  Plus, 
  Trash2,
  Calendar
} from 'lucide-react';
import { DoctorRecoverySummary } from '@/types/maatrusetu';

interface Props {
  recordId: string;
  motherName: string;
  careDay: number;
}

export default function RecoverySummaryView({ recordId, motherName, careDay }: Props) {
  const [summary, setSummary] = useState<DoctorRecoverySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit fields
  const [customNotes, setCustomNotes] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    fetchSummary();
  }, [recordId]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maatrusetu?action=summary&recordId=${recordId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSummary(json.data);
        setCustomNotes(json.data.customMotherNotes || '');
        setQuestions(json.data.questionsForDoctor || []);
      }
    } catch (e) {
      console.error('Failed to load doctor summary', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_summary',
          recordId,
          customMotherNotes: customNotes,
          questions
        })
      });
      const json = await res.json();
      if (json.success) {
        setSummary(json.data);
        setIsEditing(false);
      }
    } catch (e) {
      console.error('Failed to save summary', e);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions(prev => [...prev, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCopy = () => {
    if (!summary) return;
    const text = `
=== SEVA MAATRUSETU CLINICAL CONSULTATION BRIEF ===
Patient: ${motherName} (Day ${summary.currentDay} of 42 Postpartum)
Date: ${summary.generatedDate}

VITAL & PROGRESS TREND:
${summary.vitalTrendsText}

BLEEDING & LOCHIA:
${summary.bleedingTrendSummary}

PAIN & COMFORT:
${summary.painTrendSummary}

MOOD & SLEEP:
${summary.moodPatternSummary}

QUESTIONS FOR DOCTOR:
${summary.questionsForDoctor.map((q, i) => `${i + 1}. ${q}`).join('\n')}

PATIENT PRIVATE NOTES:
${summary.customMotherNotes || 'None recorded'}
===================================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Compiling doctor summary...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Doctor Recovery Summary</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Day {careDay} Clinical Brief
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured consultation briefing for your OB-GYN, pediatrician, or ASHA home visit
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Brief' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Summary</span>
            </button>
          ) : (
            <button
              onClick={handleSaveSummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>

      {summary && (
        <div className="space-y-4 text-xs">
          {/* Clinical Overview Strip */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span className="font-bold uppercase tracking-wider text-slate-700">Clinical Status Overview</span>
              <span>Generated on {summary.generatedDate}</span>
            </div>
            <p className="font-medium text-slate-900 leading-relaxed">{summary.vitalTrendsText}</p>
          </div>

          {/* 3 Pillars: Bleeding, Pain, Mood */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Lochia &amp; Bleeding</span>
              <p className="text-slate-800 font-semibold">{summary.bleedingTrendSummary}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Pain Trajectory</span>
              <p className="text-slate-800 font-semibold">{summary.painTrendSummary}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Sleep &amp; Emotional Wellness</span>
              <p className="text-slate-800 font-semibold">{summary.moodPatternSummary}</p>
            </div>
          </div>

          {/* Questions for Doctor */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Prepared Questions for Consultation ({questions.length})
              </h4>
            </div>

            <ul className="space-y-2">
              {questions.map((q, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-800 font-medium">{idx + 1}. {q}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isEditing && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a new question for your doctor..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                />
                <button
                  onClick={handleAddQuestion}
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            )}
          </div>

          {/* Mother Notes / Concerns */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">Personal Notes / Concerns to Mention</h4>
            {isEditing ? (
              <textarea
                rows={3}
                placeholder="Mention any new concerns, feeding questions, or fatigue..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
              />
            ) : (
              <p className="text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                {summary.customMotherNotes || 'No custom notes added. Click "Edit Summary" to add specific concerns.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
