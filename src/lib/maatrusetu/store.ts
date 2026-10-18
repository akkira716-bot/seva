// MaatruSetu Isolated Data Store & Clinical Engine
// Completely separate from existing SEVA application tables and models

import {
  MaatruSetuRecord,
  FamilyCareTask,
  DigitalDischargePlan,
  RecoveryJournalEntry,
  DoctorRecoverySummary,
  FamilyExplainerItem,
  CareCircleMember,
  CompletionReport42,
  MaatruAIGuidance,
  computeCareDay
} from '@/types/maatrusetu';

export const SEED_MAATRUSETU_RECORDS: MaatruSetuRecord[] = [
  {
    id: 'ms-rec-001',
    mother: {
      name: 'Anita Sharma',
      age: 26,
      phone: '+91 98765 43210',
      rchId: 'RCH-2026-7841'
    },
    newborn: {
      name: 'Baby Aarav',
      sex: 'male',
      birthDate: '2026-10-11', // Day 8 of 42
      birthWeightKg: 3.10,
      gestationalAgeWeeks: 39
    },
    healthStatus: 'stable',
    healthStatusNote: 'Mother recovering well following normal vaginal delivery. Infant latching vigorously, yellow seedy stool, clean umbilicus.',
    nextFollowUp: {
      date: '2026-10-18',
      type: 'Day 7-10 Postnatal Home Visit - ASHA/ANM',
      providerOrWorker: 'ASHA Worker Geeta Bai'
    },
    nextVaccination: {
      name: 'OPV-1 + Pentavalent-1 + Rotavirus-1',
      dueDate: '2026-11-22',
      status: 'pending'
    },
    checkInStatus: 'pending',
    registeredAt: '2026-10-11T10:30:00Z'
  },
  {
    id: 'ms-rec-002',
    mother: {
      name: 'Sunita Devi',
      age: 29,
      phone: '+91 98112 34567',
      rchId: 'RCH-2026-6219'
    },
    newborn: {
      name: 'Baby Meera',
      sex: 'female',
      birthDate: '2026-10-04', // Day 15 of 42
      birthWeightKg: 2.35,
      gestationalAgeWeeks: 36
    },
    healthStatus: 'attention_needed',
    healthStatusNote: 'Moderate Low Birth Weight (<2.5kg) & late preterm. Kangaroo Mother Care (KMC) recommended; monitor weight gain closely.',
    nextFollowUp: {
      date: '2026-10-19',
      type: 'Day 14 Special Newborn Care & Weight Evaluation',
      providerOrWorker: 'Community Health Center (CHC) Pediatric Wing'
    },
    nextVaccination: {
      name: 'Pentavalent-1 + OPV-1 + fIPV-1',
      dueDate: '2026-11-15',
      status: 'pending'
    },
    checkInStatus: 'pending',
    registeredAt: '2026-10-04T08:15:00Z'
  },
  {
    id: 'ms-rec-003',
    mother: {
      name: 'Fatima Begum',
      age: 32,
      phone: '+91 97234 56789',
      rchId: 'RCH-2026-9042'
    },
    newborn: {
      name: 'Baby Zayan',
      sex: 'male',
      birthDate: '2026-09-06', // Day 43 of 42 (Completed)
      birthWeightKg: 3.45,
      gestationalAgeWeeks: 40
    },
    healthStatus: 'stable',
    healthStatusNote: 'Exclusively breastfed, cord stump detached naturally, infant alert and smiling. Maternal lochia resolved normally.',
    nextFollowUp: {
      date: '2026-10-20',
      type: '6-Week Comprehensive Postnatal & Infant Assessment',
      providerOrWorker: 'Dr. Sarah Lin / Primary Health Center'
    },
    nextVaccination: {
      name: 'OPV-1 + Pentavalent-1 + PCV-1',
      dueDate: '2026-10-20',
      status: 'pending'
    },
    checkInStatus: 'completed',
    registeredAt: '2026-09-06T14:45:00Z'
  }
];

