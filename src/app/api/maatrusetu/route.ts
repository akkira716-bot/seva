import { NextRequest, NextResponse } from 'next/server';
import { maatruSetuStore } from '@/lib/maatrusetu/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const recordId = searchParams.get('recordId') || searchParams.get('id');

    // Sub-actions for the 9 MaatruSetu features
    if (action === 'tasks' && recordId) {
      const tasks = maatruSetuStore.getTasksForRecord(recordId);
      return NextResponse.json({ success: true, count: tasks.length, data: tasks });
    }

    if (action === 'discharge' && recordId) {
      const plan = maatruSetuStore.getDischargePlan(recordId);
      return NextResponse.json({ success: true, data: plan || null });
    }

    if (action === 'journal' && recordId) {
      const entries = maatruSetuStore.getJournalEntries(recordId);
      return NextResponse.json({ success: true, count: entries.length, data: entries });
    }

    if (action === 'summary' && recordId) {
      const summary = maatruSetuStore.getRecoverySummary(recordId) ||
        maatruSetuStore.generateOrUpdateRecoverySummary(recordId);
      return NextResponse.json({ success: true, data: summary });
    }

    if (action === 'explainers') {
      const explainers = maatruSetuStore.getAllExplainers();
      return NextResponse.json({ success: true, count: explainers.length, data: explainers });
    }

    if (action === 'circle' && recordId) {
      const members = maatruSetuStore.getCareCircleMembers(recordId);
      return NextResponse.json({ success: true, count: members.length, data: members });
    }

    if (action === 'report' && recordId) {
      const report = maatruSetuStore.getCompletionReport(recordId) ||
        maatruSetuStore.generateCompletionReport(recordId);
      return NextResponse.json({ success: true, data: report });
    }

    if (action === 'ai_guidance') {
      const careDay = Number(searchParams.get('careDay') || 1);
      const deliveryType = (searchParams.get('deliveryType') as 'vaginal' | 'cesarean') || 'vaginal';
      const guidance = maatruSetuStore.getDailyAIGuidance(careDay, deliveryType);
      return NextResponse.json({ success: true, data: guidance });
    }

    // Existing default behavior: single record or all records
    if (recordId) {
      const record = maatruSetuStore.getRecordById(recordId);
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
    console.error('API GET /api/maatrusetu error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch MaatruSetu data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Feature 2: Family Tasks Actions
    if (action === 'add_task') {
      const { recordId, title, description, assignedRole, priority, category, dueDate } = body;
      if (!recordId || !title || !assignedRole || !dueDate) {
        return NextResponse.json({ success: false, error: 'Missing required task fields.' }, { status: 400 });
      }
      const task = maatruSetuStore.addTask({
        recordId,
        title,
        description,
        assignedRole,
        priority: priority || 'routine',
        category: category || 'baby_care',
        dueDate
      });
      return NextResponse.json({ success: true, data: task }, { status: 201 });
    }

    if (action === 'toggle_task') {
      const { taskId, completedBy } = body;
      if (!taskId) {
        return NextResponse.json({ success: false, error: 'Task ID required.' }, { status: 400 });
      }
      const updated = maatruSetuStore.toggleTaskCompletion(taskId, completedBy);
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'delete_task') {
      const { taskId } = body;
      if (!taskId) {
        return NextResponse.json({ success: false, error: 'Task ID required.' }, { status: 400 });
      }
      const deleted = maatruSetuStore.deleteTask(taskId);
      return NextResponse.json({ success: true, deleted });
    }

    // Feature 3: Discharge Plan Actions
    if (action === 'save_discharge') {
      const {
        recordId,
        hospitalName,
        dischargeDate,
        attendingPhysician,
        deliveryType,
        woundCare,
        activityRestrictions,
        babyFeedingPlan,
        medicationScheduleNote,
        emergencyReturnTriggers,
        attachmentName
      } = body;

      if (!recordId || !hospitalName || !dischargeDate) {
        return NextResponse.json({ success: false, error: 'Missing required discharge plan fields.' }, { status: 400 });
      }

      const plan = maatruSetuStore.createDischargePlan({
        recordId,
        hospitalName,
        dischargeDate,
        attendingPhysician: attendingPhysician || 'Attending Physician',
        deliveryType: deliveryType || 'vaginal',
        woundCare: woundCare || 'Keep clean and dry.',
        activityRestrictions: activityRestrictions || 'Rest and avoid heavy lifting.',
        babyFeedingPlan: babyFeedingPlan || 'Breastfeed every 2-3 hours.',
        medicationScheduleNote: medicationScheduleNote || 'Postnatal Iron & Calcium.',
        emergencyReturnTriggers: emergencyReturnTriggers || ['Fever ≥ 100.4°F', 'Severe Bleeding'],
        isVerifiedByClinician: false,
        attachmentName
      });
      return NextResponse.json({ success: true, data: plan });
    }

    if (action === 'verify_discharge') {
      const { recordId, clinicianNotes } = body;
      if (!recordId) {
        return NextResponse.json({ success: false, error: 'Record ID required.' }, { status: 400 });
      }
      const verified = maatruSetuStore.verifyDischargePlan(recordId, clinicianNotes);
      return NextResponse.json({ success: true, data: verified });
    }

    // Feature 4: Recovery Journal Action
    if (action === 'add_journal') {
      const {
        recordId,
        date,
        careDay,
        painScore,
        painLocations,
        bleedingLevel,
        mood,
        sleepHours,
        temperatureF,
        notes
      } = body;

      if (!recordId || !date || painScore === undefined || !bleedingLevel || !mood) {
        return NextResponse.json({ success: false, error: 'Missing required journal fields.' }, { status: 400 });
      }

      const entry = maatruSetuStore.addJournalEntry({
        recordId,
        date,
        careDay: careDay || 1,
        painScore: Number(painScore),
        painLocations: painLocations || [],
        bleedingLevel,
        mood,
        sleepHours: Number(sleepHours || 6),
        temperatureF: temperatureF ? Number(temperatureF) : undefined,
        notes
      });
      return NextResponse.json({ success: true, data: entry }, { status: 201 });
    }

    // Feature 5: Doctor Recovery Summary Action
    if (action === 'generate_summary') {
      const { recordId, customMotherNotes, questions } = body;
      if (!recordId) {
        return NextResponse.json({ success: false, error: 'Record ID required.' }, { status: 400 });
      }
      const summary = maatruSetuStore.generateOrUpdateRecoverySummary(recordId, customMotherNotes, questions);
      return NextResponse.json({ success: true, data: summary });
    }

    // Feature 8: Care Circle Actions
    if (action === 'add_circle_member') {
      const { recordId, name, relationship, phone, accessLevel, notificationsEnabled } = body;
      if (!recordId || !name || !relationship || !phone) {
        return NextResponse.json({ success: false, error: 'Missing required member fields.' }, { status: 400 });
      }
      const member = maatruSetuStore.addCareCircleMember({
        recordId,
        name,
        relationship,
        phone,
        accessLevel: accessLevel || 'helper',
        notificationsEnabled: notificationsEnabled !== false
      });
      return NextResponse.json({ success: true, data: member }, { status: 201 });
    }

    if (action === 'revoke_circle_member') {
      const { memberId } = body;
      if (!memberId) {
        return NextResponse.json({ success: false, error: 'Member ID required.' }, { status: 400 });
      }
      const revoked = maatruSetuStore.revokeCareCircleMember(memberId);
      return NextResponse.json({ success: true, revoked });
    }

    // Feature 9: 42-Day Completion Report Action
    if (action === 'generate_report') {
      const { recordId, healthWorkerName } = body;
      if (!recordId) {
        return NextResponse.json({ success: false, error: 'Record ID required.' }, { status: 400 });
      }
      const report = maatruSetuStore.generateCompletionReport(recordId, healthWorkerName);
      return NextResponse.json({ success: true, data: report });
    }

    // Default Action: Register new Mother + Newborn pair (existing behavior)
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

    if (
      !motherName ||
      !motherAge ||
      !newbornName ||
      !birthDate ||
      !birthWeightKg ||
      !gestationalAgeWeeks ||
      !nextFollowUpDate ||
      !nextFollowUpType ||
      !nextVaccinationName ||
      !nextVaccinationDate
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required registration fields' },
        { status: 400 }
      );
    }

    const newRecord = maatruSetuStore.createRecord({
      mother: {
        name: motherName,
        age: Number(motherAge),
        phone: motherPhone || undefined,
        rchId: rchId || undefined
      },
      newborn: {
        name: newbornName,
        sex: newbornSex || 'female',
        birthDate,
        birthWeightKg: Number(birthWeightKg),
        gestationalAgeWeeks: Number(gestationalAgeWeeks)
      },
      healthStatus: healthStatus || 'stable',
      healthStatusNote: healthStatusNote || undefined,
      nextFollowUp: {
        date: nextFollowUpDate,
        type: nextFollowUpType,
        providerOrWorker: nextFollowUpWorker || undefined
      },
      nextVaccination: {
        name: nextVaccinationName,
        dueDate: nextVaccinationDate,
        status: 'pending'
      },
      checkInStatus: 'pending'
    });

    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
  } catch (error) {
    console.error('API POST /api/maatrusetu error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process MaatruSetu request' },
      { status: 500 }
    );
  }
}
