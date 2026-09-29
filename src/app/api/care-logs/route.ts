import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CareLogType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-1';
    const entryType = searchParams.get('entryType') || undefined;
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : undefined;

    // Strict user isolation
    const logs = db.getCareLogs(userId, { entryType, days });

    // Calculate daily analytics summary for parents & pediatricians
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.timestamp.startsWith(today));

    const summary = {
      todayFeedCount: todayLogs.filter(l => l.entryType === 'feed').length,
      todaySleepMinutes: todayLogs
        .filter(l => l.entryType === 'sleep')
        .reduce((sum, l) => sum + (l.details.durationMinutes || 0), 0),
      todayDiaperCount: todayLogs.filter(l => l.entryType === 'diaper').length,
      wetDiapers: todayLogs.filter(l => l.entryType === 'diaper' && (l.details.diaperType === 'wet' || l.details.diaperType === 'mixed')).length,
      dirtyDiapers: todayLogs.filter(l => l.entryType === 'diaper' && (l.details.diaperType === 'dirty' || l.details.diaperType === 'mixed')).length,
    };

    return NextResponse.json({
      success: true,
      count: logs.length,
      summary,
      data: logs
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve care logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, entryType, timestamp, details } = body;

    if (!userId || !entryType || !details) {
      return NextResponse.json(
        { success: false, error: 'Missing required care log fields (userId, entryType, details)' },
        { status: 400 }
      );
    }

    const newLog = db.createCareLog({
      userId,
      entryType: entryType as CareLogType,
      timestamp: timestamp || new Date().toISOString(),
      details
    });

    return NextResponse.json({
      success: true,
      data: newLog
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save care log entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-1';
    const id = searchParams.get('id');
    const retentionDays = searchParams.get('retentionDays');

    // Case 1: Purge batch based on retention policy
    if (retentionDays !== null && retentionDays !== undefined) {
      const days = parseInt(retentionDays, 10);
      const purgedCount = db.purgeCareLogs(userId, days);
      return NextResponse.json({
        success: true,
        message: `Purged ${purgedCount} care log records matching retention rule (${days === 0 ? 'all' : `${days} days`}).`,
        purgedCount
      });
    }

    // Case 2: Delete single entry
    if (id) {
      const deleted = db.deleteCareLog(id, userId);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Care log entry not found or unauthorized' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Care log entry deleted'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide either log id or retentionDays to delete' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete care log data' },
      { status: 500 }
    );
  }
}
