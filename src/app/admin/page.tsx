'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Compass, 
  ShieldAlert, 
  PlusCircle, 
  ExternalLink, 
  RefreshCw, 
  Code2, 
  UserCheck, 
  ArrowRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { Article, Provider, AuditLog, UserRole, PublicationStatus } from '@/types';

export default function AdminPortalPage() {
  const [activeRole, setActiveRole] = useState<UserRole>('clinical_reviewer');
  const [activeTab, setActiveTab] = useState<'content' | 'providers' | 'audit' | 'fhir'>('content');

  const [articles, setArticles] = useState<Article[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // New Draft Modal
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftStage, setDraftStage] = useState<'pregnancy' | 'postpartum' | 'baby_care'>('pregnancy');
  const [draftAuthor, setDraftAuthor] = useState('');
  const [draftReviewer, setDraftReviewer] = useState('Dr. Sarah Lin, MD, FACOG');

  // FHIR Test Explorer
  const [fhirResponse, setFhirResponse] = useState<any>(null);
  const [fhirEndpoint, setFhirEndpoint] = useState<'Patient' | 'Appointment'>('Patient');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [artRes, provRes, auditRes] = await Promise.all([
        fetch('/api/admin/content'),
        fetch('/api/admin/providers'),
        fetch('/api/admin/audit-logs')
      ]);

      const [artData, provData, auditData] = await Promise.all([
        artRes.json(),
        provRes.json(),
        auditRes.json()
      ]);

      if (artData.success) setArticles(artData.data);
      if (provData.success) setProviders(provData.data);
      if (auditData.success) setAuditLogs(auditData.data);
    } catch (e) {
      console.error('Failed to load admin portal data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArticleStatus = async (articleId: string, nextStatus: PublicationStatus) => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          articleId,
          nextStatus,
          reviewerName: activeRole === 'clinical_reviewer' ? 'Dr. Sarah Lin, MD' : 'Editorial Staff',
          actorRole: activeRole
        })
      });
      const json = await res.json();
      if (json.success) {
        fetchAdminData();
      }
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !draftBody) return;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_draft',
          articleData: {
            title: draftTitle,
            body: draftBody,
            stage: draftStage,
            author: draftAuthor || 'Staff Contributor',
            clinicalReviewer: draftReviewer
          },
          actorRole: activeRole
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowDraftModal(false);
        setDraftTitle('');
        setDraftBody('');
        fetchAdminData();
      }
    } catch (e) {
      console.error('Failed to submit draft', e);
    }
  };

  const handleVerifyProvider = async (providerId: string, status: 'verified' | 'retired') => {
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          status,
          actorRole: activeRole
        })
      });
      const json = await res.json();
      if (json.success) {
        fetchAdminData();
      }
    } catch (e) {
      console.error('Provider update failed', e);
    }
  };

  const testFhirEndpoint = async (endpoint: 'Patient' | 'Appointment') => {
    setFhirEndpoint(endpoint);
    try {
      const url = endpoint === 'Patient' ? '/api/fhir/Patient?id=user-demo-1' : '/api/fhir/Appointment?patient=user-demo-1';
      const res = await fetch(url);
      const json = await res.json();
      setFhirResponse(json);
    } catch (e) {
      console.error('FHIR fetch failed', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with Role Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Staff &amp; Reviewer Portal (Stage 4)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Clinical Governance &amp; Administration
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Review maternal health evidence, manage provider credentials, and audit privacy operations.
          </p>
        </div>

        {/* Role Switcher Pill */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 pl-2">Active Role:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setActiveRole('clinical_reviewer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeRole === 'clinical_reviewer'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Dr. Sarah Lin (Clinical Reviewer)
            </button>
            <button
              onClick={() => setActiveRole('content_editor')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeRole === 'content_editor'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Content Editor
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              System Admin
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" role="tablist">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'content'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Clinical Review Workflow ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'providers'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Provider Directory Management ({providers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Operational &amp; Security Audit Logs</span>
        </button>

        <button
          onClick={() => { setActiveTab('fhir'); testFhirEndpoint('Patient'); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'fhir'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>HL7 FHIR &amp; Clinic Interoperability</span>
        </button>
      </div>

      {/* TAB 1: CONTENT WORKFLOW */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Workflow Diagram Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Section 6 Blueprint: Clinical Review Pipeline
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">1. Draft</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">2. Clinical Review</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">3. Editorial Review</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800">4. Published Live</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">5. Scheduled Review / Retire</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Articles &amp; Clinical Guidance</h2>
            <button
              onClick={() => setShowDraftModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Draft New Guidance</span>
            </button>
          </div>

          {/* New Draft Modal */}
          {showDraftModal && (
            <div className="p-6 rounded-2xl bg-white border border-purple-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Submit New Clinical Article Draft</h3>
                <button onClick={() => setShowDraftModal(false)} className="text-xs text-slate-400">Cancel</button>
              </div>

              <form onSubmit={handleCreateDraft} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Managing Gestational Hypertension"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Care Stage</label>
                    <select
                      value={draftStage}
                      onChange={(e: any) => setDraftStage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="pregnancy">Pregnancy &amp; Prenatal</option>
                      <option value="postpartum">Postpartum &amp; Fourth Trimester</option>
                      <option value="baby_care">Newborn &amp; Baby Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Author / Contributor</label>
                    <input
                      type="text"
                      placeholder="e.g., Elena Gomez, CNM"
                      value={draftAuthor}
                      onChange={(e) => setDraftAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Clinical Reviewer</label>
                    <input
                      type="text"
                      value={draftReviewer}
                      onChange={(e) => setDraftReviewer(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Article Body (Markdown Supported) *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter evidence-based guidance, dosage boundaries, and urgent warning signs..."
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDraftModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    Submit for Clinical Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Articles Workflow Table */}
          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Title &amp; Stage</th>
                  <th className="p-4">Author / Reviewer</th>
                  <th className="p-4">Status &amp; Version</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{art.title}</div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        {art.stage.replace('_', ' ')} • {art.readingTimeMinutes}m read
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{art.author}</div>
                      <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" />
                        <span>{art.clinicalReviewer}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        art.publicationStatus === 'published'
                          ? 'bg-teal-100 text-teal-800'
                          : art.publicationStatus === 'clinical_review'
                          ? 'bg-blue-100 text-blue-800'
                          : art.publicationStatus === 'editorial'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {art.publicationStatus.replace('_', ' ')}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">Version {art.version || 1}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {art.publicationStatus === 'clinical_review' && (
                          <button
                            onClick={() => handleUpdateArticleStatus(art.id, 'editorial')}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                          >
                            Approve Clinical Review
                          </button>
                        )}

                        {art.publicationStatus === 'editorial' && (
                          <button
                            onClick={() => handleUpdateArticleStatus(art.id, 'published')}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                          >
                            Publish Live
                          </button>
                        )}

                        {art.publicationStatus === 'published' && (
                          <button
                            onClick={() => handleUpdateArticleStatus(art.id, 'retired')}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold"
                          >
                            Retire / Archive
                          </button>
                        )}

                        {art.publicationStatus === 'retired' && (
                          <button
                            onClick={() => handleUpdateArticleStatus(art.id, 'clinical_review')}
                            className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold"
                          >
                            Re-Open Review
                          </button>
                        )}

                        <Link
                          href={`/articles/${art.slug}`}
                          className="p-1 text-slate-400 hover:text-slate-800"
                          title="Preview public view"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROVIDERS VERIFICATION */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Provider Credential &amp; Listing Management</h2>
            <span className="text-xs text-slate-500">
              Only verified listings are published in the public search directory.
            </span>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Provider / Organization</th>
                  <th className="p-4">Specialty &amp; Location</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((prov) => (
                  <tr key={prov.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{prov.name}</div>
                      <div className="text-[11px] text-slate-500">{prov.organization || 'Independent Practice'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{prov.contactDetails.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-rose-600">{prov.specialty}</div>
                      <div className="text-[11px] text-slate-500">
                        {prov.location.city}, {prov.location.state}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        prov.listingStatus === 'verified'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {prov.listingStatus}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">Verified: {prov.verificationDate}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {prov.listingStatus !== 'verified' ? (
                          <button
                            onClick={() => handleVerifyProvider(prov.id, 'verified')}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs"
                          >
                            Verify Credentials
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyProvider(prov.id, 'retired')}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
                          >
                            Suspend / Retire
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              <span>Section 5 Security Guarantee: Application audit logs never store personal health notes or user search queries.</span>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Actor &amp; Role</th>
                  <th className="p-4">Action Event</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{log.actorId}</span>
                      <div className="text-[10px] text-purple-700 uppercase font-sans font-semibold">
                        {log.actorRole}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: HL7 FHIR CLINIC INTEGRATIONS */}
      {activeTab === 'fhir' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-teal-200 shadow-sm space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>HL7 FHIR R4 Interoperability Gateway</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                Electronic Health Record (EHR) Synchronization
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                As described in Section 7 of the blueprint, when clinics and maternal health networks integrate, data is exchanged via the HL7 FHIR standard with explicit patient consent. Test live FHIR endpoints below:
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => testFhirEndpoint('Patient')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  fhirEndpoint === 'Patient'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                GET /api/fhir/Patient
              </button>
              <button
                onClick={() => testFhirEndpoint('Appointment')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  fhirEndpoint === 'Appointment'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                GET /api/fhir/Appointment
              </button>
            </div>

            {/* JSON Output Viewer */}
            <div className="p-4 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs overflow-x-auto max-h-96 shadow-inner">
              <pre>{JSON.stringify(fhirResponse, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
