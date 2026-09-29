import React from 'react';

// Modern SaaS rounded human character illustration for ALEX (Worker)
export const AlexCharacter: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Alex - Person doing the work"
  >
    {/* Background soft bubble */}
    <circle cx="60" cy="60" r="54" fill="#E6FFFA" stroke="#99F6E4" strokeWidth="2.5" />
    
    {/* Torso / Work Jacket */}
    <path
      d="M34 104C34 88 44 80 60 80C76 80 86 88 86 104"
      fill="#0F766E"
      stroke="#0D5F58"
      strokeWidth="2.5"
    />
    {/* Inner shirt collar */}
    <path d="M52 80L60 92L68 80" stroke="#F0FDFA" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Neck */}
    <rect x="54" y="66" width="12" height="16" rx="4" fill="#FBD5B5" />
    
    {/* Head */}
    <circle cx="60" cy="50" r="22" fill="#FBD5B5" />
    
    {/* Hair (Slightly quirky side-part) */}
    <path
      d="M40 48C40 34 50 28 64 28C76 28 82 34 82 44C82 46 80 47 77 43C73 37 68 34 60 34C50 34 44 40 41 49C40 49 40 48 40 48Z"
      fill="#334155"
    />
    
    {/* Eyes */}
    <ellipse cx="53" cy="50" rx="2.5" ry="3" fill="#1E293B" />
    <ellipse cx="67" cy="50" rx="2.5" ry="3" fill="#1E293B" />
    {/* Highlights */}
    <circle cx="54" cy="49" r="0.8" fill="#FFFFFF" />
    <circle cx="68" cy="49" r="0.8" fill="#FFFFFF" />
    
    {/* Friendly Smile */}
    <path d="M54 59C56 62 64 62 66 59" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    
    {/* Cheeks */}
    <ellipse cx="48" cy="54" rx="3" ry="1.8" fill="#FCA5A5" opacity="0.6" />
    <ellipse cx="72" cy="54" rx="3" ry="1.8" fill="#FCA5A5" opacity="0.6" />
    
    {/* Mini Clipboard badge */}
    <rect x="74" y="74" width="16" height="22" rx="3" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2" />
    <rect x="78" y="72" width="8" height="3.5" rx="1.5" fill="#0F766E" />
    <path d="M78 80H86M78 85H86M78 90H83" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M78 80L80 82L85 78" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Modern SaaS rounded human character illustration for MAYA (Customer)
export const MayaCharacter: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Maya - Customer / person affected"
  >
    {/* Background soft bubble */}
    <circle cx="60" cy="60" r="54" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2.5" />
    
    {/* Long Hair back */}
    <path d="M36 50C36 68 40 88 44 96C44 96 48 88 48 66" fill="#78350F" />
    <path d="M84 50C84 68 80 88 76 96C76 96 72 88 72 66" fill="#78350F" />
    
    {/* Torso / Sweater */}
    <path
      d="M34 104C34 88 44 80 60 80C76 80 86 88 86 104"
      fill="#B45309"
      stroke="#92400E"
      strokeWidth="2.5"
    />
    <path d="M50 80C50 86 70 86 70 80" stroke="#FDE68A" strokeWidth="2" fill="none" />
    
    {/* Neck */}
    <rect x="54" y="66" width="12" height="16" rx="4" fill="#FCD34D" opacity="0.6" />
    
    {/* Head */}
    <circle cx="60" cy="50" r="22" fill="#FED7AA" />
    
    {/* Hair front / bun & bangs */}
    <path
      d="M38 48C38 34 46 26 60 26C74 26 82 34 82 48C78 40 70 34 60 34C48 34 42 42 38 48Z"
      fill="#78350F"
    />
    <circle cx="60" cy="22" r="9" fill="#78350F" />
    
    {/* Eyes - slightly questioning / puzzled */}
    <ellipse cx="53" cy="50" rx="2.5" ry="3" fill="#1E293B" />
    <ellipse cx="67" cy="50" rx="2.5" ry="3" fill="#1E293B" />
    {/* Raised eyebrow */}
    <path d="M50 44C52 42 56 43 56 44" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M64 42C67 40 71 42 71 44" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Puzzled mouth */}
    <path d="M56 61C58 60 62 60 64 61" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    
    {/* Cheeks */}
    <ellipse cx="48" cy="55" rx="3" ry="1.8" fill="#FCA5A5" opacity="0.5" />
    <ellipse cx="72" cy="55" rx="3" ry="1.8" fill="#FCA5A5" opacity="0.5" />
    
    {/* Question mark bubble */}
    <circle cx="86" cy="34" r="10" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.5" />
    <text x="83" y="38" fill="#B45309" fontSize="12" fontWeight="bold" fontFamily="sans-serif">?</text>
  </svg>
);

