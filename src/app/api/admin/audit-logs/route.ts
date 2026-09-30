import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const auditLogs = db.getAuditLogs();
  return NextResponse.json({
    success: true,
    count: auditLogs.length,
    data: auditLogs
  });
}
