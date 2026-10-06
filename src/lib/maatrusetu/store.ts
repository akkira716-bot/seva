// MaatruSetu Isolated Data Store
// Completely separate from existing SEVA application tables and models

import { MaatruSetuRecord } from '@/types/maatrusetu';

const SEED_MAATRUSETU_RECORDS: MaatruSetuRecord[] = [
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
      // Born 6 days ago -> Day 7 of 42
      birthDate: '2026-09-24',
      birthWeightKg: 3.10,
      gestationalAgeWeeks: 39
    },
    healthStatus: 'stable',
    healthStatusNote: 'Mother recovering well following normal vaginal delivery. Infant latching vigorously, yellow seedy stool, clean umbilicus.',
    nextFollowUp: {
      date: '2026-10-01',
      type: 'Day 7 Postnatal Home Visit - ASHA/ANM',
      providerOrWorker: 'ASHA Worker Geeta Bai'
    },
    nextVaccination: {
      name: 'OPV-1 + Pentavalent-1 + Rotavirus-1',
      dueDate: '2026-11-05',
      status: 'pending'
    },
    checkInStatus: 'pending',
    registeredAt: '2026-09-24T10:30:00Z'
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
      // Born 13 days ago -> Day 14 of 42
      birthDate: '2026-09-17',
      birthWeightKg: 2.35,
      gestationalAgeWeeks: 36
    },
    healthStatus: 'attention_needed',
    healthStatusNote: 'Moderate Low Birth Weight (<2.5kg) & late preterm. Kangaroo Mother Care (KMC) recommended; monitor weight gain closely.',
    nextFollowUp: {
      date: '2026-10-02',
      type: 'Day 14 Special Newborn Care & Weight Evaluation',
      providerOrWorker: 'Community Health Center (CHC) Pediatric Wing'
    },
    nextVaccination: {
      name: 'Pentavalent-1 + OPV-1 + fIPV-1',
      dueDate: '2026-10-29',
      status: 'pending'
    },
    checkInStatus: 'pending',
    registeredAt: '2026-09-17T08:15:00Z'
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
      // Born 28 days ago -> Day 29 of 42
      birthDate: '2026-09-02',
      birthWeightKg: 3.45,
      gestationalAgeWeeks: 40
    },
    healthStatus: 'stable',
    healthStatusNote: 'Exclusively breastfed, cord stump detached naturally, infant alert and smiling. Maternal lochia resolved normally.',
    nextFollowUp: {
      date: '2026-10-14',
      type: '6-Week Comprehensive Postnatal & Infant Assessment',
      providerOrWorker: 'Dr. Sarah Lin / Primary Health Center'
    },
    nextVaccination: {
      name: 'OPV-1 + Pentavalent-1 + PCV-1',
      dueDate: '2026-10-14',
      status: 'pending'
    },
    checkInStatus: 'pending',
    registeredAt: '2026-09-02T14:45:00Z'
  }
];

class MaatruSetuStore {
  private records: MaatruSetuRecord[] = [...SEED_MAATRUSETU_RECORDS];

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
    // Add to beginning of array so newly registered records are immediately visible
    this.records.unshift(newRecord);
    return newRecord;
  }

  updateRecord(id: string, updates: Partial<MaatruSetuRecord>): MaatruSetuRecord | undefined {
    const record = this.getRecordById(id);
    if (record) {
      Object.assign(record, updates);
    }
    return record;
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
