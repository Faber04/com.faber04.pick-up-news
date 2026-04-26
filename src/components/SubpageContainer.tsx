import type { SubpageContainerProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';

export const SubpageContainer = ({ title, children, onBack }: SubpageContainerProps) => {
  const { messages } = useI18n();

  return (
    <div className="app-container py-8 stagger-in">
      {/* Back button + Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-secondary hover:bg-[color:var(--surface-muted)] transition-colors"
          aria-label={messages.common.back}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
};
