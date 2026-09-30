export type ExceptionType = 
  | 'OVERDUE'
  | 'MISSING_INFO'
  | 'COMPLETED_WITHOUT_EVIDENCE';

export type RecordStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReviewStatus = 'UNREVIEWED' | 'APPROVED' | 'REJECTED';

export interface CompletionEvidence {
  documentId?: string | null;
  evidenceType?: string | null;
  fileUrl?: string | null;
  uploadedAt?: string | null;
  signedBy?: string | null;
  notes?: string | null;
  verified?: boolean;
}

export interface OperationalLog {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  category: 'SYSTEM' | 'AGENT' | 'CUSTOMER' | 'EXTERNAL_TELEMETRY';
}

export interface GroundTruthLabel {
  expectedExceptions: ExceptionType[];
  isNormal: boolean;
  notes: string;
}

export interface OperationalRecord {
  id: string;
  title: string;
  status: RecordStatus;
  priority: PriorityLevel;
  department: string;
  assignedAgent: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string | null;
  downstreamStatus?: string | null;
  requiredFields: {
    customerName?: string;
    contactPhone?: string;
    destinationAddress?: string;
    orderValue?: number | string;
    serviceCategory?: string;
    [key: string]: any;
  };
  completionEvidence?: CompletionEvidence | null;
  operationalNotes: OperationalLog[];
  reviewStatus: ReviewStatus;
  reviewDecision?: HumanDecision | null;
  groundTruth: GroundTruthLabel;
}

export interface DetectedException {
  id: string;
  recordId: string;
  type: ExceptionType;
  ruleId: string;
  ruleName: string;
  severity: PriorityLevel;
  detectedAt: string;
  triggerField: string;
  details: string;
  expectedCondition: string;
  actualCondition: string;
}

export interface RuleEvaluationResult {
  recordId: string;
  isNormal: boolean;
  exceptions: DetectedException[];
  evaluatedAt: string;
}

export interface AIAnalysisResult {
  analysisAvailable: boolean;
  summary: string;
  whyItMatters?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rootCauseHypothesis: string;
  recommendedAction: string;
  recommendationType: 'APPROVE_EXCEPTION' | 'REJECT_COMPLETION' | 'REQUEST_MORE_INFO' | 'ESCALATE';
  verifiedConflictingEvidence?: string[];
  missingRequiredEvidence?: string[];
  possibleFollowUpEvidence?: string[];
  contextEvidenceFound: string[];
  missingEvidenceIdentified: string[];
  confidenceScore: number;
  confidence?: string;
  humanReviewReason?: string;
  caveats: string;
  analyzedAt: string;
  modelName?: string;
  errorMessage?: string;
}

export interface HumanDecision {
  id: string;
  recordId: string;
  exceptionType: ExceptionType;
  decision: 'APPROVED' | 'REJECTED';
  reviewerName: string;
  reviewerRole: string;
  notes: string;
  timestamp: string;
  actionTaken: string;
}

export interface AuditLogEntry {
  id: string;
  recordId: string;
  timestamp: string;
  eventType: 'RULE_EVALUATION' | 'AI_INTERPRETATION' | 'HUMAN_DECISION' | 'CONFIG_SWITCH' | 'RESET';
  actor: 'SYSTEM_RULES' | 'GEMINI_AI' | 'HUMAN_REVIEWER';
  actionSummary: string;
  details: string;
  metadata?: any;
}

export interface MetricBreakdown {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
}

export interface ValidationEvaluationResult {
  totalRecordsEvaluated: number;
  evaluatedAt: string;
  overall: MetricBreakdown;
  byRule: Record<ExceptionType, MetricBreakdown>;
  testCaseResults: {
    recordId: string;
    title: string;
    expected: ExceptionType[];
    actual: ExceptionType[];
    passed: boolean;
    confusionCategory: 'TP' | 'TN' | 'FP' | 'FN' | 'MIXED';
    notes: string;
  }[];
}

export interface ReconciliationSourceLabels {
  primaryRecord: string;
  fulfilmentEvidence: string;
  downstreamStatus: string;
}

export interface BusinessDomainConfig {
  domainKey: string;
  domainName: string;
  description: string;
  recordNounSingular: string;
  recordNounPlural: string;
  evidenceNoun: string;
  assigneeLabel: string;
  idPrefix: string;
  reconciliationLabels?: ReconciliationSourceLabels;
  requiredFieldLabels: Record<string, string>;
  ruleDescriptions: {
    OVERDUE: string;
    MISSING_INFO: string;
    COMPLETED_WITHOUT_EVIDENCE: string;
  };
}
