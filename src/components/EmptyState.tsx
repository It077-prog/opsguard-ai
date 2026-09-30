import React from 'react';
import {
  IllustrationNoExceptions,
  IllustrationNoAudit,
  IllustrationEvaluationWaiting,
  IllustrationAiUnavailable,
} from './illustrations/EmptyStateIllustrations';
import { CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  type: 'NO_EXCEPTIONS_FILTER' | 'NO_AUDIT_LOGS' | 'EVALUATION_NOT_RUN' | 'NO_AI_RESPONSE' | 'ALL_NORMAL';
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  action,
}) => {
  const renderIllustration = () => {
    switch (type) {
      case 'NO_EXCEPTIONS_FILTER':
      case 'ALL_NORMAL':
        return <IllustrationNoExceptions className="h-16 w-16 mb-3" />;
      case 'NO_AUDIT_LOGS':
        return <IllustrationNoAudit className="h-16 w-16 mb-3" />;
      case 'EVALUATION_NOT_RUN':
        return <IllustrationEvaluationWaiting className="h-16 w-16 mb-3" />;
      case 'NO_AI_RESPONSE':
        return <IllustrationAiUnavailable className="h-16 w-16 mb-3" />;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'NO_EXCEPTIONS_FILTER':
        return {
          title: 'No exceptions in current filter',
          desc: 'No operational records match the selected exception filter category.',
        };
      case 'NO_AUDIT_LOGS':
        return {
          title: 'No decisions recorded in audit log',
          desc: 'When an operator reviews an exception and approves or rejects it, the auditable decision record will appear here chronologically.',
        };
      case 'EVALUATION_NOT_RUN':
        return {
          title: 'Evaluation benchmark not yet executed',
          desc: 'Execute the deterministic rule validation suite to dynamically compute precision, recall, accuracy, and test case pass rates against ground-truth labels.',
        };
      case 'NO_AI_RESPONSE':
        return {
          title: 'AI analysis unavailable — manual review required',
          desc: 'The advisory interpretation layer could not be reached or timed out. Deterministic rule detection remains 100% active. Operators may proceed with human review directly.',
        };
      case 'ALL_NORMAL':
        return {
          title: 'All operational records compliant',
          desc: 'No active deterministic exception flags detected across the current dataset filter.',
        };
    }
  };

  const defaults = getDefaultContent();

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-2xs animate-fade-in">
      {renderIllustration()}
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
        {title || defaults.title}
      </h3>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
        {description || defaults.desc}
      </p>
      {action && (
        <div className="mt-4">
          <button
            onClick={action.onClick}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] rounded-lg transition-colors shadow-2xs"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};