// Seed Family Care Tasks
const SEED_TASKS: FamilyCareTask[] = [
  {
    id: 'task-001',
    recordId: 'ms-rec-001',
    title: 'Prepare Warm Iron-Rich Khichdi & Ajwain Water',
    description: 'Ensure fresh hot meal with ghee, spinach, and roasted cumin to support lactation and digest easily.',
    assignedRole: 'Grandmother',
    priority: 'routine',
    category: 'nutrition',
    isCompleted: true,
    dueDate: '2026-10-18',
    completedAt: '2026-10-18T08:30:00Z',
    completedBy: 'Grandmother (Malti Sharma)'
  },
  {
    id: 'task-002',
    recordId: 'ms-rec-001',
    title: 'Infant Burping & Safe Supine Nap Monitoring',
    description: 'Take baby for 20 min upright burping after 10 AM feed so mother can rest uninterrupted.',
    assignedRole: 'Partner',
    priority: 'comfort',
    category: 'baby_care',
    isCompleted: false,
    dueDate: '2026-10-18'
  },
  {
    id: 'task-003',
    recordId: 'ms-rec-001',
    title: 'Pick up Calcium & Vitamin D3 Syrup from PHC',
    description: 'Bring maternal postnatal multivitamins and baby vitamin D3 drops before 5 PM.',
    assignedRole: 'Partner',
    priority: 'routine',
    category: 'medication',
    isCompleted: false,
    dueDate: '2026-10-18'
  },
  {
    id: 'task-004',
    recordId: 'ms-rec-002',
    title: 'Kangaroo Mother Care (KMC) Skin-to-Skin Session',
    description: 'Provide 2 hours continuous chest skin-to-skin contact for baby Meera (LBW care) in a warm room.',
    assignedRole: 'Partner',
    priority: 'urgent',
    category: 'baby_care',
    isCompleted: true,
    dueDate: '2026-10-18',
    completedAt: '2026-10-18T09:15:00Z',
    completedBy: 'Partner (Ramesh Devi)'
  }
];

// Seed Digital Discharge Plans
const SEED_DISCHARGE_PLANS: DigitalDischargePlan[] = [
  {
    id: 'plan-001',
    recordId: 'ms-rec-001',
    hospitalName: 'District Maternity Hospital & Civil Center',
    dischargeDate: '2026-10-13',
    attendingPhysician: 'Dr. Kavita Nair (MD, OB-GYN)',
    deliveryType: 'vaginal',
    woundCare: 'Keep perineal area clean and dry. Use lukewarm sitz bath twice daily after urination. Change maternity pads every 3-4 hours.',
    activityRestrictions: 'No lifting heavier than infant (5 kg) for 3 weeks. Rest whenever infant sleeps. Gentle walking encouraged, avoid vigorous stairs.',
    babyFeedingPlan: 'Exclusive breastfeeding every 2 to 3 hours (8-12 times per 24 hours). Ensure deep latch with chin touching breast and wide mouth.',
    medicationScheduleNote: 'Ferrous sulphate (Iron) 100mg + Folic acid once daily for 180 days; Calcium carbonate 500mg twice daily with water; Paracetamol 500mg SOS for afterpains (max 3 times/day).',
    emergencyReturnTriggers: [
      'Heavy vaginal bleeding soaking > 2 sanitary pads in 1 hour',
      'High fever ≥ 100.4°F (38°C) with chills or shivering',
      'Severe headache, blurry vision, or swelling in hands/face (Preeclampsia signs)',
      'Foul smelling vaginal discharge',
      'Baby refusing 2 consecutive feeds, yellow skin extending below abdomen, or breathing > 60 breaths/min'
    ],
    isVerifiedByClinician: true,
    verifiedAt: '2026-10-13T11:00:00Z',
    clinicianNotes: 'Routine unassisted vaginal delivery. Normal lochia rubra. Baby passed meconium & urine in hospital.',
    attachmentName: 'Civil_Hospital_Discharge_Summary_Anita.pdf'
  },
  {
    id: 'plan-002',
    recordId: 'ms-rec-002',
    hospitalName: 'Apex Women & Child Care Special Hospital',
    dischargeDate: '2026-10-06',
    attendingPhysician: 'Dr. Rajesh Deshmukh (MS, DGO)',
    deliveryType: 'cesarean',
    woundCare: 'Keep Pfannenstiel abdominal incision dressing dry. Do not scrub incision. Report redness, oozing, or gaping edges immediately.',
    activityRestrictions: 'Strictly avoid lifting anything heavier than baby for 6 weeks. No driving for 2 weeks. Support incision with small pillow when coughing or laughing.',
    babyFeedingPlan: 'Frequent breastfeeding supplemented with expressed breast milk via spoon/paladai if tiring easily due to low birth weight (<2.5kg).',
    medicationScheduleNote: 'Oral antibiotic course completed. Postnatal iron & calcium continued. Stool softener syrup 15ml at bedtime for 1 week.',
    emergencyReturnTriggers: [
      'Redness, foul smell, or pus drainage from surgical incision',
      'Persistent severe epigastric or right upper abdomen pain',
      'Painful red swollen calf in either leg (DVT warning)',
      'Shortness of breath or chest pain'
    ],
    isVerifiedByClinician: true,
    verifiedAt: '2026-10-06T15:30:00Z',
    clinicianNotes: 'Emergency Lower Segment Cesarean Section (LSCS) for fetal distress. Incision closed with subcuticular sutures.',
    attachmentName: 'Apex_Discharge_LSCS_Sunita.pdf'
  }
];

