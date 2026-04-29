import type { SubpageContainerProps } from '../types/component-props';
import { useI18n } from '../i18n/useI18n';
import { Button } from './ui';

export const SubpageContainer = ({ title, children, onBack }: SubpageContainerProps) => {
  const { messages } = useI18n();

  return (
    <div className="app-container py-8 stagger-in">
      {/* Back button + Title */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="rounded-xl"
          aria-label={messages.common.back}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
};
