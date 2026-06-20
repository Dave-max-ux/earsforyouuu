import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  onPromptSelect: (text: string) => void;
}

export default function ChatWelcome({ onPromptSelect }: Props) {
  const { t } = useApp();

  return (
    <div className="ef-chat-welcome">
      <div className="ef-welcome-icon">
        <MessageCircle className="w-8 h-8" />
      </div>
      <h2 className="ef-welcome-title">{t('chat_welcome_title')}</h2>
      <p className="ef-welcome-subtitle">{t('chat_welcome_subtitle')}</p>
      {/* Pre-prompts removed per request */}
    </div>
  );
}