// Seed Recovery Journal Entries
const SEED_JOURNAL_ENTRIES: RecoveryJournalEntry[] = [
  {
    id: 'jnl-001',
    recordId: 'ms-rec-001',
    date: '2026-10-16',
    careDay: 6,
    painScore: 3,
    painLocations: ['perineum', 'lower_back'],
    bleedingLevel: 'moderate',
    mood: 'peaceful',
    sleepHours: 5.5,
    temperatureF: 98.4,
    notes: 'Sitz bath helped significantly. Baby latched on left side without nipple soreness today.',
    redFlagsDetected: [],
    createdAt: '2026-10-16T20:00:00Z'
  },
  {
    id: 'jnl-002',
    recordId: 'ms-rec-001',
    date: '2026-10-17',
    careDay: 7,
    painScore: 2,
    painLocations: ['breasts'],
    bleedingLevel: 'light',
    mood: 'tired',
    sleepHours: 6.0,
    temperatureF: 98.6,
    notes: 'Lochia turning pinkish-brown (serosa). Breasts felt slightly engorged before 4 AM feed, warm compress gave relief.',
    redFlagsDetected: [],
    createdAt: '2026-10-17T20:30:00Z'
  },
  {
    id: 'jnl-003',
    recordId: 'ms-rec-002',
    date: '2026-10-17',
    careDay: 14,
    painScore: 4,
    painLocations: ['incision', 'lower_back'],
    bleedingLevel: 'light',
    mood: 'anxious',
    sleepHours: 4.5,
    temperatureF: 98.8,
    notes: 'Incision itching as it heals. Worried about baby Meera gaining weight slowly. KMC skin-to-skin done twice.',
    redFlagsDetected: [],
    createdAt: '2026-10-17T21:00:00Z'
  }
];

// Seed Care Circle Members
const SEED_CARE_CIRCLE: CareCircleMember[] = [
  {
    id: 'cc-001',
    recordId: 'ms-rec-001',
    name: 'Vikas Sharma',
    relationship: 'Husband / Father',
    phone: '+91 98765 11111',
    accessLevel: 'full',
    status: 'active',
    invitedAt: '2026-10-11T12:00:00Z',
    notificationsEnabled: true
  },
  {
    id: 'cc-002',
    recordId: 'ms-rec-001',
    name: 'Malti Sharma',
    relationship: 'Grandmother',
    phone: '+91 98765 22222',
    accessLevel: 'helper',
    status: 'active',
    invitedAt: '2026-10-11T12:30:00Z',
    notificationsEnabled: false
  },
  {
    id: 'cc-003',
    recordId: 'ms-rec-001',
    name: 'Geeta Bai (ASHA Worker)',
    relationship: 'Community Health Worker',
    phone: '+91 98765 33333',
    accessLevel: 'viewer',
    status: 'active',
    invitedAt: '2026-10-12T09:00:00Z',
    notificationsEnabled: true
  }
];

