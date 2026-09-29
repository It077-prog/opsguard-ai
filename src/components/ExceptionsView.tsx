import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  Clock3,
  FileWarning,
  GitCompare,
  TriangleAlert,
  ChevronRight,
  User,
  Sparkles,
} from 'lucide-react';
import { OperationalRecord, BusinessDomainConfig, ExceptionType } from '../types';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';

interface ExceptionsViewProps {
  records: (OperationalRecord & { evaluation?: any })[];
  activeConfig: BusinessDomainConfig;
  onSelectRecord: (recordId: string) => void;
  initialFilter?: ExceptionType | 'ALL';
}

export const ExceptionsView: React.FC<ExceptionsViewProps> = ({
  records,
  activeConfig,
  onSelectRecord,
  initialFilter = 'ALL',
}) => {
  const [filterType, setFilterType] = useState<ExceptionType | 'ALL'>(initialFilter);
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'UNREVIEWED' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only records that have detected exceptions
  const allExceptionRecords = records.filter(
    (r) => r.evaluation && !r.evaluation.isNormal && r.evaluation.exceptions.length > 0
  );

  const filteredRecords = allExceptionRecords.filter((record) => {
    // Exception type filter
    if (filterType !== 'ALL') {
      const hasType = record.evaluation.exceptions.some(
        (e: any) => e.type === filterType
      );
      if (!hasType) return false;
    }

    // Review status filter
    if (reviewFilter !== 'ALL') {
      if (record.reviewStatus !== reviewFilter) return false;
    }

    // Text search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = record.id.toLowerCase().includes(q);
      const matchTitle = record.title.toLowerCase().includes(q);
      const matchAgent = record.assignedAgent.toLowerCase().includes(q);
      const matchCustomer = (record.requiredFields.customerName || '')
        .toLowerCase()
        .includes(q);
      if (!matchId && !matchTitle && !matchAgent && !matchCustomer) return false;
    }

    return true;
  });

  // Calculate counts for tabs
  const overdueCount = allExceptionRecords.filter((r) =>
    r.evaluation.exceptions.some((e: any) => e.type === 'OVERDUE')
  ).length;

  const missingInfoCount = allExceptionRecords.filter((r) =>
    r.evaluation.exceptions.some((e: any) => e.type === 'MISSING_INFO')
  ).length;

  const missingEvidenceCount = allExceptionRecords.filter((r) =>
    r.evaluation.exceptions.some((e: any) => e.type === 'COMPLETED_WITHOUT_EVIDENCE')
  ).length;

  return (
    <div className="space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Work Items Flagged for Review
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-[#B45309] border border-amber-300">
              {allExceptionRecords.length} Flagged
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Cases flagged by automated safeguards, ready for AI advice and your final human sign-off.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium self-start sm:self-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          Showing <strong className="text-slate-900">{filteredRecords.length}</strong> of{' '}
          <strong className="text-slate-900">{allExceptionRecords.length}</strong> cases
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3.5">
        {/* Top: Safeguard Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center">
            <Filter className="h-3.5 w-3.5 mr-1 text-slate-400" />
            Filter by safeguard:
          </span>

          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Flagged ({allExceptionRecords.length})
          </button>

          <button
            onClick={() => setFilterType('COMPLETED_WITHOUT_EVIDENCE')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 ${
              filterType === 'COMPLETED_WITHOUT_EVIDENCE'
                ? 'bg-[#0F766E] text-white shadow-2xs'
                : 'text-[#0F766E] bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Status Conflict ({missingEvidenceCount})</span>
          </button>

          <button
            onClick={() => setFilterType('OVERDUE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              filterType === 'OVERDUE'
                ? 'bg-[#B45309] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock3 className="h-3.5 w-3.5" />
            <span>Overdue ({overdueCount})</span>
          </button>

          <button
            onClick={() => setFilterType('MISSING_INFO')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              filterType === 'MISSING_INFO'
                ? 'bg-[#B45309] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileWarning className="h-3.5 w-3.5" />
            <span>Missing Information ({missingInfoCount})</span>
          </button>
        </div>

        {/* Bottom: Search Input & Disposition Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (e.g. OP-101), title, customer, or owner..."
              className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F766E] bg-slate-50 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Review Filter */}
          <div className="flex items-center space-x-1 text-xs overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-medium mr-1 text-xs">Review state:</span>
            <button
              onClick={() => setReviewFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                reviewFilter === 'ALL'
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setReviewFilter('UNREVIEWED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                reviewFilter === 'UNREVIEWED'
                  ? 'bg-amber-100 text-[#B45309]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Awaiting Decision ({allExceptionRecords.filter((r) => r.reviewStatus === 'UNREVIEWED').length})
            </button>
            <button
              onClick={() => setReviewFilter('APPROVED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                reviewFilter === 'APPROVED'
                  ? 'bg-teal-100 text-[#0F766E]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Approved ({allExceptionRecords.filter((r) => r.reviewStatus === 'APPROVED').length})
            </button>
            <button
              onClick={() => setReviewFilter('REJECTED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                reviewFilter === 'REJECTED'
                  ? 'bg-rose-100 text-rose-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rejected ({allExceptionRecords.filter((r) => r.reviewStatus === 'REJECTED').length})
            </button>
          </div>
        </div>
      </div>

      {/* Master Cases Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="py-12 px-4">
            <EmptyState
              type="NO_EXCEPTIONS_FILTER"
              title="No cases match your filter"
              description="Try selecting a different safeguard tab or clearing your search term."
              action={{
                label: 'Reset Filters',
                onClick: () => {
                  setFilterType('ALL');
                  setReviewFilter('ALL');
                  setSearchQuery('');
                },
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Case ID</th>
                  <th scope="col" className="px-4 py-3">{activeConfig.recordNounSingular} Title</th>
                  <th scope="col" className="px-4 py-3">Issue Detected</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Owner</th>
                  <th scope="col" className="px-4 py-3">Review Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRecords.map((record) => {
                  const exceptions = record.evaluation?.exceptions || [];
                  const isPrimaryDemo = record.id === 'OP-101';

                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                        isPrimaryDemo ? 'bg-amber-50/30' : ''
                      }`}
                      onClick={() => onSelectRecord(record.id)}
                    >
                      {/* Record ID */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-slate-900 group-hover:text-[#0F766E] transition-colors">
                            {record.id}
                          </span>
                          {isPrimaryDemo && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-[#0F766E] border border-teal-200">
                              Showcase
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Priority: {record.priority}
                        </div>
                      </td>

                      {/* Title & Customer */}
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <div className="font-semibold text-slate-900 truncate">
                          {record.title}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate mt-0.5">
                          {record.requiredFields.customerName || 'No customer name'}
                        </div>
                      </td>

                      {/* Detected Rule Exceptions in plain English */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          {exceptions.map((exc: any) => (
                            <span
                              key={exc.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 w-fit"
                            >
                              {exc.type === 'COMPLETED_WITHOUT_EVIDENCE'
                                ? 'Status–Outcome Conflict'
                                : exc.type === 'OVERDUE'
                                ? 'Overdue'
                                : 'Missing Information'}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-slate-800">
                          {record.status}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                        {record.assignedAgent}
                      </td>

                      {/* Review Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {record.reviewStatus === 'UNREVIEWED' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-[#0F766E] border border-teal-200">
                            Awaiting Decision
                          </span>
                        ) : record.reviewStatus === 'APPROVED' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(record.id);
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-flex items-center space-x-1 ${
                            isPrimaryDemo
                              ? 'bg-[#0F766E] text-white hover:bg-[#115E59]'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>Inspect Case</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
