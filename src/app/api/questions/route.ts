import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_QUESTIONS_BY_STAGE } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get('stage');

  if (stage && DEFAULT_QUESTIONS_BY_STAGE[stage]) {
    return NextResponse.json({
      success: true,
      stage,
      questions: DEFAULT_QUESTIONS_BY_STAGE[stage]
    });
  }

  return NextResponse.json({
    success: true,
    stages: Object.keys(DEFAULT_QUESTIONS_BY_STAGE),
    data: DEFAULT_QUESTIONS_BY_STAGE
  });
}