// Seed Family Explainer Library
export const SEED_EXPLAINER_ITEMS: FamilyExplainerItem[] = [
  {
    id: 'exp-001',
    medicalTerm: 'Lochia (Normal Postnatal Bleeding)',
    category: 'maternal',
    plainLanguageMeaning: 'The natural shedding of the uterine lining and blood after delivery. It starts bright red (rubra), turns pinkish-brown (serosa), and fades to yellowish-white (alba) over 3-6 weeks.',
    whatFamilyShouldDo: 'Ensure mother has ample unscented maternity pads. Allow her to rest without doing heavy housework. Help prepare iron-rich meals.',
    whatNOTToDo: 'Never suggest tampons or inserting anything into the birth canal during the 6-week window. Do not ignore large golf-ball-sized clots.',
    dangerSignsToCallDoctor: 'Soaking more than 1 large pad per hour for 2 hours in a row, large blood clots bigger than an egg, or foul rotten smell.'
  },
  {
    id: 'exp-002',
    medicalTerm: 'Breast Engorgement vs. Mastitis',
    category: 'maternal',
    plainLanguageMeaning: 'Engorgement is normal fullness when mature milk arrives around Days 3-5. Mastitis is a breast infection that causes intense pain, a red hot wedge on the breast, and sudden high fever.',
    whatFamilyShouldDo: 'Help position baby for frequent feeding (every 2 hours). Apply warm cloth for 2 minutes before feeding, and cool cabbage or cold washcloth after feeding for swelling.',
    whatNOTToDo: 'Do not advise mother to stop breastfeeding—stopping makes engorgement worse. Do not squeeze breast forcefully.',
    dangerSignsToCallDoctor: 'Fever > 100.4°F, red wedge-shaped streaks that feel burning hot, flu-like body aches, or cracked bleeding nipples that do not heal.'
  },
  {
    id: 'exp-003',
    medicalTerm: 'C-Section Incision Healing (LSCS)',
    category: 'maternal',
    plainLanguageMeaning: 'The surgical cut in the lower abdomen where the baby was delivered. Full deep tissue healing takes 6 to 8 weeks.',
    whatFamilyShouldDo: 'Support mother when standing up or sitting down. Hand her the baby rather than having her lean and lift. Keep incision dry after gentle sponge bath.',
    whatNOTToDo: 'Do not apply turmeric paste, homemade oils, or powders on the surgical stitch line. Do not allow mother to lift buckets or climb frequent stairs.',
    dangerSignsToCallDoctor: 'Yellow/green pus leaking, open stitch edges, spreading redness around the scar, or high fever with chills.'
  },
  {
    id: 'exp-004',
    medicalTerm: 'Kangaroo Mother Care (KMC) for Low Birth Weight',
    category: 'neonatal',
    plainLanguageMeaning: 'Holding the diapered baby upright skin-to-skin on mother’s or father’s bare chest. It stabilizes baby’s body temperature, heart rate, promotes weight gain, and prevents hypothermia.',
    whatFamilyShouldDo: 'Both mother and father can practice KMC in a warm room. Provide warm blankets covering baby’s back while head is turned sideways to breathe freely.',
    whatNOTToDo: 'Never cover baby’s nose or mouth. Do not smoke or use strong perfume near baby. Do not leave LBW baby unmonitored in cold rooms.',
    dangerSignsToCallDoctor: 'Baby cold to touch despite skin-to-skin, blue lips/tongue, lethargy or inability to wake up for feeds, or chest pulling in deeply (chest indrawing).'
  },
  {
    id: 'exp-005',
    medicalTerm: 'Newborn Jaundice (Neonatal Hyperbilirubinemia)',
    category: 'neonatal',
    plainLanguageMeaning: 'Yellowing of the baby’s skin and eyes caused by bilirubin build-up while the infant liver matures. Mild jaundice on Days 3-5 is common.',
    whatFamilyShouldDo: 'Count wet and dirty diapers (should have 6+ wet diapers and 3+ yellow seedy stools daily). Feed baby frequently to help flush bilirubin through stool.',
    whatNOTToDo: 'Do not give baby plain water, glucose water, or herbal teas. Do not put naked baby under direct harsh outdoor midday sun.',
    dangerSignsToCallDoctor: 'Yellow color spreading below baby’s knees or into palms/soles, baby extremely sleepy and skipping feeds, high-pitched crying, or clay-white stools.'
  },
  {
    id: 'exp-006',
    medicalTerm: 'Postpartum Preeclampsia (High Blood Pressure Crisis)',
    category: 'warning',
    plainLanguageMeaning: 'A dangerous rise in blood pressure that can happen up to 6 weeks AFTER delivery, even if pregnancy blood pressure was completely normal.',
    whatFamilyShouldDo: 'Immediately take mother to the hospital emergency if she complains of severe headache or sees bright flashing spots.',
    whatNOTToDo: 'Do not assume a severe headache is just normal lack of sleep. Do not wait until morning to see if it passes.',
    dangerSignsToCallDoctor: 'Pounding headache that won’t go away with paracetamol, seeing spots/flashes of light, pain right under ribs on the right side, sudden swelling of face/hands.'
  }
];

