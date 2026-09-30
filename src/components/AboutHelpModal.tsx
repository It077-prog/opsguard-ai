import React from 'react';
import { X, ShieldCheck, HelpCircle, CheckCircle2, FileSearch, History } from 'lucide-react';

interface AboutHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'about' | 'help';
  onNavigateEvaluation?: () => void;
}

export const AboutHelpModal: React.FC<AboutHelpModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
  onNavigateEvaluation,
}) => {
  const [activeTab, setActiveTab] = React.useState<'about' | 'help'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex space-x-1 bg-slate-200/70 p-0.5 rounded-lg text-xs">
              <button onClick={() => setActiveTab('about')} className={`px-3 py-1 rounded-md font-semibold transition-colors ${activeTab === 'about' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>About OpsGuard</button>
              <button onClick={() => setActiveTab('help')} className={`px-3 py-1 rounded-md font-semibold transition-colors ${activeTab === 'help' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}>Help</button>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'about' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">What is OpsGuard?</h3>
                <p className="mt-1 text-slate-600">OpsGuard makes sure that recorded work matches real-world proof.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <p className="font-semibold text-slate-800">In typical systems, a task is marked complete as soon as someone clicks a button. OpsGuard asks a simple, essential question:</p>
                <div className="space-y-1.5 pt-1 text-slate-700">
                  <div className="flex items-start space-x-2"><span className="font-bold text-[#0F766E]">1.</span><span><strong>Case status:</strong> Was the work marked completed?</span></div>
                  <div className="flex items-start space-x-2"><span className="font-bold text-[#0F766E]">2.</span><span><strong>Proof of completion:</strong> Is the required evidence (like a signed delivery docket or photo) attached?</span></div>
                  <div className="flex items-start space-x-2"><span className="font-bold text-[#0F766E]">3.</span><span><strong>Customer outcome:</strong> Did the customer or recipient confirm resolution?</span></div>
                </div>
              </div>
              <p className="text-xs text-slate-600">If the records do not agree, OpsGuard holds the case for a team member to review. OpsGuard never closes or approves cases autonomously—people always stay in control.</p>
              {onNavigateEvaluation && (
                <div className="pt-2 border-t border-slate-100">
                  <button onClick={() => { onClose(); onNavigateEvaluation(); }} className="text-xs text-[#0F766E] hover:underline font-semibold">View deterministic evaluation tests →</button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">How to review work in OpsGuard</h3>
                <p className="mt-1 text-xs text-slate-600">Follow these simple steps when working through cases:</p>
              </div>
              <div className="space-y-3">
                {[['1','Look at the Home overview','The Home screen shows cases that need your attention right now.'],['2','Click Review on a case','Click “Review →” on any case. You\'ll see what the case says, what proof is attached, and what happened next.'],['3','Read the advice and decide','OpsGuard summarizes why it was flagged and suggests a next step. Choose to approve or send back for review.'],['4','Check History anytime','Every decision you record is saved in History so your team has a clear audit record.']].map(([n,title,text]) => (
                  <div key={n} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
                    <span className="h-6 w-6 rounded-full bg-teal-100 text-[#0F766E] flex items-center justify-center font-bold text-xs shrink-0">{n}</span>
                    <div><strong className="text-slate-900 block">{title}</strong><span className="text-slate-600">{text}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/70 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F766E] text-white hover:bg-[#115E59] transition-colors">Got it</button>
        </div>
      </div>
    </div>
  );
};
