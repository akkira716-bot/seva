import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PublicationStatus } from '@/types';

export async function GET() {
  try {
    // Return all articles regardless of publication status for staff
    const articles = db.getArticles({ status: undefined });
    // Also include drafts, clinical_review, editorial, retired
    const allStatuses: PublicationStatus[] = ['draft', 'clinical_review', 'editorial', 'published', 'retired'];
    const fullList = allStatuses.flatMap(s => db.getArticles({ status: s }));
    // Deduplicate by ID
    const unique = Array.from(new Map(fullList.map(a => [a.id, a])).values());

    return NextResponse.json({
      success: true,
      count: unique.length,
      data: unique
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve admin content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, articleId, nextStatus, articleData, reviewerName, actorRole } = body;

    if (action === 'update_status') {
      const existing = db.getArticleBySlug(articleId);
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
      }

      existing.publicationStatus = nextStatus;
      if (nextStatus === 'published' || nextStatus === 'clinical_review') {
        existing.reviewDate = new Date().toISOString().split('T')[0];
        if (reviewerName) existing.clinicalReviewer = reviewerName;
      }
      existing.version = (existing.version || 1) + 1;

      // Record in security & operational audit log
      db.logAuditEvent({
        actorId: reviewerName || 'clinical-reviewer-1',
        actorRole: actorRole || 'clinical_reviewer',
        action: `ARTICLE_STATUS_CHANGED_TO_${nextStatus.toUpperCase()}`,
        entityType: 'article',
        entityId: existing.id,
        details: `Article "${existing.title}" transitioned to ${nextStatus} (Version ${existing.version})`
      });

      return NextResponse.json({ success: true, data: existing });
    }

    if (action === 'create_draft') {
      const saved = db.saveArticle({
        title: articleData.title,
        body: articleData.body,
        summary: articleData.summary,
        stage: articleData.stage,
        author: articleData.author || 'Maternal Health Specialist',
        clinicalReviewer: articleData.clinicalReviewer || 'Dr. Sarah Lin, MD, FACOG',
        publicationStatus: 'clinical_review',
        topics: articleData.topics || ['General Care'],
        urgentFlags: articleData.urgentFlags || []
      });

      db.logAuditEvent({
        actorId: reviewerName || 'editor-1',
        actorRole: actorRole || 'content_editor',
        action: 'DRAFT_ARTICLE_SUBMITTED_FOR_REVIEW',
        entityType: 'article',
        entityId: saved.id,
        details: `Draft "${saved.title}" submitted for clinical review`
      });

      return NextResponse.json({ success: true, data: saved }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process admin content action' }, { status: 500 });
  }
}
