'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  CheckSquare, 
  Square, 
  Shield, 
  Download, 
  AlertTriangle, 
  Bell, 
  User as UserIcon, 
  HelpCircle, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { Appointment, User } from '@/types';

function OrganizerContent() {
  const searchParams = useSearchParams();
  const providerIdParam = searchParams.get('providerId');
  const providerNameParam = searchParams.get('providerName');

  const [activeTab, setActiveTab] = useState<'appointments' | 'questions' | 'privacy'>('appointments');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // New appointment form state
  const [showAddModal, setShowAddModal] = useState(!!providerNameParam);
  const [title, setTitle] = useState(providerNameParam ? `Consultation with ${providerNameParam}` : '');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [providerName, setProviderName] = useState(providerNameParam || '');
  const [reminderPreference, setReminderPreference] = useState<'none' | '1_day_before' | '2_hours_before' | '1_hour_before'>('1_day_before');
  const [privateNotes, setPrivateNotes] = useState('');
  const [customQuestions, setCustomQuestions] = useState('');

  // Questions checklist state
  const [selectedQuestionStage, setSelectedQuestionStage] = useState('first_trimester');
  const [stageQuestions, setStageQuestions] = useState<string[]>([]);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Account Privacy State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  useEffect(() => {
    loadUser();
    loadQuestions(selectedQuestionStage);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadAppointments(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    loadQuestions(selectedQuestionStage);
  }, [selectedQuestionStage]);

  const loadUser = async () => {
    try {
      const res = await fetch('/api/auth?userId=user-demo-1');
      const json = await res.json();
      if (json.success) {
        setCurrentUser(json.data);
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    }
  };

  const loadAppointments = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?userId=${userId}`);
      const json = await res.json();
      if (json.success) {
        setAppointments(json.data);
      }
    } catch (e) {
      console.error('Failed to load appointments', e);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (stage: string) => {
    try {
      const res = await fetch(`/api/questions?stage=${stage}`);
      const json = await res.json();
      if (json.success) {
        setStageQuestions(json.questions);
      }
    } catch (e) {
      console.error('Failed to load questions', e);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title || !dateTime) return;

    const parsedQuestions = customQuestions
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          title,
          providerId: providerIdParam || undefined,
          providerName: providerName || undefined,
          dateTime,
          location: location || 'Clinic Office',
          reminderPreference,
          privateNotes: privateNotes || undefined,
          questionsToAsk: parsedQuestions
        })
      });

      const json = await res.json();
      if (json.success) {
        setAppointments([...appointments, json.data]);
        setShowAddModal(false);
        // Reset form
        setTitle('');
        setDateTime('');
        setLocation('');
        setPrivateNotes('');
        setCustomQuestions('');
      }
    } catch (e) {
      console.error('Failed to save appointment', e);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}&userId=${currentUser.id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setAppointments(appointments.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete appointment', e);
    }
  };

  const toggleQuestionCheck = (questionText: string) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [questionText]: !prev[questionText]
    }));
  };

  const handleAddCustomQuestion = () => {
    if (!newQuestionInput.trim()) return;
    setStageQuestions([...stageQuestions, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleCopyQuestions = () => {
    const textToCopy = `Questions for Doctor Visit (${selectedQuestionStage}):\n` +
      stageQuestions.map((q, i) => `${i + 1}. [${checkedQuestions[q] ? 'X' : ' '}] ${q}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // WHO Data Export Handler
  const handleExportData = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/auth?userId=${currentUser.id}&action=export`);
      const json = await res.json();
      if (json.success) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `seva_health_record_${currentUser.id}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setExportNotice(true);
      }
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  // WHO Right-to-be-forgotten Handler
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/auth?userId=${currentUser.id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setDeleteSuccess(true);
        setDeleteModalOpen(false);
        setCurrentUser(null);
        setAppointments([]);
      }
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const handleUpdatePreferences = async (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          userId: currentUser.id,
          updates
        })
      });
      const json = await res.json();
      if (json.success) {
        setCurrentUser(json.data);
      }
    } catch (e) {
      console.error('Failed to update preferences', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Personal Organizer (Stage 2)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Appointments & Visit Checklists
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Organize doctor visits, prep questions to ask, and manage your health record privacy.
          </p>
        </div>

        {/* Current user session pill */}
        {currentUser && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <div className="font-bold text-slate-800">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400">{currentUser.email}</div>
            </div>
          </div>
        )}
      </div>

      {deleteSuccess && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs space-y-1">
          <p className="font-bold">Account and Health Data Successfully Erased</p>
          <p>All personal appointments and health notes have been permanently purged according to WHO Digital Health standards.</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" role="tablist">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'appointments'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Saved Visits ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'questions'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Questions to Ask Doctor</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'privacy'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Account & Privacy Controls</span>
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Clinical Appointments</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule New Visit</span>
            </button>
          </div>

          {/* Add Appointment Modal */}
          {showAddModal && (
            <div className="p-6 rounded-2xl bg-white border border-rose-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Schedule Upcoming Visit</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Visit Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 24-Week Ultrasound & Checkup"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Provider or Clinic Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Dr. Sarah Lin / Providence Clinic"
                      value={providerName}
                      onChange={(e) => setProviderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Location / Office</label>
                    <input
                      type="text"
                      placeholder="e.g., 9155 SW Barnes Rd or Telehealth"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reminder Notification</label>
                  <select
                    value={reminderPreference}
                    onChange={(e: any) => setReminderPreference(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-slate-700"
                  >
                    <option value="1_day_before">1 Day Before (Email / SMS)</option>
                    <option value="2_hours_before">2 Hours Before</option>
                    <option value="1_hour_before">1 Hour Before</option>
                    <option value="none">No Automated Reminder</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Private Health Notes (Confidential to your account)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Mention frequent heartburn after dinner and back stiffness..."
                    value={privateNotes}
                    onChange={(e) => setPrivateNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Questions for the Doctor (One per line)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Can I travel at 30 weeks?&#10;What are safe allergy medications?"
                    value={customQuestions}
                    onChange={(e) => setCustomQuestions(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
                  >
                    Save Appointment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Appointments List */}
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading saved visits...</div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No scheduled appointments</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Keep track of your prenatal checkups, ultrasounds, lactation consults, and pediatric visits.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-semibold text-rose-600 underline"
              >
                Schedule your first visit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{appt.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-bold">
                          {appt.status}
                        </span>
                      </div>
                      {appt.providerName && (
                        <p className="text-xs font-semibold text-rose-600 mt-0.5">{appt.providerName}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteAppointment(appt.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        title="Delete appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>{new Date(appt.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    {appt.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        <span className="truncate">{appt.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reminder: {appt.reminderPreference.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Private Notes */}
                  {appt.privateNotes && (
                    <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900">
                      <strong className="font-semibold block text-[11px] text-amber-800">Private Notes:</strong>
                      <p className="mt-0.5">{appt.privateNotes}</p>
                    </div>
                  )}

                  {/* Questions to Ask */}
                  {appt.questionsToAsk && appt.questionsToAsk.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Questions for Doctor:
                      </span>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {appt.questionsToAsk.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUESTIONS TO ASK */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Clinical Visit Checklist</h2>
              <p className="text-xs text-slate-500">
                Pre-populated discussion questions recommended by obstetricians and pediatricians.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyQuestions}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
              >
                {copiedNotification ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Questions'}</span>
              </button>
            </div>
          </div>

          {/* Stage Selector Dropdown */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700">Choose Visit Type:</span>
            <select
              value={selectedQuestionStage}
              onChange={(e) => setSelectedQuestionStage(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-rose-500"
            >
              <option value="first_trimester">First Trimester Prenatal Visit (Wks 1–12)</option>
              <option value="second_trimester">Second Trimester & Anatomy Ultrasound (Wks 13–27)</option>
              <option value="third_trimester">Third Trimester & Labor Planning (Wks 28–40)</option>
              <option value="postpartum_checkup">Postpartum 6-Week Recovery Checkup</option>
              <option value="pediatric_well_check">Pediatric Well-Baby Visit</option>
            </select>
          </div>

          {/* Interactive Checklist */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            {stageQuestions.map((q, idx) => {
              const isChecked = !!checkedQuestions[q];
              return (
                <div
                  key={idx}
                  onClick={() => toggleQuestionCheck(q)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                    isChecked
                      ? 'bg-teal-50/60 border-teal-200 text-slate-500 line-through'
                      : 'bg-white border-slate-200 hover:border-rose-200 text-slate-800'
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-teal-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">{q}</span>
                </div>
              );
            })}

            {/* Custom Question input */}
            <div className="pt-3 flex gap-2">
              <input
                type="text"
                placeholder="Add your own custom question..."
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomQuestion()}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={handleAddCustomQuestion}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY & DATA OWNERSHIP */}
      {activeTab === 'privacy' && currentUser && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Account Preferences & WHO Digital Health Controls</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage notifications, language, and exercise your privacy rights over personal health notes.
              </p>
            </div>

            {/* Language & Notifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Preferred Language</label>
                <select
                  value={currentUser.preferredLanguage}
                  onChange={(e) => handleUpdatePreferences({ preferredLanguage: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-rose-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="fr">Français (French)</option>
                  <option value="zh">中文 (Mandarin)</option>
                </select>
                <p className="text-[11px] text-slate-400">Public articles and appointment notices will align with this preference.</p>
              </div>

              <div className="space-y-3">
                <span className="block text-xs font-bold text-slate-700">Notification Channels</span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentUser.notificationPreferences.appointmentReminders}
                      onChange={(e) =>
                        handleUpdatePreferences({
                          notificationPreferences: {
                            ...currentUser.notificationPreferences,
                            appointmentReminders: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Receive Visit Reminders (Email / SMS)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentUser.notificationPreferences.healthCheckins}
                      onChange={(e) =>
                        handleUpdatePreferences({
                          notificationPreferences: {
                            ...currentUser.notificationPreferences,
                            healthCheckins: e.target.checked
                          }
                        })
                      }
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Weekly Trimester & Milestone Check-in Prompts</span>
                  </label>
                </div>
              </div>
            </div>

            {/* WHO Compliance: Data Export & Right to be forgotten */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Data Dignity & Portability (WHO Digital Health Guidelines)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Export Complete Health Record</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Download all saved appointments, doctor questions, and optional care logs in standardized JSON format.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Health Archive</span>
                  </button>
                </div>

                {/* Purge / Delete Card */}
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">Right to be Forgotten</h4>
                    <p className="text-[11px] text-rose-700/90 mt-1 leading-relaxed">
                      Permanently wipe your account, appointments, and care logs. This action is immediate and non-reversible.
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Erase All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Confirm Complete Data Purge</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete your account? All saved appointments, private notes, doctor questions, and tracking history will be immediately deleted from the database.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                Keep My Account
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrganizerPage() {
  return (
    <React.Suspense fallback={<div className="max-w-6xl mx-auto p-12 text-center text-xs text-slate-500">Loading visit organizer...</div>}>
      <OrganizerContent />
    </React.Suspense>
  );
}
