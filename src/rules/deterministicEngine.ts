import {
  OperationalRecord,
  DetectedException,
  RuleEvaluationResult,
  BusinessDomainConfig,
} from '../types';
import { REQUIRED_FIELD_KEYS } from '../config/businessConfig';

/**
 * Deterministic Rule Evaluation Engine
 * Pure mathematical and logical checks without fuzzy/AI heuristics.
 * Evaluates records strictly against the 3 supported operational exception rules.
 */

// Fixed evaluation reference timestamp for deterministic consistency in test suites and live checks
// Can also take an optional reference time parameter (defaults to evaluation moment or fixed baseline)
export const EVALUATION_REFERENCE_TIMESTAMP = '2026-09-28T09:00:00Z';

export function evaluateOperationalRecord(
  record: OperationalRecord,
  config?: BusinessDomainConfig,
  referenceTime: string = EVALUATION_REFERENCE_TIMESTAMP
): RuleEvaluationResult {
  const exceptions: DetectedException[] = [];
  const refDate = new Date(referenceTime).getTime();

  // -------------------------------------------------------------
  // RULE 1: OVERDUE (RULE-DET-01)
  // Check if open/in-progress record has breached its due date SLA
  // -------------------------------------------------------------
  if (record.status === 'OPEN' || record.status === 'IN_PROGRESS') {
    const dueTime = new Date(record.dueDate).getTime();
    if (refDate > dueTime) {
      const hoursOverdue = Math.round((refDate - dueTime) / (1000 * 60 * 60));
      exceptions.push({
        id: `EX-${record.id}-01`,
        recordId: record.id,
        type: 'OVERDUE',
        ruleId: 'RULE-DET-01-OVERDUE',
        ruleName: 'Due Date / SLA Deadline Exceeded',
        severity: hoursOverdue > 48 ? 'CRITICAL' : hoursOverdue > 24 ? 'HIGH' : 'MEDIUM',
        detectedAt: new Date().toISOString(),
        triggerField: 'dueDate',
        details: `Operational record is currently ${record.status} but SLA deadline expired on ${record.dueDate} (${hoursOverdue}h past threshold).`,
        expectedCondition: `currentTime <= dueDate (${record.dueDate})`,
        actualCondition: `currentTime (${referenceTime}) > dueDate (${record.dueDate}) [Delta: +${hoursOverdue}h]`,
      });
    }
  }

  // -------------------------------------------------------------
  // RULE 2: MISSING REQUIRED INFORMATION (RULE-DET-02)
  // Check if mandatory enterprise fields are absent or blank
  // -------------------------------------------------------------
  const requiredKeys = REQUIRED_FIELD_KEYS;
  const missingFields: string[] = [];

  for (const key of requiredKeys) {
    const val = record.requiredFields?.[key];
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
      const humanLabel = config?.requiredFieldLabels?.[key] || key;
      missingFields.push(humanLabel);
    }
  }

  if (missingFields.length > 0) {
    exceptions.push({
      id: `EX-${record.id}-02`,
      recordId: record.id,
      type: 'MISSING_INFO',
      ruleId: 'RULE-DET-02-REQ-INFO',
      ruleName: 'Missing Mandatory Operational Fields',
      severity: missingFields.length > 1 ? 'HIGH' : 'MEDIUM',
      detectedAt: new Date().toISOString(),
      triggerField: 'requiredFields',
      details: `Record lacks ${missingFields.length} required mandatory operational field(s): ${missingFields.join(', ')}.`,
      expectedCondition: `All mandatory fields present [${requiredKeys.join(', ')}]`,
      actualCondition: `Missing: [${missingFields.join(', ')}]`,
    });
  }

  // -------------------------------------------------------------
  // RULE 3: STATUS–OUTCOME CONFLICT (RULE-DET-03-STATUS-OUTCOME-CONFLICT)
  // Primary OpsGuard reconciliation control.
  // A Status–Outcome Conflict exists when a case is recorded as completed
  // but available fulfilment evidence or downstream status does not support completion.
  // -------------------------------------------------------------
  if (record.status === 'COMPLETED') {
    const evidence = record.completionEvidence;
    const hasEvidenceDoc = Boolean(evidence && evidence.documentId && evidence.documentId.trim() !== '');
    const hasEvidenceFile = Boolean(evidence && (evidence.fileUrl || evidence.signedBy));

    if (!evidence || !hasEvidenceDoc || !hasEvidenceFile) {
      exceptions.push({
        id: `EX-${record.id}-03`,
        recordId: record.id,
        type: 'COMPLETED_WITHOUT_EVIDENCE',
        ruleId: 'RULE-DET-03-STATUS-OUTCOME-CONFLICT',
        ruleName: 'Status–Outcome Conflict',
        severity: 'CRITICAL',
        detectedAt: new Date().toISOString(),
        triggerField: 'completionEvidence',
        details: `Status–Outcome Conflict: Record is marked as COMPLETED, but mandatory fulfilment evidence (${config?.evidenceNoun || 'Completion Evidence'}) is missing and downstream status remains ${record.downstreamStatus || 'Unresolved'}.`,
        expectedCondition: `status === 'COMPLETED' REQUIRES verifiable fulfilment evidence (${config?.evidenceNoun || 'Completion Evidence'}) supporting actual outcome`,
        actualCondition: evidence
          ? `Status is COMPLETED but evidence incomplete: docId=${evidence.documentId || 'null'}, signedBy=${evidence.signedBy || 'null'} (Downstream: ${record.downstreamStatus || 'Unresolved'})`
          : `Status is COMPLETED but fulfilment evidence is missing (Downstream: ${record.downstreamStatus || 'Unresolved'})`,
      });
    }
  }

  return {
    recordId: record.id,
    isNormal: exceptions.length === 0,
    exceptions,
    evaluatedAt: new Date().toISOString(),
  };
}

export function evaluateDataset(
  records: OperationalRecord[],
  config?: BusinessDomainConfig,
  referenceTime?: string
): Map<string, RuleEvaluationResult> {
  const results = new Map<string, RuleEvaluationResult>();
  for (const record of records) {
    results.set(record.id, evaluateOperationalRecord(record, config, referenceTime));
  }
  return results;
}
