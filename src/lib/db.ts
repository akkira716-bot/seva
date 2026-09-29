import { Article, Provider, Appointment, CareLogEntry, AuditLog, EmergencyHelpInfo, User } from '@/types';
import fs from 'fs';
import path from 'path';

// Seed Articles: Clinically reviewed guidance
const SEED_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'first-trimester-essentials-nutrition-and-warning-signs',
    title: 'First Trimester Care: Nutrition, Early Milestones & Urgent Warning Signs',
    summary: 'Essential dietary guidance, prenatal vitamin recommendations, common bodily changes, and symptoms that require immediate clinical evaluation.',
    body: `The first trimester (weeks 1–12) is a period of rapid organogenesis and significant hormonal change.

### Nutrition & Supplementation
- **Folic Acid**: Daily intake of 400–600 mcg is vital to prevent neural tube defects.
- **Hydration**: Aim for 2.5–3 liters of water daily to support expanding maternal blood volume.
- **Iron & Protein**: Prioritize legumes, lean proteins, and leafy greens to prevent maternal anemia.

### Common Symptoms vs. Red Flags
Nausea, breast tenderness, and mild fatigue are typical. However, any persistent unilateral pelvic pain, severe hyperemesis preventing fluid retention for 24+ hours, or vaginal bleeding requires urgent evaluation to rule out ectopic pregnancy or threatened miscarriage.`,
    stage: 'pregnancy',
    author: 'Elena Gomez, CNM',
    clinicalReviewer: 'Dr. Sarah Lin, MD, FACOG',
    clinicalReviewerTitle: 'Chief of Maternal-Fetal Medicine',
    reviewDate: '2026-08-15',
    publicationStatus: 'published',
    region: 'North America / Global',
    language: 'en',
    topics: ['Nutrition', 'First Trimester', 'Warning Signs', 'Vitamins'],
    readingTimeMinutes: 5,
    urgentFlags: ['Severe cramping', 'Heavy bleeding', 'Inability to keep liquids down for 24h'],
    version: 1
  },
  {
    id: 'art-2',
    slug: 'postpartum-preeclampsia-and-fourth-trimester-recovery',
    title: 'The Fourth Trimester: Physical Healing and Recognizing Postpartum Preeclampsia',
    summary: 'Understanding physiological healing after vaginal or cesarean birth, mood transitions, and critical symptoms of delayed postpartum preeclampsia.',
    body: `The 12 weeks following childbirth are often called the Fourth Trimester. Maternal physiology undergoes major hormonal, cardiovascular, and musculoskeletal adjustments.

### Postpartum Preeclampsia Awareness
Preeclampsia can develop up to 6 weeks postpartum, even if blood pressure was normal during pregnancy.
Urgent warning signs include:
- Severe, persistent headache unresponsive to medication
- Visual changes (blurriness, light spots, flashing lights)
- Pain in the upper right quadrant below the ribs
- Sudden swelling of hands, face, or ankles
- Shortness of breath

### Pelvic Floor & Cesarean Incision Recovery
Monitor incision sites for erythema, warmth, or purulent discharge. Restrict heavy lifting (>10 lbs) and follow up with a pelvic floor physical therapist if experiencing pelvic pain or incontinence.`,
    stage: 'postpartum',
    author: 'Priya Nair, DPT, PRPC',
    clinicalReviewer: 'Dr. Marcus Vance, MD',
    clinicalReviewerTitle: 'Obstetrician & Maternal Health Specialist',
    reviewDate: '2026-07-28',
    publicationStatus: 'published',
    region: 'Global',
    language: 'en',
    topics: ['Postpartum Recovery', 'Preeclampsia', 'Wound Healing', 'Warning Signs'],
    readingTimeMinutes: 6,
    urgentFlags: ['Severe headache with vision changes', 'Chest pain or difficulty breathing', 'Fever above 100.4°F'],
    version: 2
  },
  {
    id: 'art-3',
    slug: 'safe-infant-sleep-and-early-breastfeeding-latch',
    title: 'Newborn Safe Sleep Guidelines (AAP 2026) and Establishing a Comfortable Latch',
    summary: 'Evidence-based infant sleep practices to reduce SIDS risk, plus step-by-step guidance for comfortable breastfeeding and cluster feeding.',
    body: `### The ABCs of Safe Sleep
Every sleep must follow the guidelines established by the American Academy of Pediatrics:
1. **A - Alone**: No pillows, loose blankets, stuffed toys, or crib bumpers.
2. **B - On their Back**: Always place baby on their back for naps and nighttime sleep.
3. **C - In a Crib or Bassinet**: A firm, flat mattress with a fitted sheet in the caregiver's room for at least 6 months.

### Establishing an Asymmetric Latch
Nipple pain is a sign to re-evaluate the latch. Aim for an asymmetric latch where the baby takes more of the lower areola. Baby's chin should indent the breast while the nose remains clear.

### Diaper Output Benchmarks
- Day 1-2: 1-2 wet diapers, meconium stools.
- Day 4+: 6+ wet diapers, transition to mustard-yellow seedy stools daily.`,
    stage: 'baby_care',
    author: 'Amara Williams, IBCLC',
    clinicalReviewer: 'Dr. Kenneth Reed, FAAP',
    clinicalReviewerTitle: 'Consulting Pediatrician',
    reviewDate: '2026-09-02',
    publicationStatus: 'published',
    region: 'Global',
    language: 'en',
    topics: ['Safe Sleep', 'Breastfeeding', 'Newborn Care', 'Diapers'],
    readingTimeMinutes: 7,
    urgentFlags: ['Fever above 100.4°F (rectal) in infants under 3 months is an emergency', 'Lethargy or refusal to feed'],
    version: 1
  },
  {
    id: 'art-4',
    slug: 'postpartum-mental-health-baby-blues-vs-pmad',
    title: 'Baby Blues vs. Perinatal Mood & Anxiety Disorders (PMADs)',
    summary: 'Differentiating transient hormonal adjustments from depression, anxiety, or intrusive thoughts, with confidential resources for support.',
    body: `Approximately 70–80% of new parents experience the "baby blues," characterized by tearfulness, irritability, and exhaustion that typically peaks around day 4–5 and resolves by day 14.

### When It Is More Than Baby Blues
If feelings of deep sorrow, intense panic, detachment from the infant, or persistent scary intrusive thoughts last longer than two weeks, it is likely a Perinatal Mood and Anxiety Disorder (PMAD). 

PMADs are the most common complication of childbirth, affecting 1 in 5 parents. They are medically treatable through specialized therapy, peer support networks, and lactation-safe medications.`,
    stage: 'postpartum',
    author: 'Jessica Chen, LCSW, PMH-C',
    clinicalReviewer: 'Dr. Kimberly Adams, MD',
    clinicalReviewerTitle: 'Reproductive Psychiatrist',
    reviewDate: '2026-08-30',
    publicationStatus: 'published',
    region: 'Global',
    language: 'en',
    topics: ['Mental Health', 'PMAD', 'Postpartum Depression', 'Support'],
    readingTimeMinutes: 5,
    urgentFlags: ['Thoughts of harming self or infant - call 988 or maternal hotline immediately'],
    version: 1
  }
];

