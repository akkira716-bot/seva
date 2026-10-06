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
