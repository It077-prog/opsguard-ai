import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  TriangleAlert,
  Sparkles,
  UserCheck,
  Clock3,
  FileWarning,
  GitCompare,
  BadgeCheck,
  XCircle,
  ArrowRight,
  RotateCw,
  Info,
  Calendar,
  User,
  Building,
  Paperclip,
  Check,
  ChevronRight,
  AlertCircle,
  Database,
  ShieldAlert,
  Send,
  MessageSquare,
  FileText,
  Layers,
  ArrowDown,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Sparkle,
  ThumbsUp,
  ThumbsDown,
  PartyPopper,
} from 'lucide-react';
import {
  OperationalRecord,
  BusinessDomainConfig,
  AIAnalysisResult,
  ExceptionType,
} from '../types';
import { StatusBadge } from './StatusBadge';
import { ReconciliationFlowDiagram } from './illustrations/ReconciliationFlowDiagram';
import { IllustrationAiUnavailable } from './illustrations/EmptyStateIllustrations';
import { Op101HumanStoryStrip, SamCharacter } from './illustrations/HumanCharacters';
import { OpsGuardDifferenceSection } from './illustrations/OpsGuardDifferenceSection';

interface CaseInvestigationViewProps {
  record: OperationalRecord & { evaluation?: any };
  allRecords: (OperationalRecord & { evaluation?: any })[];
  activeConfig: BusinessDomainConfig;
  onSelectRecord: (recordId: string) => void;
  onSubmitDecision: (params: {
    recordId: string;
    exceptionType: ExceptionType;
    decision: 'APPROVED' | 'REJECTED';
    reviewerName: string;
    reviewerRole: string;
    notes: string;
  }) => Promise<void>;
  onAnalyzeCase: (recordId: string) => Promise<AIAnalysisResult>;
}

