import React, { useState } from 'react';
import {
  FileText,
  Clock,
  FileCheck2,
  FileSpreadsheet,
  Server,
  MessageSquare,
  MapPin,
  PenTool,
  Image,
  Activity,
  Network,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Database,
  CheckCircle2,
  Leaf,
  TrendingUp,
  Code2,
} from 'lucide-react';

export const EvidenceCapabilitySection: React.FC = () => {
  const [isTechnicalReviewerOpen, setIsTechnicalReviewerOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* ============================================================= */}
      {/* 1. WHAT CAN OPSGUARD LOOK AT? (CURRENT V0.1 VS FUTURE)         */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block mb-2">
            Reconciliation Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What can OpsGuard look at?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            OpsGuard reconciles operational records against verified proof and customer reality.
          </p>
        </div>

        {/* Current V0.1 Capabilities */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0F766E]" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0F766E]">
              Current V0.1 Active Capabilities
            </h3>
            <span className="text-[11px] bg-teal-50 text-[#0F766E] border border-teal-200 font-bold px-2 py-0.5 rounded-full">
              Live in V0.1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Card 1 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-start space-x-3 hover:border-teal-300 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-teal-100/70 text-[#0F766E] flex items-center justify-center shrink-0">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Recorded status</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Status marked as OPEN, IN_PROGRESS, or COMPLETED in workflow software.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-start space-x-3 hover:border-teal-300 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-teal-100/70 text-[#0F766E] flex items-center justify-center shrink-0">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Due date / SLA</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Promised fulfillment deadlines and elapsed turnaround targets.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-start space-x-3 hover:border-teal-300 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-teal-100/70 text-[#0F766E] flex items-center justify-center shrink-0">
                <FileSpreadsheet className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Mandatory fields</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Required customer name, phone number, and destination address.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-start space-x-3 hover:border-teal-300 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-teal-100/70 text-[#0F766E] flex items-center justify-center shrink-0">
                <FileCheck2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Completion evidence</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Verified proof of completion documents, signed dockets, and upload IDs.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-start space-x-3 hover:border-teal-300 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-teal-100/70 text-[#0F766E] flex items-center justify-center shrink-0">
                <Server className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Downstream outcome</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Independent client status, confirmed resolution, or open escalations.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-start space-x-3 hover:border-teal-300 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-teal-100/70 text-[#0F766E] flex items-center justify-center shrink-0">
                <MessageSquare className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Notes / comments</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Operator logs, courier dispatch comments, and communication records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Capabilities */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-600">
              Future Roadmap Capabilities
            </h3>
            <span className="text-[11px] bg-slate-100 text-slate-600 border border-slate-300 font-bold px-2 py-0.5 rounded-full">
              Roadmap · Not active in V0.1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-slate-500 mb-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Location / GPS</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Geofence verification of physical delivery coordinates.
              </p>
            </div>

            <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-slate-500 mb-1.5">
                <PenTool className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Signatures</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Biometric signature capture and cryptographic verification.
              </p>
            </div>

            <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-slate-500 mb-1.5">
                <Image className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Photos / images</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Computer vision assessment of doorstep drops and condition photos.
              </p>
            </div>

            <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-slate-500 mb-1.5">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Telemetry</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                IoT cold-chain temperature sensors and vehicle OBD telematics.
              </p>
            </div>

            <div className="bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-slate-500 mb-1.5">
                <Network className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Live 3P APIs</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Real-time carrier webhooks and external partner EDI integrations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. BUSINESS VALUE & SUSTAINABILITY BY DESIGN                   */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Business Value */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200/70">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                Operational Impact
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Business value
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Clear operational outcomes achieved through cross-system reconciliation:
            </p>

            {/* Exactly the 6 requested plain operational points */}
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span className="font-medium">Reduce avoidable rework</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span className="font-medium">Surface conflicting records earlier</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span className="font-medium">Reduce manual checking effort</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span className="font-medium">Help reviewers focus on exceptions</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span className="font-medium">Create clearer audit evidence</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] shrink-0 mt-0.5" />
                <span className="font-medium">Support consistent operational decisions</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
            OpsGuard focuses purely on process consistency and verifiable operational truth.
          </div>
        </div>

        {/* Sustainability by Design */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Process Integrity
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Sustainability by design
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Operational sustainability through streamlined workflow integrity:
            </p>

            {/* Exactly the 4 requested operational sustainability points */}
            <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span className="font-medium">Reduce avoidable rework</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span className="font-medium">Use people’s time better</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span className="font-medium">Support digital evidence and audit trails</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span className="font-medium">
                  Reduce unnecessary repeat activity where operational conflicts are caught earlier
                </span>
              </li>
            </ul>
          </div>

          {/* Mandatory Environmental Note as specified in Prompt */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-700 font-semibold block mb-0.5">Measurement Note:</strong>
            Clearly defined as operational sustainability. Any physical or environmental impact would require separate empirical measurement.
          </div>
        </div>

      </div>

      {/* ============================================================= */}
      {/* 3. COLLAPSED “FOR TECHNICAL REVIEWERS”                         */}
      {/* ============================================================= */}
      <div className="border border-slate-200/90 rounded-2xl bg-white shadow-2xs overflow-hidden">
        <button
          onClick={() => setIsTechnicalReviewerOpen(!isTechnicalReviewerOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">For technical reviewers</h3>
              <p className="text-xs text-slate-500">
                Architectural details, deterministic rules, and AI governance mechanisms.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>{isTechnicalReviewerOpen ? 'Collapse' : 'Expand technical specs'}</span>
            {isTechnicalReviewerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {isTechnicalReviewerOpen && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  1. Deterministic Rule Engine
                </span>
                <p className="text-slate-600 text-[11px]">
                  Three zero-hallucination TypeScript predicates evaluate SLA due dates, mandatory required fields, and completion evidence. Code strictly controls exception states without probabilistic guessing.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  2. Exception-Only Gemini Invocation
                </span>
                <p className="text-slate-600 text-[11px]">
                  Gemini 2.5 Flash is invoked exclusively when exceptions are surfaced by rules. Compliant records bypass AI processing, minimizing compute overhead and cost.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  3. Human-in-the-Loop Governance
                </span>
                <p className="text-slate-600 text-[11px]">
                  Autonomous closure rate is strictly 0%. The AI model provides context synthesis and recommendations, but only credentialed human supervisors can approve or reject records.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  4. Persistent Audit Trail &amp; Synthetic Harness
                </span>
                <p className="text-slate-600 text-[11px]">
                  Every rule execution, advisory payload, and human decision is logged with timestamps and operator identity. The 30-case synthetic validation harness verifies 100% precision and recall.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
