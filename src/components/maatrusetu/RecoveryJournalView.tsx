'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Heart, 
  Moon, 
  Thermometer, 
  Smile, 
  Activity,
  Flame,
  Info
} from 'lucide-react';
import { RecoveryJournalEntry, BleedingLevel, MoodState } from '@/types/maatrusetu';

interface Props {
  recordId: string;
  careDay: number;
}

const PAIN_LOCATIONS = [
  { id: 'perineum', label: 'Perineum' },
  { id: 'incision', label: 'C-Section Incision' },
  { id: 'breasts', label: 'Breasts / Nipples' },
  { id: 'lower_back', label: 'Lower Back' },
  { id: 'pelvis', label: 'Pelvic Floor' },
  { id: 'head', label: 'Head / Neck' }
];

const MOODS: { id: MoodState; label: string; emoji: string }[] = [
  { id: 'peaceful', label: 'Calm & Peaceful', emoji: '🌸' },
  { id: 'energetic', label: 'Good Energy', emoji: '✨' },
  { id: 'tired', label: 'Normal Tiredness', emoji: '😴' },
  { id: 'anxious', label: 'Anxious / Restless', emoji: '😟' },
  { id: 'weepy_overwhelmed', label: 'Weepy / Overwhelmed', emoji: '🌧️' }
];

export default function RecoveryJournalView({ recordId, careDay }: Props) {
  const [entries, setEntries] = useState<RecoveryJournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New entry form state
  const [entryDate, setEntryDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [painScore, setPainScore] = useState(2);
  const [painLocations, setPainLocations] = useState<string[]>(['perineum']);
  const [bleedingLevel, setBleedingLevel] = useState<BleedingLevel>('light');
  const [mood, setMood] = useState<MoodState>('peaceful');
  const [sleepHours, setSleepHours] = useState(6.0);
  const [temperatureF, setTemperatureF] = useState('98.6');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEntries();
  }, [recordId]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maatrusetu?action=journal&recordId=${recordId}`);
      const json = await res.json();
      if (json.success) {
        setEntries(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch journal entries', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = (id: string) => {
    setPainLocations(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_journal',
          recordId,
          date: entryDate,
          careDay,
          painScore,
          painLocations,
          bleedingLevel,
          mood,
          sleepHours,
          temperatureF: temperatureF ? Number(temperatureF) : undefined,
          notes: notes.trim() || undefined
        })
      });

      const json = await res.json();
      if (json.success) {
        setEntries(prev => [json.data, ...prev]);
        setShowAddModal(false);
        setNotes('');
      } else {
        setFormError(json.error || 'Failed to save entry.');
      }
    } catch (e) {
      console.error('Failed to add journal entry', e);
      setFormError('Network error while saving journal entry.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Maternal Recovery Journal</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
                {entries.length} Entries Logged
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily physical healing, pain tracking, bleeding trajectory, and emotional wellness diary
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Entry</span>
        </button>
      </div>

      {/* Entries Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading recovery journal...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No journal entries yet. Log today's recovery to track your healing trajectory!</p>
          </div>
        ) : (
          entries.map((entry) => {
            const hasRedFlags = entry.redFlagsDetected && entry.redFlagsDetected.length > 0;
            return (
              <div
                key={entry.id}
                className={`p-4 rounded-xl border transition space-y-3 ${
                  hasRedFlags
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      {entry.date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                      Day {entry.careDay}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">
                      Pain: <strong className={entry.painScore >= 7 ? 'text-rose-600' : 'text-slate-900'}>{entry.painScore}/10</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-slate-700">
                      Sleep: <strong>{entry.sleepHours}h</strong>
                    </span>
                  </div>
                </div>

                {/* Vitals Pills */}
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    Bleeding: <strong className="capitalize">{entry.bleedingLevel.replace('_', ' ')}</strong>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    Mood: <strong className="capitalize">{entry.mood.replace('_', ' ')}</strong>
                  </span>

                  {entry.temperatureF && (
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-rose-500" />
                      Temp: <strong>{entry.temperatureF}°F</strong>
                    </span>
                  )}

                  {entry.painLocations.length > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      Locations: <strong>{entry.painLocations.join(', ')}</strong>
                    </span>
                  )}
                </div>

                {entry.notes && (
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                    "{entry.notes}"
                  </p>
                )}

                {hasRedFlags && (
                  <div className="p-2.5 rounded-lg bg-rose-100/70 border border-rose-300 text-xs text-rose-900 flex items-start gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] uppercase">Alert Logged:</strong>
                      {entry.redFlagsDetected.join(' • ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Record Today's Recovery Journal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sleep (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Pain Score Slider */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">Maternal Pain Score: {painScore}/10</label>
                  <span className={`text-[11px] font-extrabold ${painScore >= 7 ? 'text-rose-600' : painScore >= 4 ? 'text-amber-600' : 'text-teal-600'}`}>
                    {painScore === 0 ? 'No Pain' : painScore <= 3 ? 'Mild' : painScore <= 6 ? 'Moderate' : 'Severe'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painScore}
                  onChange={(e) => setPainScore(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Pain Location Chips */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Where is the discomfort located?</label>
                <div className="flex flex-wrap gap-1.5">
                  {PAIN_LOCATIONS.map((loc) => {
                    const active = painLocations.includes(loc.id);
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => toggleLocation(loc.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          active
                            ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {loc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bleeding Level */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Postpartum Bleeding (Lochia) Volume</label>
                <select
                  value={bleedingLevel}
                  onChange={(e: any) => setBleedingLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                >
                  <option value="scant">Scant / Spotting only</option>
                  <option value="light">Light (Normal pad changes)</option>
                  <option value="moderate">Moderate (Pinkish brown discharge)</option>
                  <option value="heavy">Heavy (Soaking full pad in 2-3 hrs)</option>
                  <option value="abnormal_clots">Warning: Soaking pad in 1 hr / Large clots</option>
                </select>
              </div>

              {/* Mood Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Emotional State &amp; Mood</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`p-2 rounded-xl text-left border transition text-xs flex items-center gap-1.5 ${
                        mood === m.id
                          ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span className="truncate">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Oral Temperature (°F) - Optional</label>
                <input
                  type="text"
                  placeholder="e.g. 98.6"
                  value={temperatureF}
                  onChange={(e) => setTemperatureF(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Feelings / Questions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Baby latched easily; feeling fatigued around 4 PM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-sm"
                >
                  Save Journal Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
