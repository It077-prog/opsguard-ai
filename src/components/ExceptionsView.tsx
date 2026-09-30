import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { OperationalRecord, BusinessDomainConfig, ExceptionType } from '../types';

interface ExceptionsViewProps {
  records: (OperationalRecord & { evaluation?: any })[];
  activeConfig: BusinessDomainConfig;
  onSelectRecord: (recordId: string) => void;
  initialFilter?: ExceptionType | 'ALL';
}

interface IssueBadgeItem {
  id: string;
  label: string;
  color: string;
}

type PrimaryFilterType = 'ALL' | 'NEEDS_ATTENTION' | 'AWAITING_DECISION' | 'NORMAL';

export const ExceptionsView: React.FC<ExceptionsViewProps> = ({
  records,
  activeConfig,
  onSelectRecord,
  initialFilter = 'ALL',
}) => {
  // Primary Filter
  const [primaryFilter, setPrimaryFilter] = useState<PrimaryFilterType>('ALL');

  // Secondary Filters
  const [issueFilter, setIssueFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Counts for primary filter badges
  const totalCount = records.length;
  const exceptionRecords = records.filter(
    (r) => r.evaluation && !r.evaluation.isNormal
  );
  const normalRecords = records.filter(
    (r) => r.evaluation && r.evaluation.isNormal
  );
  const awaitingDecisionRecords = exceptionRecords.filter(
    (r) => r.reviewStatus === 'UNREVIEWED'
  );

  // Helper to format plain-English issue labels
  const getPlainEnglishIssues = (record: OperationalRecord & { evaluation?: any }): IssueBadgeItem[] => {
    const exceptions = record.evaluation?.exceptions || [];
    if (exceptions.length === 0) {
      return [{ id: 'normal', label: 'Normal', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }];
    }

    return exceptions.map((exc: any) => {
      if (exc.type === 'COMPLETED_WITHOUT_EVIDENCE') {
        return {
          id: exc.id,
          label: 'Status conflict',
          color: 'bg-amber-100/80 text-amber-950 border-amber-300 font-bold',
        };
      }
      if (exc.type === 'OVERDUE') {
        return {
          id: exc.id,
          label: 'Past due',
          color: 'bg-amber-50 text-[#B45309] border-amber-200 font-semibold',
        };
      }
      if (exc.type === 'MISSING_INFO') {
        return {
          id: exc.id,
          label: 'Missing information',
          color: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
        };
      }
      return {
        id: exc.id,
        label: 'Issue',
        color: 'bg-amber-50 text-amber-900 border-amber-200',
      };
    });
  };

  // Helper for formatted status text
  const formatStatus = (status: string) => {
    if (status === 'COMPLETED') return 'Completed';
    if (status === 'IN_PROGRESS') return 'In Progress';
    if (status === 'OPEN') return 'Open';
    return status;
  };

  // Filtered records based on search and filters
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // 1. Primary Filter
      if (primaryFilter === 'NEEDS_ATTENTION') {
        if (!record.evaluation || record.evaluation.isNormal) return false;
      } else if (primaryFilter === 'AWAITING_DECISION') {
        if (!record.evaluation || record.evaluation.isNormal || record.reviewStatus !== 'UNREVIEWED') {
          return false;
        }
      } else if (primaryFilter === 'NORMAL') {
        if (!record.evaluation || !record.evaluation.isNormal) return false;
      }

      // 2. Issue Type Secondary Filter
      if (issueFilter !== 'ALL') {
        if (issueFilter === 'NORMAL') {
          if (!record.evaluation || !record.evaluation.isNormal) return false;
        } else {
          const hasType = record.evaluation?.exceptions?.some(
            (e: any) => e.type === issueFilter
          );
          if (!hasType) return false;
        }
      }

      // 3. Status Secondary Filter
      if (statusFilter !== 'ALL') {
        if (record.status !== statusFilter) return false;
      }

      // 4. Search Query: case, owner, or customer
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchId = record.id.toLowerCase().includes(q);
        const matchTitle = record.title.toLowerCase().includes(q);
        const matchOwner = record.assignedAgent.toLowerCase().includes(q);
        const matchCustomer = (record.requiredFields.customerName || '')
          .toLowerCase()
          .includes(q);

        if (!matchId && !matchTitle && !matchOwner && !matchCustomer) {
          return false;
        }
      }

      return true;
    });
  }, [records, primaryFilter, issueFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ============================================================= */}
      {/* 1. PAGE TITLE & SUBTITLE                                      */}
      {/* ============================================================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Cases
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1 font-normal">
          Find and review operational cases.
        </p>
      </div>

      {/* ============================================================= */}
      {/* 2. SEARCH & FILTERS BAR                                       */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Search Box */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search case, owner or customer"
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Primary Filters: All, Needs Attention, Awaiting Decision, Normal */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => setPrimaryFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              primaryFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => setPrimaryFilter('NEEDS_ATTENTION')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              primaryFilter === 'NEEDS_ATTENTION'
                ? 'bg-[#B45309] text-white shadow-2xs'
                : 'text-[#B45309] bg-amber-50 hover:bg-amber-100/70 border border-amber-200'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Needs Attention ({exceptionRecords.length})</span>
          </button>

          <button
            onClick={() => setPrimaryFilter('AWAITING_DECISION')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              primaryFilter === 'AWAITING_DECISION'
                ? 'bg-[#0F766E] text-white shadow-2xs'
                : 'text-[#0F766E] bg-teal-50 hover:bg-teal-100/70 border border-teal-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Awaiting Decision ({awaitingDecisionRecords.length})</span>
          </button>

          <button
            onClick={() => setPrimaryFilter('NORMAL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              primaryFilter === 'NORMAL'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Normal ({normalRecords.length})</span>
          </button>
        </div>

        {/* Secondary Optional Filters: Issue Type & Status */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500">
          {/* Issue Type */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-400">Issue type:</span>
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0F766E]"
            >
              <option value="ALL">All issues</option>
              <option value="COMPLETED_WITHOUT_EVIDENCE">Status conflict</option>
              <option value="OVERDUE">Past due</option>
              <option value="MISSING_INFO">Missing information</option>
              <option value="NORMAL">None (Normal)</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0F766E]"
            >
              <option value="ALL">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="OPEN">Open</option>
            </select>
          </div>

          {(issueFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setIssueFilter('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="text-xs font-medium text-[#0F766E] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 3. CASE LIST: DESKTOP TABLE & MOBILE STACKED CARDS            */}
      {/* ============================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {/* Header showing match count */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredRecords.length}</strong> of{' '}
            <strong className="text-slate-900">{records.length}</strong> cases
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <FolderOpen className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No cases match your filters</p>
            <p className="text-xs text-slate-500">Try changing your search term or selecting "All".</p>
            <button
              onClick={() => {
                setPrimaryFilter('ALL');
                setIssueFilter('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F766E] bg-teal-50 border border-teal-200"
            >
              Show all cases
            </button>
          </div>
        ) : (
          <>
            {/* --------------------------------------------------------- */}
            {/* DESKTOP / TABLET VIEW (TABLE)                             */}
            {/* --------------------------------------------------------- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="py-3 px-6">Case ID</th>
                    <th className="py-3 px-6">Case title</th>
                    <th className="py-3 px-6">Issue</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Owner</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRecords.map((record) => {
                    const issues = getPlainEnglishIssues(record);
                    const isPrimary = record.id === 'OP-101';

                    return (
                      <tr
                        key={record.id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          isPrimary ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* Case ID */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-900">
                              {record.id}
                            </span>
                            {isPrimary && (
                              <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                                Showcase
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Case title */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900 max-w-sm">
                            {record.title}
                          </div>
                          {record.requiredFields.customerName && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {record.requiredFields.customerName}
                            </div>
                          )}
                        </td>

                        {/* Issue */}
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap items-center gap-2">
                            {issues.map((issue) => (
                              <span
                                key={issue.id}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${issue.color}`}
                              >
                                {issue.label}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="text-slate-800 font-medium">
                            {formatStatus(record.status)}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="text-slate-700 font-medium">
                            {record.assignedAgent}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectRecord(record.id)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F766E] bg-teal-50 hover:bg-[#0F766E] hover:text-white border border-teal-200/80 hover:border-[#0F766E] transition-all shadow-2xs"
                          >
                            <span>Review →</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* --------------------------------------------------------- */}
            {/* MOBILE VIEW (STACKED CASE CARDS)                          */}
            {/* --------------------------------------------------------- */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredRecords.map((record) => {
                const issues = getPlainEnglishIssues(record);
                const isPrimary = record.id === 'OP-101';

                return (
                  <div
                    key={record.id}
                    className={`p-5 space-y-3 ${isPrimary ? 'bg-amber-50/20' : ''}`}
                  >
                    {/* Header: ID & Title */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {record.id}
                        </span>
                        {isPrimary && (
                          <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                            Showcase
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                        {record.title}
                      </div>
                      {record.requiredFields.customerName && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {record.requiredFields.customerName}
                        </div>
                      )}
                    </div>

                    {/* Issue & Status */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {issues.map((issue) => (
                        <span
                          key={issue.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${issue.color}`}
                        >
                          {issue.label}
                        </span>
                      ))}

                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {formatStatus(record.status)}
                      </span>
                    </div>

                    {/* Owner */}
                    <div className="text-xs text-slate-600 font-medium">
                      Owner: {record.assignedAgent}
                    </div>

                    {/* Action */}
                    <div className="pt-1">
                      <button
                        onClick={() => onSelectRecord(record.id)}
                        className="w-full py-2.5 px-4 text-xs font-bold rounded-xl text-[#0F766E] bg-teal-50 hover:bg-[#0F766E] hover:text-white border border-teal-200/80 hover:border-[#0F766E] transition-all flex items-center justify-center space-x-1 shadow-2xs min-h-[44px]"
                      >
                        <span>Review →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
