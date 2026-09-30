import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_OPERATIONAL_RECORDS } from './src/data/syntheticRecords.ts';
import { BUSINESS_DOMAIN_PRESETS, DEFAULT_DOMAIN_KEY } from './src/config/businessConfig.ts';
import { evaluateOperationalRecord, EVALUATION_REFERENCE_TIMESTAMP } from './src/rules/deterministicEngine.ts';
import { runRuleValidation } from './src/rules/evaluationEngine.ts';
import {
  OperationalRecord,
  AuditLogEntry,
  AIAnalysisResult,
  HumanDecision,
  ExceptionType,
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory operational state for prototype
let records: OperationalRecord[] = JSON.parse(JSON.stringify(INITIAL_OPERATIONAL_RECORDS));
let activeDomainKey = DEFAULT_DOMAIN_KEY;
let auditLogs: AuditLogEntry[] = [];

// Seed initial audit log entries
records.forEach((rec) => {
  const evalResult = evaluateOperationalRecord(rec, BUSINESS_DOMAIN_PRESETS[activeDomainKey]);
  if (!evalResult.isNormal) {
    auditLogs.push({
      id: `AUD-INIT-${rec.id}`,
      recordId: rec.id,
      timestamp: rec.createdAt,
      eventType: 'RULE_EVALUATION',
      actor: 'SYSTEM_RULES',
      actionSummary: `Deterministic Rule Triggered: ${evalResult.exceptions.map((e) => e.type).join(', ')}`,
      details: evalResult.exceptions.map((e) => `${e.ruleId}: ${e.details}`).join(' | '),
      metadata: { exceptions: evalResult.exceptions },
    });
  }
});

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------

// Health & Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'OpsGuard AI V0.1',
    engineStatus: 'DETERMINISTIC_ACTIVE',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    activeDomain: activeDomainKey,
    totalRecords: records.length,
  });
});

// Domain Configuration
app.get('/api/config', (req: Request, res: Response) => {
  res.json({
    activeDomainKey,
    activeConfig: BUSINESS_DOMAIN_PRESETS[activeDomainKey],
    availablePresets: BUSINESS_DOMAIN_PRESETS,
  });
});

app.post('/api/config', (req: Request, res: Response) => {
  const { domainKey } = req.body;
  if (domainKey && BUSINESS_DOMAIN_PRESETS[domainKey]) {
    activeDomainKey = domainKey;
    const log: AuditLogEntry = {
      id: `AUD-CFG-${Date.now()}`,
      recordId: 'GLOBAL',
      timestamp: new Date().toISOString(),
      eventType: 'CONFIG_SWITCH',
      actor: 'HUMAN_REVIEWER',
      actionSummary: `Operational Domain Preset Switched to: ${BUSINESS_DOMAIN_PRESETS[domainKey].domainName}`,
      details: `Active terminology and field labels updated to ${BUSINESS_DOMAIN_PRESETS[domainKey].domainName}.`,
    };
    auditLogs.unshift(log);
    res.json({
      success: true,
      activeDomainKey,
      activeConfig: BUSINESS_DOMAIN_PRESETS[activeDomainKey],
    });
  } else {
    res.status(400).json({ error: 'Invalid domain key provided.' });
  }
});

// Records with deterministic evaluation
app.get('/api/records', (req: Request, res: Response) => {
  const activeConfig = BUSINESS_DOMAIN_PRESETS[activeDomainKey];
  const enrichedRecords = records.map((rec) => {
    const evaluation = evaluateOperationalRecord(rec, activeConfig);
    return {
      ...rec,
      evaluation,
    };
  });
  res.json({ records: enrichedRecords });
});

// Single Record
app.get('/api/records/:id', (req: Request, res: Response) => {
  const record = records.find((r) => r.id === req.params.id);
  if (!record) {
    res.status(404).json({ error: `Record ${req.params.id} not found.` });
    return;
  }
  const activeConfig = BUSINESS_DOMAIN_PRESETS[activeDomainKey];
  const evaluation = evaluateOperationalRecord(record, activeConfig);
  res.json({ record, evaluation });
});

