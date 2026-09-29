// SEVA Mother and Child Care Platform Types

export type Stage = 'pregnancy' | 'postpartum' | 'baby_care';

export type PublicationStatus = 
  | 'draft' 
  | 'clinical_review' 
  | 'editorial' 
  | 'published' 
  | 'retired';

export type UserRole = 'user' | 'content_editor' | 'clinical_reviewer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  preferredLanguage: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    appointmentReminders: boolean;
    healthCheckins: boolean;
  };
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  stage: Stage;
  author: string;
  clinicalReviewer: string;
  clinicalReviewerTitle?: string;
  reviewDate: string;
  publicationStatus: PublicationStatus;
  region: string;
  language: string;
  topics: string[];
  readingTimeMinutes: number;
  urgentFlags?: string[];
  version?: number;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  organization?: string;
  services: string[];
  location: {
    city: string;
    state: string;
    zipCode: string;
    address: string;
    distanceMiles?: number;
  };
  languages: string[];
  contactDetails: {
    phone: string;
    email: string;
    website?: string;
  };
  verificationDate: string;
  listingStatus: 'verified' | 'pending' | 'retired';
  acceptsInsurance: boolean;
  telehealthAvailable: boolean;
  rating?: number;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  providerId?: string;
  providerName?: string;
  dateTime: string;
  location?: string;
  reminderPreference: 'none' | '1_day_before' | '2_hours_before' | '1_hour_before';
  privateNotes?: string;
  questionsToAsk?: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export type CareLogType = 'feed' | 'sleep' | 'diaper' | 'medication' | 'growth';

export interface CareLogEntry {
  id: string;
  userId: string;
  entryType: CareLogType;
  timestamp: string;
  // Specific payload for type
  details: {
    subType?: string; // e.g., 'breast_left', 'breast_right', 'bottle_formula', 'solid'
    amountOz?: number;
    durationMinutes?: number;
    diaperType?: 'wet' | 'dirty' | 'mixed';
    medicationName?: string;
    dosage?: string;
    weightKg?: number;
    heightCm?: number;
    notes?: string;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: 'article' | 'provider' | 'user' | 'system';
  entityId: string;
  details: string;
}

export interface EmergencyHelpInfo {
  id: string;
  category: 'maternal' | 'infant' | 'mental_health';
  title: string;
  description: string;
  redFlags: string[];
  actionRequired: string;
  hotline: string;
}