// Seed Verified Healthcare Providers
const SEED_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'Lotus Maternal & Midwifery Care',
    specialty: 'Certified Nurse Midwifery & Prenatal Care',
    organization: 'Community Health Partners',
    services: ['Prenatal Checkups', 'Water Birth Support', 'Postpartum Home Visits', 'Lactation Consultation'],
    location: {
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      address: '1420 SW 5th Ave, Suite 300',
      distanceMiles: 2.1
    },
    languages: ['English', 'Spanish'],
    contactDetails: {
      phone: '(503) 555-0192',
      email: 'care@lotusmidwifery.org',
      website: 'https://lotusmidwifery.example.org'
    },
    verificationDate: '2026-08-10',
    listingStatus: 'verified',
    acceptsInsurance: true,
    telehealthAvailable: true,
    rating: 4.9
  },
  {
    id: 'prov-2',
    name: 'Dr. Sarah Lin, MD, FACOG',
    specialty: 'High-Risk Obstetrics & Maternal-Fetal Medicine',
    organization: 'Providence Perinatal Center',
    services: ['High-Risk Pregnancy', 'Level II Ultrasound', 'Gestational Diabetes Management', 'Vaginal Birth After Cesarean (VBAC)'],
    location: {
      city: 'Portland',
      state: 'OR',
      zipCode: '97225',
      address: '9155 SW Barnes Rd, Medical Tower 2',
      distanceMiles: 4.5
    },
    languages: ['English', 'Mandarin'],
    contactDetails: {
      phone: '(503) 555-0144',
      email: 'drlin@providenceperinatal.example.org'
    },
    verificationDate: '2026-09-01',
    listingStatus: 'verified',
    acceptsInsurance: true,
    telehealthAvailable: true,
    rating: 5.0
  },
  {
    id: 'prov-3',
    name: 'Cradle & Nurture Lactation Collective',
    specialty: 'IBCLC Lactation & Feeding Support',
    organization: 'Independent Collective',
    services: ['Tongue-Tie Evaluation', 'Latch Coaching', 'Low Milk Supply Consultation', 'Pumping Strategy'],
    location: {
      city: 'Beaverton',
      state: 'OR',
      zipCode: '97005',
      address: '3800 SW Cedar Hills Blvd',
      distanceMiles: 6.2
    },
    languages: ['English', 'Spanish', 'Hindi'],
    contactDetails: {
      phone: '(503) 555-0188',
      email: 'consult@cradlenurture.example.org',
      website: 'https://cradlenurture.example.org'
    },
    verificationDate: '2026-07-15',
    listingStatus: 'verified',
    acceptsInsurance: true,
    telehealthAvailable: true,
    rating: 4.8
  },
  {
    id: 'prov-4',
    name: 'Evergreen Pediatric & Adolescent Clinic',
    specialty: 'Pediatrics & Early Childhood Development',
    organization: 'Evergreen Health',
    services: ['Newborn Well-Checks', 'Immunization Counseling', 'Developmental Milestone Screening', 'Pediatric Urgent Care'],
    location: {
      city: 'Vancouver',
      state: 'WA',
      zipCode: '98660',
      address: '2100 Main St, Suite 101',
      distanceMiles: 8.7
    },
    languages: ['English', 'Vietnamese', 'Russian'],
    contactDetails: {
      phone: '(360) 555-0130',
      email: 'reception@evergreenpediatrics.example.org'
    },
    verificationDate: '2026-08-20',
    listingStatus: 'verified',
    acceptsInsurance: true,
    telehealthAvailable: false,
    rating: 4.7
  }
];