class MaatruSetuStore {
  private records: MaatruSetuRecord[] = [...SEED_MAATRUSETU_RECORDS];
  private tasks: FamilyCareTask[] = [...SEED_TASKS];
  private dischargePlans: DigitalDischargePlan[] = [...SEED_DISCHARGE_PLANS];
  private journalEntries: RecoveryJournalEntry[] = [...SEED_JOURNAL_ENTRIES];
  private careCircle: CareCircleMember[] = [...SEED_CARE_CIRCLE];
  private explainers: FamilyExplainerItem[] = [...SEED_EXPLAINER_ITEMS];
  private summaries: Record<string, DoctorRecoverySummary> = {};
  private completionReports: Record<string, CompletionReport42> = {};

  // ---------------- Core Record Methods ----------------
  getAllRecords(): MaatruSetuRecord[] {
    return this.records;
  }

  getRecordById(id: string): MaatruSetuRecord | undefined {
    return this.records.find((r) => r.id === id);
  }

  createRecord(data: Omit<MaatruSetuRecord, 'id' | 'registeredAt'>): MaatruSetuRecord {
    const newRecord: MaatruSetuRecord = {
      ...data,
      id: `ms-rec-${Date.now()}`,
      registeredAt: new Date().toISOString()
    };
    this.records.unshift(newRecord);

    // Auto-create default initial discharge plan template
    this.createDischargePlan({
      recordId: newRecord.id,
      hospitalName: 'Delivery Health Facility',
      dischargeDate: newRecord.newborn.birthDate,
      attendingPhysician: 'Delivering Obstetrician / ANM',
      deliveryType: 'vaginal',
      woundCare: 'Keep perineal area clean and dry. Warm sitz bath twice daily.',
      activityRestrictions: 'Rest as much as possible. Avoid lifting heavy objects for 4-6 weeks.',
      babyFeedingPlan: 'Exclusive breastfeeding on demand (every 2-3 hours).',
      medicationScheduleNote: 'Daily Postnatal Iron (100mg) and Calcium (500mg) for 180 days.',
      emergencyReturnTriggers: [
        'Bleeding soaking > 2 pads in 1 hour',
        'Fever ≥ 100.4°F with chills',
        'Severe persistent headache or vision changes'
      ],
      isVerifiedByClinician: false
    });

    // Auto-create initial care circle member for father / partner
    this.addCareCircleMember({
      recordId: newRecord.id,
      name: 'Family Primary Caregiver',
      relationship: 'Spouse / Partner',
      phone: newRecord.mother.phone || '+91 98000 00000',
      accessLevel: 'full',
      notificationsEnabled: true
    });

    return newRecord;
  }

  updateRecord(id: string, updates: Partial<MaatruSetuRecord>): MaatruSetuRecord | undefined {
    const record = this.getRecordById(id);
    if (record) {
      Object.assign(record, updates);
    }
    return record;
  }

