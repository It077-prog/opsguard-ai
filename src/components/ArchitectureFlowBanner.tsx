import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  GitBranch,
  Sparkles,
  UserCheck,
  ScrollText,
  BadgeCheck,
  TriangleAlert,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CornerDownRight,
} from 'lucide-react';

export const ArchitectureFlowBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 mb-6 shadow-2xs">
      {/* Banner Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-md bg-teal-50 flex items-center justify-center text-[#0F766E]">
            <GitBranch className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-800">
              OpsGuard Architecture Pipeline
            </span>
            <span className="hidden md:inline text-xs text-slate-400 mx-2">·</span>
            <span className="hidden md:inline text-xs text-[#0F766E] font-medium">
              Deterministic Rules → Branching → Gemini Advisory → Human Governance → Audit Log
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 self-start sm:self-center transition-colors focus:outline-none"
        >
          <span>{isExpanded ? 'Hide Architecture Contract' : 'View Architecture Contract'}</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Visual Workflow Cards with Obvious Branching */}
      <div className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          
          {/* Step 1: Operational Record (2 cols) */}
          <div className="lg:col-span-2 border border-slate-200 bg-slate-50/70 rounded-lg p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs mb-1">
                <Database className="h-3.5 w-3.5 text-slate-600" />
                <span>1. Operational Record</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Ingests primary case status, timestamps, and payload metadata.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Source System</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </div>
          </div>

          {/* Step 2: Deterministic Rules (2 cols) */}
          <div className="lg:col-span-2 border border-teal-200 bg-teal-50/40 rounded-lg p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-[#0F766E] font-bold text-xs mb-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0F766E]" />
                <span>2. Deterministic Rules</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Evaluates 3 mathematical checks: Status–Outcome Conflict, Overdue, Missing Info.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-teal-200/50 flex items-center justify-between text-[10px] text-[#0F766E] font-mono">
              <span>Mathematical Code</span>
              <ArrowRight className="h-3 w-3 text-[#0F766E]" />
            </div>
          </div>

          {/* Step 3: Branching / Decision Fork (3 cols) */}
          <div className="lg:col-span-3 border border-amber-200/80 bg-amber-50/30 rounded-lg p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-amber-950 font-bold text-xs mb-1.5">
                <GitBranch className="h-3.5 w-3.5 text-[#B45309]" />
                <span>3. Exception Found?</span>
              </div>

              {/* Fork Branches */}
              <div className="space-y-1.5 text-[11px]">
                {/* Branch A: No Exception */}
                <div className="flex items-center space-x-1.5 bg-emerald-50/80 border border-emerald-200/80 rounded px-2 py-1 text-emerald-800">
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[10px] font-mono">NO:</span>
                  <span className="truncate">Normal → Pass-through</span>
                </div>

                {/* Branch B: Exception Found */}
                <div className="flex items-center space-x-1.5 bg-amber-100/70 border border-amber-300/80 rounded px-2 py-1 text-amber-900">
                  <TriangleAlert className="h-3.5 w-3.5 text-[#B45309] shrink-0" />
                  <span className="font-semibold text-[10px] font-mono">YES:</span>
                  <span className="truncate">Flagged → Triggers AI Review</span>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-[#B45309] font-mono">
              <span>Exception Fork</span>
              <ArrowRight className="h-3 w-3 text-[#B45309]" />
            </div>
          </div>

          {/* Step 4: Gemini Context Advisory (3 cols) */}
          <div className="lg:col-span-3 border border-indigo-200 bg-indigo-50/30 rounded-lg p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-indigo-950 font-bold text-xs mb-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>4. Gemini Context Advisory</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Synthesizes unstructured notes, root cause, and safest next step.
                <em className="block text-[10px] text-indigo-800 font-medium not-italic mt-0.5">
                  Advisory only — strictly zero autonomous closure.
                </em>
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-indigo-200/60 flex items-center justify-between text-[10px] text-indigo-700 font-mono">
              <span>Contextual AI</span>
              <ArrowRight className="h-3 w-3 text-indigo-500" />
            </div>
          </div>

          {/* Step 5: Human Decision & Audit Trail (2 cols) */}
          <div className="lg:col-span-2 border border-slate-200 bg-slate-50/70 rounded-lg p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs mb-1">
                <UserCheck className="h-3.5 w-3.5 text-slate-700" />
                <span>5. Human Decision</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Operator verifies &amp; issues Approve / Reject disposition.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center space-x-1 text-[10px] text-slate-600 font-mono">
              <ScrollText className="h-3 w-3 text-slate-500" />
              <span>Audit Log Record</span>
            </div>
          </div>

        </div>
      </div>

      {/* Expanded Architecture Contract */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2 bg-slate-50/70 p-3.5 rounded-lg">
          <div className="font-semibold text-slate-800">System Safety &amp; Role Boundary Guarantees:</div>
          <ul className="list-disc pl-4 space-y-1 text-slate-600">
            <li>
              <strong>Case-to-Outcome Reconciliation:</strong> Reconciles operational status with fulfilment evidence to identify work that appears complete in one system but remains unresolved or unsupported in another.
            </li>
            <li>
              <strong>Deterministic Primacy:</strong> Gemini never decides whether an exception exists. Only deterministic mathematical code flags an exception.
            </li>
            <li>
              <strong>Context Analysis Only:</strong> Gemini is invoked <em>strictly after</em> an exception is flagged, analyzing messy unstructured logs and notes.
            </li>
            <li>
              <strong>Non-Autonomous Constraint:</strong> Gemini is barred from closing cases, altering records, or approving its own recommendations.
            </li>
            <li>
              <strong>Resilient Fallback:</strong> If Gemini is unreachable or errors out, system renders: <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono text-[11px]">AI analysis unavailable — manual review required.</code>
            </li>
            <li>
              <strong>Auditable Governance:</strong> Every detection, AI analysis, and human Approve/Reject action is recorded in a chronological audit trail.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
