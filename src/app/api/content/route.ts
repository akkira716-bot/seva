import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage') || undefined;
    const query = searchParams.get('query') || undefined;
    const status = searchParams.get('status') || 'published';

    const articles = db.getArticles({ stage, query, status });

    return NextResponse.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clinical content' },
      { status: 500 }
    );
  }
}
