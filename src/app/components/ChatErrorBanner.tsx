import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { TranslationKey } from '../i18n/translations';

interface Props {
  messageKey: TranslationKey;
  onDismiss: () => void;
}

export default function ChatErrorBanner({ messageKey, onDismiss }: Props) {
  const { t } = useApp();

  return (
    <div className="ef-chat-error" role="alert">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{t(messageKey)}</span>
      <button
        type="button"
        className="ef-chat-error-dismiss"
        onClick={onDismiss}
        aria-label={t('close')}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
