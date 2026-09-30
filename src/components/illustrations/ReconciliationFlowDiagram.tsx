import React from 'react';
import {
  FileText,
  FileCheck2,
  FileX2,
  Server,
  ArrowRight,
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface ReconciliationFlowDiagramProps {
  primaryRecordLabel?: string;
  fulfilmentLabel?: string;
  downstreamLabel?: string;
  recordedStatus: string;
  hasFulfilmentEvidence: boolean;
  fulfilmentEvidenceDisplay: string;
  downstreamStatus: string;
  isStatusOutcomeConflict: boolean;
  reconciliationResult: string;
  caseId: string;
  isSimpleMode?: boolean;
}

export const ReconciliationFlowDiagram: React.FC<ReconciliationFlowDiagramProps> = ({
  primaryRecordLabel = 'Operational Record',
  fulfilmentLabel = 'Proof of completion',
  downstreamLabel = 'What happened next',
  recordedStatus,
  hasFulfilmentEvidence,
  fulfilmentEvidenceDisplay,
  downstreamStatus,
  isStatusOutcomeConflict,
  reconciliationResult,
  caseId,
  isSimpleMode = true,
}) => {
  // Plain-English visual status mappings matching requirement 1
  const caseSaysValue = 'Completed';
  
  const proofSaysValue = hasFulfilmentEvidence
    ? 'Verified completion evidence on file'
    : 'Missing required completion evidence';

  const outcomeSaysValue =
    downstreamStatus === 'Resolved' || downstreamStatus === 'RESOLVED'
      ? 'Verified customer delivery'
      : isStatusOutcomeConflict
      ? 'Unresolved / conflicting downstream outcome'
      : downstreamStatus || 'In Progress';

  const opsGuardFoundValue = isStatusOutcomeConflict
    ? 'Status–Outcome Conflict'
    : recordedStatus === 'COMPLETED' && hasFulfilmentEvidence
    ? 'Verified Compliant'
    : 'In Progress';

  return (
    <div
      className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden transition-all ${
        isStatusOutcomeConflict
          ? 'border-amber-300 ring-2 ring-amber-100'
          : 'border-slate-200'
      }`}
    >
      {/* Friendly Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-[#0F766E] border border-teal-200">
              Cross-System Comparison
            </span>
            {caseId === 'OP-101' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                Flagship Reconciliation Showcase
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            How OpsGuard tests the truth
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Reconciles three independent signals to catch premature case closures.
          </p>
        </div>

        <div className="text-left sm:text-right bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl">
          <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">The Core Question</span>
          <span className="text-xs font-bold text-slate-800">
            Does the recorded status match the real-world proof?
          </span>
        </div>
      </div>

      {/* 4 LARGE VISUAL CARDS CONNECTED WITH VISUAL ARROWS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative items-stretch">
        
        {/* CARD 1: CASE SAYS */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all relative group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Signal 1 · ERP / CRM
              </span>
              <div className="h-8 w-8 rounded-lg bg-slate-200/70 text-slate-700 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              CASE SAYS
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {caseSaysValue}
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Work was marked finished in the primary operational record.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Claimed Status</span>
            <span className="text-slate-800 font-bold">{caseSaysValue}</span>
          </div>
        </div>

        {/* CARD 2: PROOF SAYS */}
        <div
          className={`border rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all relative group ${
            !hasFulfilmentEvidence
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-emerald-50/50 border-emerald-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Signal 2 · Document Store
              </span>
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  !hasFulfilmentEvidence
                    ? 'bg-amber-100 text-[#B45309]'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {!hasFulfilmentEvidence ? (
                  <FileX2 className="h-4 w-4" />
                ) : (
                  <FileCheck2 className="h-4 w-4" />
                )}
              </div>
            </div>
            <div
              className={`text-xs font-bold uppercase tracking-wider ${
                !hasFulfilmentEvidence ? 'text-[#B45309]' : 'text-emerald-700'
              }`}
            >
              PROOF SAYS
            </div>
            <div
              className={`text-base sm:text-lg font-extrabold mt-1 tracking-tight leading-snug ${
                !hasFulfilmentEvidence ? 'text-[#B45309]' : 'text-emerald-900'
              }`}
            >
              {proofSaysValue}
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {!hasFulfilmentEvidence
                ? 'No signed delivery docket, client signature, or photographic upload found.'
                : 'Verified completion evidence on file.'}
            </p>
          </div>
          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${
              !hasFulfilmentEvidence
                ? 'border-amber-200 text-[#B45309]'
                : 'border-emerald-200 text-emerald-800'
            }`}
          >
            <span>Proof of completion</span>
            <span className="font-bold">{hasFulfilmentEvidence ? 'Verified' : 'Missing'}</span>
          </div>
        </div>

        {/* CARD 3: OUTCOME SAYS */}
        <div
          className={`border rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all relative group ${
            isStatusOutcomeConflict
              ? 'bg-rose-50/60 border-rose-300'
              : 'bg-slate-50/90 border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Signal 3 · Downstream Client
              </span>
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  isStatusOutcomeConflict
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-200/70 text-slate-700'
                }`}
              >
                <Server className="h-4 w-4" />
              </div>
            </div>
            <div
              className={`text-xs font-bold uppercase tracking-wider ${
                isStatusOutcomeConflict ? 'text-rose-800' : 'text-slate-500'
              }`}
            >
              OUTCOME SAYS
            </div>
            <div
              className={`text-base sm:text-lg font-extrabold mt-1 tracking-tight leading-snug ${
                isStatusOutcomeConflict ? 'text-rose-700' : 'text-slate-900'
              }`}
            >
              {outcomeSaysValue}
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {isStatusOutcomeConflict
                ? 'Downstream client has not confirmed resolution; ticket remains open.'
                : 'Client confirmed job completion successfully.'}
            </p>
          </div>
          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${
              isStatusOutcomeConflict
                ? 'border-rose-200 text-rose-900'
                : 'border-slate-200 text-slate-700'
            }`}
          >
            <span>What happened next</span>
            <span className="font-bold">{isStatusOutcomeConflict ? 'Unresolved' : 'Resolved'}</span>
          </div>
        </div>

        {/* CARD 4: OPSGUARD FOUND (CONVERGENCE CARD) */}
        <div
          className={`rounded-2xl p-5 border-2 flex flex-col justify-between shadow-xs transition-all relative group ${
            isStatusOutcomeConflict
              ? 'bg-gradient-to-br from-amber-50/90 via-white to-teal-50/40 border-[#0F766E] ring-2 ring-teal-100'
              : 'bg-emerald-50 border-emerald-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#0F766E] uppercase tracking-wider">
                Automated Convergence
              </span>
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  isStatusOutcomeConflict
                    ? 'bg-[#0F766E] text-white shadow-2xs'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isStatusOutcomeConflict ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <BadgeCheck className="h-4 w-4" />
                )}
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
              OPSGUARD FOUND
            </div>
            <div
              className={`text-xl font-extrabold mt-1 tracking-tight leading-snug ${
                isStatusOutcomeConflict ? 'text-amber-950' : 'text-emerald-950'
              }`}
            >
              {opsGuardFoundValue}
            </div>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
              {isStatusOutcomeConflict
                ? 'Case claimed completed, but proof is missing and the final outcome is unresolved.'
                : 'Recorded status agrees with proof and verified outcome.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-teal-200 flex items-center justify-between text-xs font-bold text-[#0F766E]">
            <span>System finding</span>
            <span className="flex items-center space-x-1">
              <span>{isStatusOutcomeConflict ? 'Conflict detected' : 'Pass-through'}</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>

      </div>

      {/* Visual Convergence Takeaway Callout */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <span className="font-bold text-slate-900">Convergence Summary:</span>
          <span>
            {isStatusOutcomeConflict
              ? 'Signals 1, 2, and 3 do not tell the same story. Premature closure was halted automatically.'
              : 'All 3 independent signals match. Case proceeds with clean pass-through.'}
          </span>
        </div>
        <div className="text-slate-500 font-semibold shrink-0">
          {isStatusOutcomeConflict ? 'Next step: Review AI advice below' : 'Status: Clean'}
        </div>
      </div>
    </div>
  );
};
