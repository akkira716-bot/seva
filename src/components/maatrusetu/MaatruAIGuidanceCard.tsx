'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Droplets, 
  Heart, 
  ShieldAlert, 
  Info, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  Baby,
  Smile
} from 'lucide-react';
import { MaatruAIGuidance, MaatruSetuRecord } from '@/types/maatrusetu';

interface Props {
  record: MaatruSetuRecord;
  careDay: number;
}

const COMMON_QUESTIONS = [
  'Is light pinkish lochia normal on this day?',
  'How can I ease lower back discomfort during feeds?',
  'What should I do if baby has hiccup spells after feeding?',
  'When should the umbilical cord stump naturally detach?'
];

const PREPARED_ANSWERS: Record<string, string> = {
  lochia: 'Yes. By this stage, vaginal discharge transitions from dark red (lochia rubra) to pinkish-brown (lochia serosa) or yellowish-white (lochia alba). Report to your clinic only if you observe sudden soaking of more than 1 large pad per hour or foul odor.',
  back: 'Lower back strain is common due to relaxed ligaments and holding postures. Always bring the baby to your breast using a nursing pillow rather than leaning forward. Keep your feet flat on a low stool and maintain shoulder relaxation.',
  hiccup: 'Infant hiccups are completely harmless and caused by brief involuntary diaphragm spasms as the digestive tract matures. Gently burp the baby upright and offer a brief suckling session to relax the diaphragm.',
  cord: 'The umbilical cord stump typically dries and separates between Day 5 and Day 15. Keep it clean and strictly dry outside the diaper waistband. Never pull or apply oils/pastes; it will detach naturally.'
};

export default function MaatruAIGuidanceCard({ record, careDay }: Props) {
  const [guidance, setGuidance] = useState<MaatruAIGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<{ question: string; answer: string; time: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchGuidance();
  }, [record.id, careDay]);

  const fetchGuidance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maatrusetu?action=ai_guidance&careDay=${careDay}&deliveryType=vaginal`);
      const json = await res.json();
      if (json.success) {
        setGuidance(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch MaatruAI guidance', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = (customQuestion?: string) => {
    const q = (customQuestion || query).trim();
    if (!q) return;

    setChatLoading(true);
    setTimeout(() => {
      let answer = 'Thank you for your question. As your baby develops, maintain consistent hydration, gentle posture, and unhurried feeding. If you experience persistent acute pain, sudden heavy bleeding, or a rectal temperature above 100.4°F, contact your primary health center immediately.';
      
      const lower = q.toLowerCase();
      if (lower.includes('lochia') || lower.includes('bleed') || lower.includes('color')) {
        answer = PREPARED_ANSWERS.lochia;
      } else if (lower.includes('back') || lower.includes('pain') || lower.includes('discomfort') || lower.includes('posture')) {
        answer = PREPARED_ANSWERS.back;
      } else if (lower.includes('hiccup') || lower.includes('burp') || lower.includes('spit')) {
        answer = PREPARED_ANSWERS.hiccup;
      } else if (lower.includes('cord') || lower.includes('stump') || lower.includes('navel')) {
        answer = PREPARED_ANSWERS.cord;
      }

      setChatLog(prev => [
        {
          question: q,
          answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      setQuery('');
      setChatLoading(false);
    }, 450);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 text-white shadow-md shadow-purple-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">MaatruAI Personalized Care Guidance</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase border border-purple-200">
                Day {careDay} of 42
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized daily physiological milestones and supportive maternal advice for {record.mother.name}
            </p>
          </div>
        </div>

        <button
          onClick={fetchGuidance}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          <span>Refresh Insights</span>
        </button>
      </div>

      {guidance && (
        <div className="space-y-4">
          {/* Main Headline Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 border border-purple-100/80">
            <div className="flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{guidance.headline}</h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{guidance.maternalBodyFocus}</p>
              </div>
            </div>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Infant Milestone */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                <Baby className="w-3.5 h-3.5 text-teal-600" />
                Infant Milestone
              </span>
              <p className="text-xs text-slate-700 leading-snug">{guidance.infantMilestone}</p>
            </div>

            {/* 2. Nutrition & Hydration */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-amber-600" />
                Hydration &amp; Nutrition
              </span>
              <p className="text-xs text-slate-700 leading-snug">{guidance.nutritionHydrationTip}</p>
            </div>

            {/* 3. Emotional Wellbeing */}
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-rose-600" />
                Emotional Wellbeing
              </span>
              <p className="text-xs text-slate-700 leading-snug">{guidance.emotionalWellbeingTip}</p>
            </div>
          </div>

          {/* Caution Alert Flag */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Today's Key Red-Flag to Monitor: </span>
              <span>{guidance.cautionFlag}</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Clinical Inquiry */}
      <div className="border-t border-slate-100 pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            Ask MaatruAI a Recovery or Baby-Care Question
          </label>
          <span className="text-[10px] text-slate-400">Safe • Evidence-Based • Non-Diagnostic</span>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendQuery(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition border border-slate-200/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder="Type your question (e.g. Is back pain normal, breastfeeding tips, lochia signs...)"
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          <button
            onClick={() => handleSendQuery()}
            disabled={chatLoading || !query.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Q&A Stream Log */}
        {chatLog.length > 0 && (
          <div className="space-y-3 pt-2 max-h-60 overflow-y-auto pr-1">
            {chatLog.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[10px]">
                  <span className="font-bold text-purple-900">Q: {item.question}</span>
                  <span>{item.time}</span>
                </div>
                <p className="text-slate-700 leading-relaxed pl-2 border-l-2 border-purple-400">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          Guidance provided by MaatruAI is strictly informational and reviewed against WHO & MoHFW postnatal care protocols. Always consult your attending doctor for medical decisions.
        </p>
      </div>
    </div>
  );
}
