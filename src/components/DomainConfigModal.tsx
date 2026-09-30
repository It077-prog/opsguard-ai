import React from 'react';
import { X, Check, Sliders, Globe, Building2, Server, Home, Coffee, Users, ShoppingBag } from 'lucide-react';
import { BusinessDomainConfig } from '../types';
import { BUSINESS_DOMAIN_PRESETS } from '../config/businessConfig';

interface DomainConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDomainKey: string;
  onSwitchDomain: (domainKey: string) => Promise<void>;
  isSwitching: boolean;
}

const PRESET_ICONS: Record<string, React.ElementType> = {
  generic: Globe,
  logistics: Building2,
  it_support: Server,
  real_estate: Home,
  hospitality: Coffee,
  recruitment: Users,
  ecommerce: ShoppingBag,
};

export const DomainConfigModal: React.FC<DomainConfigModalProps> = ({
  isOpen,
  onClose,
  activeDomainKey,
  onSwitchDomain,
  isSwitching,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200/60">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Business Domain &amp; Terminology Portability
              </h2>
              <p className="text-xs text-slate-500">
                Driven by <code className="font-mono text-[#0F766E] font-semibold">businessConfig.ts</code> — zero hardcoded industry logic.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content: List of Presets */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            OpsGuard separates deterministic boundary logic from domain vocabulary. Select any enterprise preset to instantly adapt all terminology, record labels, required fields, and rule descriptions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(BUSINESS_DOMAIN_PRESETS).map(([key, preset]) => {
              const Icon = PRESET_ICONS[key] || Globe;
              const isActive = key === activeDomainKey;
              return (
                <div
                  key={key}
                  onClick={() => !isSwitching && onSwitchDomain(key)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? 'border-[#0F766E] bg-teal-50/50 shadow-2xs ring-1 ring-[#0F766E]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isActive ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {preset.domainName}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-[11px] font-bold text-[#0F766E] flex items-center space-x-0.5">
                        <Check className="h-3.5 w-3.5" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] space-y-1 font-mono text-slate-500">
                    <div>
                      <span className="text-slate-400">Record:</span> {preset.recordNounSingular}
                    </div>
                    <div>
                      <span className="text-slate-400">Evidence:</span> {preset.evidenceNoun}
                    </div>
                    {preset.reconciliationLabels && (
                      <div className="truncate">
                        <span className="text-slate-400">Sources:</span> {preset.reconciliationLabels.primaryRecord} / {preset.reconciliationLabels.fulfilmentEvidence}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Config Inspect Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800 block mb-1">
              Active Configuration Object (<code className="font-mono text-[#0F766E]">businessConfig.ts</code>):
            </span>
            <div className="font-mono text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
              <div>domainKey: "{BUSINESS_DOMAIN_PRESETS[activeDomainKey]?.domainKey}"</div>
              <div>recordNoun: "{BUSINESS_DOMAIN_PRESETS[activeDomainKey]?.recordNounSingular}"</div>
              <div>evidenceNoun: "{BUSINESS_DOMAIN_PRESETS[activeDomainKey]?.evidenceNoun}"</div>
              <div>assigneeLabel: "{BUSINESS_DOMAIN_PRESETS[activeDomainKey]?.assigneeLabel}"</div>
              {BUSINESS_DOMAIN_PRESETS[activeDomainKey]?.reconciliationLabels && (
                <div>
                  reconciliationSources: "{BUSINESS_DOMAIN_PRESETS[activeDomainKey].reconciliationLabels?.primaryRecord} | {BUSINESS_DOMAIN_PRESETS[activeDomainKey].reconciliationLabels?.fulfilmentEvidence} | {BUSINESS_DOMAIN_PRESETS[activeDomainKey].reconciliationLabels?.downstreamStatus}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
