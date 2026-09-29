/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, ScreenId } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ExceptionsView } from './components/ExceptionsView';
import { CaseInvestigationView } from './components/CaseInvestigationView';
import { AuditLogView } from './components/AuditLogView';
import { EvaluationView } from './components/EvaluationView';
import { DomainConfigModal } from './components/DomainConfigModal';
import { INITIAL_OPERATIONAL_RECORDS } from './data/syntheticRecords';
import { BUSINESS_DOMAIN_PRESETS, DEFAULT_DOMAIN_KEY } from './config/businessConfig';
import { evaluateOperationalRecord } from './rules/deterministicEngine';
import { runRuleValidation } from './rules/evaluationEngine';
import {
  OperationalRecord,
  BusinessDomainConfig,
  AuditLogEntry,
  AIAnalysisResult,
  ValidationEvaluationResult,
  ExceptionType,
} from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('OP-101');
  const [activeDomainKey, setActiveDomainKey] = useState<string>(DEFAULT_DOMAIN_KEY);
  const [activeConfig, setActiveConfig] = useState<BusinessDomainConfig>(
    BUSINESS_DOMAIN_PRESETS[DEFAULT_DOMAIN_KEY]
  );

  const [records, setRecords] = useState<(OperationalRecord & { evaluation?: any })[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<ValidationEvaluationResult | null>(null);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSwitchingDomain, setIsSwitchingDomain] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [exceptionsFilter, setExceptionsFilter] = useState<ExceptionType | 'ALL'>('ALL');

  // Load initial data from server API or local fallback
  const fetchState = async () => {
    try {
      // 1. Health check
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setGeminiConnected(Boolean(healthData.geminiConfigured));
      }

      // 2. Config
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setActiveDomainKey(configData.activeDomainKey);
        setActiveConfig(configData.activeConfig);
      }

      // 3. Records
      const recordsRes = await fetch('/api/records');
      if (recordsRes.ok) {
        const recordsData = await recordsRes.json();
        setRecords(recordsData.records);
      } else {
        throw new Error('API records call returned non-200');
      }

      // 4. Audit Logs
      const auditRes = await fetch('/api/audit-logs');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs);
      }
    } catch {
      // Fallback in-client evaluation if backend not responding
      const fallbackRecords = INITIAL_OPERATIONAL_RECORDS.map((rec) => ({
        ...rec,
        evaluation: evaluateOperationalRecord(rec, BUSINESS_DOMAIN_PRESETS[activeDomainKey]),
      }));
      setRecords(fallbackRecords);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Jump directly to a record and open Case Investigation
  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setActiveScreen('investigation');
  };

  // Switch domain preset
  const handleSwitchDomain = async (domainKey: string) => {
    setIsSwitchingDomain(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainKey }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveDomainKey(data.activeDomainKey);
        setActiveConfig(data.activeConfig);
      } else {
        setActiveDomainKey(domainKey);
        setActiveConfig(BUSINESS_DOMAIN_PRESETS[domainKey]);
      }
      await fetchState();
    } catch {
      setActiveDomainKey(domainKey);
      setActiveConfig(BUSINESS_DOMAIN_PRESETS[domainKey]);
    } finally {
      setIsSwitchingDomain(false);
      setIsConfigModalOpen(false);
    }
  };

  // Reset synthetic records to baseline demo state
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/records/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.activeDomainKey && data.activeConfig) {
          setActiveDomainKey(data.activeDomainKey);
          setActiveConfig(data.activeConfig);
        } else {
          setActiveDomainKey(DEFAULT_DOMAIN_KEY);
          setActiveConfig(BUSINESS_DOMAIN_PRESETS[DEFAULT_DOMAIN_KEY]);
        }
      } else {
        setActiveDomainKey(DEFAULT_DOMAIN_KEY);
        setActiveConfig(BUSINESS_DOMAIN_PRESETS[DEFAULT_DOMAIN_KEY]);
      }
      await fetchState();
      setEvaluationResult(null);
    } catch {
      setActiveDomainKey(DEFAULT_DOMAIN_KEY);
      setActiveConfig(BUSINESS_DOMAIN_PRESETS[DEFAULT_DOMAIN_KEY]);
      const fallbackRecords = INITIAL_OPERATIONAL_RECORDS.map((rec) => ({
        ...rec,
        evaluation: evaluateOperationalRecord(rec, BUSINESS_DOMAIN_PRESETS[DEFAULT_DOMAIN_KEY]),
      }));
      setRecords(fallbackRecords);
    } finally {
      setIsResetting(false);
    }
  };

  // Submit human decision (Approve / Reject)
  const handleSubmitDecision = async (params: {
    recordId: string;
    exceptionType: ExceptionType;
    decision: 'APPROVED' | 'REJECTED';
    reviewerName: string;
    reviewerRole: string;
    notes: string;
  }) => {
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit decision.');
      }

      const data = await res.json();

      // Update local records
      setRecords((prev) =>
        prev.map((r) =>
          r.id === params.recordId
            ? { ...r, reviewStatus: params.decision, reviewDecision: data.decision }
            : r
        )
      );

      // Append to audit logs
      if (data.auditEntry) {
        setAuditLogs((prev) => [data.auditEntry, ...prev]);
      }
    } catch (err: any) {
      // Local fallback state update
      setRecords((prev) =>
        prev.map((r) =>
          r.id === params.recordId
            ? {
                ...r,
                reviewStatus: params.decision,
                reviewDecision: {
                  id: `DEC-${Date.now()}`,
                  recordId: params.recordId,
                  exceptionType: params.exceptionType,
                  decision: params.decision,
                  reviewerName: params.reviewerName,
                  reviewerRole: params.reviewerRole,
                  notes: params.notes,
                  timestamp: new Date().toISOString(),
                  actionTaken:
                    params.decision === 'APPROVED' ? 'Approved in-client' : 'Rejected in-client',
                },
              }
            : r
        )
      );
      throw err;
    }
  };

  // Contextual AI Analysis
  const handleAnalyzeCase = async (recordId: string): Promise<AIAnalysisResult> => {
    try {
      const res = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analysis service error.');
      }

      const data = await res.json();

      // Refresh audit logs since AI analysis appends an audit record
      const auditRes = await fetch('/api/audit-logs');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs);
      }

      return data.result;
    } catch {
      // Graceful fallback per instructions: "AI analysis unavailable — manual review required."
      return {
        analysisAvailable: false,
        summary: 'Automated contextual intelligence service is currently offline or unreachable.',
        riskLevel: 'MEDIUM',
        rootCauseHypothesis: 'Rule violated deterministic operational threshold.',
        recommendedAction: 'Conduct physical documentation audit and verify with delivery driver.',
        recommendationType: 'REQUEST_MORE_INFO',
        contextEvidenceFound: [],
        missingEvidenceIdentified: ['Mandatory compliance sign-off'],
        confidenceScore: 0.0,
        caveats: 'Human authorization required.',
        analyzedAt: new Date().toISOString(),
        errorMessage: 'AI analysis unavailable — manual review required.',
      };
    }
  };

  // Run Rule Validation (Evaluation)
  const handleRunValidation = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/evaluation/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data.result);
      } else {
        // Run locally
        const localResult = runRuleValidation(records, activeConfig);
        setEvaluationResult(localResult);
      }

      // Refresh audit logs
      const auditRes = await fetch('/api/audit-logs');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs);
      }
    } catch {
      const localResult = runRuleValidation(records, activeConfig);
      setEvaluationResult(localResult);
    } finally {
      setIsValidating(false);
    }
  };

  // Selected record object for Case Investigation
  const activeRecord =
    records.find((r) => r.id === selectedRecordId) ||
    records[0] ||
    ({
      ...INITIAL_OPERATIONAL_RECORDS[0],
      evaluation: evaluateOperationalRecord(INITIAL_OPERATIONAL_RECORDS[0], activeConfig),
    } as any);

  // Count flagged exceptions
  const exceptionCount = records.filter(
    (r) => r.evaluation && !r.evaluation.isNormal && r.evaluation.exceptions.length > 0
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Brand Header */}
      <Header
        activeConfig={activeConfig}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onResetData={handleResetData}
        onSelectRecord={handleSelectRecord}
        isResetting={isResetting}
        geminiConnected={geminiConnected}
      />

      {/* Screen Navigation Tabs */}
      <Navigation
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        exceptionCount={exceptionCount}
        auditCount={auditLogs.length}
        investigationTargetId={selectedRecordId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeScreen === 'dashboard' && (
          <DashboardView
            records={records}
            activeConfig={activeConfig}
            onSelectRecord={handleSelectRecord}
            onNavigateExceptions={(filter) => {
              setExceptionsFilter(filter || 'ALL');
              setActiveScreen('exceptions');
            }}
            onNavigateEvaluation={() => {
              setActiveScreen('evaluation');
            }}
            onRunValidation={handleRunValidation}
            isValidating={isValidating}
          />
        )}

        {activeScreen === 'exceptions' && (
          <ExceptionsView
            records={records}
            activeConfig={activeConfig}
            onSelectRecord={handleSelectRecord}
            initialFilter={exceptionsFilter}
          />
        )}

        {activeScreen === 'investigation' && (
          <CaseInvestigationView
            record={activeRecord}
            allRecords={records}
            activeConfig={activeConfig}
            onSelectRecord={(id) => setSelectedRecordId(id)}
            onSubmitDecision={handleSubmitDecision}
            onAnalyzeCase={handleAnalyzeCase}
          />
        )}

        {activeScreen === 'audit' && (
          <AuditLogView logs={auditLogs} onSelectRecord={handleSelectRecord} />
        )}

        {activeScreen === 'evaluation' && (
          <EvaluationView
            evaluationResult={evaluationResult}
            onRunValidation={handleRunValidation}
            isRunning={isValidating}
            activeConfig={activeConfig}
            onSelectRecord={handleSelectRecord}
          />
        )}
      </main>

      {/* Business Domain Terminology Portability Modal */}
      <DomainConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        activeDomainKey={activeDomainKey}
        onSwitchDomain={handleSwitchDomain}
        isSwitching={isSwitchingDomain}
      />

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">OpsGuard AI V0.1</span>
            <span className="text-slate-300">·</span>
            <span>Cross-System Case-to-Outcome Reconciliation</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Deterministic Control &amp; AI Advisory</span>
            <span>·</span>
            <span>Auditable Decision Logging</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