// Emergency Matrices & Urgent Protocols
export const EMERGENCY_PROTOCOLS: EmergencyHelpInfo[] = [
  {
    id: 'emg-1',
    category: 'maternal',
    title: 'Urgent Maternal Red Flags (Pregnancy & Postpartum)',
    description: 'If you experience any of these signs, seek emergency medical care immediately or call your obstetric triage.',
    redFlags: [
      'Severe headache, blurry vision, or sudden visual spots (Preeclampsia warning)',
      'Heavy vaginal bleeding (soaking more than one maxi pad per hour for two consecutive hours)',
      'Sudden difficulty breathing, chest pain, or rapid heartbeat',
      'Significantly decreased or absent fetal movements in 3rd trimester',
      'Fever of 100.4°F (38°C) or higher with abdominal tenderness'
    ],
    actionRequired: 'Call 911 or head directly to the nearest hospital labor & delivery triage unit.',
    hotline: 'Maternal Mental & Health Hotline: 1-833-9-HELP4MOMS (1-833-943-5746)'
  },
  {
    id: 'emg-2',
    category: 'infant',
    title: 'Infant Emergency Indicators (Birth to 12 Months)',
    description: 'Infant conditions can progress quickly. Trust your caregiver intuition and seek immediate care.',
    redFlags: [
      'Fever of 100.4°F (38°C) or higher in an infant under 3 months (rectal reading is gold standard)',
      'Labored breathing: grunting, flared nostrils, chest pulling inward below ribs (retractions)',
      'Bluish or grayish tint around mouth, lips, or fingernails',
      'Extreme lethargy: infant cannot be awakened or does not respond to sounds/touch',
      'Significantly dehydrated: sunken fontanelle, dry diapers for 8+ hours, no tears when crying'
    ],
    actionRequired: 'Seek pediatric emergency room care immediately.',
    hotline: 'Poison Control Center: 1-800-222-1222'
  },
  {
    id: 'emg-3',
    category: 'mental_health',
    title: 'Perinatal Crisis & Emotional Distress',
    description: 'Postpartum distress, intrusive scary thoughts, or thoughts of self-harm are medical emergencies that can be safely treated.',
    redFlags: [
      'Persistent thoughts of harming yourself or your baby',
      'Severe insomnia despite utter exhaustion (inability to sleep even when baby sleeps)',
      'Hearing voices or seeing things that others do not see',
      'Overwhelming panic that prevents basic daily care'
    ],
    actionRequired: 'Call or text the 988 Suicide & Crisis Lifeline or 1-833-TLC-MAMA.',
    hotline: 'Call or text 988 (Available 24/7, confidential and free)'
  }
];

