import React from 'react';
import {
  LayoutDashboard,
  TriangleAlert,
  FileSearch,
  History,
  BarChart3,
} from 'lucide-react';

export type ScreenId = 'dashboard' | 'exceptions' | 'investigation' | 'audit' | 'evaluation';

interface NavigationProps {
  activeScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  exceptionCount: number;
  auditCount: number;
  investigationTargetId: string | null;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScreen,
  onScreenChange,
  exceptionCount,
  auditCount,
  investigationTargetId,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ScreenId,
      name: 'Control Room',
      icon: LayoutDashboard,
    },
    {
      id: 'exceptions' as ScreenId,
      name: 'Flagged Queue',
      icon: TriangleAlert,
      badge: exceptionCount > 0 ? exceptionCount : undefined,
      badgeColor: 'bg-amber-100 text-[#B45309] border border-amber-200',
    },
    {
      id: 'investigation' as ScreenId,
      name: 'Case Investigation',
      icon: FileSearch,
      sublabel: investigationTargetId ? investigationTargetId : undefined,
    },
    {
      id: 'audit' as ScreenId,
      name: 'Audit Trail',
      icon: History,
      badge: auditCount > 0 ? auditCount : undefined,
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
    {
      id: 'evaluation' as ScreenId,
      name: 'Verification Suite',
      icon: BarChart3,
      badge: '30 Cases',
      badgeColor: 'bg-teal-50 text-[#0F766E] border border-teal-200',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onScreenChange(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-50/80 text-[#0F766E] ring-1 ring-[#0F766E]/30 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-[#0F766E]' : 'text-slate-400'
                  }`}
                />
                <span>{tab.name}</span>

                {tab.sublabel && (
                  <span className="font-mono text-[11px] text-[#0F766E] font-bold bg-teal-100/60 px-1.5 py-0.5 rounded border border-teal-200/50">
                    {tab.sublabel}
                  </span>
                )}

                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      tab.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
