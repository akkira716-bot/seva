import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const providers = db.getAllProvidersAdmin();
  return NextResponse.json({
    success: true,
    data: providers
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, status, actorId, actorRole } = body;

    if (!providerId || !status) {
      return NextResponse.json({ success: false, error: 'Provider ID and status required' }, { status: 400 });
    }

    const updated = db.updateProviderStatus(providerId, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Provider not found' }, { status: 404 });
    }

    db.logAuditEvent({
      actorId: actorId || 'admin-1',
      actorRole: actorRole || 'admin',
      action: `PROVIDER_STATUS_${status.toUpperCase()}`,
      entityType: 'provider',
      entityId: providerId,
      details: `Provider "${updated.name}" credential verification status set to ${status}`
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Provider verification update failed' }, { status: 500 });
  }
}
