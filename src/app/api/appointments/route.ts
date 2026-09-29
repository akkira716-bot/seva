import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-1';

    // Strict account-level access check
    const appointments = db.getAppointments(userId);

    return NextResponse.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, providerId, providerName, dateTime, location, reminderPreference, privateNotes, questionsToAsk } = body;

    if (!userId || !title || !dateTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required appointment parameters (userId, title, dateTime)' },
        { status: 400 }
      );
    }

    const newAppt = db.createAppointment({
      userId,
      title,
      providerId,
      providerName,
      dateTime,
      location,
      reminderPreference: reminderPreference || '1_day_before',
      privateNotes,
      questionsToAsk: questionsToAsk || [],
      status: 'scheduled'
    });

    return NextResponse.json({
      success: true,
      data: newAppt
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, updates } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: 'Appointment id and userId required' },
        { status: 400 }
      );
    }

    const updated = db.updateAppointment(id, userId, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId') || 'user-demo-1';

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Appointment id is required' },
        { status: 400 }
      );
    }

    const deleted = db.deleteAppointment(id, userId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment successfully deleted'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
