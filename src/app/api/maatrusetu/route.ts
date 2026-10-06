import { NextRequest, NextResponse } from 'next/server';
import { maatruSetuStore } from '@/lib/maatrusetu/store';
import { MaatruSetuRecord } from '@/types/maatrusetu';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const record = maatruSetuStore.getRecordById(id);
      if (!record) {
        return NextResponse.json(
          { success: false, error: 'MaatruSetu record not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: record });
    }

    const records = maatruSetuStore.getAllRecords();
    return NextResponse.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch MaatruSetu records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      motherName,
      motherAge,
      motherPhone,
      rchId,
      newbornName,
      newbornSex,
      birthDate,
      birthWeightKg,
      gestationalAgeWeeks,
      healthStatus,
      healthStatusNote,
      nextFollowUpDate,
      nextFollowUpType,
      nextFollowUpWorker,
      nextVaccinationName,
      nextVaccinationDate
    } = body;

    // Validate required fields
    if (
      !motherName ||
      !motherAge ||
      !newbornName ||
      !newbornSex ||
      !birthDate ||
      !birthWeightKg ||
      !gestationalAgeWeeks ||
      !healthStatus ||
      !nextFollowUpDate ||
      !nextFollowUpType ||
      !nextVaccinationName ||
      !nextVaccinationDate
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required registration parameters' },
        { status: 400 }
      );
    }

    const newRecord = maatruSetuStore.createRecord({
      mother: {
        name: motherName.trim(),
        age: Number(motherAge),
        phone: motherPhone ? motherPhone.trim() : undefined,
        rchId: rchId ? rchId.trim() : undefined
      },
      newborn: {
        name: newbornName.trim(),
        sex: newbornSex,
        birthDate,
        birthWeightKg: Number(birthWeightKg),
        gestationalAgeWeeks: Number(gestationalAgeWeeks)
      },
      healthStatus,
      healthStatusNote: healthStatusNote ? healthStatusNote.trim() : undefined,
      nextFollowUp: {
        date: nextFollowUpDate,
        type: nextFollowUpType.trim(),
        providerOrWorker: nextFollowUpWorker ? nextFollowUpWorker.trim() : undefined
      },
      nextVaccination: {
        name: nextVaccinationName.trim(),
        dueDate: nextVaccinationDate,
        status: 'pending'
      },
      checkInStatus: 'pending'
    });

    return NextResponse.json({
      success: true,
      data: newRecord
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to register mother and newborn' },
      { status: 500 }
    );
  }
}
