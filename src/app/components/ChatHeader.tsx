import React from 'react';
import { Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EarsForYouLogo } from './EarsForYouLogo';

interface Props {
  title?: string;
  subtitle?: string;
  onClear?: () => void;
  hasMessages?: boolean;
  isBusy?: boolean;
}

export default function ChatHeader({
  title,
  subtitle,
  onClear,
  hasMessages = false,
  isBusy = false,
}: Props) {
  const { t } = useApp();

  return (
    <header className="ef-chat-header">
      <div className="ef-header-row">
        <div className="ef-brand-mark">
          <EarsForYouLogo variant="mark" size="sm" />
        </div>
        <div className="ef-header-title">
          <div className="name">{title ?? t('chat_title')}</div>
          <div className="subtitle">{subtitle ?? t('chat_subtitle')}</div>
        </div>
        <div className="ef-status-dot" aria-label={t('chat_online')} title={t('chat_online')} />
      </div>
      <div className="ef-header-actions">
        {onClear && (
          <button
            type="button"
            className="ef-header-btn"
            onClick={onClear}
            disabled={!hasMessages || isBusy}
            aria-label={t('chat_clear')}
            title={t('chat_clear')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
