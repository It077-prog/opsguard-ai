import React from 'react';
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Sparkles,
  UserCheck,
  FileCheck2,
  Database,
  HelpCircle,
} from 'lucide-react';

export const OpsGuardDifferenceSection: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* 1. VISUAL COMPARISON: TYPICAL WORKFLOW VS OPSGUARD            */}
      {/* ------------------------------------------------------------- */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block mb-2">
            Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Typical workflow vs OpsGuard
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
            OpsGuard is designed around an additional reconciliation question: <strong className="text-[#0F766E]">Does the evidence agree?</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT: Typical Workflow */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Typical workflow
                </span>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Single-system assumption
                </span>
              </div>

              {/* Exact Bullets from Requirement 6 */}
              <div className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center space-x-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    Status says completed
                  </div>
                </div>

                <div className="flex justify-center text-slate-300">
                  <ArrowDown className="h-4 w-4" />
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center space-x-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    Record is accepted
                  </div>
                </div>

                <div className="flex justify-center text-slate-300">
                  <ArrowDown className="h-4 w-4" />
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-center space-x-3">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 text-[#B45309] flex items-center justify-center font-bold text-xs shrink-0">
                    !
                  </div>
                  <div className="text-xs font-bold text-amber-950">
                    Conflicting evidence may remain unnoticed
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
              Risk: Incomplete jobs get closed prematurely, leading to customer complaints or audit failures.
            </div>
          </div>

          {/* RIGHT: With OpsGuard */}
          <div className="bg-teal-50/40 border-2 border-[#0F766E]/70 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-teal-200/60 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  With OpsGuard
                </span>
                <span className="text-xs font-bold text-[#0F766E] bg-teal-100/70 px-2 py-0.5 rounded-full border border-teal-200">
                  7-step reconciliation
                </span>
              </div>

              {/* Exact Bullets from Requirement 6 */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white border border-teal-200 rounded-xl p-2.5 text-xs text-center">
                    <span className="text-[10px] font-bold text-teal-700 block">Step 1</span>
                    <span className="font-bold text-slate-900">Status checked</span>
                  </div>
                  <div className="bg-white border border-teal-200 rounded-xl p-2.5 text-xs text-center">
                    <span className="text-[10px] font-bold text-[#B45309] block">Step 2</span>
                    <span className="font-bold text-[#B45309]">Evidence checked</span>
                  </div>
                  <div className="bg-white border border-teal-200 rounded-xl p-2.5 text-xs text-center">
                    <span className="text-[10px] font-bold text-teal-700 block">Step 3</span>
                    <span className="font-bold text-slate-900">Outcome checked</span>
                  </div>
                </div>

                <div className="flex justify-center text-[#0F766E] py-0.5">
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>

                <div className="bg-white border border-amber-300 rounded-xl p-2.5 text-xs flex items-center space-x-2">
                  <span className="h-5 w-5 rounded-full bg-amber-100 text-[#B45309] flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
                  <span className="font-bold text-amber-950">Conflicts surfaced</span>
                </div>

                <div className="bg-white border border-indigo-200 rounded-xl p-2.5 text-xs flex items-center space-x-2">
                  <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">5</span>
                  <span className="font-bold text-indigo-950">AI explains context</span>
                </div>

                <div className="bg-white border border-[#0F766E] rounded-xl p-2.5 text-xs flex items-center space-x-2">
                  <span className="h-5 w-5 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-[10px] shrink-0">6</span>
                  <span className="font-bold text-[#0F766E]">Human decides</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 text-xs flex items-center space-x-2 text-emerald-950">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0">7</span>
                  <span className="font-bold">Decision enters audit trail</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-200/60 text-xs font-semibold text-[#0F766E]">
              Benefit: Stops premature closures cold, keeping humans in 100% control of the final outcome.
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HYBRID ARCHITECTURE (REQUIREMENT 7)                        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6">
        <div className="text-center max-w-xl mx-auto mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Hybrid Architecture
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            "Rules check the facts. AI explains the context. People stay in control."
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Rules → Facts */}
          <div className="bg-white border border-teal-200 rounded-xl p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto mb-2.5 border border-teal-200/60">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">
              Rules → Facts
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              Objective exception detection
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Deterministic code identifies discrepancies with 100% mathematical precision.
            </p>
          </div>

          {/* AI → Context */}
          <div className="bg-white border border-indigo-200 rounded-xl p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto mb-2.5 border border-indigo-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">
              AI → Context
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              Interpretation and recommendation
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Gemini analyzes notes, extracts nuances, and provides recommended next steps.
            </p>
          </div>

          {/* Human → Decision */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-2.5 border border-slate-200">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Human → Decision
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">
              Final operational judgement
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Supervisors hold final authority. Zero autonomous closures allowed.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
