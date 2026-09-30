import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onSelectRecord?: (recordId: string) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onSelectRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleTechnicalDetails = (logId: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  // Helper to format 24h / 12h time string (e.g. "10:31")
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '';
    }
  };

  // Helper to format date string (e.g. "29 Sep 2026")
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  // Plain-English mapping for events
  const getPlainEnglishEvent = (log: AuditLogEntry) => {
    const summaryLower = (log.actionSummary || '').toLowerCase();
    const detailsLower = (log.details || '').toLowerCase();

    // 1. Human Decision Events
    if (log.actor === 'HUMAN_REVIEWER' || log.eventType === 'HUMAN_DECISION') {
      const reviewerRole = log.metadata?.reviewerRole || 'Operations Reviewer';

      if (summaryLower.includes('approved')) {
        return {
          title: 'Case completion approved',
          description: `Reviewed by ${reviewerRole}`,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotColor: 'bg-emerald-500 ring-emerald-100',
        };
      }

      if (
        summaryLower.includes('rejected') ||
        summaryLower.includes('remand') ||
        summaryLower.includes('open')
      ) {
        return {
          title: 'Case kept open',
          description: `Reviewed by ${reviewerRole}`,
          badgeColor: 'bg-amber-50 text-[#B45309] border-amber-200',
          dotColor: 'bg-[#B45309] ring-amber-100',
        };
      }

      return {
        title: 'Decision recorded',
        description: `Reviewed by ${reviewerRole}`,
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        dotColor: 'bg-slate-500 ring-slate-100',
      };
    }

    // 2. AI Summary Events
    if (log.actor === 'GEMINI_AI' || log.eventType === 'AI_INTERPRETATION') {
      if (
        summaryLower.includes('unavailable') ||
        summaryLower.includes('error') ||
        detailsLower.includes('unavailable')
      ) {
        return {
          title: 'Summary skipped',
          description: 'Manual review required',
          badgeColor: 'bg-amber-50 text-[#B45309] border-amber-200',
          dotColor: 'bg-amber-500 ring-amber-100',
        };
      }

      return {
        title: 'Summary prepared',
        description: 'Context and guidance prepared for reviewer',
        badgeColor: 'bg-teal-50 text-[#0F766E] border-teal-200',
        dotColor: 'bg-[#0F766E] ring-teal-100',
      };
    }

    // 3. Automated System Checks
    // Example: “Deterministic Rule Triggered: COMPLETED_WITHOUT_EVIDENCE” -> "Issue found", "Completion proof is missing."
    if (
      summaryLower.includes('completed_without_evidence') ||
      detailsLower.includes('completed_without_evidence') ||
      summaryLower.includes('status conflict')
    ) {
      return {
        title: 'Issue found',
        description: 'Completion proof is missing.',
        badgeColor: 'bg-amber-50 text-[#B45309] border-amber-200',
        dotColor: 'bg-amber-500 ring-amber-100',
      };
    }

    if (summaryLower.includes('overdue') || detailsLower.includes('overdue')) {
      return {
        title: 'Issue found',
        description: 'The case has passed its due date.',
        badgeColor: 'bg-amber-50 text-[#B45309] border-amber-200',
        dotColor: 'bg-amber-500 ring-amber-100',
      };
    }

    if (summaryLower.includes('missing_info') || detailsLower.includes('missing')) {
      return {
        title: 'Issue found',
        description: 'Required operational information is missing.',
        badgeColor: 'bg-amber-50 text-[#B45309] border-amber-200',
        dotColor: 'bg-amber-500 ring-amber-100',
      };
    }

    if (
      summaryLower.includes('conflict') ||
      summaryLower.includes('exception') ||
      summaryLower.includes('rule triggered') ||
      summaryLower.includes('flagged')
    ) {
      return {
        title: 'Issue found',
        description: 'Flagged for operational review.',
        badgeColor: 'bg-amber-50 text-[#B45309] border-amber-200',
        dotColor: 'bg-amber-500 ring-amber-100',
      };
    }

    if (
      summaryLower.includes('passed') ||
      summaryLower.includes('compliant') ||
      summaryLower.includes('normal') ||
      summaryLower.includes('reconciled')
    ) {
      return {
        title: 'Case checked and verified',
        description: 'All requirements met',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500 ring-emerald-100',
      };
    }

    return {
      title: 'Activity recorded',
      description: 'System activity recorded',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      dotColor: 'bg-slate-400 ring-slate-100',
    };
  };

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;

    const q = searchQuery.toLowerCase().trim();
    return logs.filter((log) => {
      const matchRecord = log.recordId.toLowerCase().includes(q);
      const matchSummary = (log.actionSummary || '').toLowerCase().includes(q);
      const matchDetails = (log.details || '').toLowerCase().includes(q);
      const plainInfo = getPlainEnglishEvent(log);
      const matchPlainTitle = plainInfo.title.toLowerCase().includes(q);
      const matchPlainLabel = plainInfo.description.toLowerCase().includes(q);

      return (
        matchRecord ||
        matchSummary ||
        matchDetails ||
        matchPlainTitle ||
        matchPlainLabel
      );
    });
  }, [logs, searchQuery]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* ============================================================= */}
      {/* 1. PAGE TITLE & SUBTITLE                                      */}
      {/* ============================================================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Decision History
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1 font-normal">
          See what happened and when.
        </p>
      </div>

      {/* ============================================================= */}
      {/* 2. SEARCH BOX                                                 */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by case ID or event description..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>
      </div>

      {/* ============================================================= */}
      {/* 3. SIMPLE READABLE TIMELINE                                   */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 space-y-2 text-slate-500">
            <Clock className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No events found</p>
            <p className="text-xs text-slate-500">
              {searchQuery ? 'Try clearing your search term.' : 'History will appear here as cases are reviewed.'}
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-8 my-2">
            {filteredLogs.map((log) => {
              const eventInfo = getPlainEnglishEvent(log);
              const isDetailsOpen = Boolean(expandedDetails[log.id]);
              const timeString = formatTime(log.timestamp);
              const dateString = formatDate(log.timestamp);
              const isCaseSpecific = log.recordId && log.recordId !== 'GLOBAL' && log.recordId !== 'SYSTEM';

              return (
                <div key={log.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full ring-4 transition-transform ${eventInfo.dotColor}`}
                  />

                  {/* Timeline Item Content */}
                  <div className="space-y-1.5">
                    {/* Timestamp & Case ID Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {timeString || '10:30'}
                      </span>

                      {dateString && (
                        <span className="text-[11px] text-slate-400 font-medium">
                          {dateString}
                        </span>
                      )}

                      {isCaseSpecific && (
                        <button
                          onClick={() => onSelectRecord && onSelectRecord(log.recordId)}
                          className="font-mono text-xs font-bold text-[#0F766E] hover:underline flex items-center space-x-1"
                        >
                          <span>{log.recordId}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                        </button>
                      )}
                    </div>

                    {/* Plain-English Event Title */}
                    <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {eventInfo.title}
                    </div>

                    {/* Plain-English Subtitle / Description */}
                    <div className="text-xs sm:text-sm text-slate-600 font-normal">
                      {eventInfo.description}
                    </div>

                    {/* Human Reviewer Notes if available */}
                    {log.metadata?.notes && (
                      <div className="mt-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 italic">
                        "{log.metadata.notes}"
                      </div>
                    )}

                    {/* Collapsed by Default: Technical details ▾ */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleTechnicalDetails(log.id)}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <span>Technical details</span>
                        {isDetailsOpen ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {isDetailsOpen && (
                        <div className="mt-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs animate-slide-up">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 font-mono">
                            <div>
                              <span className="text-slate-400 block">Event ID:</span>
                              <span className="text-slate-700 font-bold">{log.id}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Actor Code:</span>
                              <span className="text-slate-700 font-bold">{log.actor}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Event Type:</span>
                              <span className="text-slate-700 font-bold">{log.eventType}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Raw Action:</span>
                              <span className="text-slate-700 truncate block">{log.actionSummary}</span>
                            </div>
                          </div>

                          {log.details && (
                            <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                              <span className="text-slate-400 block mb-0.5">Details:</span>
                              <p className="leading-relaxed">{log.details}</p>
                            </div>
                          )}

                          {log.metadata && (
                            <div className="pt-1 border-t border-slate-200">
                              <span className="text-slate-400 block text-[10px] mb-1 font-mono">
                                Raw Metadata:
                              </span>
                              <pre className="text-[10px] font-mono bg-slate-900 text-slate-100 p-2.5 rounded-lg overflow-x-auto leading-relaxed">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