// AI Case Investigation (Gemini Context Analysis)
// MUST only analyse contextual information AFTER a rule detects an exception.
app.post('/api/analyze-case', async (req: Request, res: Response) => {
  const { recordId } = req.body;
  const record = records.find((r) => r.id === recordId);

  if (!record) {
    res.status(404).json({ error: `Record ${recordId} not found.` });
    return;
  }

  const activeConfig = BUSINESS_DOMAIN_PRESETS[activeDomainKey];
  const evaluation = evaluateOperationalRecord(record, activeConfig);

  // Architecture Enforcement: Deterministic rule check is prerequisite
  if (evaluation.isNormal || evaluation.exceptions.length === 0) {
    res.status(400).json({
      error: 'Rule check did not detect an exception. AI analysis is restricted to flagged exceptions only.',
    });
    return;
  }

  // If Gemini client not available, gracefully return required fallback
  if (!aiClient || !process.env.GEMINI_API_KEY) {
    const fallbackResult: AIAnalysisResult = {
      analysisAvailable: false,
      summary: 'Automated Gemini service credentials not present in environment.',
      riskLevel: 'MEDIUM',
      rootCauseHypothesis: 'Rule violation triggered by deterministic boundary check.',
      recommendedAction: 'Verify operational attachments and contact dispatch agent directly.',
      recommendationType: 'REQUEST_MORE_INFO',
      contextEvidenceFound: [],
      missingRequiredEvidence: evaluation.exceptions.map((e) => e.details),
      possibleFollowUpEvidence: ['Direct communication with dispatch agent', 'Manual inspection of physical paperwork'],
      missingEvidenceIdentified: evaluation.exceptions.map((e) => e.details),
      confidenceScore: 0.0,
      caveats: 'Deterministic fallback applied. Human reviewer retains final authority for approval or rejection.',
      analyzedAt: new Date().toISOString(),
      modelName: 'AI Interpretation',
      errorMessage: 'AI analysis unavailable — manual review required.',
    };
    res.json({ result: fallbackResult });
    return;
  }

  try {
    const prompt = `
You are OpsGuard AI, a contextual operational investigation assistant.
A deterministic operational rule has detected an exception on the following record:

RECORD IDENTIFICATION:
ID: ${record.id}
Title: ${record.title}
Status: ${record.status}
Priority: ${record.priority}
Department: ${record.department}
Assigned Agent: ${record.assignedAgent}
Created At: ${record.createdAt}
SLA Due Date: ${record.dueDate}
Completed At: ${record.completedAt || 'N/A'}
Downstream Status: ${record.downstreamStatus || 'Unresolved'}
Required Fields Present/Missing: ${JSON.stringify(record.requiredFields)}
Fulfilment Completion Evidence: ${JSON.stringify(record.completionEvidence || 'None uploaded / Missing')}

DETECTED DETERMINISTIC EXCEPTIONS:
${evaluation.exceptions.map((e) => `- [${e.ruleId}] ${e.ruleName} (${e.type}, Severity: ${e.severity}): ${e.details}`).join('\n')}

OPERATIONAL NOTES & TELEMETRY LOGS (Chronological):
${record.operationalNotes
  .map(
    (n) =>
      `[${n.timestamp}] (${n.category}) ${n.author} (${n.role}): "${n.content}"`
  )
  .join('\n')}

STRICT ARCHITECTURAL INSTRUCTIONS:
1. OpsGuard AI reconciles operational status with fulfilment evidence to identify work that appears complete in one system but remains unresolved or unsupported in another.
2. You are an advisor to a human reviewer. You must NEVER close a case, change business data automatically, approve your own recommendation, or invent missing evidence.
3. Formulate an objective root cause hypothesis explaining the conflicting evidence between recorded operational status, available fulfilment evidence, and downstream status based strictly on the factual logs above.
4. EVIDENCE GROUNDING RULES (CRITICAL):
   - "missingRequiredEvidence": ONLY include evidence explicitly required by the case data, business rules, or record configuration (for example: Completion Evidence / Proof of Delivery). Never claim that photographic evidence, temperature logger calibration reports, customer physical signatures, or other specific items are mandatory unless explicitly configured as required.
   - "possibleFollowUpEvidence": Suggest optional follow-up items that could aid human investigation (e.g. contacting dispatch, reviewing driver logs), but clearly separate them from formally required evidence.
5. Recommend the safest concrete next step for the human operator (e.g. Approve exception if justified, reject/remand completion, request re-upload of POD, or escalate).
6. Provide structured JSON matching the requested schema.
`;

    let response;
    let usedModel = 'gemini-3.8-flash';
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are OpsGuard AI, an enterprise compliance and operational intelligence engine. Provide precise, factual analysis without hallucination. You never approve or close cases automatically.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Concise 2-sentence summary of the contextual circumstance.',
              },
              riskLevel: {
                type: Type.STRING,
                description: 'Operational risk assessment: LOW, MEDIUM, HIGH, or CRITICAL',
              },
              rootCauseHypothesis: {
                type: Type.STRING,
                description: 'Factual root cause inferred from operational notes and timeline.',
              },
              recommendedAction: {
                type: Type.STRING,
                description: 'Clear, actionable recommendation for the human reviewer.',
              },
              recommendationType: {
                type: Type.STRING,
                description: 'Categorical type: APPROVE_EXCEPTION, REJECT_COMPLETION, REQUEST_MORE_INFO, or ESCALATE',
              },
              contextEvidenceFound: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific factual evidence points found in the logs.',
              },
              missingRequiredEvidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Evidence items strictly required by the record configuration or deterministic rules. Do NOT invent requirements.',
              },
              possibleFollowUpEvidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Optional follow-up evidence items that could aid human investigation but are NOT formally required.',
              },
              confidenceScore: {
                type: Type.NUMBER,
                description: 'Confidence between 0.0 and 1.0 based on available contextual fidelity.',
              },
              caveats: {
                type: Type.STRING,
                description: 'Mandatory disclaimer statement reminding that human authorization is required.',
              },
            },
            required: [
              'summary',
              'riskLevel',
              'rootCauseHypothesis',
              'recommendedAction',
              'recommendationType',
              'contextEvidenceFound',
              'missingRequiredEvidence',
              'possibleFollowUpEvidence',
              'confidenceScore',
              'caveats',
            ],
          },
        },
      });
    } catch (primaryErr: any) {
      // If primary model is experiencing a demand spike, fallback to gemini-3.1-flash-lite
      console.warn('Primary model error, attempting gemini-3.1-flash-lite fallback:', primaryErr?.message);
      usedModel = 'gemini-3.1-flash-lite';
      response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction:
            'You are OpsGuard AI, an enterprise compliance and operational intelligence engine. Provide precise, factual analysis without hallucination. You never approve or close cases automatically.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Concise 2-sentence summary of the contextual circumstance.',
              },
              riskLevel: {
                type: Type.STRING,
                description: 'Operational risk assessment: LOW, MEDIUM, HIGH, or CRITICAL',
              },
              rootCauseHypothesis: {
                type: Type.STRING,
                description: 'Factual root cause inferred from operational notes and timeline.',
              },
              recommendedAction: {
                type: Type.STRING,
                description: 'Clear, actionable recommendation for the human reviewer.',
              },
              recommendationType: {
                type: Type.STRING,
                description: 'Categorical type: APPROVE_EXCEPTION, REJECT_COMPLETION, REQUEST_MORE_INFO, or ESCALATE',
              },
              contextEvidenceFound: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific factual evidence points found in the logs.',
              },
              missingRequiredEvidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Evidence items strictly required by the record configuration or deterministic rules. Do NOT invent requirements.',
              },
              possibleFollowUpEvidence: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Optional follow-up evidence items that could aid human investigation but are NOT formally required.',
              },
              confidenceScore: {
                type: Type.NUMBER,
                description: 'Confidence between 0.0 and 1.0 based on available contextual fidelity.',
              },
              caveats: {
                type: Type.STRING,
                description: 'Mandatory disclaimer statement reminding that human authorization is required.',
              },
            },
            required: [
              'summary',
              'riskLevel',
              'rootCauseHypothesis',
              'recommendedAction',
              'recommendationType',
              'contextEvidenceFound',
              'missingRequiredEvidence',
              'possibleFollowUpEvidence',
              'confidenceScore',
              'caveats',
            ],
          },
        },
      });
    }

    const responseText = response.text?.trim() || '{}';
    const parsed = JSON.parse(responseText);

    const missingRequired = Array.isArray(parsed.missingRequiredEvidence)
      ? parsed.missingRequiredEvidence
      : Array.isArray(parsed.missingEvidenceIdentified)
      ? parsed.missingEvidenceIdentified
      : [];
    const possibleFollowUp = Array.isArray(parsed.possibleFollowUpEvidence)
      ? parsed.possibleFollowUpEvidence
      : [];

    const analysisResult: AIAnalysisResult = {
      analysisAvailable: true,
      summary: parsed.summary || 'Contextual analysis completed.',
      riskLevel: parsed.riskLevel || 'MEDIUM',
      rootCauseHypothesis: parsed.rootCauseHypothesis || 'Contextual divergence observed.',
      recommendedAction: parsed.recommendedAction || 'Conduct supervisor review.',
      recommendationType: parsed.recommendationType || 'REQUEST_MORE_INFO',
      contextEvidenceFound: Array.isArray(parsed.contextEvidenceFound)
        ? parsed.contextEvidenceFound
        : [],
      missingRequiredEvidence: missingRequired,
      possibleFollowUpEvidence: possibleFollowUp,
      missingEvidenceIdentified: missingRequired,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.85,
      caveats:
        parsed.caveats ||
        'Advisory interpretation only. Human operator retains final authority for approval or rejection.',
      analyzedAt: new Date().toISOString(),
      modelName: usedModel,
    };

    // Log AI Interpretation in audit trail
    auditLogs.unshift({
      id: `AUD-AI-${Date.now()}`,
      recordId: record.id,
      timestamp: new Date().toISOString(),
      eventType: 'AI_INTERPRETATION',
      actor: 'GEMINI_AI',
      actionSummary: `Contextual Recommendation: ${analysisResult.recommendationType} (Risk: ${analysisResult.riskLevel})`,
      details: `${analysisResult.summary} | Rec: ${analysisResult.recommendedAction}`,
      metadata: { analysisResult },
    });

    res.json({ result: analysisResult });
  } catch (err: any) {
    console.error('Gemini contextual analysis error:', err);
    // As required: "If Gemini fails: show: 'AI analysis unavailable — manual review required.'"
    const fallbackResult: AIAnalysisResult = {
      analysisAvailable: false,
      summary: 'The contextual intelligence service was unable to evaluate this case.',
      riskLevel: 'MEDIUM',
      rootCauseHypothesis: 'Rule threshold breached; manual root cause investigation required.',
      recommendedAction: 'Dispatch supervisor must inspect the physical paperwork.',
      recommendationType: 'REQUEST_MORE_INFO',
      contextEvidenceFound: [],
      missingRequiredEvidence: evaluation.exceptions.map((e) => e.details),
      possibleFollowUpEvidence: ['Direct communication with dispatch agent', 'Manual inspection of physical paperwork'],
      missingEvidenceIdentified: evaluation.exceptions.map((e) => e.details),
      confidenceScore: 0.0,
      caveats: 'Rule detection remains authoritative. AI analysis was bypassed. Human operator retains final authority for approval or rejection.',
      analyzedAt: new Date().toISOString(),
      modelName: 'AI Interpretation',
      errorMessage: 'AI analysis unavailable — manual review required.',
    };

    res.json({ result: fallbackResult });
  }
});

