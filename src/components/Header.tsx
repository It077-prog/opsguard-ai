import React from 'react';
import { ShieldCheck, RotateCcw, Sliders, Cpu, Sparkles } from 'lucide-react';
import { BusinessDomainConfig } from '../types';

interface HeaderProps {
  activeConfig: BusinessDomainConfig;
  onOpenConfigModal: () => void;
  onResetData: () => void;
  onSelectRecord: (recordId: string) => void;
  isResetting: boolean;
  geminiConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeConfig,
  onOpenConfigModal,
  onResetData,
  onSelectRecord,
  isResetting,
  geminiConnected,
}) => {
  return (
    <header className="border-b border-slate-200/90 bg-white sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  OpsGuard AI
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  V0.1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Cross-System Case-to-Outcome Reconciliation
              </p>
            </div>
          </div>

          {/* Quick Demo Cases Jumper */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-50 border border-slate-200/80 rounded-lg p-1 text-xs">
            <span className="text-slate-400 font-medium px-2 text-[11px]">Demo:</span>
            <button
              onClick={() => onSelectRecord('OP-101')}
              title="Primary Showcase: Status–Outcome Conflict (Completed but evidence missing & downstream unresolved)"
              className="px-2.5 py-1 font-mono font-bold rounded-md bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:shadow-2xs transition-colors"
            >
              ★ OP-101
            </button>
            <button
              onClick={() => onSelectRecord('OP-102')}
              title="Open and overdue SLA target"
              className="px-2 py-1 font-mono font-medium rounded-md text-slate-700 hover:bg-white hover:shadow-2xs transition-colors"
            >
              OP-102
            </button>
            <button
              onClick={() => onSelectRecord('OP-103')}
              title="Missing required operational information"
              className="px-2 py-1 font-mono font-medium rounded-md text-slate-700 hover:bg-white hover:shadow-2xs transition-colors"
            >
              OP-103
            </button>
            <button
              onClick={() => onSelectRecord('OP-104')}
              title="Normal completed with verified evidence"
              className="px-2 py-1 font-mono font-semibold rounded-md text-emerald-800 hover:bg-white hover:shadow-2xs transition-colors"
            >
              OP-104
            </button>
            <button
              onClick={() => onSelectRecord('OP-105')}
              title="Multiple exceptions (Overdue + Missing Info)"
              className="px-2 py-1 font-mono font-semibold rounded-md text-[#B45309] hover:bg-white hover:shadow-2xs transition-colors"
            >
              OP-105
            </button>
          </div>

          {/* Right Action Tools: Domain Switcher, Engine Status, Reset */}
          <div className="flex items-center space-x-2.5">
            {/* Domain Config Button */}
            <button
              onClick={onOpenConfigModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Switch business terminology preset"
            >
              <Sliders className="h-3.5 w-3.5 text-[#0F766E]" />
              <span className="max-w-[120px] truncate hidden md:inline">{activeConfig.domainName}</span>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Preset</span>
            </button>

            {/* Deterministic / AI status indicators */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <span className="flex items-center space-x-1 text-emerald-700" title="Deterministic Rule Engine Active">
                <Cpu className="h-3.5 w-3.5" />
                <span className="font-semibold text-[11px]">Rules</span>
              </span>
              <span className="text-slate-300">|</span>
              <span
                className={`flex items-center space-x-1 ${
                  geminiConnected ? 'text-[#0F766E]' : 'text-slate-500'
                }`}
                title={geminiConnected ? 'Gemini Advisory Connected' : 'Manual Review Fallback Mode'}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-semibold text-[11px]">Gemini</span>
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetData}
              disabled={isResetting}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Reset synthetic dataset to default demo state"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
