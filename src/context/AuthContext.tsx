'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

export interface RolePreset {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  badge: string;
  email: string;
  avatarBg: string;
  description: string;
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'user-demo-1',
    name: 'Anita Sharma',
    role: 'mother',
    title: 'Postnatal Mother (Day 8 of 42)',
    badge: 'Mother / Parent',
    email: 'anita.mother@maatrusetu.org',
    avatarBg: 'bg-rose-500',
    description: 'Access Maternal Care Dashboard, Recovery Journal, Family Care, Organizer & Baby Vitals.'
  },
  {
    id: 'asha-demo-1',
    name: 'Geeta Bai',
    role: 'asha',
    title: 'Senior ASHA Community Health Worker',
    badge: 'ASHA Health Worker',
    email: 'geeta.asha@health.gov.in',
    avatarBg: 'bg-emerald-600',
    description: 'Track 42-day community cohort, home visit schedules, maternal triage, and danger signs.'
  },
  {
    id: 'reviewer-demo-1',
    name: 'Dr. Sarah Lin, MD, FACOG',
    role: 'doctor',
    title: 'Consulting Obstetrician & Clinical Reviewer',
    badge: 'Doctor / Reviewer',
    email: 'dr.lin@clinics.maatrusetu.org',
    avatarBg: 'bg-sky-600',
    description: 'Verify discharge plans, evaluate doctor recovery summaries, and review health guidance.'
  },
  {
    id: 'admin-demo-1',
    name: 'MaatruSetu System Admin',
    role: 'admin',
    title: 'Executive Platform & Security Administrator',
    badge: 'System Admin',
    email: 'admin@maatrusetu.org',
    avatarBg: 'bg-purple-600',
    description: 'Full administrative governance, security audit logs, provider verification, and FHIR stubs.'
  }
];

interface AuthContextType {
  currentUser: User | null;
  activeRole: UserRole;
  isAuthenticated: boolean;
  switchRolePreset: (presetId: string) => void;
  switchRole: (role: UserRole) => void;
  login: (email: string, name?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'maatrusetu_unified_auth_v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('mother');

  useEffect(() => {
    // Initialize auth from localStorage or default to Mother preset
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user) {
          setCurrentUser(parsed.user);
          setActiveRole(parsed.user.role || 'mother');
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved auth', e);
      }
    }
    // Default fallback to first preset (Anita Sharma - Mother)
    initDefaultUser();
  }, []);

  const initDefaultUser = async () => {
    const defaultPreset = ROLE_PRESETS[0];
    const userObj: User = {
      id: defaultPreset.id,
      name: defaultPreset.name,
      email: defaultPreset.email,
      role: defaultPreset.role,
      preferredLanguage: 'en',
      notificationPreferences: {
        email: true,
        sms: true,
        appointmentReminders: true,
        healthCheckins: true
      },
      createdAt: '2026-09-01T10:00:00Z'
    };
    setCurrentUser(userObj);
    setActiveRole(defaultPreset.role);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userObj }));
  };

  const switchRolePreset = async (presetId: string) => {
    const preset = ROLE_PRESETS.find(p => p.id === presetId) || ROLE_PRESETS[0];
    try {
      // Sync with server if exists
      const res = await fetch(`/api/auth?userId=${preset.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        const user = { ...json.data, role: preset.role };
        setCurrentUser(user);
        setActiveRole(preset.role);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
        return;
      }
    } catch (e) {
      console.warn('Using client preset without remote fetch', e);
    }

    const fallbackUser: User = {
      id: preset.id,
      name: preset.name,
      email: preset.email,
      role: preset.role,
      preferredLanguage: preset.role === 'asha' ? 'hi' : 'en',
      notificationPreferences: {
        email: true,
        sms: true,
        appointmentReminders: true,
        healthCheckins: true
      },
      createdAt: '2026-09-01T10:00:00Z'
    };
    setCurrentUser(fallbackUser);
    setActiveRole(preset.role);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: fallbackUser }));
  };

  const switchRole = (role: UserRole) => {
    const preset = ROLE_PRESETS.find(p => p.role === role) || ROLE_PRESETS[0];
    switchRolePreset(preset.id);
  };

  const login = async (email: string, name?: string, role?: UserRole): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          name: name || email.split('@')[0],
          role: role || 'mother'
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentUser(json.data);
        setActiveRole(json.data.role);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: json.data }));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error', e);
      return false;
    }
  };

  const logout = () => {
    initDefaultUser();
  };

  const hasAccess = (allowedRoles: UserRole[]): boolean => {
    if (activeRole === 'admin') return true;
    return allowedRoles.includes(activeRole);
  };

  const refreshUserData = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/auth?userId=${currentUser.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentUser(json.data);
        setActiveRole(json.data.role);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: json.data }));
      }
    } catch (e) {
      console.error('Failed refreshing user data', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        isAuthenticated: !!currentUser,
        switchRolePreset,
        switchRole,
        login,
        logout,
        hasAccess,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