// Human Decision (Approve / Reject)
app.post('/api/decisions', (req: Request, res: Response) => {
  const {
    recordId,
    exceptionType,
    decision,
    reviewerName,
    reviewerRole,
    notes,
  } = req.body;

  const recordIndex = records.findIndex((r) => r.id === recordId);
  if (recordIndex === -1) {
    res.status(404).json({ error: `Record ${recordId} not found.` });
    return;
  }

  if (decision !== 'APPROVED' && decision !== 'REJECTED') {
    res.status(400).json({ error: 'Decision must be APPROVED or REJECTED.' });
    return;
  }

  const humanDecision: HumanDecision = {
    id: `DEC-${Date.now()}`,
    recordId,
    exceptionType: exceptionType || 'OVERDUE',
    decision,
    reviewerName: reviewerName || 'Operations Supervisor',
    reviewerRole: reviewerRole || 'Compliance Lead',
    notes: notes || 'Reviewed contextual operational logs and confirmed disposition.',
    timestamp: new Date().toISOString(),
    actionTaken:
      decision === 'APPROVED'
        ? 'Exception approved by authorized operator; record disposition granted.'
        : 'Exception rejected; case remanded back to operational team for correction.',
  };

  // Update in-memory record review status
  records[recordIndex].reviewStatus = decision;
  records[recordIndex].reviewDecision = humanDecision;

  // Append operational note
  records[recordIndex].operationalNotes.push({
    id: `LOG-DEC-${Date.now()}`,
    author: humanDecision.reviewerName,
    role: humanDecision.reviewerRole,
    timestamp: humanDecision.timestamp,
    content: `HUMAN DECISION [${decision}]: ${humanDecision.notes}`,
    category: 'AGENT',
  });

  // Create persistent audit log
  const auditEntry: AuditLogEntry = {
    id: `AUD-HUMAN-${Date.now()}`,
    recordId,
    timestamp: humanDecision.timestamp,
    eventType: 'HUMAN_DECISION',
    actor: 'HUMAN_REVIEWER',
    actionSummary: `Human Decision: ${decision} by ${humanDecision.reviewerName} (${humanDecision.reviewerRole})`,
    details: `Decision: ${decision} | Justification: ${humanDecision.notes} | Action: ${humanDecision.actionTaken}`,
    metadata: { decision: humanDecision },
  };

  auditLogs.unshift(auditEntry);

  res.json({
    success: true,
    record: records[recordIndex],
    decision: humanDecision,
    auditEntry,
  });
});

