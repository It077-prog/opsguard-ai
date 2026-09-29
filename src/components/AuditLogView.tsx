import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Sparkles,
  UserCheck,
  FileCode,
  X,
  BadgeCheck,
  XCircle,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  List,
  GitCommit,
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';
import { AuditTimelineView } from './AuditTimelineView';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onSelectRecord?: (recordId: string) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onSelectRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actorFilter, setActorFilter] = useState<'ALL' | 'SYSTEM_RULES' | 'GEMINI_AI' | 'HUMAN_REVIEWER'>('ALL');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (actorFilter !== 'ALL' && log.actor !== actorFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchRecord = log.recordId.toLowerCase().includes(q);
      const matchSummary = log.actionSummary.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      if (!matchRecord && !matchSummary && !matchDetails) return false;
    }
    return true;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opsguard-audit-log-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {/* Title & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Auditable Decision Log
            </h1>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {logs.length} Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronological audit record of all deterministic checks, AI context advisories, and human operator decisions.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          {/* Timeline vs Table View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitCommit className="h-3.5 w-3.5 text-[#0F766E]" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5 text-slate-500" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by record ID, event, actor, notes..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0F766E] bg-slate-50 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Actor Segmented Tabs */}
        <div className="flex items-center space-x-1 text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-medium mr-1 text-[11px] flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            Actor:
          </span>
          <button
            onClick={() => setActorFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              actorFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setActorFilter('SYSTEM_RULES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              actorFilter === 'SYSTEM_RULES'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>What OpsGuard found</span>
          </button>
          <button
            onClick={() => setActorFilter('GEMINI_AI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              actorFilter === 'GEMINI_AI'
                ? 'bg-indigo-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>What AI thinks</span>
          </button>
          <button
            onClick={() => setActorFilter('HUMAN_REVIEWER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              actorFilter === 'HUMAN_REVIEWER'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Your final decision</span>
          </button>
        </div>
      </div>

      {/* Main View Area: Timeline or Table */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-xl p-12 shadow-2xs">
          <EmptyState
            type="NO_AUDIT_LOGS"
            title={searchQuery ? 'No matching audit records' : 'No decisions recorded in audit log'}
            description={
              searchQuery
                ? `No audit trail entries matched query "${searchQuery}".`
                : 'Decisions submitted by human operators and system rule checks will be recorded here.'
            }
          />
        </div>
      ) : viewMode === 'timeline' ? (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Sequential Governance Timeline
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredLogs.length} events
            </span>
          </div>
          <AuditTimelineView
            logs={filteredLogs}
            onSelectRecord={onSelectRecord}
            onViewJson={(log) => setSelectedLog(log)}
          />
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Timestamp</th>
                  <th scope="col" className="px-4 py-3">Case ID</th>
                  <th scope="col" className="px-4 py-3">Actor &amp; Layer</th>
                  <th scope="col" className="px-4 py-3">Action Disposition</th>
                  <th scope="col" className="px-4 py-3">Decision / Comment</th>
                  <th scope="col" className="px-4 py-3 text-right">Audit Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filteredLogs.map((log) => {
                  const isApproved = log.actionSummary.toLowerCase().includes('approved');
                  const isRejected = log.actionSummary.toLowerCase().includes('rejected') || log.actionSummary.toLowerCase().includes('remand');

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono text-[11px] tabular-nums">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      {/* Case ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.recordId !== 'GLOBAL' && log.recordId !== 'SYSTEM' ? (
                          <button
                            onClick={() => onSelectRecord && onSelectRecord(log.recordId)}
                            className="font-mono font-bold text-slate-900 hover:text-[#0F766E] hover:underline flex items-center space-x-1"
                          >
                            <span>{log.recordId}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                          </button>
                        ) : (
                          <span className="font-mono text-slate-400 font-semibold">
                            {log.recordId}
                          </span>
                        )}
                      </td>

                      {/* Actor & Layer */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.actor === 'SYSTEM_RULES' && (
                          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-[#0F766E] border border-teal-200">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>System Rules</span>
                          </span>
                        )}
                        {log.actor === 'GEMINI_AI' && (
                          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Gemini Advisory</span>
                          </span>
                        )}
                        {log.actor === 'HUMAN_REVIEWER' && (
                          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                            <UserCheck className="h-3.5 w-3.5 text-[#B45309]" />
                            <span>Human Decision</span>
                          </span>
                        )}
                      </td>

                      {/* Action Summary with Icon */}
                      <td className="px-4 py-3 font-semibold text-slate-800 max-w-[260px] truncate">
                        <div className="flex items-center space-x-1.5">
                          {isApproved && <BadgeCheck className="h-3.5 w-3.5 text-[#0F766E] shrink-0" />}
                          {isRejected && <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />}
                          <span className="truncate">{log.actionSummary}</span>
                        </div>
                      </td>

                      {/* Details / Comment */}
                      <td className="px-4 py-3 text-slate-600 max-w-[360px] truncate text-[11px]">
                        {log.details}
                      </td>

                      {/* Raw Payload trigger */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors inline-flex items-center space-x-1"
                          title="View Raw Audit JSON"
                        >
                          <FileCode className="h-3.5 w-3.5 text-slate-500" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw JSON Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <FileCode className="h-4 w-4 text-[#0F766E]" />
                <span className="text-sm font-bold text-slate-900">
                  Audit Log Entry: {selectedLog.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs">
              <pre className="leading-relaxed">{JSON.stringify(selectedLog, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
