// MaatruSetu Localized Translation Dictionary
// Rule: Every user-facing label in translation keys (English for now, extensible for regional languages)

export const maatrusetuTranslationsEn = {
  // Navigation & Branding
  nav_title: 'MaatruSetu',
  badge_new: 'Active Care',
  hero_badge: 'Maternal & Newborn 42-Day Continuum of Care',
  page_title: 'MaatruSetu Care Dashboard',
  page_subtitle: 'Tracking postpartum recovery, infant vitality milestones, and essential check-ins across the critical 42-day window.',

  // Profile Switching & Directory
  select_pair_label: 'Registered Mother & Newborn Pairs',
  switch_pair_button: 'Select Profile',
  register_new_button: '+ Register Mother & Newborn',
  active_record_badge: 'Active Profile',

  // Mother Profile
  mother_profile_title: 'Mother Profile',
  mother_name_label: 'Mother’s Name',
  mother_age_label: 'Age',
  years_old: 'years',
  rch_id_label: 'RCH / Health ID',

  // Newborn Profile
  newborn_profile_title: 'Newborn Profile',
  newborn_name_label: 'Baby’s Name',
  newborn_sex_label: 'Sex',
  sex_female: 'Female',
  sex_male: 'Male',
  sex_other: 'Other',
  birth_date_label: 'Date of Birth',
  baby_age_in_days: 'Age: Day {day}',

  // Birth Metrics
  birth_metrics_title: 'Birth & Gestational Metrics',
  birth_weight_label: 'Birth Weight',
  birth_weight_unit: 'kg',
  low_birth_weight_badge: 'Low Birth Weight (< 2.5 kg)',
  normal_birth_weight_badge: 'Normal Weight',
  gestational_age_label: 'Gestational Age',
  gestational_age_unit: 'weeks',
  preterm_badge: 'Preterm (< 37 wks)',
  term_badge: 'Full Term (≥ 37 wks)',

  // Care Day Out of 42
  care_day_card_title: 'Continuum of Care Timeline',
  care_day_counter: 'Day {current} of {total}',
  care_day_description: 'The first 42 days (6 weeks) postpartum represent the most vital period for maternal healing and neonatal survival.',
  care_day_progress_label: 'Care Window Progress',
  care_day_days_remaining: '{count} days remaining in 42-day window',
  care_day_completed: '42-day postnatal care milestone completed',

  // Health Status
  health_status_title: 'Clinical Health Status',
  status_stable: 'Stable',
  status_attention_needed: 'Attention Needed',
  status_critical: 'Critical Alert',
  status_note_label: 'Clinical Observation',

  // Next Follow-Up
  next_followup_title: 'Next Scheduled Follow-up',
  followup_date_label: 'Date',
  followup_type_label: 'Visit Type',
  followup_worker_label: 'Assigned Healthcare Worker',

  // Next Vaccination
  next_vaccination_title: 'Next Immunization',
  vaccine_name_label: 'Vaccine / Dose',
  vaccine_date_label: 'Due Date',
  vaccine_status_pending: 'Scheduled',
  vaccine_status_completed: 'Administered',
  vaccine_status_overdue: 'Overdue',

  // Call to Action
  start_checkin_button: 'Start Check-in',
  start_checkin_description: 'Initiate daily postpartum & neonatal symptom screening questionnaire',
  checkin_link_notice: 'Check-in gateway ready. Connects to clinical telemetry in future stage.',

  // Registration Form Modal
  form_modal_title: 'Register Mother + Newborn',
  form_modal_subtitle: 'Enter baseline maternal and neonatal delivery details to initialize 42-day care tracking.',
  form_section_mother: '1. Mother’s Information',
  form_section_newborn: '2. Newborn’s Information',
  form_section_clinical: '3. Initial Clinical State & Follow-up',
  
  form_mother_name: 'Mother’s Full Name *',
  form_mother_name_placeholder: 'e.g. Sunita Devi',
  form_mother_age: 'Mother’s Age (years) *',
  form_mother_age_placeholder: 'e.g. 26',
  form_mother_phone: 'Contact Phone Number',
  form_mother_phone_placeholder: 'e.g. +91 98765 43210',
  form_rch_id: 'RCH Registration ID',
  form_rch_id_placeholder: 'e.g. RCH-2026-0894',

  form_newborn_name: 'Baby’s Name *',
  form_newborn_name_placeholder: 'e.g. Baby of Sunita / Aarav',
  form_newborn_sex: 'Sex *',
  form_birth_date: 'Date of Birth *',
  form_birth_weight: 'Birth Weight (in kg) *',
  form_birth_weight_placeholder: 'e.g. 2.85',
  form_gestational_age: 'Gestational Age (weeks) *',
  form_gestational_age_placeholder: 'e.g. 39',

  form_health_status: 'Initial Health Status *',
  form_health_note: 'Clinical Observation / Risk Factors',
  form_health_note_placeholder: 'e.g. Good latch, cord clean, jaundice check normal',

  form_followup_type: 'Next Follow-up Visit Type *',
  form_followup_type_placeholder: 'e.g. Day 7 Postnatal Home Visit - ASHA',
  form_followup_date: 'Next Follow-up Date *',

  form_vaccine_name: 'Next Vaccine Name *',
  form_vaccine_name_placeholder: 'e.g. OPV-1 + Pentavalent-1 + Rotavirus-1',
  form_vaccine_date: 'Vaccination Due Date *',

  form_cancel_button: 'Cancel',
  form_submit_button: 'Register & Launch Dashboard',
  form_success_message: 'Mother and newborn successfully registered into MaatruSetu!',
  form_validation_error: 'Please fill in all required fields marked with *.',

  // Empty State
  empty_state_title: 'No Registered Pairs Yet',
  empty_state_desc: 'Register a mother and newborn to initialize the 42-day postnatal care timeline.'
};

export type MaatruSetuTranslationKey = keyof typeof maatrusetuTranslationsEn;

/**
 * Access translation with placeholder interpolation e.g. {current}, {total}
 */
export function t(key: MaatruSetuTranslationKey, params?: Record<string, string | number>): string {
  let str: string = maatrusetuTranslationsEn[key] || (key as string);
  if (params) {
    Object.entries(params).forEach(([placeholder, value]) => {
      str = str.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(value));
    });
  }
  return str;
}
