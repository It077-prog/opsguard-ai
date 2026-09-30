/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation, ScreenId } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ExceptionsView } from './components/ExceptionsView';
import { CaseInvestigationView } from './components/CaseInvestigationView';
import { AuditLogView } from './components/AuditLogView';
import { EvaluationView } from './components/EvaluationView';
import { DomainConfigModal } from './components/DomainConfigModal';
import { AboutHelpModal } from './components/AboutHelpModal';
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
  const [isAboutHelpOpen, setIsAboutHelpOpen] = useState(false);
  const [aboutHelpTab, setAboutHelpTab] = useState<'about' | 'help'>('about');

  const fetchState = async () => {
    try {
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setGeminiConnected(Boolean(healthData.geminiConfigured));
      }

      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setActiveDomainKey(configData.activeDomainKey);
        setActiveConfig(configData.activeConfig);
      }

      const recordsRes = await fetch('/api/records');
      if (recordsRes.ok) {
        const recordsData = await recordsRes.json();
        setRecords(recordsData.records);
      } else {
        throw new Error('API records call returned non-200');
      }

      const auditRes = await fetch('/api/audit-logs');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs);
      }
    } catch {
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

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setActiveScreen('investigation');
  };

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

      setRecords((prev) =>
        prev.map((r) =>
          r.id === params.recordId
            ? { ...r, reviewStatus: params.decision, reviewDecision: data.decision }
            : r
        )
      );

      if (data.auditEntry) {
        setAuditLogs((prev) => [data.auditEntry, ...prev]);
      }
    } catch (err: any) {
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

      const auditRes = await fetch('/api/audit-logs');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs);
      }

      return data.result;
    } catch {
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

  const handleRunValidation = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/evaluation/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEvaluationResult(data.result);
      } else {
        const localResult = runRuleValidation(records, activeConfig);
        setEvaluationResult(localResult);
      }

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

  const activeRecord =
    records.find((r) => r.id === selectedRecordId) ||
    records[0] ||
    ({
      ...INITIAL_OPERATIONAL_RECORDS[0],
      evaluation: evaluateOperationalRecord(INITIAL_OPERATIONAL_RECORDS[0], activeConfig),
    } as any);

  const exceptionCount = records.filter(
    (r) => r.evaluation && !r.evaluation.isNormal && r.evaluation.exceptions.length > 0
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Navigation
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        exceptionCount={exceptionCount}
        auditCount={auditLogs.length}
        onOpenAbout={() => {
          setAboutHelpTab('about');
          setIsAboutHelpOpen(true);
        }}
        onOpenHelp={() => {
          setAboutHelpTab('help');
          setIsAboutHelpOpen(true);
        }}
        activeConfig={activeConfig}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
        onResetData={handleResetData}
        onSelectRecord={handleSelectRecord}
        isResetting={isResetting}
      />

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
            onNavigateEvaluation={() => setActiveScreen('evaluation')}
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

      <DomainConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        activeDomainKey={activeDomainKey}
        onSwitchDomain={handleSwitchDomain}
        isSwitching={isSwitchingDomain}
      />

      <AboutHelpModal
        isOpen={isAboutHelpOpen}
        onClose={() => setIsAboutHelpOpen(false)}
        initialTab={aboutHelpTab}
        onNavigateEvaluation={() => setActiveScreen('evaluation')}
      />

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <span>OpsGuard AI V0.1 · Demo Environment</span>
        </div>
      </footer>
    </div>
  );
}
