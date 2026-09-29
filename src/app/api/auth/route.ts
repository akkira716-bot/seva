import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-demo-1';
    const action = searchParams.get('action');

    const user = db.getUser(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Export complete user data (WHO Data Portability standard)
    if (action === 'export') {
      const appointments = db.getAppointments(userId);
      const careLogs = db.getCareLogs(userId);

      const exportPayload = {
        compliance: 'WHO Digital Health Data Governance Standard',
        exportedAt: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          preferredLanguage: user.preferredLanguage,
          notificationPreferences: user.notificationPreferences,
          createdAt: user.createdAt
        },
        appointments,
        careLogs,
        dataIntegrityNotice: 'This exported data contains your personal health notes and care logs. Keep it in a secure location.'
      };

      return NextResponse.json({
        success: true,
        data: exportPayload
      });
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication service failure' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, name, phone, preferredLanguage, role, userId } = body;

    if (action === 'login') {
      // Find or switch to user
      let user = db.getUserByEmail(email);
      if (!user) {
        // Auto-register demo/new user for seamless experience
        user = db.createUser({
          name: name || email.split('@')[0],
          email,
          phone,
          preferredLanguage: preferredLanguage || 'en',
          role: role || 'user'
        });
      }
      return NextResponse.json({ success: true, data: user });
    }

    if (action === 'register') {
      const existing = db.getUserByEmail(email);
      if (existing) {
        return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 });
      }
      const newUser = db.createUser({
        name,
        email,
        phone,
        preferredLanguage: preferredLanguage || 'en',
        role: role || 'user'
      });
      return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    }

    if (action === 'update_profile') {
      const user = db.updateUser(userId, body.updates);
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: user });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication operation failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'UserId required for deletion' }, { status: 400 });
    }

    const success = db.deleteUser(userId);
    if (!success) {
      return NextResponse.json({ success: false, error: 'User could not be found' }, { status: 404 });
    }

    // Log security event (without storing personal health details)
    db.logAuditEvent({
      actorId: userId,
      actorRole: 'user',
      action: 'RIGHT_TO_BE_FORGOTTEN_PURGE',
      entityType: 'user',
      entityId: userId,
      details: 'User invoked complete account deletion and data purge'
    });

    return NextResponse.json({
      success: true,
      message: 'Account and all associated appointments and care logs have been permanently deleted.'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Account deletion failed' }, { status: 500 });
  }
}
