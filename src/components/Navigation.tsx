import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Home,
  FolderOpen,
  History as HistoryIcon,
  ChevronDown,
  HelpCircle,
  Info,
  Sliders,
  RotateCcw,
  BarChart2,
} from 'lucide-react';
import { BusinessDomainConfig } from '../types';

export type ScreenId = 'dashboard' | 'exceptions' | 'investigation' | 'audit' | 'evaluation';

interface NavigationProps {
  activeScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
  exceptionCount: number;
  auditCount: number;
  onOpenAbout?: () => void;
  onOpenHelp?: () => void;
  // Demo / Settings controls moved into More:
  activeConfig?: BusinessDomainConfig;
  onOpenConfigModal?: () => void;
  onResetData?: () => void;
  onSelectRecord?: (recordId: string) => void;
  isResetting?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScreen,
  onScreenChange,
  exceptionCount,
  auditCount,
  onOpenAbout,
  onOpenHelp,
  activeConfig,
  onOpenConfigModal,
  onResetData,
  onSelectRecord,
  isResetting,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHomeActive = activeScreen === 'dashboard';
  const isCasesActive = activeScreen === 'exceptions' || activeScreen === 'investigation';
  const isHistoryActive = activeScreen === 'audit';

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand: OpsGuard */}
          <div
            onClick={() => onScreenChange('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer select-none"
          >
            <div className="h-9 w-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                OpsGuard
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block leading-none mt-0.5">
                Case Verification &amp; Review
              </span>
            </div>
          </div>

          {/* Primary Navigation: Home, Cases, History, More */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {/* 1. Home */}
              <button
                onClick={() => onScreenChange('dashboard')}
                className={`flex items-center space-x-2 py-2 px-3.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isHomeActive
                    ? 'bg-teal-50/80 text-[#0F766E] ring-1 ring-[#0F766E]/30 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home
                  className={`h-4 w-4 shrink-0 ${
                    isHomeActive ? 'text-[#0F766E]' : 'text-slate-400'
                  }`}
                />
                <span>Home</span>
              </button>

              {/* 2. Cases */}
              <button
                onClick={() => onScreenChange('exceptions')}
                className={`flex items-center space-x-2 py-2 px-3.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isCasesActive
                    ? 'bg-teal-50/80 text-[#0F766E] ring-1 ring-[#0F766E]/30 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FolderOpen
                  className={`h-4 w-4 shrink-0 ${
                    isCasesActive ? 'text-[#0F766E]' : 'text-slate-400'
                  }`}
                />
                <span>Cases</span>
                {exceptionCount > 0 && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-[#B45309] border border-amber-200 font-mono">
                    {exceptionCount}
                  </span>
                )}
              </button>

              {/* 3. History */}
              <button
                onClick={() => onScreenChange('audit')}
                className={`flex items-center space-x-2 py-2 px-3.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isHistoryActive
                    ? 'bg-teal-50/80 text-[#0F766E] ring-1 ring-[#0F766E]/30 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <HistoryIcon
                  className={`h-4 w-4 shrink-0 ${
                    isHistoryActive ? 'text-[#0F766E]' : 'text-slate-400'
                  }`}
                />
                <span>History</span>
                {auditCount > 0 && (
                  <span className="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                    {auditCount}
                  </span>
                )}
              </button>
            </nav>

            {/* 4. More (Dropdown containing Secondary Demo Controls & Documentation) */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex items-center space-x-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-colors border ${
                  isMoreOpen
                    ? 'bg-slate-100 text-slate-900 border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
                }`}
                aria-expanded={isMoreOpen}
              >
                <span>More</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs animate-slide-up">
                  {/* General Items */}
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onOpenAbout?.();
                    }}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors font-medium"
                  >
                    <Info className="h-4 w-4 text-[#0F766E]" />
                    <span>About OpsGuard</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onOpenHelp?.();
                    }}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors font-medium"
                  >
                    <HelpCircle className="h-4 w-4 text-[#0F766E]" />
                    <span>Help &amp; Documentation</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      onScreenChange('evaluation');
                    }}
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors font-medium"
                  >
                    <BarChart2 className="h-4 w-4 text-[#0F766E]" />
                    <span>Benchmark Evaluation</span>
                  </button>

                  {/* Secondary Demo & Settings Section */}
                  <div className="border-t border-slate-100 my-1 pt-1.5">
                    <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Demo &amp; Testing Tools
                    </div>

                    {/* Industry Preset Switcher */}
                    {onOpenConfigModal && activeConfig && (
                      <button
                        onClick={() => {
                          setIsMoreOpen(false);
                          onOpenConfigModal();
                        }}
                        className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors font-medium"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Sliders className="h-4 w-4 text-slate-500" />
                          <span>Industry Preset</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded truncate max-w-[90px]">
                          {activeConfig.domainName}
                        </span>
                      </button>
                    )}

                    {/* Reset Demo Data */}
                    {onResetData && (
                      <button
                        onClick={() => {
                          setIsMoreOpen(false);
                          onResetData();
                        }}
                        disabled={isResetting}
                        className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors font-medium"
                      >
                        <RotateCcw className={`h-4 w-4 text-slate-500 ${isResetting ? 'animate-spin' : ''}`} />
                        <span>Reset Demo Data</span>
                      </button>
                    )}

                    {/* Quick Case Jumpers */}
                    {onSelectRecord && (
                      <div className="px-3.5 py-2 border-t border-slate-100 mt-1">
                        <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                          Jump to Demo Case:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => {
                              setIsMoreOpen(false);
                              onSelectRecord('OP-101');
                            }}
                            className="px-2 py-0.5 font-mono text-[11px] font-bold rounded bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
                          >
                            OP-101
                          </button>
                          <button
                            onClick={() => {
                              setIsMoreOpen(false);
                              onSelectRecord('OP-102');
                            }}
                            className="px-2 py-0.5 font-mono text-[11px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                          >
                            OP-102
                          </button>
                          <button
                            onClick={() => {
                              setIsMoreOpen(false);
                              onSelectRecord('OP-103');
                            }}
                            className="px-2 py-0.5 font-mono text-[11px] font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                          >
                            OP-103
                          </button>
                          <button
                            onClick={() => {
                              setIsMoreOpen(false);
                              onSelectRecord('OP-104');
                            }}
                            className="px-2 py-0.5 font-mono text-[11px] font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                          >
                            OP-104
                          </button>
                          <button
                            onClick={() => {
                              setIsMoreOpen(false);
                              onSelectRecord('OP-105');
                            }}
                            className="px-2 py-0.5 font-mono text-[11px] font-medium rounded bg-amber-50 text-[#B45309] border border-amber-200 hover:bg-amber-100"
                          >
                            OP-105
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
