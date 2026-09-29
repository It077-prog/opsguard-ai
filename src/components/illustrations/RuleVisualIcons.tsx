import React from 'react';

export const RuleVisualOverdue: React.FC<{ className?: string }> = ({ className = 'h-10 w-10' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
    >
      <circle cx="24" cy="24" r="20" className="fill-amber-50 stroke-amber-300" strokeWidth="2" />
      {/* Clock ticks */}
      <line x1="24" y1="8" x2="24" y2="12" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="36" x2="24" y2="40" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="24" x2="12" y2="24" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="24" x2="40" y2="24" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      {/* Overdue hand exceeding SLA limit */}
      <circle cx="24" cy="24" r="3" fill="#B45309" />
      <path d="M24 24L32 16" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 24L24 14" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
      {/* Exceeded arc */}
      <path
        d="M24 10A14 14 0 0 1 35 17"
        stroke="#DC2626"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </svg>
  );
};

export const RuleVisualMissingInfo: React.FC<{ className?: string }> = ({ className = 'h-10 w-10' }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
    >
      {/* Document sheet */}
      <rect x="10" y="6" width="28" height="36" rx="4" className="fill-amber-50 stroke-amber-300" strokeWidth="2" />
      {/* Filled rows */}
      <rect x="16" y="13" width="16" height="3" rx="1.5" fill="#64748B" />
      <rect x="16" y="19" width="12" height="3" rx="1.5" fill="#64748B" />
      {/* Missing mandatory field highlighted in red/amber with question mark */}
      <rect x="16" y="25" width="16" height="5" rx="2" className="fill-amber-200 stroke-amber-500" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M23 27C23 26 25 26 25 27.5C25 28.5 24 28.8 24 29.5" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="24" cy="31" r="0.6" fill="#B45309" />
      <rect x="16" y="34" width="10" height="2.5" rx="1" fill="#94A3B8" />
    </svg>
  );
};

export const RuleVisualConflict: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => {
  return (
    <svg
      viewBox="0 0 54 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
    >
      {/* System 1: Database Left (Teal) */}
      <g>
        <path d="M8 12C8 10 14 9 18 9C22 9 28 10 28 12V24C28 26 22 27 18 27C14 27 8 26 8 24V12Z" className="fill-teal-50 stroke-[#0F766E]" strokeWidth="1.5" />
        <ellipse cx="18" cy="12" rx="10" ry="3" className="fill-teal-100 stroke-[#0F766E]" strokeWidth="1.5" />
        <ellipse cx="18" cy="18" rx="10" ry="2.5" stroke="#0F766E" strokeWidth="1" strokeDasharray="2 2" />
        {/* Checkmark icon for Completed */}
        <circle cx="25" cy="8" r="4.5" fill="#0F766E" />
        <path d="M23 8L24.5 9.5L27 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* System 2: Evidence Right (Amber/Rose) */}
      <g>
        <path d="M26 18C26 16 32 15 36 15C40 15 46 16 46 18V30C46 32 40 33 36 33C32 33 26 32 26 30V18Z" className="fill-amber-50 stroke-[#B45309]" strokeWidth="1.5" />
        <ellipse cx="36" cy="18" rx="10" ry="3" className="fill-amber-100 stroke-[#B45309]" strokeWidth="1.5" />
        <ellipse cx="36" cy="24" rx="10" ry="2.5" stroke="#B45309" strokeWidth="1" strokeDasharray="2 2" />
        {/* X icon for Missing Evidence */}
        <circle cx="43" cy="14" r="4.5" fill="#B45309" />
        <path d="M41 12L45 16M45 12L41 16" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Cross-Verification Conflict Lightning / Barrier */}
      <g className="animate-pulse-once">
        <circle cx="27" cy="27" r="7" className="fill-amber-500 shadow-md" />
        <path d="M27 23V27.5M27 30.5V31" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
};