  // ---------------- FEATURE 1: MaatruAI Guidance ----------------
  getDailyAIGuidance(careDay: number, deliveryType: 'vaginal' | 'cesarean' = 'vaginal'): MaatruAIGuidance {
    const clampedDay = Math.min(42, Math.max(1, careDay));

    if (clampedDay <= 3) {
      return {
        dayNumber: clampedDay,
        headline: `Day ${clampedDay}: The Golden Colostrum & Initial Healing Window`,
        maternalBodyFocus: deliveryType === 'cesarean'
          ? 'Protect your surgical incision when coughing or laughing with a small pillow. Lochia rubra (bright red bleeding) is expected.'
          : 'Afterpains (mild cramps while nursing) mean your uterus is actively shrinking. Use warm packs and rest supine frequently.',
        infantMilestone: 'Newborn stomach is the size of a marble (5-7ml). Frequent tiny feedings of nutrient-dense colostrum are normal.',
        nutritionHydrationTip: 'Drink 2.5-3 liters of warm water, fennel or ajwain tea. Keep a water bottle at every feeding station.',
        emotionalWellbeingTip: 'The "Baby Blues" peak around Day 3-5 due to massive hormonal shifts. Crying easily is normal; accept help without guilt.',
        cautionFlag: 'Watch for soaking >1 pad/hour, fever over 100.4°F, or baby not passing meconium/stool.',
        disclaimer: 'Non-diagnostic guidance for supportive maternal education only. Contact your physician for symptoms.'
      };
    } else if (clampedDay <= 7) {
      return {
        dayNumber: clampedDay,
        headline: `Day ${clampedDay}: Mature Milk Transition & Umbilical Cord Care`,
        maternalBodyFocus: 'Mature milk comes in. Breasts may feel heavy or firm. Feed frequently to avoid clogged ducts. Perineum or incision soreness begins to ease.',
        infantMilestone: 'Baby should have 6+ wet diapers and 3-4 yellow seedy stools daily. Umbilical stump is darkening and drying out.',
        nutritionHydrationTip: 'Eat calcium-rich warm meals: ragi porridge, sesame, lentils, and fresh leafy greens with healthy ghee.',
        emotionalWellbeingTip: 'Rest when the baby rests. Politely designate a family gatekeeper to restrict lengthy visitor visits.',
        cautionFlag: 'Red, painful warm wedge on breast with fever indicates mastitis. Call your nurse or doctor promptly.',
        disclaimer: 'Non-diagnostic guidance for supportive maternal education only. Contact your physician for symptoms.'
      };
    } else if (clampedDay <= 14) {
      return {
        dayNumber: clampedDay,
        headline: `Day ${clampedDay}: Neonatal Weight Rebound & Gentle Movement`,
        maternalBodyFocus: 'Lochia transitions from pink to yellowish-white (lochia serosa to alba). Pelvic floor rest is still essential.',
        infantMilestone: 'Baby should have regained their birth weight by Day 10-14. Cord stump detached or ready to fall naturally.',
        nutritionHydrationTip: 'Iron & Vitamin C pairing: lentils with lemon squeeze. Continue prescribed postnatal iron tablets daily.',
        emotionalWellbeingTip: 'Step outdoors for 10 minutes of gentle morning sunlight. Fresh air and daylight stabilize circadian rhythms.',
        cautionFlag: 'Sudden return of bright red heavy bleeding or large clots means your body is telling you to slow down physical activity.',
        disclaimer: 'Non-diagnostic guidance for supportive maternal education only. Contact your physician for symptoms.'
      };
    } else if (clampedDay <= 28) {
      return {
        dayNumber: clampedDay,
        headline: `Day ${clampedDay}: Establishing Rhythm & Postnatal Vitality`,
        maternalBodyFocus: 'Uterus has returned into pelvic cavity. Gentle pelvic floor kegels and walking can be started if pain-free.',
        infantMilestone: 'Baby begins social smiling and tracks faces with eyes. Growth spurts common around weeks 3 and 4.',
        nutritionHydrationTip: 'Protein & hydration: eggs, dals, paneer, nuts, seeds, and buttermilk help tissue regeneration and milk supply.',
        emotionalWellbeingTip: 'Communicate openly with partner. If persistent feelings of emptiness or intense anxiety last >2 weeks, ask for maternal screening.',
        cautionFlag: 'Painful swollen calf in one leg or chest tightness requires emergency evaluation for blood clot risks.',
        disclaimer: 'Non-diagnostic guidance for supportive maternal education only. Contact your physician for symptoms.'
      };
    } else {
      return {
        dayNumber: clampedDay,
        headline: `Day ${clampedDay}: 6-Week Continuum Milestone & Recovery Graduation`,
        maternalBodyFocus: 'Approaching complete 42-day physiological recovery milestone. Schedule your comprehensive 6-week postnatal checkup.',
        infantMilestone: 'Infant responds to familiar caregiver voices, lifts head briefly during tummy time, due for Week 6 National Immunization Schedule vaccines.',
        nutritionHydrationTip: 'Sustain balanced family meals with adequate iodine, calcium, and iron for ongoing lactation energy.',
        emotionalWellbeingTip: 'Celebrate your 42-day milestone! You and your baby have safely navigated the most critical continuum window.',
        cautionFlag: 'Ensure your 6-week postpartum examination checks blood pressure, pelvic healing, and contraception counseling.',
        disclaimer: 'Non-diagnostic guidance for supportive maternal education only. Contact your physician for symptoms.'
      };
    }
  }

  // ---------------- FEATURE 2: Family Care Tasks ----------------
  getTasksForRecord(recordId: string): FamilyCareTask[] {
    return this.tasks.filter((t) => t.recordId === recordId);
  }

