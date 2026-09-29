import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty') || undefined;
    const query = searchParams.get('query') || undefined;
    const language = searchParams.get('language') || undefined;
    const telehealth = searchParams.get('telehealth') === 'true';

    const providers = db.getProviders({ specialty, query, language, telehealth });

    return NextResponse.json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch provider listings' },
      { status: 500 }
    );
  }
}
