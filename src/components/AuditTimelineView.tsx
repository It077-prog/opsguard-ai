import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  UserCheck,
  BadgeCheck,
  XCircle,
  FileCode,
  ArrowRight,
  Clock3,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditTimelineViewProps {
  logs: AuditLogEntry[];
  onSelectRecord?: (recordId: string) => void;
  onViewJson: (log: AuditLogEntry) => void;
}

export const AuditTimelineView: React.FC<AuditTimelineViewProps> = ({
  logs,
  onSelectRecord,
  onViewJson,
}) => {
  return (
    <div className="py-2 px-2 sm:px-4">
      <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-6">
        {logs.map((log, index) => {
          const isApproved = log.actionSummary.toLowerCase().includes('approved');
          const isRejected =
            log.actionSummary.toLowerCase().includes('rejected') ||
            log.actionSummary.toLowerCase().includes('remand');
          const isAiError =
            log.actionSummary.toLowerCase().includes('error') ||
            log.actionSummary.toLowerCase().includes('unavailable') ||
            log.details.toLowerCase().includes('unavailable');
          const isExceptionTriggered =
            log.actionSummary.toLowerCase().includes('exception') ||
            log.actionSummary.toLowerCase().includes('conflict') ||
            log.actionSummary.toLowerCase().includes('overdue') ||
            log.actionSummary.toLowerCase().includes('missing');

          const getActorNode = () => {
            if (log.actor === 'HUMAN_REVIEWER') {
              if (isApproved) {
                return {
                  icon: BadgeCheck,
                  bg: 'bg-[#0F766E] text-white ring-4 ring-teal-100',
                  stageLabel: 'Human decision: Approved',
                  border: 'border-teal-200 bg-teal-50/40',
                };
              }
              if (isRejected) {
                return {
                  icon: XCircle,
                  bg: 'bg-rose-600 text-white ring-4 ring-rose-100',
                  stageLabel: 'Human decision: Rejected',
                  border: 'border-rose-200 bg-rose-50/40',
                };
              }
              return {
                icon: UserCheck,
                bg: 'bg-amber-600 text-white ring-4 ring-amber-100',
                stageLabel: 'Human decision recorded',
                border: 'border-amber-200 bg-amber-50/40',
              };
            }

            if (log.actor === 'GEMINI_AI') {
              if (isAiError) {
                return {
                  icon: AlertTriangle,
                  bg: 'bg-amber-600 text-white ring-4 ring-amber-100',
                  stageLabel: 'AI response unavailable (manual review required)',
                  border: 'border-amber-200 bg-amber-50/40',
                };
              }
              return {
                icon: Sparkles,
                bg: 'bg-indigo-600 text-white ring-4 ring-indigo-100',
                stageLabel: 'AI response received',
                border: 'border-indigo-200 bg-indigo-50/30',
              };
            }

            // SYSTEM_RULES
            if (isExceptionTriggered) {
              return {
                icon: AlertTriangle,
                bg: 'bg-amber-700 text-white ring-4 ring-amber-100',
                stageLabel: 'Rule triggered · Case detected',
                border: 'border-amber-200 bg-amber-50/30',
              };
            }

            return {
              icon: ShieldCheck,
              bg: 'bg-teal-700 text-white ring-4 ring-teal-100',
              stageLabel: 'Rule evaluated · Normal pass-through',
              border: 'border-slate-200 bg-slate-50/80',
            };
          };

          const node = getActorNode();
          const Icon = node.icon;

          return (
            <div
              key={log.id}
              className="relative pl-6 sm:pl-8 group animate-slide-up"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              {/* Timeline Bullet Icon Node */}
              <div
                className={`absolute -left-4 top-1.5 h-8 w-8 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${node.bg}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Timeline Card */}
              <div
                className={`border rounded-2xl p-4 sm:p-5 shadow-2xs transition-shadow group-hover:shadow-xs ${node.border}`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-slate-200/60">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">
                      {node.stageLabel}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] font-mono text-slate-500 flex items-center">
                      <Clock3 className="h-3 w-3 mr-1 text-slate-400" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {log.recordId !== 'GLOBAL' && log.recordId !== 'SYSTEM' && (
                      <button
                        onClick={() =>
                          onSelectRecord && onSelectRecord(log.recordId)
                        }
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-white border border-slate-300 text-slate-800 hover:text-[#0F766E] hover:border-[#0F766E] transition-colors flex items-center space-x-1 shadow-2xs"
                      >
                        <span>Case: {log.recordId}</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => onViewJson(log)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Inspect JSON Payload"
                    >
                      <FileCode className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Summary & Details */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    {log.actionSummary}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {log.details}
                  </p>

                  {/* Reviewer Comment Callout if logged by human */}
                  {log.actor === 'HUMAN_REVIEWER' && log.metadata?.notes && (
                    <div className="mt-3 p-3 bg-white/90 border border-slate-200 rounded-xl flex items-start space-x-2 text-xs">
                      <MessageSquare className="h-3.5 w-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Reviewer comment
                        </span>
                        <span className="text-slate-800 font-medium italic mt-0.5 block">
                          "{log.metadata.notes}"
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