// Pre-populated clinical visit question lists
export const DEFAULT_QUESTIONS_BY_STAGE: Record<string, string[]> = {
  first_trimester: [
    'Are my current medications and vitamins safe to continue?',
    'What genetic screening options are recommended for my age group?',
    'What level of physical exercise is safe during my day-to-day routine?',
    'Which over-the-counter remedies can I take for nausea and headache?'
  ],
  second_trimester: [
    'When should I begin feeling consistent fetal kicks?',
    'What are the signs of preterm labor I should watch for?',
    'When is the anatomy ultrasound scheduled and what does it assess?',
    'Do you recommend childbirth education or infant CPR classes?'
  ],
  third_trimester: [
    'What is your hospital/birth center protocol if my water breaks early?',
    'What are my options for pain management during labor?',
    'When should I call the triage line versus coming directly to the hospital?',
    'Who is available on-call when I go into labor?'
  ],
  postpartum_checkup: [
    'Is my bleeding (lochia) and perineal / incision healing progressing normally?',
    'When is it safe to resume moderate exercise and sexual intercourse?',
    'What contraceptive methods are safe while breastfeeding?',
    'I have been feeling tearful/anxious; can we discuss mental health resources?'
  ],
  pediatric_well_check: [
    'Is baby gaining weight according to the growth curve?',
    'Are baby’s feeding frequency and dirty diaper counts where they should be?',
    'What milestones should we look for before the next visit?',
    'What vaccines are scheduled for today, and what side effects might appear?'
  ]
};

// Seed Demo Users (User & Admin/Reviewer)
const SEED_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: 'Maya Patel',
    email: 'maya.parent@example.com',
    phone: '+1 (503) 555-0177',
    role: 'user',
    preferredLanguage: 'en',
    notificationPreferences: {
      email: true,
      sms: false,
      appointmentReminders: true,
      healthCheckins: true
    },
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'reviewer-demo-1',
    name: 'Dr. Sarah Lin, MD',
    email: 'dr.lin@clinics.seva.org',
    role: 'clinical_reviewer',
    preferredLanguage: 'en',
    notificationPreferences: {
      email: true,
      sms: true,
      appointmentReminders: false,
      healthCheckins: false
    },
    createdAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'admin-demo-1',
    name: 'Seva Editorial Admin',
    email: 'admin@seva.org',
    role: 'admin',
    preferredLanguage: 'en',
    notificationPreferences: {
      email: true,
      sms: true,
      appointmentReminders: true,
      healthCheckins: true
    },
    createdAt: '2026-07-01T08:00:00Z'
  }
];