// Modern SaaS rounded human character illustration for SAM (Operations Reviewer)
export const SamCharacter: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Sam - Operations reviewer"
  >
    {/* Background soft bubble */}
    <circle cx="60" cy="60" r="54" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2.5" />
    
    {/* Torso / Blazer */}
    <path
      d="M34 104C34 86 44 78 60 78C76 78 86 86 86 104"
      fill="#1E293B"
      stroke="#0F172A"
      strokeWidth="2.5"
    />
    {/* Tie */}
    <path d="M58 84L60 98L62 84Z" fill="#0F766E" />
    <circle cx="60" cy="82" r="2.5" fill="#0F766E" />
    
    {/* Neck */}
    <rect x="54" y="64" width="12" height="16" rx="4" fill="#E2E8F0" />
    <rect x="54" y="64" width="12" height="16" rx="4" fill="#FBD5B5" />
    
    {/* Head */}
    <circle cx="60" cy="48" r="22" fill="#FBD5B5" />
    
    {/* Hair (Sleek short cropped) */}
    <path
      d="M38 46C38 32 46 26 60 26C74 26 82 32 82 46C82 40 78 30 60 30C46 30 39 40 38 46Z"
      fill="#1E293B"
    />
    
    {/* Distinctive Glasses (Reviewer persona) */}
    <rect x="46" y="44" width="11" height="9" rx="3" fill="#FFFFFF" fillOpacity="0.4" stroke="#0F766E" strokeWidth="2" />
    <rect x="63" y="44" width="11" height="9" rx="3" fill="#FFFFFF" fillOpacity="0.4" stroke="#0F766E" strokeWidth="2" />
    <line x1="57" y1="48" x2="63" y2="48" stroke="#0F766E" strokeWidth="2" />
    <line x1="42" y1="46" x2="46" y2="47" stroke="#0F766E" strokeWidth="1.5" />
    <line x1="74" y1="47" x2="78" y2="46" stroke="#0F766E" strokeWidth="1.5" />
    
    {/* Eyes behind glasses */}
    <circle cx="51.5" cy="48.5" r="2" fill="#1E293B" />
    <circle cx="68.5" cy="48.5" r="2" fill="#1E293B" />
    
    {/* Calm confident smile */}
    <path d="M54 58C56 61 64 61 66 58" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
    
    {/* Tablet device */}
    <rect x="30" y="86" width="22" height="18" rx="2.5" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
    <rect x="33" y="89" width="16" height="12" rx="1.5" fill="#0F766E" />
    <circle cx="41" cy="95" r="2" fill="#A7F3D0" />
  </svg>
);

// OpsGuard System Shield Icon (Modern, clean SaaS)
export const OpsGuardShieldBadge: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="OpsGuard System Check"
  >
    <circle cx="60" cy="60" r="54" fill="#F0FDFA" stroke="#99F6E4" strokeWidth="2.5" />
    {/* Shield */}
    <path
      d="M60 26L84 36V62C84 76 74 88 60 94C46 88 36 76 36 62V36L60 26Z"
      fill="#0F766E"
      stroke="#115E59"
      strokeWidth="2"
    />
    {/* Inner scan wave / check */}
    <path
      d="M48 60L56 68L72 52"
      stroke="#A7F3D0"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="60" cy="42" r="3" fill="#FDE047" />
  </svg>
);

