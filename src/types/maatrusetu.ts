// MaatruSetu Domain Models & Types
// Completely separate from existing SEVA data models

export type NewbornSex = 'female' | 'male' | 'other';
export type MaatruSetuHealthStatus = 'stable' | 'attention_needed' | 'critical';

export interface MotherProfile {
  name: string;
  age: number;
  phone?: string;
  rchId?: string; // Reproductive and Child Health ID
}

export interface NewbornProfile {
  name: string;
  sex: NewbornSex;
  birthDate: string; // ISO date string YYYY-MM-DD
  birthWeightKg: number;
  gestationalAgeWeeks: number;
}

export interface FollowUpInfo {
  date: string;
  type: string;
  providerOrWorker?: string;
}

export interface VaccinationInfo {
  name: string;
  dueDate: string;
  status?: 'pending' | 'completed' | 'overdue';
}

export interface MaatruSetuRecord {
  id: string;
  mother: MotherProfile;
  newborn: NewbornProfile;
  healthStatus: MaatruSetuHealthStatus;
  healthStatusNote?: string;
  nextFollowUp: FollowUpInfo;
  nextVaccination: VaccinationInfo;
  checkInStatus: 'pending' | 'in_progress' | 'completed';
  registeredAt: string;
}

export interface CareDayCalculation {
  currentDay: number;
  totalDays: number;
  isWithinWindow: boolean;
  daysRemaining: number;
  progressPercent: number;
}

/**
 * Computes current care day out of 42 based on the newborn's birth date.
 * Day 1 is the date of birth.
 */
export function computeCareDay(birthDateStr: string, totalDays: number = 42): CareDayCalculation {
  const birth = new Date(birthDateStr);
  const now = new Date();
  
  // Set both to midnight UTC for clean calendar day difference
  const utcBirth = Date.UTC(birth.getFullYear(), birth.getMonth(), birth.getDate());
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = utcNow - utcBirth;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Day 1 is the day of birth (diff = 0 -> day 1)
  const currentDay = Math.max(1, diffDays + 1);
  const isWithinWindow = currentDay <= totalDays;
  const daysRemaining = Math.max(0, totalDays - currentDay);
  const progressPercent = Math.min(100, Math.round((Math.min(currentDay, totalDays) / totalDays) * 100));

  return {
    currentDay,
    totalDays,
    isWithinWindow,
    daysRemaining,
    progressPercent
  };
}

// -------------------------------------------------------------
// NEW FEATURE 1: MaatruAI Personalized Daily Guidance
// -------------------------------------------------------------
export interface MaatruAIGuidance {
  dayNumber: number;
  headline: string;
  maternalBodyFocus: string;
  infantMilestone: string;
  nutritionHydrationTip: string;
  emotionalWellbeingTip: string;
  cautionFlag: string;
  disclaimer: string;
}

// -------------------------------------------------------------
// NEW FEATURE 2: Family Care Mode (Caregiver Tasks)
// -------------------------------------------------------------
export type CaregiverRole = 'Partner' | 'Grandmother' | 'Aunt / Sister' | 'Elder / Relative' | 'Community Helper';
export type TaskPriority = 'routine' | 'comfort' | 'urgent';
export type TaskCategory = 'nutrition' | 'baby_care' | 'rest' | 'errands' | 'medication';

export interface FamilyCareTask {
  id: string;
  recordId: string;
  title: string;
  description?: string;
  assignedRole: CaregiverRole;
  priority: TaskPriority;
  category: TaskCategory;
  isCompleted: boolean;
  dueDate: string;
  completedAt?: string;
  completedBy?: string;
}

