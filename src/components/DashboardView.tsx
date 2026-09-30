import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { OperationalRecord, BusinessDomainConfig, ExceptionType } from '../types';

function useCountUp(target: number, duration: number = 400): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
}

interface DashboardViewProps {
  records: (OperationalRecord & { evaluation?: any })[];
  activeConfig: BusinessDomainConfig;
  onSelectRecord: (recordId: string) => void;
  onNavigateExceptions: (filterType?: ExceptionType | 'ALL') => void;
  onNavigateEvaluation?: () => void;
  onRunValidation?: () => Promise<void>;
  isValidating?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  activeConfig,
  onSelectRecord,
  onNavigateExceptions,
}) => {
  const totalCount = records.length;
  const exceptionRecords = records.filter((r) => r.evaluation && !r.evaluation.isNormal);
  const normalRecords = records.filter((r) => r.evaluation && r.evaluation.isNormal);
  const pendingReviewCount = exceptionRecords.filter((r) => r.reviewStatus === 'UNREVIEWED').length;

  const displayTotal = useCountUp(totalCount);
  const displayExceptions = useCountUp(exceptionRecords.length);
  const displayPending = useCountUp(pendingReviewCount);
  const displayNormal = useCountUp(normalRecords.length);

  const attentionCases = exceptionRecords.slice(0, 5);

  const renderIssueBadges = (record: OperationalRecord & { evaluation?: any }) => {
    const exceptions = record.evaluation?.exceptions || [];
    if (exceptions.length === 0) {
      return <span className="text-xs text-slate-500">None</span>;
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        {exceptions.map((exc: any) => {
          let label = 'Issue';
          let color = 'bg-amber-50 text-[#B45309] border-amber-200';

          if (exc.type === 'COMPLETED_WITHOUT_EVIDENCE') {
            label = 'Status conflict';
            color = 'bg-amber-100/70 text-amber-900 border-amber-300 font-semibold';
          } else if (exc.type === 'OVERDUE') {
            label = 'Past due';
            color = 'bg-amber-50 text-[#B45309] border-amber-200';
          } else if (exc.type === 'MISSING_INFO') {
            label = 'Missing information';
            color = 'bg-slate-100 text-slate-700 border-slate-200';
          }

          return (
            <span
              key={exc.id}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${color}`}
            >
              {label}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Operations Overview
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] mt-1 font-normal">
          Review work that may need your attention.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateExceptions('ALL')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Need Attention</span>
            <AlertTriangle className="h-4 w-4 text-[#B45309] shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#B45309] font-mono mt-2 sm:mt-3 tabular-nums">{displayExceptions}</div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-tight">Cases flagged with an issue</p>
        </div>

        <div
          onClick={() => onNavigateExceptions('ALL')}
          className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Decision</span>
            <Clock className="h-4 w-4 text-[#0F766E] shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F766E] font-mono mt-2 sm:mt-3 tabular-nums">{displayPending}</div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-tight">Ready for your review</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Normal</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2 sm:mt-3 tabular-nums">{displayNormal}</div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-tight">No issues found</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Cases</span>
            <FolderOpen className="h-4 w-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono mt-2 sm:mt-3 tabular-nums">{displayTotal}</div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-tight">All active validation cases</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Needs Your Attention</h2>
            <p className="text-xs text-slate-500 mt-0.5">First 5 cases where records do not agree.</p>
          </div>
          <button onClick={() => onNavigateExceptions('ALL')} className="text-xs font-semibold text-[#0F766E] hover:text-[#115E59] flex items-center space-x-1">
            <span>View all →</span>
          </button>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <th className="py-3 px-6">Case</th>
                <th className="py-3 px-6">Issue</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Owner</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {attentionCases.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{record.id}</span>
                      {record.id === 'OP-101' && (
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">★ Showcase</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">{record.title}</div>
                  </td>
                  <td className="py-4 px-6">{renderIssueBadges(record)}</td>
                  <td className="py-4 px-6">
                    <span className="text-slate-800 font-medium">{record.status === 'COMPLETED' ? 'Completed' : record.status === 'IN_PROGRESS' ? 'In Progress' : 'Open'}</span>
                  </td>
                  <td className="py-4 px-6"><span className="text-slate-700 font-medium">{record.assignedAgent}</span></td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => onSelectRecord(record.id)} className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F766E] bg-teal-50 hover:bg-[#0F766E] hover:text-white border border-teal-200/80 hover:border-[#0F766E] transition-all shadow-2xs min-h-[36px]">
                      <span>Review →</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="block md:hidden divide-y divide-slate-100">
          {attentionCases.map((record) => (
            <div key={record.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{record.id}</span>
                  {record.id === 'OP-101' && (
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded">★ Showcase</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{record.status === 'COMPLETED' ? 'Completed' : record.status === 'IN_PROGRESS' ? 'In Progress' : 'Open'}</span>
              </div>
              <div className="text-xs font-semibold text-slate-800 leading-snug">{record.title}</div>
              <div className="flex items-center justify-between pt-1">
                {renderIssueBadges(record)}
                <span className="text-xs text-slate-500 font-medium">{record.assignedAgent}</span>
              </div>
              <div className="pt-1">
                <button onClick={() => onSelectRecord(record.id)} className="w-full py-2.5 px-4 text-xs font-bold rounded-xl text-[#0F766E] bg-teal-50 hover:bg-[#0F766E] hover:text-white border border-teal-200/80 hover:border-[#0F766E] transition-all flex items-center justify-center space-x-1 shadow-2xs min-h-[44px]">
                  <span>Review →</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Showing first 5 of {exceptionRecords.length} cases needing review</span>
          <button onClick={() => onNavigateExceptions('ALL')} className="font-bold text-[#0F766E] hover:text-[#115E59] hover:underline flex items-center space-x-1">
            <span>View all cases →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
