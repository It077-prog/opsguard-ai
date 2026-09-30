import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  OperationalRecord,
  BusinessDomainConfig,
  AIAnalysisResult,
  ExceptionType,
} from '../types';

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
  onNavigateHome?: () => void;
  onNavigateHistory?: () => void;
  onNavigateCases?: () => void;
}

export const CaseInvestigationView: React.FC<CaseInvestigationViewProps> = ({
  record,
  allRecords,
  activeConfig,
  onSelectRecord,
  onSubmitDecision,
  onAnalyzeCase,
  onNavigateHome,
  onNavigateHistory,
  onNavigateCases,
}) => {
  // Step state: 'overview' | 'details' | 'summary' | 'decision'
  const [currentStep, setCurrentStep] = useState<'overview' | 'details' | 'summary' | 'decision'>('overview');

  // Toggle for collapsible "More case information ▾" on Details screen
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);

  // Toggle for collapsible "More details ▾" on AI Summary screen
  const [isMoreDetailsOpen, setIsMoreDetailsOpen] = useState(false);

  // Toggle for optional "View case details" on Normal Case screen (e.g. OP-104)
  const [showNormalDetails, setShowNormalDetails] = useState(false);

  // Selected decision option on Your Decision screen: 'APPROVE_COMPLETION' | 'KEEP_CASE_OPEN'
  const [selectedDecision, setSelectedDecision] = useState<'APPROVE_COMPLETION' | 'KEEP_CASE_OPEN'>('KEEP_CASE_OPEN');

  // AI Advisory state
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Human Decision Form State
  const [reviewerName, setReviewerName] = useState('Sarah Jenkins');
  const [reviewerRole, setReviewerRole] = useState('Operations Reviewer');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recentDecisionType, setRecentDecisionType] = useState<'APPROVED' | 'REJECTED' | null>(null);

  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  const evaluation = record.evaluation;
  const exceptions = evaluation?.exceptions || [];
  const isNormal = evaluation?.isNormal || exceptions.length === 0;

  const isStatusOutcomeConflict = exceptions.some(
    (e: any) => e.type === 'COMPLETED_WITHOUT_EVIDENCE'
  );

  const hasFulfilmentEvidence = Boolean(
    record.completionEvidence &&
      (record.completionEvidence.verified || record.completionEvidence.documentId)
  );

  // Helper for case title display
  const displayTitle =
    record.id === 'OP-101'
      ? 'Express Medical Consignment — Northstar Medical Centre'
      : record.requiredFields.customerName
      ? `${record.title} — ${record.requiredFields.customerName}`
      : record.title;

  // Helper for formatted status text
  const formatStatus = (status: string) => {
    if (status === 'COMPLETED') return 'Completed';
    if (status === 'IN_PROGRESS') return 'In Progress';
    if (status === 'OPEN') return 'Open';
    return status;
  };

  // Helper for clean dates (e.g. 27 September 2026)
  const formatDueDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Plain-English summary text for Step 1
  const getPlainEnglishSummary = () => {
    if (isNormal) {
      return 'This case has verified completion proof and conforms to operational standards.';
    }
    if (isStatusOutcomeConflict || record.id === 'OP-101') {
      return 'This case is marked complete, but the required completion proof is missing and the final outcome has not been confirmed.';
    }
    const hasOverdue = exceptions.some((e: any) => e.type === 'OVERDUE');
    if (hasOverdue) {
      return 'This case has passed its due date SLA without verified completion proof.';
    }
    return 'This case is missing required operational information needed to verify fulfillment.';
  };

  // Relevant operational note in plain English
  const getRelevantOperationalNote = () => {
    if (record.id === 'OP-101') {
      return 'Marked completed per driver verbal phone confirmation. Physical dock sign-off sheet pending photo upload. Recipient hospital has not confirmed receipt.';
    }

    if (record.operationalNotes && record.operationalNotes.length > 0) {
      // Find the most recent note
      const latestNote = record.operationalNotes[record.operationalNotes.length - 1];
      return latestNote.content;
    }

    return 'No additional operational notes logged for this record.';
  };

  // Plain-English visible summary for AI Summary screen
  const getAiVisibleSummary = () => {
    if (isNormal) {
      return 'The available information confirms this case meets all operational requirements.';
    }
    if (isStatusOutcomeConflict || record.id === 'OP-101') {
      return 'The available information suggests this case should be checked before it is accepted as complete.';
    }
    const hasOverdue = exceptions.some((e: any) => e.type === 'OVERDUE');
    if (hasOverdue) {
      return 'The available information suggests this case is past due and requires confirmation before closing.';
    }
    return 'The available information indicates essential details are missing and must be verified before proceeding.';
  };

  // Plain-English suggested next step for AI Summary screen
  const getAiSuggestedNextStep = () => {
    if (isNormal) {
      return 'No action needed. Safe to archive or proceed to the next item.';
    }
    if (isStatusOutcomeConflict || record.id === 'OP-101') {
      return 'Confirm the missing completion proof and check whether the final outcome has been resolved.';
    }
    const hasOverdue = exceptions.some((e: any) => e.type === 'OVERDUE');
    if (hasOverdue) {
      return 'Check carrier fulfillment status and confirm whether delivery has arrived.';
    }
    return 'Contact the assigning agent to collect required customer contact and address details.';
  };

  // Plain-English conflicting information for collapsed section
  const getConflictingInformation = () => {
    if (isNormal) return 'None. Records across systems match.';
    if (record.id === 'OP-101' || isStatusOutcomeConflict) {
      return 'The operational system records the case as "Completed", but Northstar Medical Centre reports the consignment has not been received.';
    }
    if (aiAnalysis?.verifiedConflictingEvidence && aiAnalysis.verifiedConflictingEvidence.length > 0) {
      return aiAnalysis.verifiedConflictingEvidence.join(' ');
    }
    return 'Operational status claims completion while external delivery confirmation remains open.';
  };

  // Plain-English missing supporting information for collapsed section
  const getMissingSupportingInformation = () => {
    if (isNormal) return 'None. Required evidence is verified on file.';
    if (record.id === 'OP-101' || isStatusOutcomeConflict) {
      return 'Physical dock sign-off sheet or delivery docket photograph has not been uploaded to the system.';
    }
    if (aiAnalysis?.missingRequiredEvidence && aiAnalysis.missingRequiredEvidence.length > 0) {
      return aiAnalysis.missingRequiredEvidence.join(' ');
    }
    return 'Required completion document or receipt verification is not attached.';
  };

  // Plain-English possible follow-up evidence for collapsed section
  const getPossibleFollowUpEvidence = () => {
    if (isNormal) return 'No follow-up required.';
    if (record.id === 'OP-101' || isStatusOutcomeConflict) {
      return 'Signed proof of delivery docket from Northstar Medical Centre dock receiver, or direct customer email confirming receipt.';
    }
    if (aiAnalysis?.possibleFollowUpEvidence && aiAnalysis.possibleFollowUpEvidence.length > 0) {
      return aiAnalysis.possibleFollowUpEvidence.join(' ');
    }
    return 'Signed customer receipt, courier delivery docket, or dispatch verification log.';
  };

  // Reset state on record switch
  useEffect(() => {
    let isCurrent = true;

    setCurrentStep('overview');
    setIsMoreInfoOpen(false);
    setIsMoreDetailsOpen(false);
    setShowNormalDetails(false);
    setSelectedDecision(record.reviewStatus === 'APPROVED' ? 'APPROVE_COMPLETION' : 'KEEP_CASE_OPEN');
    setAiAnalysis(null);
    setAnalysisError(null);
    setSubmitSuccess(false);
    setRecentDecisionType(null);

    if (record.reviewDecision) {
      setDecisionNotes(record.reviewDecision.notes || '');
      setReviewerName(record.reviewDecision.reviewerName || 'Sarah Jenkins');
      setReviewerRole(record.reviewDecision.reviewerRole || 'Operations Reviewer');
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
            setAnalysisError(err?.message || 'Failed to fetch advisory.');
            setIsAnalyzing(false);
          }
        });
    }

    return () => {
      isCurrent = false;
    };
  }, [record.id, isNormal]);

  // Handle Human Decision Submission
  const handleDecisionSubmit = async (overrideChoice?: 'APPROVE_COMPLETION' | 'KEEP_CASE_OPEN') => {
    const choice = overrideChoice || selectedDecision;
    const primaryExceptionType =
      exceptions.length > 0 ? exceptions[0].type : 'COMPLETED_WITHOUT_EVIDENCE';

    const decision: 'APPROVED' | 'REJECTED' =
      choice === 'APPROVE_COMPLETION' ? 'APPROVED' : 'REJECTED';

    setIsSubmitting(true);
    try {
      await onSubmitDecision({
        recordId: record.id,
        exceptionType: primaryExceptionType,
        decision,
        reviewerName,
        reviewerRole,
        notes:
          decisionNotes.trim() ||
          (decision === 'APPROVED'
            ? 'Approved completion based on operational review.'
            : 'Keeping case open for fulfillment verification.'),
      });
      setSubmitSuccess(true);
      setRecentDecisionType(decision);
    } catch (err: any) {
      alert('Failed to submit decision: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* ============================================================= */}
      {/* SCREEN 1: CASE OVERVIEW ("WHY DOES THIS NEED ATTENTION?")      */}
      {/* ============================================================= */}
      {currentStep === 'overview' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {record.id}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight mt-1">
                  {displayTitle}
                </h1>
              </div>

              {/* EXACTLY TWO STATUS CHIPS */}
              <div className="flex items-center space-x-2 shrink-0">
                {/* Chip 1: Completed */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {formatStatus(record.status)}
                </span>

                {/* Chip 2: Needs Attention / Normal */}
                {!isNormal ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-[#B45309] border border-amber-200">
                    Needs Attention
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Normal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Main Section */}
          {isNormal ? (
            /* Normal Case Screen (e.g. OP-104) */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-6 text-center animate-fade-in">
              {/* Emerald Check Icon */}
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 stroke-[2.5]" />
              </div>

              {/* Title & Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                  ✓ No issues found
                </h2>
                <p className="text-sm sm:text-base text-slate-700 max-w-md mx-auto leading-relaxed">
                  The available information is consistent and no review is required.
                </p>
              </div>

              {/* One Primary Button: Back to Cases */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    if (onNavigateCases) {
                      onNavigateCases();
                    } else if (onNavigateHome) {
                      onNavigateHome();
                    }
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0F766E] text-white font-bold text-sm hover:bg-[#115E59] shadow-xs transition-all flex items-center justify-center space-x-1.5 min-h-[48px]"
                >
                  <span>Back to Cases</span>
                </button>
              </div>

              {/* Optional: View case details */}
              <div className="pt-2">
                <button
                  onClick={() => setShowNormalDetails(!showNormalDetails)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors underline underline-offset-4 py-1"
                >
                  <span>{showNormalDetails ? 'Hide case details' : 'View case details'}</span>
                </button>
              </div>

              {/* Optional Expanded Case Details */}
              {showNormalDetails && (
                <div className="pt-6 border-t border-slate-100 text-left animate-slide-up">
                  <div className="flex flex-col space-y-3">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                      <span className="text-xs font-semibold text-slate-500 block">Current status</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{formatStatus(record.status)}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                      <span className="text-xs font-semibold text-slate-500 block">Owner</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{record.assignedAgent}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                      <span className="text-xs font-semibold text-slate-500 block">Due date</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{formatDueDate(record.dueDate)}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                      <span className="text-xs font-semibold text-slate-500 block">Completion proof</span>
                      <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                        {hasFulfilmentEvidence ? 'Verified on file' : 'Verified'}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                      <span className="text-xs font-semibold text-slate-500 block">Final outcome</span>
                      <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                        {record.downstreamStatus || 'Resolved'}
                      </span>
                    </div>
                    {getRelevantOperationalNote() && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                        <span className="text-xs font-semibold text-slate-500 block">Notes</span>
                        <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{getRelevantOperationalNote()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Flagged Case Screen: Why this needs attention */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight">
                  Why this needs attention
                </h2>
                <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
                  {getPlainEnglishSummary()}
                </p>

                {/* Multiple issue chips with clear visual separation (e.g. OP-105: Past due & Missing information) */}
                {exceptions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {exceptions.map((exc: any) => {
                      let label = 'Issue';
                      let color = 'bg-amber-50 text-[#B45309] border-amber-200';
                      if (exc.type === 'COMPLETED_WITHOUT_EVIDENCE') {
                        label = 'Status conflict';
                        color = 'bg-amber-100/70 text-amber-900 border-amber-300';
                      } else if (exc.type === 'OVERDUE') {
                        label = 'Past due';
                        color = 'bg-amber-50 text-[#B45309] border-amber-200';
                      } else if (exc.type === 'MISSING_INFO') {
                        label = 'Missing information';
                        color = 'bg-slate-100 text-slate-700 border-slate-200';
                      }
                      return (
                        <span
                          key={exc.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${color}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Three Simple Cards (Order: Status -> Evidence -> Outcome) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* 1. STATUS */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      STATUS
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
                      {formatStatus(record.status)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    What the system currently says.
                  </p>
                </div>

                {/* 2. EVIDENCE */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      EVIDENCE
                    </div>
                    <div className={`text-xl sm:text-2xl font-extrabold mt-2 tracking-tight ${
                      hasFulfilmentEvidence ? 'text-emerald-800' : 'text-[#B45309]'
                    }`}>
                      {hasFulfilmentEvidence ? 'Verified' : 'Missing'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    {hasFulfilmentEvidence
                      ? 'Required completion proof is attached.'
                      : 'Required completion proof was not found.'}
                  </p>
                </div>

                {/* 3. OUTCOME */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      OUTCOME
                    </div>
                    <div className={`text-xl sm:text-2xl font-extrabold mt-2 tracking-tight ${
                      isStatusOutcomeConflict || !hasFulfilmentEvidence
                        ? 'text-rose-700'
                        : 'text-slate-900'
                    }`}>
                      {isStatusOutcomeConflict || !hasFulfilmentEvidence ? 'Unresolved' : 'Active'}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                    The final result has not been confirmed.
                  </p>
                </div>
              </div>

              {/* Primary Action Button: Review details → */}
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F766E] text-white font-bold text-sm hover:bg-[#115E59] shadow-xs transition-all flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <span>Review details →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 2: CASE DETAILS (VERTICALLY STACKED FIELDS)            */}
      {/* ============================================================= */}
      {currentStep === 'details' && (
        <div className="space-y-6 animate-fade-in">
          {/* Navigation Bar / Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('overview')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to overview</span>
            </button>
            <span className="font-mono text-xs font-bold text-slate-400">
              {record.id}
            </span>
          </div>

          {/* Main Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            {/* Title & Question Subtitle */}
            <div>
              <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                Case Details
              </h1>
              <p className="text-sm font-medium text-[#64748B] mt-1">
                What information do I need to check?
              </p>
            </div>

            {/* Vertically Stacked Fields */}
            <div className="flex flex-col space-y-3 pt-2">
              {/* Field 1: Current status */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-500 block">
                  Current status
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {formatStatus(record.status)}
                </span>
              </div>

              {/* Field 2: Owner */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-500 block">
                  Owner
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {record.assignedAgent}
                </span>
              </div>

              {/* Field 3: Due date */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-500 block">
                  Due date
                </span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {formatDueDate(record.dueDate)}
                </span>
              </div>

              {/* Field 4: Completion proof */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-500 block">
                  Completion proof
                </span>
                <span className={`text-base font-bold mt-1 block ${
                  hasFulfilmentEvidence ? 'text-emerald-800' : 'text-[#B45309]'
                }`}>
                  {hasFulfilmentEvidence ? 'Verified on file' : 'Not available'}
                </span>
              </div>

              {/* Field 5: Final outcome */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-500 block">
                  Final outcome
                </span>
                <span className={`text-base font-bold mt-1 block ${
                  isStatusOutcomeConflict || !hasFulfilmentEvidence
                    ? 'text-rose-700'
                    : 'text-slate-900'
                }`}>
                  {isStatusOutcomeConflict || !hasFulfilmentEvidence ? 'Unresolved' : 'Active'}
                </span>
              </div>

              {/* Field 6: Notes */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">
                  Notes
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                  {getRelevantOperationalNote()}
                </p>
              </div>
            </div>

            {/* Collapsible: More case information ▾ */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsMoreInfoOpen(!isMoreInfoOpen)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1 transition-colors"
              >
                <span>More case information</span>
                {isMoreInfoOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {isMoreInfoOpen && (
                <div className="mt-3 p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3 text-xs animate-slide-up">
                  {record.requiredFields.customerName && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Customer / Organization:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {record.requiredFields.customerName}
                      </span>
                    </div>
                  )}

                  {record.requiredFields.contactPhone && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Contact Phone:
                      </span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {record.requiredFields.contactPhone}
                      </span>
                    </div>
                  )}

                  {record.requiredFields.destinationAddress && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Destination Address:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {record.requiredFields.destinationAddress}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Department:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {record.department}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block text-[11px]">
                        Priority:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {record.priority}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Primary Action: Continue to summary → */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => setCurrentStep('overview')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('summary')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F766E] text-white font-bold text-sm hover:bg-[#115E59] shadow-xs transition-all flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <span>Continue to summary →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 3: AI SUMMARY & FINAL DECISION                         */}
      {/* ============================================================= */}
      {currentStep === 'summary' && (
        <div className="space-y-6 animate-fade-in">
          {/* Navigation Bar / Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('details')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to case details</span>
            </button>
            <span className="font-mono text-xs font-bold text-slate-400">
              {record.id}
            </span>
          </div>

          {/* Main AI Summary Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
            {/* Title: AI Summary */}
            <div>
              <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                AI Summary
              </h1>

              {/* Short visible summary */}
              <p className="text-sm sm:text-base text-slate-800 mt-2 leading-relaxed font-normal">
                {getAiVisibleSummary()}
              </p>
            </div>

            {/* Suggested Next Step Box */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-4 sm:p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] block mb-1">
                Suggested next step
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {getAiSuggestedNextStep()}
              </p>
            </div>

            {/* Collapsible: More details ▾ */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsMoreDetailsOpen(!isMoreDetailsOpen)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1 transition-colors"
              >
                <span>More details</span>
                {isMoreDetailsOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {isMoreDetailsOpen && (
                <div className="mt-3 p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-4 text-xs animate-slide-up">
                  {/* 1. Conflicting information */}
                  <div>
                    <span className="font-bold text-slate-900 block text-xs mb-1">
                      Conflicting information
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {getConflictingInformation()}
                    </p>
                  </div>

                  {/* 2. Missing supporting information */}
                  <div>
                    <span className="font-bold text-slate-900 block text-xs mb-1">
                      Missing supporting information
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {getMissingSupportingInformation()}
                    </p>
                  </div>

                  {/* 3. Possible follow-up evidence */}
                  <div>
                    <span className="font-bold text-slate-900 block text-xs mb-1">
                      Possible follow-up evidence
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {getPossibleFollowUpEvidence()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Back & Primary Action "Make decision →" */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => setCurrentStep('details')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 text-center sm:text-left"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep('decision')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F766E] text-white font-bold text-sm hover:bg-[#115E59] shadow-xs transition-all flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <span>Make decision →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 4: HUMAN DECISION (FULL-WIDTH TOUCH ACTIONS)           */}
      {/* ============================================================= */}
      {currentStep === 'decision' && (
        <div className="space-y-6 animate-fade-in">
          {/* Navigation Bar / Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('summary')}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to AI Summary</span>
            </button>
            <span className="font-mono text-xs font-bold text-slate-400">
              {record.id}
            </span>
          </div>

          {submitSuccess ? (
            /* Post-Submission Simple Confirmation - ZERO Technical Logs */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-6 text-center max-w-lg mx-auto animate-slide-up">
              {/* Check Icon */}
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 stroke-[2.5]" />
              </div>

              {/* Title & Messages */}
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                  Decision Recorded ✓
                </h2>
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  {recentDecisionType === 'APPROVED'
                    ? `${record.id} completion has been approved.`
                    : `${record.id} will remain open.`}
                </p>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Your decision and note have been saved.
                </p>
              </div>

              {/* Only Two Main Actions: Next Case → & Back to Home */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {nextFlaggedRecord ? (
                  <button
                    onClick={() => onSelectRecord(nextFlaggedRecord.id)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0F766E] text-white font-bold text-xs sm:text-sm hover:bg-[#115E59] shadow-xs transition-all flex items-center justify-center space-x-1.5 min-h-[48px]"
                  >
                    <span>Next Case →</span>
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    if (onNavigateHome) {
                      onNavigateHome();
                    } else {
                      setCurrentStep('overview');
                    }
                  }}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center min-h-[48px] ${
                    nextFlaggedRecord
                      ? 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                      : 'bg-[#0F766E] text-white hover:bg-[#115E59] shadow-xs font-bold'
                  }`}
                >
                  <span>Back to Home</span>
                </button>
              </div>

              {/* Optional Small Link: View decision history */}
              {onNavigateHistory && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={onNavigateHistory}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center space-x-1 underline underline-offset-4 py-1"
                  >
                    <span>View decision history</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Dedicated Decision Screen */
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              {/* Page Title & Question */}
              <div>
                <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                  Your Decision
                </h1>
                <p className="text-sm font-medium text-[#64748B] mt-1">
                  What would you like to do?
                </p>
              </div>

              {/* REVIEWER NOTE */}
              <div className="space-y-2 pt-1">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 block">
                  Add a short reason for your decision
                </label>
                <textarea
                  ref={notesTextareaRef}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Add a brief reason or note for your team..."
                  rows={3}
                  className="w-full p-3.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-all"
                />
              </div>

              {/* FULL-WIDTH, TOUCH-FRIENDLY ACTIONS */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                {/* Action 1: Approve Completion */}
                <button
                  type="button"
                  onClick={() => handleDecisionSubmit('APPROVE_COMPLETION')}
                  disabled={isSubmitting}
                  className="w-full py-4 px-5 rounded-2xl bg-[#0F766E] text-white hover:bg-[#115E59] active:bg-[#042f2e] shadow-xs transition-all flex flex-col items-center justify-center min-h-[56px] text-center disabled:opacity-50"
                >
                  <span className="text-base font-extrabold tracking-tight">Approve Completion</span>
                  <span className="text-xs text-teal-100 font-normal mt-0.5">
                    Use when the available information is sufficient to accept this case as complete.
                  </span>
                </button>

                {/* Action 2: Keep Case Open */}
                <button
                  type="button"
                  onClick={() => handleDecisionSubmit('KEEP_CASE_OPEN')}
                  disabled={isSubmitting}
                  className="w-full py-4 px-5 rounded-2xl bg-amber-50 text-[#B45309] hover:bg-amber-100/80 active:bg-amber-100 border-2 border-amber-300 shadow-2xs transition-all flex flex-col items-center justify-center min-h-[56px] text-center disabled:opacity-50"
                >
                  <span className="text-base font-extrabold tracking-tight">Keep Case Open</span>
                  <span className="text-xs text-amber-900/80 font-normal mt-0.5">
                    Use when more evidence or action is required.
                  </span>
                </button>
              </div>

              {/* Back navigation */}
              <div className="pt-2 text-center sm:text-left">
                <button
                  onClick={() => setCurrentStep('summary')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 inline-flex items-center space-x-1"
                >
                  <span>← Back to AI Summary</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