// -------------------------------------------------------------
// NEW FEATURE 3: Digital Discharge Plan
// -------------------------------------------------------------
export interface DigitalDischargePlan {
  id: string;
  recordId: string;
  hospitalName: string;
  dischargeDate: string;
  attendingPhysician: string;
  deliveryType: 'vaginal' | 'cesarean';
  woundCare: string;
  activityRestrictions: string;
  babyFeedingPlan: string;
  medicationScheduleNote: string; // Strictly informational adherence logging
  emergencyReturnTriggers: string[];
  isVerifiedByClinician: boolean;
  verifiedAt?: string;
  clinicianNotes?: string;
  attachmentName?: string;
}

// -------------------------------------------------------------
// NEW FEATURE 4: Recovery Journal (Daily Log)
// -------------------------------------------------------------
export type BleedingLevel = 'scant' | 'light' | 'moderate' | 'heavy' | 'abnormal_clots';
export type MoodState = 'peaceful' | 'energetic' | 'tired' | 'anxious' | 'weepy_overwhelmed';

export interface RecoveryJournalEntry {
  id: string;
  recordId: string;
  date: string;
  careDay: number;
  painScore: number; // 0 to 10 scale
  painLocations: string[]; // e.g. ["perineum", "lower_back", "breasts", "incision"]
  bleedingLevel: BleedingLevel;
  mood: MoodState;
  sleepHours: number;
  temperatureF?: number;
  notes?: string;
  redFlagsDetected: string[];
  createdAt: string;
}

// -------------------------------------------------------------
// NEW FEATURE 5: Doctor Recovery Summary
// -------------------------------------------------------------
export interface DoctorRecoverySummary {
  id: string;
  recordId: string;
  generatedDate: string;
  currentDay: number;
  vitalTrendsText: string;
  bleedingTrendSummary: string;
  painTrendSummary: string;
  moodPatternSummary: string;
  questionsForDoctor: string[];
  customMotherNotes: string;
  doctorReviewNotes?: string;
  isReviewedByDoctor: boolean;
}

// -------------------------------------------------------------
// NEW FEATURE 6: Family Explainer (Simplified Medical Instructions)
// -------------------------------------------------------------
export interface FamilyExplainerItem {
  id: string;
  medicalTerm: string;
  category: 'maternal' | 'neonatal' | 'warning' | 'medication';
  plainLanguageMeaning: string;
  whatFamilyShouldDo: string;
  whatNOTToDo: string;
  dangerSignsToCallDoctor: string;
}

// -------------------------------------------------------------
// NEW FEATURE 7: Offline Mode Cache State
// -------------------------------------------------------------
export interface OfflineEmergencyCard {
  motherName: string;
  rchId: string;
  babyName: string;
  babyDob: string;
  deliveryType: string;
  bloodGroup?: string;
  emergencyContacts: { name: string; relation: string; phone: string }[];
  hospitalName: string;
  ambulanceHelpline: string;
  criticalAllergies: string;
  lastSyncedTimestamp: string;
}

// -------------------------------------------------------------
// NEW FEATURE 8: Care Circle (Consent-Based Access & Permissions)
// -------------------------------------------------------------
export type CareCircleAccessLevel = 'viewer' | 'helper' | 'full';

export interface CareCircleMember {
  id: string;
  recordId: string;
  name: string;
  relationship: string;
  phone: string;
  accessLevel: CareCircleAccessLevel;
  status: 'active' | 'revoked';
  invitedAt: string;
  revokedAt?: string;
  notificationsEnabled: boolean;
}

// -------------------------------------------------------------
// NEW FEATURE 9: 42-Day Completion Report
// -------------------------------------------------------------
export interface CompletionReport42 {
  id: string;
  recordId: string;
  completedDate: string;
  overallOutcome: 'milestones_achieved' | 'extended_monitoring_advised';
  totalJournalEntries: number;
  averagePainResolved: boolean;
  lochiaNormalResolution: boolean;
  moodStatusResolved: boolean;
  infantWeightGainKg: number;
  vaccinesCompletedList: string[];
  upcomingChildhoodVaccinesList: string[];
  ashaVisitMilestonesCompleted: number;
  attendingHealthWorkerName: string;
  certificateId: string;
  clinicianSignOffDate?: string;
}
