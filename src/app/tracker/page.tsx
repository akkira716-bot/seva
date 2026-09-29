'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Moon, 
  Baby, 
  Coffee, 
  Pill, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  ChevronDown
} from 'lucide-react';
import { CareLogEntry, CareLogType } from '@/types';

export default function TrackerPage() {
  const [logs, setLogs] = useState<CareLogEntry[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeLogType, setActiveLogType] = useState<CareLogType>('feed');

  // Form states
  const [feedType, setFeedType] = useState('breast_left');
  const [feedDuration, setFeedDuration] = useState('15');
  const [feedAmountOz, setFeedAmountOz] = useState('');
  const [sleepDuration, setSleepDuration] = useState('60');
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'mixed'>('mixed');
  const [medicationName, setMedicationName] = useState('Vitamin D Drops (400 IU)');
  const [notes, setNotes] = useState('');

  // Retention purge state
  const [retentionDays, setRetentionDays] = useState('0'); // 0 = all
  const [purgeNotice, setPurgeNotice] = useState<string | null>(null);

  const userId = 'user-demo-1';

  useEffect(() => {
    fetchLogs();
  }, [activeFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);
      if (activeFilter !== 'all') params.append('entryType', activeFilter);

      const res = await fetch(`/api/care-logs?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
        setSummary(json.summary);
      }
    } catch (e) {
      console.error('Failed to load care logs', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let detailsPayload: any = { notes: notes.trim() || undefined };

      if (activeLogType === 'feed') {
        detailsPayload = {
          ...detailsPayload,
          subType: feedType,
          durationMinutes: feedDuration ? parseInt(feedDuration, 10) : undefined,
          amountOz: feedAmountOz ? parseFloat(feedAmountOz) : undefined
        };
      } else if (activeLogType === 'sleep') {
        detailsPayload = {
          ...detailsPayload,
          durationMinutes: sleepDuration ? parseInt(sleepDuration, 10) : 60
        };
      } else if (activeLogType === 'diaper') {
        detailsPayload = {
          ...detailsPayload,
          diaperType
        };
      } else if (activeLogType === 'medication') {
        detailsPayload = {
          ...detailsPayload,
          medicationName,
          dosage: 'Standard clinical dose'
        };
      }

      const res = await fetch('/api/care-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          entryType: activeLogType,
          timestamp: new Date().toISOString(),
          details: detailsPayload
        })
      });

      const json = await res.json();
      if (json.success) {
        setNotes('');
        fetchLogs();
      }
    } catch (e) {
      console.error('Failed to create care log', e);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/care-logs?id=${id}&userId=${userId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setLogs(logs.filter(l => l.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete log', e);
    }
  };

  const handlePurgeLogs = async () => {
    try {
      const res = await fetch(`/api/care-logs?userId=${userId}&retentionDays=${retentionDays}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setPurgeNotice(json.message);
        fetchLogs();
        setTimeout(() => setPurgeNotice(null), 4000);
      }
    } catch (e) {
      console.error('Failed to purge care logs', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Optional Health Tracking (Stage 3)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Baby Care Tracker & Vitality Logs
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Log feedings, sleep duration, and diaper changes to observe daily rhythms and share insights with your pediatrician.
          </p>
        </div>

        {/* Strict isolation badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 text-xs shadow-sm">
          <Lock className="w-4 h-4 text-teal-400" />
          <span>Care logs are isolated &amp; not indexed</span>
        </div>
      </div>

      {purgeNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
          {purgeNotice}
        </div>
      )}

      {/* Daily Summary Counters */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Today&apos;s Feedings</span>
              <div className="text-2xl font-black text-slate-900">{summary.todayFeedCount} feeds</div>
              <span className="text-[10px] text-slate-400">Target: 8–12 feeds / 24h</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Total Sleep Today</span>
              <div className="text-2xl font-black text-slate-900">
                {Math.floor(summary.todaySleepMinutes / 60)}h {summary.todaySleepMinutes % 60}m
              </div>
              <span className="text-[10px] text-slate-400">Naps &amp; night intervals</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Diaper Output Today</span>
              <div className="text-2xl font-black text-slate-900">{summary.todayDiaperCount} changes</div>
              <span className="text-[10px] text-slate-400">
                {summary.wetDiapers} wet • {summary.dirtyDiapers} dirty
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Quick Logger + History Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Log Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Record Activity</h2>
              <p className="text-xs text-slate-500">Select entry type to record</p>
            </div>

            {/* Entry type pill buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveLogType('feed')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeLogType === 'feed'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Feeding</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLogType('sleep')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeLogType === 'sleep'
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Sleep / Nap</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLogType('diaper')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeLogType === 'diaper'
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Diaper</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLogType('medication')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  activeLogType === 'medication'
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Pill className="w-4 h-4" />
                <span>Vitamins</span>
              </button>
            </div>

            {/* Dynamic Form based on activeLogType */}
            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
              {activeLogType === 'feed' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Feeding Method</label>
                    <select
                      value={feedType}
                      onChange={(e) => setFeedType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="breast_left">Nursing: Left Breast</option>
                      <option value="breast_right">Nursing: Right Breast</option>
                      <option value="breast_both">Nursing: Both Breasts</option>
                      <option value="bottle_breastmilk">Bottle: Expressed Breastmilk</option>
                      <option value="bottle_formula">Bottle: Infant Formula</option>
                      <option value="solids">Purees / Solid Foods</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Duration (Min)</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={feedDuration}
                        onChange={(e) => setFeedDuration(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Amount (Oz - Opt)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="e.g., 3.5"
                        value={feedAmountOz}
                        onChange={(e) => setFeedAmountOz(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeLogType === 'sleep' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sleep Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="720"
                    value={sleepDuration}
                    onChange={(e) => setSleepDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">e.g., 45 min nap or 180 min night stretch.</p>
                </div>
              )}

              {activeLogType === 'diaper' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Diaper Condition</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['wet', 'dirty', 'mixed'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDiaperType(type)}
                        className={`py-2 px-1 text-center rounded-lg border capitalize font-semibold transition ${
                          diaperType === type
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeLogType === 'medication' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Medication or Supplement</label>
                  <input
                    type="text"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Care Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g., Deep latch, calm, slept in bassinet..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition shadow-sm"
              >
                Record {activeLogType.toUpperCase()}
              </button>
            </form>
          </div>

          {/* Retention & Privacy Management Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Log Retention Policy (WHO Standard)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Care records are confidential and not stored indefinitely without a user purpose. Purge older records anytime:
            </p>

            <div className="flex gap-2">
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs"
              >
                <option value="0">All Logs (Complete Purge)</option>
                <option value="30">Logs Older Than 30 Days</option>
                <option value="60">Logs Older Than 60 Days</option>
                <option value="90">Logs Older Than 90 Days</option>
              </select>

              <button
                onClick={handlePurgeLogs}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
              >
                Purge
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline / History Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">Activity Timeline</h2>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 text-xs">
              {(['all', 'feed', 'sleep', 'diaper', 'medication'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                    activeFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading care logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
              <Activity className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No care entries logged yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the quick form on the left to track feeding intervals, nap durations, or diaper counts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-start justify-between gap-4 hover:border-slate-300 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl text-white mt-0.5 ${
                      log.entryType === 'feed'
                        ? 'bg-rose-500'
                        : log.entryType === 'sleep'
                        ? 'bg-purple-500'
                        : log.entryType === 'diaper'
                        ? 'bg-teal-500'
                        : 'bg-amber-500'
                    }`}>
                      {log.entryType === 'feed' && <Baby className="w-4 h-4" />}
                      {log.entryType === 'sleep' && <Moon className="w-4 h-4" />}
                      {log.entryType === 'diaper' && <Activity className="w-4 h-4" />}
                      {log.entryType === 'medication' && <Pill className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs capitalize text-slate-900">
                          {log.entryType}
                        </span>
                        {log.details.subType && (
                          <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {log.details.subType.replace('_', ' ')}
                          </span>
                        )}
                        {log.details.diaperType && (
                          <span className="px-2 py-0.2 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold uppercase">
                            {log.details.diaperType}
                          </span>
                        )}
                        {log.details.durationMinutes && (
                          <span className="text-[11px] font-semibold text-purple-700">
                            {log.details.durationMinutes} minutes
                          </span>
                        )}
                        {log.details.amountOz && (
                          <span className="text-[11px] font-semibold text-rose-700">
                            {log.details.amountOz} oz
                          </span>
                        )}
                      </div>

                      {log.details.notes && (
                        <p className="text-xs text-slate-600">{log.details.notes}</p>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="text-slate-300 hover:text-rose-600 p-1 rounded transition"
                    title="Delete log entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
