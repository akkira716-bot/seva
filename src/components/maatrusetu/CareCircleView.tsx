'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  UserX, 
  Eye, 
  CheckSquare, 
  Key, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Lock
} from 'lucide-react';
import { CareCircleMember, CareCircleAccessLevel } from '@/types/maatrusetu';

interface Props {
  recordId: string;
  motherName: string;
}

const ACCESS_DETAILS: Record<CareCircleAccessLevel, { label: string; desc: string; badge: string }> = {
  viewer: {
    label: 'Viewer',
    desc: 'Can only view baby care timeline and upcoming clinic appointments.',
    badge: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  helper: {
    label: 'Care Helper',
    desc: 'Can view baby timeline and mark assigned family care tasks as completed.',
    badge: 'bg-teal-50 text-teal-800 border-teal-200'
  },
  full: {
    label: 'Full Caregiver',
    desc: 'Can view mother recovery journal, receive emergency triage alerts, and coordinate visits.',
    badge: 'bg-purple-50 text-purple-800 border-purple-200'
  }
};

export default function CareCircleView({ recordId, motherName }: Props) {
  const [members, setMembers] = useState<CareCircleMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [revokeSuccess, setRevokeSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Partner / Husband');
  const [phone, setPhone] = useState('');
  const [accessLevel, setAccessLevel] = useState<CareCircleAccessLevel>('helper');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [recordId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maatrusetu?action=circle&recordId=${recordId}`);
      const json = await res.json();
      if (json.success) {
        setMembers(json.data);
      }
    } catch (e) {
      console.error('Failed to load care circle', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to revoke care circle access for ${memberName}? They will immediately lose access.`)) {
      return;
    }

    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke_circle_member', memberId })
      });
      const json = await res.json();
      if (json.success) {
        setMembers(prev => prev.filter(m => m.id !== memberId));
        setRevokeSuccess(`Access for ${memberName} was successfully revoked.`);
        setTimeout(() => setRevokeSuccess(''), 4000);
      }
    } catch (e) {
      console.error('Failed to revoke access', e);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !phone.trim()) {
      setFormError('Please enter member name and phone number.');
      return;
    }

    try {
      const res = await fetch('/api/maatrusetu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_circle_member',
          recordId,
          name: name.trim(),
          relationship,
          phone: phone.trim(),
          accessLevel,
          notificationsEnabled
        })
      });

      const json = await res.json();
      if (json.success) {
        setMembers(prev => [json.data, ...prev]);
        setShowInviteModal(false);
        setName('');
        setPhone('');
      } else {
        setFormError(json.error || 'Failed to invite member.');
      }
    } catch (e) {
      console.error('Failed to invite member', e);
      setFormError('Network error while creating member access.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Care Circle &amp; Consent Permissions</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase">
                {members.length} Active Caregivers
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consent-driven family access control. You decide who can see your recovery data with 1-click immediate revocation.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Caregiver</span>
        </button>
      </div>

      {revokeSuccess && (
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{revokeSuccess}</span>
        </div>
      )}

      {/* Permission Tiers Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            1. Viewer Tier
          </span>
          <p className="text-[10px] text-slate-500 leading-snug">
            Baby feeding &amp; appointment viewing only. No maternal recovery access.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-teal-800 flex items-center gap-1.5 text-[11px]">
            <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
            2. Helper Tier
          </span>
          <p className="text-[10px] text-slate-500 leading-snug">
            View baby timeline + complete assigned meal/errand/burping tasks.
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-purple-800 flex items-center gap-1.5 text-[11px]">
            <Key className="w-3.5 h-3.5 text-purple-600" />
            3. Full Caregiver Tier
          </span>
          <p className="text-[10px] text-slate-500 leading-snug">
            Full maternal recovery diary access + instant emergency triage alerts.
          </p>
        </div>
      </div>

      {/* Active Members List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading care circle members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
            <Lock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">No external caregivers have access. Your records remain strictly private.</p>
          </div>
        ) : (
          members.map((member) => {
            const tier = ACCESS_DETAILS[member.accessLevel] || ACCESS_DETAILS.viewer;
            return (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{member.name}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">{member.relationship}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${tier.badge}`}>
                      {tier.label}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">{tier.desc}</p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3" />
                      {member.phone}
                    </span>
                    <span>•</span>
                    <span>Granted: {new Date(member.invitedAt).toLocaleDateString()}</span>
                    {member.notificationsEnabled && (
                      <span className="text-teal-700 font-semibold flex items-center gap-0.5">
                        <Bell className="w-3 h-3" /> SMS Alerts On
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleRevoke(member.id, member.name)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition text-xs shrink-0 self-start sm:self-auto"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Revoke Access</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Grant Care Circle Access</h3>
              <button
                onClick={() => setShowInviteModal(false)}
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

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Caregiver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Devi / Sister Priya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Relationship to Mother *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Husband / Mother-in-law / Sister / ASHA"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Access Permission Level</label>
                <select
                  value={accessLevel}
                  onChange={(e: any) => setAccessLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                >
                  <option value="viewer">Viewer (Baby timeline &amp; visits only)</option>
                  <option value="helper">Care Helper (Can complete family care tasks)</option>
                  <option value="full">Full Caregiver (Recovery diary &amp; alerts access)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notif_check"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="notif_check" className="text-slate-700 font-medium">
                  Send SMS notification alerts for urgent follow-up visits
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-sm"
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