// In-Memory Database store with optional persistence
class MemoryDb {
  private articles: Article[] = [...SEED_ARTICLES];
  private providers: Provider[] = [...SEED_PROVIDERS];
  private users: User[] = [...SEED_USERS];
  private appointments: Appointment[] = [
    {
      id: 'appt-1',
      userId: 'user-demo-1',
      title: '28-Week Prenatal Checkup & Glucose Screening',
      providerId: 'prov-2',
      providerName: 'Dr. Sarah Lin, MD, FACOG',
      dateTime: '2026-10-08T09:30:00',
      location: 'Providence Perinatal Center, Suite 400',
      reminderPreference: '1_day_before',
      privateNotes: 'Ask about leg cramps at night and check on RhoGAM injection schedule.',
      questionsToAsk: [
        'Do I need to fast before the 1-hour glucose drink?',
        'Can my partner join for the third-trimester ultrasound?'
      ],
      status: 'scheduled',
      createdAt: '2026-09-15T14:20:00Z'
    },
    {
      id: 'appt-2',
      userId: 'user-demo-1',
      title: 'Prenatal Lactation Consultation',
      providerId: 'prov-3',
      providerName: 'Cradle & Nurture Lactation Collective',
      dateTime: '2026-10-15T14:00:00',
      location: 'Telehealth Video Visit',
      reminderPreference: '2_hours_before',
      privateNotes: 'Review breast pump assembly and flange sizing.',
      questionsToAsk: [
        'How soon after birth should I try pumping?',
        'What should I prepare in my hospital bag for nursing?'
      ],
      status: 'scheduled',
      createdAt: '2026-09-20T11:00:00Z'
    }
  ];
  private careLogs: CareLogEntry[] = [
    {
      id: 'log-1',
      userId: 'user-demo-1',
      entryType: 'feed',
      timestamp: '2026-09-29T08:30:00',
      details: {
        subType: 'breast_left',
        durationMinutes: 18,
        notes: 'Good deep latch, burped well'
      },
      createdAt: '2026-09-29T08:50:00Z'
    },
    {
      id: 'log-2',
      userId: 'user-demo-1',
      entryType: 'diaper',
      timestamp: '2026-09-29T09:15:00',
      details: {
        diaperType: 'mixed',
        notes: 'Wet + yellow seedy stool'
      },
      createdAt: '2026-09-29T09:16:00Z'
    },
    {
      id: 'log-3',
      userId: 'user-demo-1',
      entryType: 'sleep',
      timestamp: '2026-09-29T09:45:00',
      details: {
        durationMinutes: 90,
        notes: 'Morning crib nap on back, swaddled arms out'
      },
      createdAt: '2026-09-29T11:20:00Z'
    }
  ];
  private auditLogs: AuditLog[] = [
    {
      id: 'audit-1',
      timestamp: '2026-09-02T10:15:00Z',
      actorId: 'reviewer-demo-1',
      actorRole: 'clinical_reviewer',
      action: 'APPROVE_PUBLICATION',
      entityType: 'article',
      entityId: 'art-3',
      details: 'Clinical review approved for Safe Infant Sleep and Latch'
    }
  ];