// The Full 4-Character Storyboard Strip: Alex -> Maya -> OpsGuard -> Sam
export const HumanStoryStrip: React.FC<{
  onReviewClick?: () => void;
  onShowcaseClick?: () => void;
}> = ({ onReviewClick, onShowcaseClick }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block mb-1.5">
            The Human Story
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Why automated status checks fail — and why humans stay in charge
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Real operations · Fictional characters · Zero robots
        </span>
      </div>

      {/* 4 Cards Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        
        {/* CHARACTER 1: ALEX */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <AlexCharacter className="w-14 h-14 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Alex</span>
                <span className="text-[11px] text-slate-500 block">Field Ops &amp; Delivery</span>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs relative">
              <div className="text-xs font-semibold text-slate-800">
                "I tapped <span className="text-emerald-700 font-bold">Done</span> on my phone when I dropped the package off."
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                System marks case: <strong>COMPLETED</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Operational Claim</span>
            <span className="font-bold text-slate-900">Done.</span>
          </div>
        </div>

        {/* CHARACTER 2: MAYA */}
        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MayaCharacter className="w-14 h-14 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-950 block">Maya</span>
                <span className="text-[11px] text-amber-800 block">Recipient / Client</span>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-white border border-amber-200 rounded-xl p-3 shadow-2xs relative">
              <div className="text-xs font-semibold text-slate-800">
                "Wait, my clinic never received the delivery. <span className="text-[#B45309] font-bold">It's still not solved.</span>"
              </div>
              <span className="text-[10px] text-[#B45309] mt-1 block font-medium">
                Downstream outcome: <strong>UNRESOLVED</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-medium">
            <span>Customer Reality</span>
            <span className="font-bold text-[#B45309]">Not solved.</span>
          </div>
        </div>

        {/* CHARACTER 3: OPSGUARD */}
        <div className="bg-teal-50/50 border-2 border-[#0F766E]/60 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <OpsGuardShieldBadge className="w-14 h-14 shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#0F766E] block">OpsGuard</span>
                <span className="text-[11px] text-teal-700 block">Deterministic Engine</span>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-white border border-teal-200 rounded-xl p-3 shadow-2xs relative">
              <div className="text-xs font-semibold text-slate-900">
                "Status says complete, but no signed docket exists. <span className="text-[#0F766E] font-bold">Something doesn't match.</span>"
              </div>
              <span className="text-[10px] text-[#0F766E] mt-1 block font-medium">
                Rule 03: <strong>Conflict Detected</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-teal-200/60 flex items-center justify-between text-xs text-[#0F766E] font-bold">
            <span>Automated Check</span>
            <span>Flagged!</span>
          </div>
        </div>

        {/* CHARACTER 4: SAM */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <SamCharacter className="w-14 h-14 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Sam</span>
                <span className="text-[11px] text-slate-500 block">Operations Reviewer</span>
              </div>
            </div>

            {/* Speech Bubble */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs relative">
              <div className="text-xs font-semibold text-slate-800">
                "AI summarized the driver notes for me. <span className="text-slate-900 font-bold">I'll review it and make the final call.</span>"
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Human Authority: <strong>Final Approval or Rejection</strong>
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-700 font-bold">
            <span>Human Decision</span>
            <span className="text-[#0F766E]">Decides.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// Compact 4-character dialogue strip for OP-101 case investigation
export const Op101HumanStoryStrip: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-[#0F766E]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            The Human Story Behind OP-101
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Cross-system conflict in plain words</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* ALEX */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-3">
          <AlexCharacter className="w-11 h-11 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 block">Alex</span>
            <span className="text-[10px] text-slate-400 block mb-1">Person doing the work</span>
            <div className="text-xs text-slate-900 font-extrabold">
              “Done.”
            </div>
          </div>
        </div>

        {/* MAYA */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 flex items-start space-x-3">
          <MayaCharacter className="w-11 h-11 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-amber-950 block">Maya</span>
            <span className="text-[10px] text-amber-800/80 block mb-1">Person affected</span>
            <div className="text-xs text-[#B45309] font-extrabold">
              “It’s still not solved.”
            </div>
          </div>
        </div>

        {/* OPSGUARD */}
        <div className="bg-teal-50/60 border-2 border-[#0F766E]/70 rounded-xl p-3 flex items-start space-x-3">
          <OpsGuardShieldBadge className="w-11 h-11 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#0F766E] block">OpsGuard</span>
            <span className="text-[10px] text-teal-700/80 block mb-1">Cross-check engine</span>
            <div className="text-xs text-[#0F766E] font-extrabold">
              “Something doesn’t match.”
            </div>
          </div>
        </div>

        {/* SAM */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start space-x-3">
          <SamCharacter className="w-11 h-11 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 block">Sam</span>
            <span className="text-[10px] text-slate-500 block mb-1">Operations reviewer</span>
            <div className="text-xs text-slate-900 font-extrabold">
              “I’ll review it.”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

