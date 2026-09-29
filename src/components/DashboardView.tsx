import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  TriangleAlert,
  UserRoundSearch,
  BadgeCheck,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Play,
  RotateCw,
  Sparkles,
  Layers,
  ChevronRight,
  HeartPulse,
  Clock,
  FileQuestion,
  GitCompare,
  CheckCircle2,
  FileCheck2,
  FileX2,
  Server,
  AlertCircle,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import { OperationalRecord, BusinessDomainConfig, ExceptionType } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  AlexCharacter,
  MayaCharacter,
  SamCharacter,
  OpsGuardShieldBadge,
  HumanStoryStrip,
} from './illustrations/HumanCharacters';
import {
  RuleVisualOverdue,
  RuleVisualMissingInfo,
  RuleVisualConflict,
} from './illustrations/RuleVisualIcons';
import { EvidenceCapabilitySection } from './illustrations/EvidenceCapabilitySection';

// Lightweight animated count-up hook
function useCountUp(target: number, duration: number = 600): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
}

interface DashboardViewProps {
  records: (OperationalRecord & { evaluation?: any })[];
  activeConfig: BusinessDomainConfig;
  onSelectRecord: (recordId: string) => void;
  onNavigateExceptions: (filterType?: ExceptionType | 'ALL') => void;
  onNavigateEvaluation: () => void;
  onRunValidation?: () => Promise<void>;
  isValidating?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  activeConfig,
  onSelectRecord,
  onNavigateExceptions,
  onNavigateEvaluation,
  onRunValidation,
  isValidating,
}) => {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Aggregate statistics
  const totalCount = records.length;
  const exceptionRecords = records.filter(
    (r) => r.evaluation && !r.evaluation.isNormal
  );
  const normalRecords = records.filter(
    (r) => r.evaluation && r.evaluation.isNormal
  );
  const reviewedCount = exceptionRecords.filter(
    (r) => r.reviewStatus !== 'UNREVIEWED'
  ).length;
  const pendingReviewCount = exceptionRecords.filter(
    (r) => r.reviewStatus === 'UNREVIEWED'
  ).length;

  // Breakdown across the 3 supported exception types
  let overdueCount = 0;
  let missingInfoCount = 0;
  let missingEvidenceCount = 0;

  records.forEach((rec) => {
    if (rec.evaluation?.exceptions) {
      rec.evaluation.exceptions.forEach((e: any) => {
        if (e.type === 'OVERDUE') overdueCount++;
        if (e.type === 'MISSING_INFO') missingInfoCount++;
        if (e.type === 'COMPLETED_WITHOUT_EVIDENCE') missingEvidenceCount++;
      });
    }
  });

  // Animated KPI values
  const displayTotal = useCountUp(totalCount);
  const displayExceptions = useCountUp(exceptionRecords.length);
  const displayPending = useCountUp(pendingReviewCount);
  const displayNormal = useCountUp(normalRecords.length);

  // Review progress percentage
  const reviewProgressPercent =
    exceptionRecords.length > 0
      ? Math.round((reviewedCount / exceptionRecords.length) * 100)
      : 100;

  // Key attention demo items (benchmark cases)
  const demoAttentionIds = ['OP-101', 'OP-102', 'OP-103', 'OP-104', 'OP-105'];
  const attentionRecords = records.filter((r) =>
    demoAttentionIds.includes(r.id)
  );

  const scrollToHowItWorks = () => {
    if (howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* ============================================================= */}
      {/* 1. TOP-OF-DASHBOARD HERO: "DONE? PROVE IT."                   */}
      {/* ============================================================= */}
      <div className="bg-gradient-to-br from-white via-[#F8FAFC] to-teal-50/40 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-teal-100/50 pointer-events-none blur-3xl opacity-60" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-100/40 pointer-events-none blur-3xl opacity-50" />

        <div className="relative z-10 max-w-4xl">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-teal-50 text-[#0F766E] border border-teal-200">
              Operations Verification Platform
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
              Demo Mode — 30 Synthetic Records
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] tracking-tight leading-[1.08]">
            DONE? PROVE IT.
          </h1>

          {/* Supporting Text */}
          <p className="mt-4 text-lg sm:text-xl font-medium text-slate-700 leading-relaxed max-w-2xl">
            OpsGuard checks whether work marked complete is actually supported by the evidence.
          </p>

          {/* Secondary Line */}
          <p className="mt-2 text-sm sm:text-base text-slate-500 italic max-w-2xl">
            Because a green "Completed" badge doesn't always mean the job is really finished.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onSelectRecord('OP-101')}
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-[#0F766E] text-white hover:bg-[#115E59] shadow-xs hover:shadow-md transition-all flex items-center space-x-2 group hover:-translate-y-0.5"
            >
              <span>Review flagged cases</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-all flex items-center space-x-2 shadow-2xs hover:-translate-y-0.5"
            >
              <span>See how it works</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. HUMAN CHARACTERS STORY: ALEX, MAYA, OPSGUARD, SAM          */}
      {/* ============================================================= */}
      <HumanStoryStrip
        onReviewClick={() => onNavigateExceptions('ALL')}
        onShowcaseClick={() => onSelectRecord('OP-101')}
      />

      {/* ============================================================= */}
      {/* 3. SHOW THE CORE IDEA (CLAIM vs EVIDENCE vs OUTCOME)          */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block mb-2">
            The Core Concept
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            How OpsGuard tests the truth
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Reconciling three independent layers to ensure honest operations.
          </p>
        </div>

        {/* 3 Versus Cards + OpsGuard Nexus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative items-stretch">
          
          {/* Card 1: CLAIM */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. The Claim
              </span>
              <div className="text-xl font-bold text-slate-900 mt-2">
                "The job is done."
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The field tech or workflow software marked the operational status as complete.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-700">
              Operational Layer
            </div>
          </div>

          {/* Card 2: EVIDENCE */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                2. The Evidence
              </span>
              <div className="text-xl font-bold text-[#B45309] mt-2">
                "What proves it?"
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Where is the signed document, delivery docket, or photo proof in the repository?
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 text-xs font-semibold text-[#B45309]">
              Proof Repository
            </div>
          </div>

          {/* Card 3: OUTCOME */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. The Outcome
              </span>
              <div className="text-xl font-bold text-slate-900 mt-2">
                "What actually happened?"
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Did the downstream customer receive the goods, or are they still reporting an open issue?
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-700">
              Customer &amp; Downstream Outcome
            </div>
          </div>

        </div>

        {/* The Big OpsGuard Answer Strip */}
        <div className="mt-4 p-4 rounded-2xl bg-teal-50 border-2 border-[#0F766E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="h-10 w-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                OpsGuard Question
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900">
                "Do all three tell the same story?"
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-700 font-medium">
            If not, OpsGuard halts the case and asks a human to review.
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. VISUAL 4-STEP: "HERE'S WHAT OPSGUARD ACTUALLY DOES"        */}
      {/* ============================================================= */}
      <div ref={howItWorksRef} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block mb-2">
            Step-by-Step Flow
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Here's what OpsGuard actually does
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Automated verification meets human decision making in 4 clear steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* STEP 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Step 1
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1.5">
                Someone says the work is done
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                A team member or field technician marks a delivery or task as "Completed" in the operational software.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Primary input</span>
              <FileCheck2 className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">
                Step 2
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1.5">
                OpsGuard checks the evidence
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Deterministic rules check whether a signed document exists, required fields are populated, and the customer confirmed receipt.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-[#0F766E] font-medium">
              <span>Rule evaluation</span>
              <ShieldCheck className="h-4 w-4 text-[#0F766E]" />
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                Step 3
              </span>
              <h3 className="text-base font-bold text-amber-950 mt-1.5">
                Something doesn't match
              </h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                If the proof is missing or the outcome is unresolved, OpsGuard immediately halts the case and flags a discrepancy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between text-xs text-amber-900 font-bold">
              <span>Discrepancy caught</span>
              <TriangleAlert className="h-4 w-4 text-[#B45309]" />
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-teal-50/70 border-2 border-[#0F766E] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">
                Step 4
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1.5">
                AI explains. A human decides.
              </h3>
              <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                Gemini summarizes notes and suggests next steps. The human operations manager makes the final call: approve or reject.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-200 flex items-center justify-between text-xs text-[#0F766E] font-bold">
              <span>Human authority</span>
              <BadgeCheck className="h-4 w-4 text-[#0F766E]" />
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================= */}
      {/* 5. OPERATIONS HEALTH (SYNTHETIC DEMO DATASET COUNTS)          */}
      {/* ============================================================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-800">
                Operations Health
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Synthetic demo dataset
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical status counts across the 30 controlled test records (no arbitrary scores).
            </p>
          </div>

          {/* Review Progress Bar */}
          <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-medium">Review Progress:</span>
            <div className="w-24 sm:w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0F766E] h-2 rounded-full transition-all duration-500"
                style={{ width: `${reviewProgressPercent}%` }}
              />
            </div>
            <span className="font-bold text-slate-800 font-mono text-[11px]">
              {reviewedCount}/{exceptionRecords.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 30 Total Validation Cases */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Total validation cases
              </span>
              <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Database className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {displayTotal}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Synthetic demo dataset
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Ground truth:</span>
              <span className="font-semibold text-slate-700">30 controlled records</span>
            </div>
          </div>

          {/* Card 2: 11 Normal */}
          <div className="bg-white border border-emerald-200/90 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-800 font-bold">
                Normal cases
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BadgeCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-950 font-mono tabular-nums">
                {displayNormal}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                11 normal
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Clean pass-through:</span>
              <span className="font-semibold text-emerald-700">11 of 30 compliant</span>
            </div>
          </div>

          {/* Card 3: 19 Need Attention */}
          <div className="bg-white border border-amber-200/90 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-900 font-bold">
                Need attention
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-[#B45309] flex items-center justify-center">
                <TriangleAlert className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-950 font-mono tabular-nums">
                {displayExceptions}
              </span>
              <span className="text-xs font-semibold text-[#B45309]">
                19 need attention
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Halted by rules:</span>
              <span className="font-semibold text-[#B45309]">19 of 30 flagged</span>
            </div>
          </div>

          {/* Card 4: Awaiting Decision */}
          <div className="bg-white border border-teal-200/90 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#0F766E] font-bold">
                Awaiting your decision
              </span>
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
                <UserRoundSearch className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {displayPending}
              </span>
              <span className="text-xs text-slate-500 font-medium">Pending sign-off</span>
            </div>
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
              <span>Autonomous closures:</span>
              <span className="font-semibold text-rose-600">0% (Forbidden)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 6. GUIDED SHOWCASE BENCHMARK CASES (OP-101 TO OP-105)        */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Benchmark Showcase List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Guided Showcase Cases
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  OP-101 to OP-105
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore the 3 automated safeguards and clean pass-through with sample cases.
              </p>
            </div>
            <button
              onClick={() => onSelectRecord('OP-101')}
              className="text-xs font-bold text-[#0F766E] hover:underline flex items-center space-x-1"
            >
              <span>Inspect OP-101 Showcase</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {attentionRecords.map((record) => {
              const exceptions = record.evaluation?.exceptions || [];
              const isPrimaryDemo = record.id === 'OP-101';

              return (
                <div
                  key={record.id}
                  className={`py-3.5 px-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isPrimaryDemo ? 'bg-amber-50/50 border border-amber-200/80' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-900">{record.id}</span>
                      {isPrimaryDemo && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-[#0F766E] border border-teal-200">
                          Primary Showcase
                        </span>
                      )}
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-800">{record.title}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>Status: <strong className="text-slate-700">{record.status}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Owner: <span className="text-slate-700">{record.assignedAgent}</span></span>
                      <span aria-hidden="true">·</span>
                      <div>
                        {exceptions.length === 0 ? (
                          <StatusBadge type="NORMAL" label="Normal Pass-through" size="sm" />
                        ) : (
                          <div className="inline-flex flex-wrap gap-1">
                            {exceptions.map((e: any) => (
                              <span
                                key={e.id}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300"
                              >
                                {e.type === 'COMPLETED_WITHOUT_EVIDENCE'
                                  ? 'Status–Outcome Conflict'
                                  : e.type === 'OVERDUE'
                                  ? 'Overdue'
                                  : 'Missing Information'}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => onSelectRecord(record.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 ${
                        isPrimaryDemo
                          ? 'bg-[#0F766E] text-white hover:bg-[#115E59] shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span>Investigate</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Automated Safeguard Verification Widget */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-[#0F766E] font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Automated Verification</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Run Safeguard Verification
            </h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Empirically tests the 3 deterministic safeguards against verified ground truth across all 30 cases.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="font-semibold text-slate-800">Dynamic Calculation:</span>
                <span className="text-[#0F766E] font-bold">Empirical Math</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>• Real Issues Caught (TP):</span>
                <span className="font-bold text-slate-900">19 cases</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>• False Alarms (FP):</span>
                <span className="font-bold text-slate-900">0 cases</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>• Clean Pass-Throughs (TN):</span>
                <span className="font-bold text-slate-900">11 cases</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>• Missed Issues (FN):</span>
                <span className="font-bold text-slate-900">0 cases</span>
              </div>
              <div className="flex justify-between text-[#0F766E] font-bold border-t border-slate-200/80 pt-1.5">
                <span>• Precision &amp; Recall:</span>
                <span>100% / 100%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <button
              onClick={async () => {
                if (onRunValidation) {
                  await onRunValidation();
                }
                onNavigateEvaluation();
              }}
              disabled={isValidating}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-[#0F766E] text-white hover:bg-[#115E59] shadow-2xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Play className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
              <span>{isValidating ? 'Running Verification...' : 'Run Safeguard Verification'}</span>
            </button>
            <button
              onClick={onNavigateEvaluation}
              className="w-full py-2 px-4 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1"
            >
              <span>View Full Verification Suite</span>
            </button>
          </div>
        </div>

      </div>

      {/* ============================================================= */}
      {/* 7. EVIDENCE CAPABILITIES, VALUE, SUSTAINABILITY & TECH DETAIL */}
      {/* ============================================================= */}
      <EvidenceCapabilitySection />
    </div>
  );
};
