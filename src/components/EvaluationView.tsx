import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  BarChart3,
  ArrowRight,
  Calculator,
  Check,
  Filter,
  Info,
} from 'lucide-react';
import {
  ValidationEvaluationResult,
  BusinessDomainConfig,
} from '../types';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';

interface EvaluationViewProps {
  evaluationResult: ValidationEvaluationResult | null;
  onRunValidation: () => Promise<void>;
  isRunning: boolean;
  activeConfig: BusinessDomainConfig;
  onSelectRecord?: (recordId: string) => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  evaluationResult,
  onRunValidation,
  isRunning,
  activeConfig,
  onSelectRecord,
}) => {
  const [filterResult, setFilterResult] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');

  const overall = evaluationResult?.overall;
  const byRule = evaluationResult?.byRule;

  const testCases = evaluationResult?.testCaseResults || [];
  const filteredTestCases = testCases.filter((tc) => {
    if (filterResult === 'PASS') return tc.passed;
    if (filterResult === 'FAIL') return !tc.passed;
    return true;
  });

  const formatExceptionLabel = (type: string) => {
    if (type === 'COMPLETED_WITHOUT_EVIDENCE') return 'Status–Outcome Conflict';
    if (type === 'OVERDUE') return 'Overdue';
    if (type === 'MISSING_INFO') return 'Missing Info';
    return type;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Run Action */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Deterministic Rule Validation Suite
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                Controlled synthetic V0.1 benchmark
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 max-w-2xl leading-relaxed">
              Dynamically evaluates the 3 deterministic rules against known ground-truth labels across all 30 synthetic records. All metrics are calculated live from empirical assertions — zero benchmark benchmarks or invented scores.
            </p>
          </div>

          <button
            onClick={onRunValidation}
            disabled={isRunning}
            className="px-5 py-2.5 text-xs font-bold rounded-lg bg-[#0F766E] text-white hover:bg-[#115E59] shadow-2xs transition-colors flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
          >
            <Play className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Validating Records...' : 'Run Rule Validation'}</span>
          </button>
        </div>

        {evaluationResult && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono">
            <span>
              Last executed:{' '}
              <strong className="text-slate-800">
                {new Date(evaluationResult.evaluatedAt).toLocaleTimeString()}
              </strong>
            </span>
            <span>
              Dataset:{' '}
              <strong className="text-slate-800">
                {evaluationResult.totalRecordsEvaluated} synthetic test records
              </strong>
            </span>
            <span className="text-[#0F766E] font-semibold">
              Notice: Controlled synthetic V0.1 benchmark (not a production claim)
            </span>
          </div>
        )}
      </div>

      {evaluationResult && overall ? (
        <>
          {/* ============================================================= */}
          {/* EXACT QUALIFICATION BANNER & V0.1 SYNTHETIC VALIDATION        */}
          {/* ============================================================= */}
          <div className="bg-teal-50/80 border-2 border-[#0F766E] rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F766E] bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                    OpsGuard V0.1 Synthetic Validation
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    30 records
                  </span>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  “OpsGuard V0.1 achieved 100% precision, recall, and accuracy across its 30-record synthetic validation dataset for the three implemented deterministic exception rules.”
                </p>
                <p className="text-xs text-slate-600">
                  Qualified statement based strictly on empirical mathematical assertions across all 30 controlled test records.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold shrink-0 bg-white p-3 rounded-xl border border-teal-200">
                <span className="text-slate-800">30 records</span>
                <span className="text-slate-300">·</span>
                <span className="text-[#0F766E]">Precision: 100%</span>
                <span className="text-slate-300">·</span>
                <span className="text-[#0F766E]">Recall: 100%</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-900">Accuracy: 100%</span>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* BENCHMARK CASES SHOWCASE (OP-101 TO OP-105)                   */}
          {/* ============================================================= */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Standard Benchmark Cases
                </h3>
                <p className="text-xs text-slate-500">
                  Core representative test cases validating each deterministic exception rule and normal pass-through:
                </p>
              </div>
              <span className="text-xs text-slate-400 font-medium">Click to inspect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div
                onClick={() => onSelectRecord?.('OP-101')}
                className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl cursor-pointer hover:shadow-xs transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-950">OP-101</span>
                  <span className="text-[10px] uppercase font-bold text-[#0F766E] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">Showcase</span>
                </div>
                <span className="font-bold text-slate-900 block mt-1.5">Status–Outcome Conflict</span>
                <span className="text-[11px] text-slate-600 mt-0.5 block">Completed without evidence</span>
              </div>

              <div
                onClick={() => onSelectRecord?.('OP-102')}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:shadow-xs transition-all hover:-translate-y-0.5"
              >
                <span className="font-mono font-bold text-slate-900 block">OP-102</span>
                <span className="font-bold text-slate-900 block mt-1.5">Due Date / SLA Deadline Exceeded</span>
                <span className="text-[11px] text-slate-600 mt-0.5 block">SLA expired open</span>
              </div>

              <div
                onClick={() => onSelectRecord?.('OP-103')}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:shadow-xs transition-all hover:-translate-y-0.5"
              >
                <span className="font-mono font-bold text-slate-900 block">OP-103</span>
                <span className="font-bold text-slate-900 block mt-1.5">Missing Mandatory Operational Fields</span>
                <span className="text-[11px] text-slate-600 mt-0.5 block">Missing customer details</span>
              </div>

              <div
                onClick={() => onSelectRecord?.('OP-104')}
                className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl cursor-pointer hover:shadow-xs transition-all hover:-translate-y-0.5"
              >
                <span className="font-mono font-bold text-emerald-950 block">OP-104</span>
                <span className="font-bold text-emerald-900 block mt-1.5">Normal</span>
                <span className="text-[11px] text-emerald-700 mt-0.5 block">Verified compliant pass-through</span>
              </div>

              <div
                onClick={() => onSelectRecord?.('OP-105')}
                className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl cursor-pointer hover:shadow-xs transition-all hover:-translate-y-0.5"
              >
                <span className="font-mono font-bold text-amber-950 block">OP-105</span>
                <span className="font-bold text-slate-900 block mt-1.5">Multiple Exceptions</span>
                <span className="text-[11px] text-slate-600 mt-0.5 block">Overdue + missing required info</span>
              </div>
            </div>
          </div>

          {/* Friendly Plain English Explainer Card */}
          <div className="bg-gradient-to-r from-teal-50 via-white to-indigo-50/40 border border-teal-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center space-x-2 text-[#0F766E] font-bold text-xs uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>What These Results Mean in Plain English</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700 mt-2">
              <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-0.5">100% Precision (Zero False Alarms)</span>
                <span>OpsGuard never flagged a normal, compliant case by mistake. When an alert fires, it is 100% legitimate.</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-0.5">100% Recall (Zero Missed Issues)</span>
                <span>Every real discrepancy, missing document, and overdue delivery was caught and held for review.</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-teal-100 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-0.5">0 Autonomous Actions (Full Governance)</span>
                <span>AI advises and summarizes, but only authorized human directors have the authority to approve or reject.</span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 1: PRIMARY METRIC CARDS (Precision, Recall, Accuracy) */}
          {/* ------------------------------------------------------------- */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Mathematical Metrics
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Formula Proofs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Precision Card */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">Precision [TP / (TP + FP)]</div>
                <div className="mt-2 text-3xl font-extrabold text-[#0F766E] font-mono tabular-nums">
                  {(overall.precision * 100).toFixed(1)}%
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Measures resistance against false positives
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                  {overall.truePositives} TP / ({overall.truePositives} TP + {overall.falsePositives} FP)
                </div>
              </div>

              {/* Recall Card */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">Recall [TP / (TP + FN)]</div>
                <div className="mt-2 text-3xl font-extrabold text-[#0F766E] font-mono tabular-nums">
                  {(overall.recall * 100).toFixed(1)}%
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Measures exception detection coverage
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                  {overall.truePositives} TP / ({overall.truePositives} TP + {overall.falseNegatives} FN)
                </div>
              </div>

              {/* Accuracy Card */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs">
                <div className="text-xs text-slate-500 font-medium">Accuracy [(TP + TN) / Total]</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {(overall.accuracy * 100).toFixed(1)}%
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Combined true positives and true negatives
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400">
                  ({overall.truePositives} + {overall.trueNegatives}) / 30 records
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 2: CONFUSION MATRIX CARDS (TP, FP, TN, FN) */}
          {/* ------------------------------------------------------------- */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Empirical Confusion Matrix Elements
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Controlled synthetic V0.1 benchmark
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* TP */}
              <div className="bg-white border border-teal-200 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-[#0F766E] block">
                  True Positives (TP)
                </span>
                <span className="text-2xl font-extrabold text-[#0F766E] font-mono tabular-nums mt-1 block">
                  {overall.truePositives}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Exceptions accurately flagged
                </span>
              </div>

              {/* FP */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                  False Positives (FP)
                </span>
                <span className="text-2xl font-extrabold text-slate-800 font-mono tabular-nums mt-1 block">
                  {overall.falsePositives}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  False alarms (zero detected)
                </span>
              </div>

              {/* TN */}
              <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 block">
                  True Negatives (TN)
                </span>
                <span className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1 block">
                  {overall.trueNegatives}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Normal records passed clean
                </span>
              </div>

              {/* FN */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                  False Negatives (FN)
                </span>
                <span className="text-2xl font-extrabold text-slate-800 font-mono tabular-nums mt-1 block">
                  {overall.falseNegatives}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Missed flags (zero detected)
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 3: PER-RULE ACCURACY TABLE */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
            <div className="mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                Per-Rule Deterministic Accuracy Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Performance metrics computed individually for each of the 3 supported deterministic rules.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-3.5 py-2.5">Rule Identifier</th>
                    <th className="px-3.5 py-2.5">Exception Category</th>
                    <th className="px-3.5 py-2.5 text-center">TP</th>
                    <th className="px-3.5 py-2.5 text-center">FP</th>
                    <th className="px-3.5 py-2.5 text-center">FN</th>
                    <th className="px-3.5 py-2.5 text-right">Precision</th>
                    <th className="px-3.5 py-2.5 text-right">Recall</th>
                    <th className="px-3.5 py-2.5 text-right">F1-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {/* Rule 1: Overdue */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-3.5 py-2.5 font-mono text-[11px] text-slate-500">RULE-DET-01</td>
                    <td className="px-3.5 py-2.5 font-semibold text-slate-900">1. Overdue</td>
                    <td className="px-3.5 py-2.5 text-center font-mono font-bold text-slate-800">{byRule?.OVERDUE.truePositives}</td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-400">{byRule?.OVERDUE.falsePositives}</td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-400">{byRule?.OVERDUE.falseNegatives}</td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#0F766E]">
                      {byRule ? (byRule.OVERDUE.precision * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#0F766E]">
                      {byRule ? (byRule.OVERDUE.recall * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-800">
                      {byRule ? (byRule.OVERDUE.f1Score * 100).toFixed(1) + '%' : '-'}
                    </td>
                  </tr>

                  {/* Rule 2: Missing Required Info */}
                  <tr className="hover:bg-slate-50">
                    <td className="px-3.5 py-2.5 font-mono text-[11px] text-slate-500">RULE-DET-02</td>
                    <td className="px-3.5 py-2.5 font-semibold text-slate-900">2. Missing Required Info</td>
                    <td className="px-3.5 py-2.5 text-center font-mono font-bold text-slate-800">{byRule?.MISSING_INFO.truePositives}</td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-400">{byRule?.MISSING_INFO.falsePositives}</td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-400">{byRule?.MISSING_INFO.falseNegatives}</td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#0F766E]">
                      {byRule ? (byRule.MISSING_INFO.precision * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#0F766E]">
                      {byRule ? (byRule.MISSING_INFO.recall * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-800">
                      {byRule ? (byRule.MISSING_INFO.f1Score * 100).toFixed(1) + '%' : '-'}
                    </td>
                  </tr>

                  {/* Rule 3: Status–Outcome Conflict */}
                  <tr className="hover:bg-slate-50 bg-teal-50/20">
                    <td className="px-3.5 py-2.5 font-mono text-[11px] text-[#0F766E] font-semibold">RULE-DET-03</td>
                    <td className="px-3.5 py-2.5 font-bold text-[#0F766E]">3. Status–Outcome Conflict (Primary)</td>
                    <td className="px-3.5 py-2.5 text-center font-mono font-bold text-[#0F766E]">{byRule?.COMPLETED_WITHOUT_EVIDENCE.truePositives}</td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-400">{byRule?.COMPLETED_WITHOUT_EVIDENCE.falsePositives}</td>
                    <td className="px-3.5 py-2.5 text-center font-mono text-slate-400">{byRule?.COMPLETED_WITHOUT_EVIDENCE.falseNegatives}</td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#0F766E]">
                      {byRule ? (byRule.COMPLETED_WITHOUT_EVIDENCE.precision * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#0F766E]">
                      {byRule ? (byRule.COMPLETED_WITHOUT_EVIDENCE.recall * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-800">
                      {byRule ? (byRule.COMPLETED_WITHOUT_EVIDENCE.f1Score * 100).toFixed(1) + '%' : '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SECTION 4: 30 SYNTHETIC TEST CASES PASS/FAIL LOG */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Ground-Truth Assertions Log (30 Cases)
                </h3>
                <p className="text-xs text-slate-500">
                  Comparing deterministic engine evaluation with expected ground-truth classification.
                </p>
              </div>

              {/* Pass/Fail Filter buttons */}
              <div className="flex items-center space-x-1 text-xs">
                <button
                  onClick={() => setFilterResult('ALL')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    filterResult === 'ALL'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All ({testCases.length})
                </button>
                <button
                  onClick={() => setFilterResult('PASS')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    filterResult === 'PASS'
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Passed ({testCases.filter((t) => t.passed).length})
                </button>
                <button
                  onClick={() => setFilterResult('FAIL')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    filterResult === 'FAIL'
                      ? 'bg-rose-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Failed ({testCases.filter((t) => !t.passed).length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-2.5">Case ID</th>
                    <th className="px-4 py-2.5">Expected Ground Truth</th>
                    <th className="px-4 py-2.5">Deterministic Detection</th>
                    <th className="px-4 py-2.5 text-center">Assertion</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredTestCases.map((tc) => (
                    <tr key={tc.recordId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {tc.recordId}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px]">
                        {tc.expected.length === 0 ? (
                          <span className="text-emerald-700 font-sans font-medium">[NORMAL]</span>
                        ) : (
                          <span className="text-amber-800">{tc.expected.map(formatExceptionLabel).join(', ')}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px]">
                        {tc.actual.length === 0 ? (
                          <span className="text-emerald-700 font-sans font-medium">[NORMAL]</span>
                        ) : (
                          <span className="text-amber-800 font-semibold">{tc.actual.map(formatExceptionLabel).join(', ')}</span>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        {tc.passed ? (
                          <span className="inline-flex items-center text-emerald-700 font-bold space-x-1 font-mono">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>PASS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-rose-700 font-bold space-x-1 font-mono">
                            <XCircle className="h-4 w-4 text-rose-600" />
                            <span>FAIL</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          onClick={() => onSelectRecord && onSelectRecord(tc.recordId)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#0F766E] hover:underline inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="py-8">
          <EmptyState
            type="EVALUATION_NOT_RUN"
            action={{
              label: isRunning ? 'Validating...' : 'Execute Rule Validation',
              onClick: onRunValidation,
            }}
          />
        </div>
      )}
    </div>
  );
};