export const CaseInvestigationView: React.FC<CaseInvestigationViewProps> = ({
  record,
  allRecords,
  activeConfig,
  onSelectRecord,
  onSubmitDecision,
  onAnalyzeCase,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // UX Toggle: Simple Friendly Mode vs Technical In-Depth Mode
  const [isSimpleMode, setIsSimpleMode] = useState(true);

  // Expandable sections for progressive disclosure
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(true);
  const [isTechnicalDetailsOpen, setIsTechnicalDetailsOpen] = useState(false);
  const [showFullAiAnalysis, setShowFullAiAnalysis] = useState(false);
  const [isNoteInputVisible, setIsNoteInputVisible] = useState(false);

  // Active step highlight
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Human Decision Form State
  const [reviewerName, setReviewerName] = useState('Sarah Jenkins');
  const [reviewerRole, setReviewerRole] = useState('Operations Director');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recentDecisionType, setRecentDecisionType] = useState<'APPROVED' | 'REJECTED' | null>(null);

  // Refs for smooth scroll navigation between the 4 steps
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  const evaluation = record.evaluation;
  const exceptions = evaluation?.exceptions || [];
  const isNormal = evaluation?.isNormal || exceptions.length === 0;

  // Primary check for status-to-outcome conflict
  const isStatusOutcomeConflict = exceptions.some(
    (e: any) => e.type === 'COMPLETED_WITHOUT_EVIDENCE'
  );

  // Reconcile status & fulfilment evidence
  const hasFulfilmentEvidence = Boolean(
    record.completionEvidence &&
      (record.completionEvidence.verified || record.completionEvidence.documentId)
  );
  const recordedStatusDisplay = record.status;
  const fulfilmentEvidenceDisplay = hasFulfilmentEvidence
    ? record.completionEvidence?.evidenceType || 'Verified'
    : 'None uploaded';
  const downstreamStatusDisplay =
    record.downstreamStatus || (isStatusOutcomeConflict ? 'Unresolved' : 'Active');
  const reconciliationResult = isStatusOutcomeConflict
    ? 'Status–Outcome Conflict'
    : isNormal
    ? 'Normal Pass-through'
    : 'Discrepancy Flagged';

  // Load AI analysis when viewing flagged record
  useEffect(() => {
    let isCurrent = true;

    // Reset state on record switch
    setAiAnalysis(null);
    setAnalysisError(null);
    setSubmitSuccess(false);
    setRecentDecisionType(null);
    setActiveStep(1);

    if (record.reviewDecision) {
      setDecisionNotes(record.reviewDecision.notes || '');
      setReviewerName(record.reviewDecision.reviewerName || 'Sarah Jenkins');
      setReviewerRole(record.reviewDecision.reviewerRole || 'Operations Director');
    } else {
      setDecisionNotes('');
    }

    if (!isNormal) {
      setIsAnalyzing(true);
      onAnalyzeCase(record.id)
        .then((result) => {
          if (isCurrent) {
            setAiAnalysis(result);
            setIsAnalyzing(false);
          }
        })
        .catch((err) => {
          if (isCurrent) {
            setAnalysisError(err?.message || 'Failed to fetch AI analysis.');
            setIsAnalyzing(false);
          }
        });
    }

    return () => {
      isCurrent = false;
    };
  }, [record.id, isNormal]);

  const handleManualAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await onAnalyzeCase(record.id);
      setAiAnalysis(result);
    } catch (err: any) {
      setAnalysisError(err?.message || 'Failed to fetch AI analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!reviewerName.trim()) {
      alert('Please provide your name.');
      return;
    }

    const primaryExceptionType =
      exceptions.length > 0 ? exceptions[0].type : 'COMPLETED_WITHOUT_EVIDENCE';

    setIsSubmitting(true);
    try {
      await onSubmitDecision({
        recordId: record.id,
        exceptionType: primaryExceptionType,
        decision,
        reviewerName,
        reviewerRole,
        notes: decisionNotes.trim() || (decision === 'APPROVED' ? 'Approved based on operational review.' : 'Sent back for fulfillment verification.'),
      });
      setSubmitSuccess(true);
      setRecentDecisionType(decision);
      setActiveStep(4);
    } catch (err: any) {
      alert('Failed to submit decision: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNoteClick = () => {
    setIsNoteInputVisible(true);
    setTimeout(() => {
      notesTextareaRef.current?.focus();
    }, 100);
  };

  const scrollToStep = (stepNum: 1 | 2 | 3 | 4) => {
    setActiveStep(stepNum);
    const refMap = {
      1: step1Ref,
      2: step2Ref,
      3: step3Ref,
      4: step4Ref,
    };
    const targetRef = refMap[stepNum];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Find next unreviewed flagged case
  const nextFlaggedRecord = allRecords.find(
    (r) =>
      r.id !== record.id &&
      r.evaluation &&
      !r.evaluation.isNormal &&
      r.reviewStatus === 'UNREVIEWED'
  );

  // Plain-English Hero hook summary text
  const getHeroSummary = () => {
    if (isNormal) {
      return {
        headline: "Everything checks out.",
        whatHappened: "This case has verified completion proof and conforms to all operational policies.",
        whyFlagged: "No issues detected. Case passed all 3 deterministic safeguards cleanly.",
        aiSuggestion: "No action needed. Case is compliant.",
        nextStep: "Safe to archive or proceed to the next item.",
        healthStatus: "Healthy & Verified",
        healthColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      };
    }

    if (isStatusOutcomeConflict) {
      return {
        headline: "Something doesn't add up.",
        whatHappened: "This case says the work is complete, but the proof is missing and the final outcome is still unresolved.",
        whyFlagged: "The record was closed in the primary system, but there is zero proof of completion and the customer has not confirmed resolution.",
        aiSuggestion: aiAnalysis?.recommendedAction || "Hold case and request signed proof of delivery.",
        nextStep: "Review the AI advice and make your final decision (Approve or Send back).",
        healthStatus: "Status–Outcome Conflict",
        healthColor: "text-amber-900 bg-amber-50 border-amber-300",
      };
    }

    const hasOverdue = exceptions.some((e: any) => e.type === 'OVERDUE');
    if (hasOverdue) {
      return {
        headline: "Something doesn't add up.",
        whatHappened: "This case has passed its due date SLA without completion evidence.",
        whyFlagged: "Due date SLA expired while the case remained open.",
        aiSuggestion: aiAnalysis?.recommendedAction || "Escalate for immediate field dispatch.",
        nextStep: "Review SLA timeline and decide whether to extend or reassign.",
        healthStatus: "Overdue Delivery",
        healthColor: "text-amber-900 bg-amber-50 border-amber-300",
      };
    }

    return {
      headline: "Something doesn't add up.",
      whatHappened: "Essential case information like customer details or destination address is missing.",
      whyFlagged: "Mandatory operational fields were left blank upon creation.",
      aiSuggestion: aiAnalysis?.recommendedAction || "Contact assigning agent to complete required data.",
      nextStep: "Reject until missing fields are completed.",
      healthStatus: "Missing Information",
      healthColor: "text-amber-900 bg-amber-50 border-amber-300",
    };
  };

  const hero = getHeroSummary();

  const reconciliationLabels = {
    primaryRecord: activeConfig.reconciliationLabels?.primaryRecord || 'System 1 Record',
    fulfilmentAudit: activeConfig.reconciliationLabels?.fulfilmentEvidence || 'System 2 Proof',
    downstreamOutcome: activeConfig.reconciliationLabels?.downstreamStatus || 'Customer Outcome',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* ============================================================= */}
      {/* 1. TOP HERO SUMMARY CARD (THE HOOK)                           */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-base font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
              {record.id}
            </span>
            <span className="text-slate-300">·</span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {record.title}
            </h1>
            {record.id === 'OP-101' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-teal-100 text-[#0F766E] border border-teal-200">
                Primary Showcase Case
              </span>
            )}
          </div>

          {/* Simple vs Technical Mode Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setIsSimpleMode(true)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  isSimpleMode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Simple View
              </button>
              <button
                onClick={() => setIsSimpleMode(false)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  !isSimpleMode
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Technical View
              </button>
            </div>

            {/* Quick Switch Dropdown */}
            <select
              value={record.id}
              onChange={(e) => onSelectRecord(e.target.value)}
              className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 font-mono text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            >
              {allRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.title.slice(0, 26)}...
                  {r.evaluation?.isNormal ? ' (OK)' : ' (FLAGGED)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Plain-English Hook: Something doesn't add up */}
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${hero.healthColor}`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              <span>{hero.healthStatus}</span>
            </span>

            {/* Light gamification badges */}
            {exceptions.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                {exceptions.length} {exceptions.length === 1 ? 'issue found' : 'issues found'}
              </span>
            )}
            {!hasFulfilmentEvidence && record.status === 'COMPLETED' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
                Proof missing
              </span>
            )}
            {record.reviewStatus === 'UNREVIEWED' && !isNormal && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                Ready for your decision
              </span>
            )}
            {record.reviewStatus !== 'UNREVIEWED' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Review complete
              </span>
            )}
          </div>

          {/* Hook Headline & Supporting Explanation */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              {hero.headline}
            </h2>
            <p className="mt-1.5 text-base sm:text-lg font-medium text-slate-700 leading-relaxed max-w-4xl">
              {hero.whatHappened}
            </p>
          </div>

          {/* Guided Next Step Callout */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-2.5 text-xs sm:text-sm">
              <span className="font-extrabold text-[#0F766E] uppercase tracking-wider text-[11px] shrink-0 bg-white px-2 py-0.5 rounded-md border border-teal-200">
                Recommended Next Step
              </span>
              <span className="text-slate-800 font-semibold">{hero.nextStep}</span>
            </div>
            {!isNormal && (
              <button
                onClick={() => scrollToStep(4)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0F766E] text-white hover:bg-[#115E59] shadow-2xs transition-colors shrink-0 flex items-center space-x-1.5"
              >
                <span>Jump to Decision</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Key Quick Facts Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Assigned to:</span>
            <span className="font-semibold text-slate-800">{record.assignedAgent}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Department:</span>
            <span className="font-semibold text-slate-800">{record.department}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Due Target:</span>
            <span className="font-mono text-slate-800">
              {new Date(record.dueDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Status:</span>
            <span className="font-semibold text-slate-800">{record.status}</span>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. HUMAN STORY STRIP ON OP-101 (ALEX, MAYA, OPSGUARD, SAM)    */}
      {/* ============================================================= */}
      {(record.id === 'OP-101' || isStatusOutcomeConflict) && (
        <Op101HumanStoryStrip />
      )}

      {/* ============================================================= */}
      {/* 3. GUIDED REVIEW JOURNEY (HORIZONTAL STEPPER)                 */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Guided Review Journey
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {record.reviewStatus !== 'UNREVIEWED' ? 'Step 4 of 4: Review complete' : `Step ${activeStep} of 4`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          {/* Step 1 */}
          <button
            onClick={() => scrollToStep(1)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeStep === 1
                ? 'border-[#0F766E] bg-teal-50/70 ring-2 ring-[#0F766E]/40'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F766E]">Step 1</span>
              <Check className="h-3.5 w-3.5 text-[#0F766E]" />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">1. Spot the issue</div>
            <div className="text-xs text-slate-500 mt-0.5">What OpsGuard found</div>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => scrollToStep(2)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeStep === 2
                ? 'border-[#0F766E] bg-teal-50/70 ring-2 ring-[#0F766E]/40'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F766E]">Step 2</span>
              <Check className="h-3.5 w-3.5 text-[#0F766E]" />
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">2. Understand why</div>
            <div className="text-xs text-slate-500 mt-0.5">Proof vs Outcome</div>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => scrollToStep(3)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeStep === 3
                ? 'border-[#0F766E] bg-teal-50/70 ring-2 ring-[#0F766E]/40'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F766E]">Step 3</span>
              {aiAnalysis ? (
                <Check className="h-3.5 w-3.5 text-[#0F766E]" />
              ) : isAnalyzing ? (
                <RotateCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              )}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">3. Review AI advice</div>
            <div className="text-xs text-slate-500 mt-0.5">What AI thinks</div>
          </button>

          {/* Step 4 */}
          <button
            onClick={() => scrollToStep(4)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              activeStep === 4
                ? 'border-[#0F766E] bg-teal-50/70 ring-2 ring-[#0F766E]/40'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F766E]">Step 4</span>
              {record.reviewStatus !== 'UNREVIEWED' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-400" />
              )}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-1">4. Make your decision</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {record.reviewStatus !== 'UNREVIEWED' ? 'Review complete' : 'Ready for your decision'}
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. VISUAL STORYTELLING: RECONCILIATION FLOW (STEP 2)          */}
      {/* ============================================================= */}
      <div ref={step2Ref}>
        <ReconciliationFlowDiagram
          primaryRecordLabel={reconciliationLabels.primaryRecord}
          fulfilmentLabel="Proof of completion"
          downstreamLabel="What happened next"
          recordedStatus={recordedStatusDisplay}
          hasFulfilmentEvidence={hasFulfilmentEvidence}
          fulfilmentEvidenceDisplay={fulfilmentEvidenceDisplay}
          downstreamStatus={downstreamStatusDisplay}
          isStatusOutcomeConflict={isStatusOutcomeConflict}
          reconciliationResult={reconciliationResult}
          caseId={record.id}
          isSimpleMode={isSimpleMode}
        />
      </div>

      {/* ============================================================= */}
      {/* 5. THE 3 GUIDED SECTIONS:                                     */}
      {/*    - What OpsGuard found (Step 1)                            */}
      {/*    - AI reviewed the situation (Step 3)                       */}
      {/*    - You make the final call (Step 4)                         */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* PILLAR 1: WHAT OPSGUARD FOUND (Step 1)                    */}
        {/* ========================================================= */}
        <div
          ref={step1Ref}
          className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col h-full overflow-hidden hover:shadow-xs transition-shadow"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200/60">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F766E] block">Step 1</span>
                <h3 className="text-sm font-bold text-slate-900">
                  What OpsGuard found
                </h3>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200">
              Rule Check
            </span>
          </div>

          <div className="p-5 space-y-4 flex-1">
            {isNormal ? (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  <span>All checks passed</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  OpsGuard ran all 3 automated rules on this case. Everything conforms to business policies.
                </p>
                <div className="pt-2 text-[11px] font-medium border-t border-emerald-200/60 text-emerald-700 space-y-1">
                  <div>✓ Due date SLA check: On schedule</div>
                  <div>✓ Required information: Complete</div>
                  <div>✓ Proof of completion: Verified</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {exceptions.map((exc: any) => (
                  <div
                    key={exc.id}
                    className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center space-x-1.5">
                        <TriangleAlert className="h-4 w-4 text-[#B45309]" />
                        <span>
                          {exc.type === 'COMPLETED_WITHOUT_EVIDENCE'
                            ? 'Status–Outcome Conflict'
                            : exc.type === 'OVERDUE'
                            ? 'Overdue Work'
                            : 'Missing Information'}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">
                        RULE-0{exc.type === 'OVERDUE' ? '1' : exc.type === 'MISSING_INFO' ? '2' : '3'}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-medium">
                      {exc.message}
                    </p>

                    {/* Expandable Explanation */}
                    <div className="pt-1">
                      <button
                        onClick={() => setIsWhyFlaggedOpen(!isWhyFlaggedOpen)}
                        className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center space-x-1"
                      >
                        <span>{isWhyFlaggedOpen ? 'Hide explanation' : 'Why was this flagged?'}</span>
                        {isWhyFlaggedOpen ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </button>

                      {isWhyFlaggedOpen && (
                        <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-amber-200 text-[11px] text-slate-600 leading-relaxed">
                          {exc.type === 'COMPLETED_WITHOUT_EVIDENCE' && (
                            <span>
                              Rule 03 strictly prohibits marking work completed without verified proof of completion. This prevents unverified closures from hiding broken deliveries.
                            </span>
                          )}
                          {exc.type === 'OVERDUE' && (
                            <span>
                              Rule 01 flags cases that pass their promised delivery target to prevent SLA breaches from going unnoticed.
                            </span>
                          )}
                          {exc.type === 'MISSING_INFO' && (
                            <span>
                              Rule 02 mandates critical operational fields (customer name and destination address) before work can be processed.
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Collapsible Technical Details for engineers */}
            {!isSimpleMode && (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <button
                  onClick={() => setIsTechnicalDetailsOpen(!isTechnicalDetailsOpen)}
                  className="w-full px-3 py-2 bg-slate-50 text-slate-700 font-semibold flex items-center justify-between"
                >
                  <span>Technical Case Details</span>
                  {isTechnicalDetailsOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                {isTechnicalDetailsOpen && (
                  <div className="p-3 bg-white space-y-1.5 font-mono text-[11px] text-slate-600 border-t border-slate-200">
                    <div>recordId: "{record.id}"</div>
                    <div>status: "{record.status}"</div>
                    <div>hasVerifiedProof: {String(hasFulfilmentEvidence)}</div>
                    <div>customerName: "{record.requiredFields?.customerName || ''}"</div>
                    <div>destinationAddress: "{record.requiredFields?.destinationAddress || ''}"</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* PILLAR 2: AI REVIEWED THE SITUATION (Step 3)              */}
        {/* ========================================================= */}
        <div
          ref={step3Ref}
          className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col h-full overflow-hidden hover:shadow-xs transition-shadow"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-700 block">Step 3</span>
                <h3 className="text-sm font-bold text-slate-900">
                  What AI thinks
                </h3>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Advisory
            </span>
          </div>

          <div className="p-5 space-y-4 flex-1">
            {isNormal ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
                <div className="flex items-center space-x-1.5 font-semibold text-slate-700">
                  <Info className="h-4 w-4 text-slate-400" />
                  <span>AI Inactive for Normal Records</span>
                </div>
                <p className="leading-relaxed">
                  OpsGuard only calls Gemini when an issue is detected. Compliant cases proceed safely without AI compute.
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="p-8 text-center text-slate-500 space-y-3">
                <RotateCw className="h-6 w-6 animate-spin text-[#0F766E] mx-auto" />
                <p className="text-xs font-semibold text-slate-800">
                  AI is reviewing driver logs and notes...
                </p>
                <p className="text-xs text-slate-400">
                  Synthesizing root cause and safest recommendation.
                </p>
              </div>
            ) : analysisError ? (
              /* REQUIRED AI FALLBACK STATE */
              <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-xl text-xs space-y-3">
                <IllustrationAiUnavailable className="h-10 w-10 mx-auto text-amber-700" />
                <div className="text-center">
                  <span className="font-extrabold text-amber-950 block text-xs">
                    AI analysis unavailable — manual review required.
                  </span>
                  <div className="mt-2 text-left bg-white/90 p-2.5 rounded-lg border border-amber-200 text-[11px] text-slate-700 space-y-1">
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
                      <span>The exception remains active</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
                      <span>The rule result is still valid</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
                      <span>The human reviewer can continue to decide below</span>
                    </div>
                  </div>
                </div>
                <div className="pt-1 text-center">
                  <button
                    onClick={handleManualAnalyze}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0F766E] bg-white border border-teal-200 rounded-lg hover:bg-teal-50 inline-flex items-center space-x-1 shadow-2xs"
                  >
                    <RotateCw className="h-3 w-3" />
                    <span>Retry AI Advisory</span>
                  </button>
                </div>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-3 text-xs">
                {/* 1. Summary */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Summary
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {aiAnalysis.summary}
                  </p>
                </div>

                {/* 2. Why it matters */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Why it matters
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {aiAnalysis.whyItMatters || aiAnalysis.rootCauseHypothesis}
                  </p>
                </div>

                {/* 3. Conflicting evidence */}
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block mb-1">
                    Conflicting evidence
                  </span>
                  <p className="text-amber-950 font-semibold leading-relaxed">
                    {aiAnalysis.verifiedConflictingEvidence && aiAnalysis.verifiedConflictingEvidence.length > 0
                      ? aiAnalysis.verifiedConflictingEvidence.join(', ')
                      : (aiAnalysis.missingRequiredEvidence && aiAnalysis.missingRequiredEvidence.length > 0)
                      ? `Missing proof: ${aiAnalysis.missingRequiredEvidence.join(', ')}`
                      : (aiAnalysis.missingEvidenceIdentified && aiAnalysis.missingEvidenceIdentified.length > 0)
                      ? `Missing proof: ${aiAnalysis.missingEvidenceIdentified.join(', ')}`
                      : 'Status marked complete without verified completion document'}
                  </p>
                </div>

                {/* 4. Recommended action */}
                <div className="p-3.5 bg-teal-50/80 rounded-xl border border-teal-200">
                  <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider block mb-1">
                    Recommended action
                  </span>
                  <p className="text-slate-900 font-bold leading-relaxed">
                    {aiAnalysis.recommendedAction}
                  </p>
                </div>

                {/* 5. Confidence & 6. Why human review is needed */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Confidence
                    </span>
                    <span className="font-extrabold text-[#0F766E] text-sm">
                      {typeof aiAnalysis.confidenceScore === 'number'
                        ? `${Math.round(aiAnalysis.confidenceScore * 100)}%`
                        : (aiAnalysis.confidence || '95%')}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                      Why human review is needed
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px] line-clamp-2">
                      {aiAnalysis.humanReviewReason || 'Autonomous closure strictly 0%. Only human operators can verify evidence and approve cases.'}
                    </span>
                  </div>
                </div>

                {/* Show full AI analysis toggle */}
                <div className="pt-1">
                  <button
                    onClick={() => setShowFullAiAnalysis(!showFullAiAnalysis)}
                    className="text-xs font-semibold text-indigo-700 hover:underline flex items-center space-x-1"
                  >
                    <span>{showFullAiAnalysis ? 'Hide full AI analysis' : 'Show full AI analysis'}</span>
                    {showFullAiAnalysis ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>

                  {showFullAiAnalysis && (
                    <div className="mt-2.5 p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2 text-[11px]">
                      {aiAnalysis.missingRequiredEvidence && aiAnalysis.missingRequiredEvidence.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-800 block">Missing Documents:</span>
                          <ul className="list-disc pl-4 text-slate-700">
                            {aiAnalysis.missingRequiredEvidence.map((doc, idx) => (
                              <li key={idx}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="text-slate-500 italic">
                        *{aiAnalysis.caveats || 'Non-autonomous analysis. Requires human supervisor verification.'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              <span className="font-bold text-slate-700 block mb-0.5">Advisory Only:</span>
              AI explains context and recommends the safest action. Only people make the final call.
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PILLAR 3: YOU MAKE THE FINAL CALL (Step 4)                */}
        {/* ========================================================= */}
        <div
          ref={step4Ref}
          className="bg-white border-2 border-[#0F766E]/40 rounded-2xl shadow-xs flex flex-col h-full overflow-hidden hover:border-[#0F766E] transition-all"
        >
          {/* Header with Sam Illustration */}
          <div className="px-5 py-4 border-b border-teal-100 bg-teal-50/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SamCharacter className="w-10 h-10 shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#0F766E] block">Step 4</span>
                <h3 className="text-base font-extrabold text-slate-900">
                  You make the final call
                </h3>
              </div>
            </div>
            <span className="text-xs font-bold text-white bg-[#0F766E] px-2.5 py-1 rounded-lg shadow-2xs">
              Human Authority
            </span>
          </div>

          <div className="p-5 space-y-4 flex-1">
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                AI can recommend. Only you can approve or reject.
              </p>
              <p className="text-slate-500 text-[11px]">
                OpsGuard and Gemini do not close or approve cases autonomously.
              </p>
            </div>

            {/* Success Celebration Banner */}
            {submitSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-2 animate-slide-up">
                <div className="flex items-center space-x-2 font-bold text-emerald-800 text-sm">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Decision recorded</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Your decision has been logged to the immutable audit trail with your name, role, and timestamp.
                </p>
                {nextFlaggedRecord && (
                  <div className="pt-2 border-t border-emerald-200">
                    <button
                      onClick={() => onSelectRecord(nextFlaggedRecord.id)}
                      className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-[#0F766E] text-white hover:bg-[#115E59] shadow-2xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>Review Next Flagged Case ({nextFlaggedRecord.id})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Existing Recorded Decision Display */}
            {record.reviewStatus !== 'UNREVIEWED' && record.reviewDecision && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  record.reviewStatus === 'APPROVED'
                    ? 'bg-teal-50/70 border-teal-200 text-teal-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>DISPOSITION: {record.reviewStatus}</span>
                  <span className="text-xs font-mono text-slate-500">
                    {new Date(record.reviewDecision.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="leading-relaxed font-medium">"{record.reviewDecision.notes}"</p>
                <div className="text-xs text-slate-500 pt-1 border-t border-slate-200/50">
                  Signed by: {record.reviewDecision.reviewerName} ({record.reviewDecision.reviewerRole})
                </div>
              </div>
            )}

            {/* Decision Input Form */}
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0F766E] text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Your Role:
                  </label>
                  <input
                    type="text"
                    value={reviewerRole}
                    onChange={(e) => setReviewerRole(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0F766E] text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Note input textarea */}
              {(isNoteInputVisible || decisionNotes) && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Add note or reason:
                  </label>
                  <textarea
                    ref={notesTextareaRef}
                    rows={2}
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Add explanation for approving or rejecting..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0F766E] resize-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* 3 Explicit Action Buttons as specified in the prompt: */}
              {/* - Approve recommendation */}
              {/* - Send back for review */}
              {/* - Add note */}
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleDecision('APPROVED')}
                    className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-[#0F766E] text-white hover:bg-[#115E59] transition-all shadow-2xs hover:shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Approve recommendation</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleDecision('REJECTED')}
                    className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-2xs hover:shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Send back for review</span>
                  </button>
                </div>

                {!isNoteInputVisible && !decisionNotes && (
                  <button
                    type="button"
                    onClick={handleAddNoteClick}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                    <span>Add note</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================= */}
      {/* 6. WHAT MAKES OPSGUARD DIFFERENT & HYBRID MODEL SECTION       */}
      {/* ============================================================= */}
      <OpsGuardDifferenceSection />

    </div>
  );
};
