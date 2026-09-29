import React from 'react';

export const IllustrationNoExceptions: React.FC<{ className?: string }> = ({ className = 'h-16 w-16' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} mx-auto`}>
      <circle cx="32" cy="32" r="28" className="fill-emerald-50 stroke-emerald-200" strokeWidth="2" />
      {/* Workflow nodes connected */}
      <circle cx="20" cy="32" r="5" fill="#10B981" />
      <circle cx="32" cy="32" r="5" fill="#059669" />
      <circle cx="44" cy="32" r="5" fill="#047857" />
      <line x1="25" y1="32" x2="27" y2="32" stroke="#10B981" strokeWidth="2" strokeDasharray="1 1" />
      <line x1="37" y1="32" x2="39" y2="32" stroke="#059669" strokeWidth="2" strokeDasharray="1 1" />
      {/* Large checkmark badge */}
      <circle cx="32" cy="46" r="10" className="fill-emerald-600 shadow-md" />
      <path d="M28 46L31 49L36 43" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const IllustrationNoAudit: React.FC<{ className?: string }> = ({ className = 'h-16 w-16' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} mx-auto`}>
      <rect x="14" y="8" width="36" height="48" rx="6" className="fill-slate-50 stroke-slate-200" strokeWidth="2" />
      {/* Timeline spine */}
      <line x1="24" y1="16" x2="24" y2="48" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
      {/* Timeline nodes waiting */}
      <circle cx="24" cy="20" r="3" fill="#94A3B8" />
      <rect x="30" y="18.5" width="14" height="3" rx="1.5" fill="#CBD5E1" />
      <circle cx="24" cy="32" r="3" fill="#94A3B8" />
      <rect x="30" y="30.5" width="12" height="3" rx="1.5" fill="#CBD5E1" />
      <circle cx="24" cy="44" r="3" fill="#94A3B8" />
      <rect x="30" y="42.5" width="10" height="3" rx="1.5" fill="#CBD5E1" />
    </svg>
  );
};

export const IllustrationEvaluationWaiting: React.FC<{ className?: string }> = ({ className = 'h-16 w-16' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} mx-auto`}>
      <rect x="10" y="10" width="44" height="44" rx="8" className="fill-teal-50/60 stroke-teal-200" strokeWidth="2" />
      {/* Mini bar chart */}
      <rect x="18" y="36" width="5" height="10" rx="1.5" fill="#94A3B8" />
      <rect x="26" y="28" width="5" height="18" rx="1.5" fill="#64748B" />
      <rect x="34" y="22" width="5" height="24" rx="1.5" fill="#0F766E" />
      <rect x="42" y="32" width="5" height="14" rx="1.5" fill="#0D9488" />
      {/* Play indicator */}
      <circle cx="32" cy="32" r="14" fill="#0F766E" className="opacity-90 shadow-md" />
      <path d="M30 27L37 32L30 37V27Z" fill="white" />
    </svg>
  );
};

export const IllustrationAiUnavailable: React.FC<{ className?: string }> = ({ className = 'h-16 w-16' }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} mx-auto`}>
      {/* AI node offline */}
      <rect x="12" y="12" width="40" height="24" rx="6" className="fill-amber-50 stroke-amber-300" strokeWidth="2" />
      <path d="M24 24L40 24" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
      <circle cx="32" cy="24" r="5" fill="#F59E0B" />
      <path d="M32 21V25M32 27V27.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      {/* Connector line to active human authority */}
      <line x1="32" y1="36" x2="32" y2="44" stroke="#0F766E" strokeWidth="2" />
      <circle cx="32" cy="50" r="8" className="fill-[#0F766E] shadow-sm" />
      {/* Human figure */}
      <circle cx="32" cy="48" r="2.5" fill="white" />
      <path d="M28 54C28 52 30 51.5 32 51.5C34 51.5 36 52 36 54" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};