// Audit Log Query
app.get('/api/audit-logs', (req: Request, res: Response) => {
  const { recordId, eventType, actor } = req.query;
  let filtered = [...auditLogs];

  if (recordId && typeof recordId === 'string') {
    filtered = filtered.filter((log) => log.recordId === recordId);
  }
  if (eventType && typeof eventType === 'string') {
    filtered = filtered.filter((log) => log.eventType === eventType);
  }
  if (actor && typeof actor === 'string') {
    filtered = filtered.filter((log) => log.actor === actor);
  }

  res.json({ logs: filtered });
});

// Rule Validation & Evaluation
// Compares synthetic records against ground truth labels and calculates TP, FP, FN, precision, recall
app.post('/api/evaluation/run', (req: Request, res: Response) => {
  const activeConfig = BUSINESS_DOMAIN_PRESETS[activeDomainKey];
  const evaluationResult = runRuleValidation(records, activeConfig, EVALUATION_REFERENCE_TIMESTAMP);

  // Add audit log for evaluation run
  auditLogs.unshift({
    id: `AUD-EVAL-${Date.now()}`,
    recordId: 'SYSTEM',
    timestamp: new Date().toISOString(),
    eventType: 'RULE_EVALUATION',
    actor: 'SYSTEM_RULES',
    actionSummary: `Run Rule Validation Executed: ${evaluationResult.totalRecordsEvaluated} test cases evaluated`,
    details: `Overall Precision: ${(evaluationResult.overall.precision * 100).toFixed(1)}%, Recall: ${(evaluationResult.overall.recall * 100).toFixed(1)}%, TP: ${evaluationResult.overall.truePositives}, FP: ${evaluationResult.overall.falsePositives}, FN: ${evaluationResult.overall.falseNegatives}`,
    metadata: { metrics: evaluationResult.overall },
  });

  res.json({ result: evaluationResult });
});

// Reset Records to initial state
app.post('/api/records/reset', (req: Request, res: Response) => {
  records = JSON.parse(JSON.stringify(INITIAL_OPERATIONAL_RECORDS));
  activeDomainKey = DEFAULT_DOMAIN_KEY;
  const log: AuditLogEntry = {
    id: `AUD-RST-${Date.now()}`,
    recordId: 'GLOBAL',
    timestamp: new Date().toISOString(),
    eventType: 'RESET',
    actor: 'HUMAN_REVIEWER',
    actionSummary: 'Synthetic dataset re-initialized to default demo baseline',
    details: 'All 30 operational records reset to baseline demo states (OP-101 to OP-130). Preset restored to Generic Operations.',
  };
  auditLogs.unshift(log);
  res.json({
    success: true,
    message: 'Records reset to default state.',
    activeDomainKey,
    activeConfig: BUSINESS_DOMAIN_PRESETS[activeDomainKey],
  });
});

// ----------------------------------------------------------------
// SERVER BOOTSTRAP (Dev with Vite middlewares vs Production)
// ----------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[OpsGuard AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start OpsGuard server:', err);
  process.exit(1);
});
