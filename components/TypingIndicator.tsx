import React from 'react';
import { useApp } from '../context/AppContext';

export default function TypingIndicator() {
  const { t } = useApp();

  return (
    <div
      className="typing-indicator"
      role="status"
      aria-label={t('chat_typing')}
    >
      <span /><span /><span />
    </div>
  );
}
