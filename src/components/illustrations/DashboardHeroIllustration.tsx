import React from 'react';
import {
  FileText,
  FileX2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';

export const DashboardHeroIllustration: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-teal-900/5 via-slate-50 to-amber-500/5 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs relative overflow-hidden animate-slide-up">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#0F766E 1px, transparent 1px), radial-gradient(#B45309 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      />

      <div className="relative z-10">
        {/* Top Header Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/70">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-[#0F766E]" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#0F766E]">
              How OpsGuard Protects Operations in 5 Steps
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-600 font-medium">
              From automated conflict detection to your final human sign-off
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold shadow-2xs">
              Human Final Authority: 100%
            </span>
          </div>
        </div>

        {/* 5 Guided Stages in Plain English */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          
          {/* Stage 1: Case says */}
          <div className="bg-white/95 border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between group hover:border-[#0F766E]/50 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  Step 1
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block uppercase">
                  Case says:
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  Completed
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Operational system claims work was finished.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#0F766E] font-medium">
              <span>Status recorded</span>
              <ArrowRight className="h-3 w-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Stage 2: Proof says */}
          <div className="bg-white/95 border border-amber-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between group hover:border-[#B45309] transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-7 w-7 rounded-lg bg-amber-50 text-[#B45309] flex items-center justify-center border border-amber-200">
                  <FileX2 className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded">
                  Step 2
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-[#B45309] block uppercase">
                  Proof says:
                </span>
                <span className="text-sm font-bold text-[#B45309] block mt-0.5">
                  Missing
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                No signed docket, customer signature, or upload found.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-[#B45309] font-medium">
              <span>Proof gap found</span>
              <ArrowRight className="h-3 w-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Stage 3: What the system found */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-7 w-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-2xs">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded">
                  Step 3
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-900 block uppercase">
                  What the system found:
                </span>
                <span className="text-sm font-extrabold text-amber-950 block mt-0.5">
                  Conflict detected
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-snug font-medium">
                Deterministic rule halts premature closure immediately.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-[#B45309] font-bold">
              <span>Flagged for review</span>
              <ArrowRight className="h-3 w-3 text-[#B45309] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Stage 4: What AI thinks */}
          <div className="bg-white/95 border border-indigo-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between group hover:border-indigo-400 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  Step 4
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-700 block uppercase">
                  What AI thinks:
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  Advice &amp; Context
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Gemini reviews driver notes and recommends safest next step.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-700 font-medium">
              <span>Advisory only</span>
              <ArrowRight className="h-3 w-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Stage 5: Your final decision */}
          <div className="bg-teal-900/5 border border-[#0F766E]/40 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between group hover:border-[#0F766E] transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-7 w-7 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shadow-2xs">
                  <UserCheck className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold uppercase text-[#0F766E] bg-teal-100/70 px-1.5 py-0.5 rounded border border-teal-200/50">
                  Step 5
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-[#0F766E] block uppercase">
                  Your final decision:
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  Human Authority
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                You review the findings, decide, and save to the audit trail.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-teal-200/60 flex items-center justify-between text-xs text-[#0F766E] font-bold">
              <span>Approve / Reject</span>
              <BadgeCheck className="h-3.5 w-3.5 text-[#0F766E]" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
