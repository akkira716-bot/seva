import { NextResponse } from 'next/server';
import { EMERGENCY_PROTOCOLS } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: EMERGENCY_PROTOCOLS
  });
}
