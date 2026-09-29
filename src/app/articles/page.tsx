'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Article, Stage } from '@/types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [selectedStage, searchQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStage !== 'all') params.append('stage', selectedStage);
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      params.append('status', 'published');

      const res = await fetch(`/api/content?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setArticles(json.data);
      }
    } catch (e) {
      console.error('Error fetching articles', e);
    } finally {
      setLoading(false);
    }
  };

  const stageTabs = [
    { id: 'all', label: 'All Guidance' },
    { id: 'pregnancy', label: 'Pregnancy & Prenatal' },
    { id: 'postpartum', label: 'Postpartum & Fourth Trimester' },
    { id: 'baby_care', label: 'Newborn & Baby Care' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Clinical Information Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Evidence-Based Guidance for Parents & Caregivers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Every article published on SEVA is authored by maternal-child health specialists, thoroughly reviewed by clinical practitioners, and regularly updated to reflect current medical protocols.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Stage Filter Tabs */}
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Article Stage Categories">
          {stageTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selectedStage === tab.id}
              onClick={() => setSelectedStage(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedStage === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms, topics, care..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          Loading clinically reviewed articles...
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No articles match your criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your search terms or selecting another stage.</p>
          <button
            onClick={() => { setSelectedStage('all'); setSearchQuery(''); }}
            className="text-xs font-semibold text-rose-600 underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-rose-200 transition flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                    article.stage === 'pregnancy'
                      ? 'bg-amber-100 text-amber-800'
                      : article.stage === 'postpartum'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {article.stage.replace('_', ' ')}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readingTimeMinutes} min read
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-rose-600 transition leading-snug">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                {/* Urgent Warning flag indicator */}
                {article.urgentFlags && article.urgentFlags.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-[11px] text-rose-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Urgent Indicators:</span>{' '}
                      <span className="text-rose-700">{article.urgentFlags[0]}</span>
                    </div>
                  </div>
                )}

                {/* Topics */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {article.topics.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Clinical Attribution */}
              <div className="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1 text-teal-800 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{article.clinicalReviewer}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Reviewed {article.reviewDate}</span>
                </div>
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