  // Articles
  getArticles(filter?: { stage?: string; query?: string; status?: string }): Article[] {
    let result = this.articles;
    if (filter?.status) {
      result = result.filter(a => a.publicationStatus === filter.status);
    } else {
      result = result.filter(a => a.publicationStatus === 'published');
    }
    if (filter?.stage && filter.stage !== 'all') {
      result = result.filter(a => a.stage === filter.stage);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.topics.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getArticleBySlug(slug: string): Article | undefined {
    return this.articles.find(a => a.slug === slug || a.id === slug);
  }

  saveArticle(article: Partial<Article> & { title: string; body: string; stage: any }): Article {
    if (article.id) {
      const idx = this.articles.findIndex(a => a.id === article.id);
      if (idx >= 0) {
        this.articles[idx] = { ...this.articles[idx], ...article, version: (this.articles[idx].version || 1) + 1 };
        return this.articles[idx];
      }
    }
    const newArticle: Article = {
      id: `art-${Date.now()}`,
      slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: article.title,
      summary: article.summary || article.body.slice(0, 150) + '...',
      body: article.body,
      stage: article.stage,
      author: article.author || 'Clinical Contributor',
      clinicalReviewer: article.clinicalReviewer || 'Pending Assignment',
      reviewDate: new Date().toISOString().split('T')[0],
      publicationStatus: article.publicationStatus || 'draft',
      region: article.region || 'Global',
      language: article.language || 'en',
      topics: article.topics || ['General Care'],
      readingTimeMinutes: Math.max(1, Math.ceil(article.body.split(/\s+/).length / 200)),
      version: 1
    };
    this.articles.unshift(newArticle);
    return newArticle;
  }

  // Providers
  getProviders(filter?: { specialty?: string; query?: string; language?: string; telehealth?: boolean }): Provider[] {
    let result = this.providers.filter(p => p.listingStatus === 'verified');
    if (filter?.specialty && filter.specialty !== 'all') {
      result = result.filter(p => p.specialty.toLowerCase().includes(filter.specialty!.toLowerCase()));
    }
    if (filter?.language && filter.language !== 'all') {
      result = result.filter(p => p.languages.includes(filter.language!));
    }
    if (filter?.telehealth) {
      result = result.filter(p => p.telehealthAvailable);
    }
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.services.some(s => s.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getAllProvidersAdmin(): Provider[] {
    return this.providers;
  }

  updateProviderStatus(id: string, status: 'verified' | 'pending' | 'retired'): Provider | undefined {
    const prov = this.providers.find(p => p.id === id);
    if (prov) {
      prov.listingStatus = status;
      prov.verificationDate = new Date().toISOString().split('T')[0];
    }
    return prov;
  }

  // Users & Auth
  getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: { name: string; email: string; phone?: string; preferredLanguage?: string; role?: any }): User {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'user',
      preferredLanguage: userData.preferredLanguage || 'en',
      notificationPreferences: {
        email: true,
        sms: !!userData.phone,
        appointmentReminders: true,
        healthCheckins: true
      },
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.getUser(id);
    if (user) {
      Object.assign(user, updates);
    }
    return user;
  }

  deleteUser(id: string): boolean {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx >= 0) {
      this.users.splice(idx, 1);
      // Cascade delete appointments and care logs for privacy (WHO Right to be forgotten)
      this.appointments = this.appointments.filter(a => a.userId !== id);
      this.careLogs = this.careLogs.filter(c => c.userId !== id);
      return true;
    }
    return false;
  }

  // Appointments (Strict User Isolation)
  getAppointments(userId: string): Appointment[] {
    return this.appointments
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  createAppointment(appt: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.appointments.push(newAppt);
    return newAppt;
  }

  updateAppointment(id: string, userId: string, updates: Partial<Appointment>): Appointment | undefined {
    const appt = this.appointments.find(a => a.id === id && a.userId === userId);
    if (appt) {
      Object.assign(appt, updates);
    }
    return appt;
  }

  deleteAppointment(id: string, userId: string): boolean {
    const idx = this.appointments.findIndex(a => a.id === id && a.userId === userId);
    if (idx >= 0) {
      this.appointments.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Care Logs (Isolated from Public & Search)
  getCareLogs(userId: string, filter?: { entryType?: string; days?: number }): CareLogEntry[] {
    let logs = this.careLogs.filter(c => c.userId === userId);
    if (filter?.entryType && filter.entryType !== 'all') {
      logs = logs.filter(c => c.entryType === filter.entryType);
    }
    if (filter?.days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - filter.days);
      logs = logs.filter(c => new Date(c.timestamp) >= cutoff);
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  createCareLog(log: Omit<CareLogEntry, 'id' | 'createdAt'>): CareLogEntry {
    const newLog: CareLogEntry = {
      ...log,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.careLogs.unshift(newLog);
    return newLog;
  }

  deleteCareLog(id: string, userId: string): boolean {
    const idx = this.careLogs.findIndex(c => c.id === id && c.userId === userId);
    if (idx >= 0) {
      this.careLogs.splice(idx, 1);
      return true;
    }
    return false;
  }

  purgeCareLogs(userId: string, retentionDays?: number): number {
    const initialCount = this.careLogs.length;
    if (retentionDays === undefined || retentionDays === 0) {
      // Purge all logs
      this.careLogs = this.careLogs.filter(c => c.userId !== userId);
    } else {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - retentionDays);
      this.careLogs = this.careLogs.filter(c => {
        if (c.userId !== userId) return true;
        return new Date(c.timestamp) >= cutoff;
      });
    }
    return initialCount - this.careLogs.length;
  }

  // Audit Logs (No Health Details or Search Strings)
  logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const audit: AuditLog = {
      ...event,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(audit);
  }

  getAuditLogs(): AuditLog[] {
    return this.auditLogs.slice(0, 100);
  }
}

// Global Singleton for in-app state across API routes
declare global {
  // eslint-disable-next-line no-var
  var __SEVA_DB__: MemoryDb | undefined;
}

export const db: MemoryDb = global.__SEVA_DB__ || new MemoryDb();
if (process.env.NODE_ENV !== 'production') {
  global.__SEVA_DB__ = db;
}
