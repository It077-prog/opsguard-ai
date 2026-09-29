import {
  OperationalRecord,
  ExceptionType,
  ValidationEvaluationResult,
  MetricBreakdown,
  BusinessDomainConfig,
} from '../types';
import { evaluateOperationalRecord } from './deterministicEngine';

const ALL_EXCEPTION_TYPES: ExceptionType[] = [
  'OVERDUE',
  'MISSING_INFO',
  'COMPLETED_WITHOUT_EVIDENCE',
];

function calculateMetrics(tp: number, fp: number, fn: number, tn: number): MetricBreakdown {
  const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 1;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const total = tp + fp + fn + tn;
  const accuracy = total > 0 ? (tp + tn) / total : 1;

  return {
    truePositives: tp,
    falsePositives: fp,
    falseNegatives: fn,
    trueNegatives: tn,
    precision: Number(precision.toFixed(4)),
    recall: Number(recall.toFixed(4)),
    f1Score: Number(f1Score.toFixed(4)),
    accuracy: Number(accuracy.toFixed(4)),
  };
}

/**
 * Runs rule validation against ground-truth labels.
 * Evaluates real deterministic rules on each record and computes
 * True Positives, False Positives, False Negatives, Precision, and Recall.
 * Strictly calculated from test data — zero fabricated results.
 */
export function runRuleValidation(
  records: OperationalRecord[],
  config?: BusinessDomainConfig,
  referenceTime?: string
): ValidationEvaluationResult {
  // Counters per rule
  const ruleCounts: Record<ExceptionType, { tp: number; fp: number; fn: number; tn: number }> = {
    OVERDUE: { tp: 0, fp: 0, fn: 0, tn: 0 },
    MISSING_INFO: { tp: 0, fp: 0, fn: 0, tn: 0 },
    COMPLETED_WITHOUT_EVIDENCE: { tp: 0, fp: 0, fn: 0, tn: 0 },
  };

  let overallTp = 0;
  let overallFp = 0;
  let overallFn = 0;
  let overallTn = 0;

  const testCaseResults: ValidationEvaluationResult['testCaseResults'] = [];

  for (const record of records) {
    const evaluation = evaluateOperationalRecord(record, config, referenceTime);
    const actualTypes = evaluation.exceptions.map((e) => e.type);
    const expectedTypes = record.groundTruth.expectedExceptions;

    // Check each of the 3 exception types
    let recordHasMismatch = false;

    for (const ruleType of ALL_EXCEPTION_TYPES) {
      const isExpected = expectedTypes.includes(ruleType);
      const isActual = actualTypes.includes(ruleType);

      if (isExpected && isActual) {
        ruleCounts[ruleType].tp += 1;
        overallTp += 1;
      } else if (!isExpected && isActual) {
        ruleCounts[ruleType].fp += 1;
        overallFp += 1;
        recordHasMismatch = true;
      } else if (isExpected && !isActual) {
        ruleCounts[ruleType].fn += 1;
        overallFn += 1;
        recordHasMismatch = true;
      } else {
        ruleCounts[ruleType].tn += 1;
        overallTn += 1;
      }
    }

    // Determine confusion category for this test case
    let confusionCategory: 'TP' | 'TN' | 'FP' | 'FN' | 'MIXED' = 'TN';
    if (expectedTypes.length > 0 && actualTypes.length > 0 && !recordHasMismatch) {
      confusionCategory = 'TP';
    } else if (expectedTypes.length === 0 && actualTypes.length === 0) {
      confusionCategory = 'TN';
    } else if (actualTypes.length > expectedTypes.length && !recordHasMismatch) {
      confusionCategory = 'FP';
    } else if (actualTypes.length < expectedTypes.length && !recordHasMismatch) {
      confusionCategory = 'FN';
    } else if (recordHasMismatch) {
      confusionCategory = 'MIXED';
    }

    testCaseResults.push({
      recordId: record.id,
      title: record.title,
      expected: expectedTypes,
      actual: actualTypes,
      passed: !recordHasMismatch,
      confusionCategory,
      notes: record.groundTruth.notes,
    });
  }

  const byRuleMetrics: Record<ExceptionType, MetricBreakdown> = {
    OVERDUE: calculateMetrics(
      ruleCounts.OVERDUE.tp,
      ruleCounts.OVERDUE.fp,
      ruleCounts.OVERDUE.fn,
      ruleCounts.OVERDUE.tn
    ),
    MISSING_INFO: calculateMetrics(
      ruleCounts.MISSING_INFO.tp,
      ruleCounts.MISSING_INFO.fp,
      ruleCounts.MISSING_INFO.fn,
      ruleCounts.MISSING_INFO.tn
    ),
    COMPLETED_WITHOUT_EVIDENCE: calculateMetrics(
      ruleCounts.COMPLETED_WITHOUT_EVIDENCE.tp,
      ruleCounts.COMPLETED_WITHOUT_EVIDENCE.fp,
      ruleCounts.COMPLETED_WITHOUT_EVIDENCE.fn,
      ruleCounts.COMPLETED_WITHOUT_EVIDENCE.tn
    ),
  };

  const overallMetrics = calculateMetrics(overallTp, overallFp, overallFn, overallTn);

  return {
    totalRecordsEvaluated: records.length,
    evaluatedAt: new Date().toISOString(),
    overall: overallMetrics,
    byRule: byRuleMetrics,
    testCaseResults,
  };
}
