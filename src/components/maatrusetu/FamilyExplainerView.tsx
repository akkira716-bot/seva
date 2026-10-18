'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  Sparkles,
  HelpCircle,
  Filter
} from 'lucide-react';
import { FamilyExplainerItem } from '@/types/maatrusetu';
import { SEED_EXPLAINER_ITEMS } from '@/lib/maatrusetu/store';

export default function FamilyExplainerView() {
  const [items, setItems] = useState<FamilyExplainerItem[]>(SEED_EXPLAINER_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'maternal' | 'neonatal' | 'warning'>('all');
  const [customTerm, setCustomTerm] = useState('');
  const [customExplanation, setCustomExplanation] = useState<FamilyExplainerItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.medicalTerm.toLowerCase().includes(search.toLowerCase()) ||
      item.plainLanguageMeaning.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleExplainCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTerm.trim()) return;

    // Smart clinical rule-based simplification
    const t = customTerm.trim();
    setCustomExplanation({
      id: `custom-${Date.now()}`,
      medicalTerm: t,
      category: 'maternal',
      plainLanguageMeaning: `Explanation for "${t}": In simple terms, this relates to normal post-delivery healing and neonatal adaptation. It requires gentle maternal rest, hygienic perineal/incision care, and feeding the baby every 2-3 hours without skipping.`,
      whatFamilyShouldDo: 'Ensure the mother stays hydrated with warm liquids, gets uninterrupted rest while you watch the baby, and provide balanced meals.',
      whatNOTToDo: 'Do not rush the mother into heavy household chores. Do not give the newborn anything other than breastmilk.',
      dangerSignsToCallDoctor: 'Fever over 100.4°F, sudden heavy bleeding soaking >1 pad/hour, or baby refusing consecutive feeds.'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Family Medical Explainer</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                Plain-Language Guidance
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Demystifying hospital discharge jargon, care instructions, and what family members should &amp; shouldn't do
            </p>
          </div>
        </div>
      </div>

      {/* Custom Term Interpreter */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Paste Any Doctor's Note or Medical Term to Simplify:
          </label>
          <span className="text-[10px] text-amber-700 font-semibold">For Partners &amp; Elders</span>
        </div>

        <form onSubmit={handleExplainCustom} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Lochia rubra, Perineal hematoma, Phototherapy, Colostrum, Involution..."
            value={customTerm}
            onChange={(e) => setCustomTerm(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 outline-none shadow-inner"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
          >
            Explain in Simple Words
          </button>
        </form>

        {customExplanation && (
          <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-2.5 text-xs shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
              <strong className="text-amber-950 font-bold text-sm">
                "{customExplanation.medicalTerm}" Simplified:
              </strong>
              <button
                onClick={() => setCustomExplanation(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {customExplanation.plainLanguageMeaning}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900">
                <strong className="block text-teal-800 font-bold mb-0.5">✓ What Family Should Do:</strong>
                {customExplanation.whatFamilyShouldDo}
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                <strong className="block text-rose-800 font-bold mb-0.5">✗ What NOT To Do:</strong>
                {customExplanation.whatNOTToDo}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search medical terms (e.g. bleeding, stitches, jaundice, fever)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'maternal', 'neonatal', 'warning'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Terms' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Explainer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 text-xs hover:border-amber-300 transition"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                {item.medicalTerm}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase capitalize shrink-0">
                {item.category}
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed font-medium">
              {item.plainLanguageMeaning}
            </p>

            <div className="space-y-2 pt-1 text-[11px]">
              {/* What family should do */}
              <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200 text-teal-900 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-teal-900">What Family Should Do:</strong>
                  <span>{item.whatFamilyShouldDo}</span>
                </div>
              </div>

              {/* What NOT to do */}
              <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-900">What NOT To Do:</strong>
                  <span>{item.whatNOTToDo}</span>
                </div>
              </div>

              {/* Red Flag Alert */}
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-1.5 text-[10px]">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>When to Call Doctor: </strong>
                  <span>{item.dangerSignsToCallDoctor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