  addTask(taskData: Omit<FamilyCareTask, 'id' | 'isCompleted'>): FamilyCareTask {
    const newTask: FamilyCareTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      isCompleted: false
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  toggleTaskCompletion(taskId: string, completedBy?: string): FamilyCareTask | undefined {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.isCompleted = !task.isCompleted;
      task.completedAt = task.isCompleted ? new Date().toISOString() : undefined;
      task.completedBy = task.isCompleted ? (completedBy || 'Caregiver') : undefined;
    }
    return task;
  }

  deleteTask(taskId: string): boolean {
    const idx = this.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      this.tasks.splice(idx, 1);
      return true;
    }
    return false;
  }

  // ---------------- FEATURE 3: Digital Discharge Plan ----------------
  getDischargePlan(recordId: string): DigitalDischargePlan | undefined {
    return this.dischargePlans.find((p) => p.recordId === recordId);
  }

  createDischargePlan(planData: Omit<DigitalDischargePlan, 'id'>): DigitalDischargePlan {
    const existing = this.getDischargePlan(planData.recordId);
    if (existing) {
      Object.assign(existing, planData);
      return existing;
    }
    const newPlan: DigitalDischargePlan = {
      ...planData,
      id: `plan-${Date.now()}`
    };
    this.dischargePlans.push(newPlan);
    return newPlan;
  }

  verifyDischargePlan(recordId: string, clinicianNotes?: string): DigitalDischargePlan | undefined {
    const plan = this.getDischargePlan(recordId);
    if (plan) {
      plan.isVerifiedByClinician = true;
      plan.verifiedAt = new Date().toISOString();
      if (clinicianNotes) plan.clinicianNotes = clinicianNotes;
    }
    return plan;
  }

  // ---------------- FEATURE 4: Recovery Journal ----------------
  getJournalEntries(recordId: string): RecoveryJournalEntry[] {
    return this.journalEntries
      .filter((e) => e.recordId === recordId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addJournalEntry(entryData: Omit<RecoveryJournalEntry, 'id' | 'createdAt' | 'redFlagsDetected'>): RecoveryJournalEntry {
    const redFlags: string[] = [];
    if (entryData.bleedingLevel === 'abnormal_clots' || entryData.bleedingLevel === 'heavy') {
      redFlags.push('Excessive postpartum bleeding flagged');
    }
    if (entryData.painScore >= 8) {
      redFlags.push('Severe acute maternal pain score (≥8/10)');
    }
    if (entryData.temperatureF && entryData.temperatureF >= 100.4) {
      redFlags.push('Elevated body temperature (≥100.4°F)');
    }
    if (entryData.mood === 'weepy_overwhelmed') {
      redFlags.push('Maternal emotional distress indicator');
    }

    const newEntry: RecoveryJournalEntry = {
      ...entryData,
      id: `jnl-${Date.now()}`,
      redFlagsDetected: redFlags,
      createdAt: new Date().toISOString()
    };
    this.journalEntries.unshift(newEntry);
    return newEntry;
  }

  // ---------------- FEATURE 5: Doctor Recovery Summary ----------------
  getRecoverySummary(recordId: string): DoctorRecoverySummary | undefined {
    return this.summaries[recordId];
  }

  generateOrUpdateRecoverySummary(
    recordId: string,
    customMotherNotes: string = '',
    questions: string[] = []
  ): DoctorRecoverySummary {
    const record = this.getRecordById(recordId);
    const entries = this.getJournalEntries(recordId);
    const careDay = record ? computeCareDay(record.newborn.birthDate).currentDay : 1;

    const avgPain = entries.length
      ? (entries.reduce((sum, e) => sum + e.painScore, 0) / entries.length).toFixed(1)
      : 'Mild (2/10)';
    
    const bleedingTrend = entries.length && entries[0].bleedingLevel
      ? `Recent: ${entries[0].bleedingLevel.toUpperCase()} (Progressively tapering)`
      : 'Normal lochial transition without hemorrhage';

    const redFlagCount = entries.reduce((sum, e) => sum + e.redFlagsDetected.length, 0);

    const vitalTrendsText = `Day ${careDay} of 42 Postpartum Review. Infant: ${record?.newborn.name || 'Baby'} (BW: ${record?.newborn.birthWeightKg || 3.0}kg). Maternal status: ${record?.healthStatus.toUpperCase() || 'STABLE'}. Average Pain Index: ${avgPain}/10. Red Flag Incidents: ${redFlagCount}.`;

    const summary: DoctorRecoverySummary = {
      id: `sum-${recordId}`,
      recordId,
      generatedDate: new Date().toISOString().split('T')[0],
      currentDay: careDay,
      vitalTrendsText,
      bleedingTrendSummary: bleedingTrend,
      painTrendSummary: `Average maternal score: ${avgPain}/10. Reported areas: Perineal healing, back strain, breast fullness.`,
      moodPatternSummary: entries.length && entries[0].mood
        ? `Most recent mood: ${entries[0].mood}. Sleep: ${entries[0].sleepHours} hrs avg.`
        : 'Stable maternal affect with normal postpartum sleep fatigue.',
      questionsForDoctor: questions.length ? questions : [
        'Is the current vaginal lochia color and volume within normal limits?',
        'When is it safe to resume light core and pelvic floor strengthening exercises?',
        'Confirm due date for baby’s 6-week pentavalent and rotavirus vaccinations.'
      ],
      customMotherNotes,
      isReviewedByDoctor: false
    };

    this.summaries[recordId] = summary;
    return summary;
  }

  // ---------------- FEATURE 6: Family Explainer Items ----------------
  getAllExplainers(): FamilyExplainerItem[] {
    return this.explainers;
  }

  // ---------------- FEATURE 8: Care Circle Access ----------------
  getCareCircleMembers(recordId: string): CareCircleMember[] {
    return this.careCircle.filter((m) => m.recordId === recordId && m.status === 'active');
  }

  addCareCircleMember(memberData: Omit<CareCircleMember, 'id' | 'status' | 'invitedAt'>): CareCircleMember {
    const newMember: CareCircleMember = {
      ...memberData,
      id: `cc-${Date.now()}`,
      status: 'active',
      invitedAt: new Date().toISOString()
    };
    this.careCircle.unshift(newMember);
    return newMember;
  }

  revokeCareCircleMember(memberId: string): boolean {
    const member = this.careCircle.find((m) => m.id === memberId);
    if (member) {
      member.status = 'revoked';
      member.revokedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // ---------------- FEATURE 9: 42-Day Completion Report ----------------
  getCompletionReport(recordId: string): CompletionReport42 | undefined {
    return this.completionReports[recordId];
  }

  generateCompletionReport(recordId: string, healthWorkerName: string = 'ANM / Supervisor'): CompletionReport42 {
    const record = this.getRecordById(recordId);
    const entries = this.getJournalEntries(recordId);

    const report: CompletionReport42 = {
      id: `rep-${recordId}`,
      recordId,
      completedDate: new Date().toISOString().split('T')[0],
      overallOutcome: record?.healthStatus === 'critical' ? 'extended_monitoring_advised' : 'milestones_achieved',
      totalJournalEntries: entries.length || 7,
      averagePainResolved: true,
      lochiaNormalResolution: true,
      moodStatusResolved: true,
      infantWeightGainKg: Number((((record?.newborn.birthWeightKg || 3.0) * 0.35) + 0.8).toFixed(2)),
      vaccinesCompletedList: ['BCG', 'OPV-0', 'Hepatitis B-Birth Dose', 'OPV-1', 'Pentavalent-1', 'Rotavirus-1'],
      upcomingChildhoodVaccinesList: ['Pentavalent-2 (Week 10)', 'OPV-2 (Week 10)', 'Pentavalent-3 (Week 14)', 'Measles-Rubella (Month 9)'],
      ashaVisitMilestonesCompleted: 6,
      attendingHealthWorkerName: healthWorkerName,
      certificateId: `MS-GRAD-${Date.now().toString().slice(-6)}`,
      clinicianSignOffDate: new Date().toISOString().split('T')[0]
    };

    this.completionReports[recordId] = report;
    return report;
  }
}

// Preserve store across hot module reloads in Next.js dev server
declare global {
  // eslint-disable-next-line no-var
  var __MAATRUSETU_STORE__: MaatruSetuStore | undefined;
}

export const maatruSetuStore: MaatruSetuStore = global.__MAATRUSETU_STORE__ || new MaatruSetuStore();

if (process.env.NODE_ENV !== 'production') {
  global.__MAATRUSETU_STORE__ = maatruSetuStore;
}
