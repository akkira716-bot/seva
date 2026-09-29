import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle, 
  Share2, 
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import { db } from '@/lib/db';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ArticleDetailPage({ params }: PageProps) {
  const article = db.getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles & Guidance</span>
        </Link>
      </div>

      {/* Header & Meta */}
      <header className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
            article.stage === 'pregnancy'
              ? 'bg-amber-100 text-amber-800'
              : article.stage === 'postpartum'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-teal-100 text-teal-800'
          }`}>
            {article.stage.replace('_', ' ')}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {article.readingTimeMinutes} min read
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Region: {article.region}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {article.summary}
        </p>

        {/* Clinical Review Verification Box */}
        <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <span>Clinically Reviewed by {article.clinicalReviewer}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 inline" />
              </div>
              <p className="text-teal-700 text-[11px] mt-0.5">
                {article.clinicalReviewerTitle || 'Clinical Specialist'} • Reviewed on {article.reviewDate}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-teal-800 font-medium">
            Written by {article.author}
          </div>
        </div>
      </header>

      {/* Urgent Warning Callout if present */}
      {article.urgentFlags && article.urgentFlags.length > 0 && (
        <aside aria-label="Critical Warning Signs" className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Urgent Symptoms Requiring Prompt Clinical Attention</span>
          </div>
          <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-rose-800/90 pl-1">
            {article.urgentFlags.map((flag, idx) => (
              <li key={idx} className="leading-relaxed font-medium">{flag}</li>
            ))}
          </ul>
          <p className="text-xs text-rose-700 pt-1">
            If you experience any of these signs, do not wait. Contact your obstetrician, pediatric triage, or visit an emergency room.
          </p>
        </aside>
      )}

      {/* Main Clinical Body */}
      <section className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-rose-600 prose-p:leading-relaxed text-sm sm:text-base space-y-6">
        {article.body.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h2 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('- ')) {
            const listItems = paragraph.split('\n- ');
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 text-slate-700 my-3">
                {listItems.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {item.replace(/^- /, '')}
                  </li>
                ))}
              </ul>
            );
          }
          if (/^\d+\.\s/.test(paragraph)) {
            const listItems = paragraph.split(/\n\d+\.\s/);
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1.5 text-slate-700 my-3">
                {listItems.map((item, itemIdx) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {item.replace(/^\d+\.\s/, '')}
                  </li>
                ))}
              </ol>
            );
          }
          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </section>

      {/* Bottom Medical Disclaimer & Next Step Action */}
      <footer className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex flex-wrap gap-2">
          {article.topics.map((t, idx) => (
            <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
              #{t}
            </span>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">Clinical Protocol Notice</p>
          <p>
            This article is part of SEVA’s open health education library. Guidance is reviewed on a scheduled 6-month cycle or whenever new clinical practice bulletins are released by professional bodies (ACOG, AAP, WHO).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/50 border border-rose-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Have questions for your upcoming visit?</h4>
            <p className="text-xs text-slate-600">Save discussion points directly to your visit organizer.</p>
          </div>
          <Link
            href="/organizer"
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
          >
            Add to Visit Organizer &rarr;
          </Link>
        </div>
      </footer>
    </article>
  );
}
