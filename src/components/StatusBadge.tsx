import React from 'react';
import {
  BadgeCheck,
  TriangleAlert,
  UserRoundSearch,
  XCircle,
  BotOff,
  Clock3,
  FileWarning,
  GitCompare,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export type StatusBadgeType =
  | 'NORMAL'
  | 'FLAGGED'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'AI_UNAVAILABLE'
  | 'OVERDUE'
  | 'MISSING_INFO'
  | 'STATUS_OUTCOME_CONFLICT'
  | 'IN_PROGRESS';

interface StatusBadgeProps {
  type: StatusBadgeType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  label,
  size = 'sm',
  className = '',
}) => {
  const iconSizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textClass = size === 'sm' ? 'text-[11px] py-0.5 px-2' : 'text-xs py-1 px-2.5';

  switch (type) {
    case 'NORMAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${textClass} ${className}`}
        >
          <BadgeCheck className={`${iconSizeClass} text-emerald-600 shrink-0`} />
          <span>{label || 'Normal'}</span>
        </span>
      );

    case 'FLAGGED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-[#B45309] border border-amber-200 ${textClass} ${className}`}
        >
          <TriangleAlert className={`${iconSizeClass} text-[#B45309] shrink-0`} />
          <span>{label || 'Flagged'}</span>
        </span>
      );

    case 'NEEDS_REVIEW':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-900 border border-amber-300/80 ${textClass} ${className}`}
        >
          <UserRoundSearch className={`${iconSizeClass} text-[#B45309] shrink-0`} />
          <span>{label || 'Needs Review'}</span>
        </span>
      );

    case 'APPROVED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-teal-50 text-[#0F766E] border border-teal-200 ${textClass} ${className}`}
        >
          <BadgeCheck className={`${iconSizeClass} text-[#0F766E] shrink-0`} />
          <span>{label || 'Approved'}</span>
        </span>
      );

    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-800 border border-rose-200 ${textClass} ${className}`}
        >
          <XCircle className={`${iconSizeClass} text-rose-600 shrink-0`} />
          <span>{label || 'Rejected'}</span>
        </span>
      );

    case 'AI_UNAVAILABLE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-900 border border-amber-300 ${textClass} ${className}`}
        >
          <BotOff className={`${iconSizeClass} text-[#B45309] shrink-0`} />
          <span>{label || 'AI Unavailable'}</span>
        </span>
      );

    case 'OVERDUE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-[#B45309] border border-amber-200 ${textClass} ${className}`}
        >
          <Clock3 className={`${iconSizeClass} text-[#B45309] shrink-0`} />
          <span>{label || 'Overdue'}</span>
        </span>
      );

    case 'MISSING_INFO':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-[#B45309] border border-amber-200 ${textClass} ${className}`}
        >
          <FileWarning className={`${iconSizeClass} text-[#B45309] shrink-0`} />
          <span>{label || 'Missing Information'}</span>
        </span>
      );

    case 'STATUS_OUTCOME_CONFLICT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-md bg-teal-50 text-[#0F766E] border border-[#0F766E]/40 ${textClass} ${className}`}
        >
          <GitCompare className={`${iconSizeClass} text-[#0F766E] shrink-0`} />
          <span>{label || 'Status–Outcome Conflict'}</span>
        </span>
      );

    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${textClass} ${className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>{label || 'In Progress'}</span>
        </span>
      );

    default:
      return null;
  }
};
