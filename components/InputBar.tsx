import React, { useState, useRef, useCallback } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { chatTheme } from '../chat/theme';
import VoiceControls from './VoiceControls';
import { useApp } from '../context/AppContext';

interface Props {
  onSend: (text: string) => void;
  isSending?: boolean;
  voice?: {
    isVoiceEnabled: boolean;
    isSpeakerEnabled: boolean;
    onToggleVoice: () => void;
    onToggleSpeaker: () => void;
    onStartListening: () => void;
    notice?: string | null;
  };
}

export default function InputBar({ onSend, isSending = false, voice }: Props) {
  const { t } = useApp();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = chatTheme.input.maxLength;

  const trimmed = text.trim();
  const canSend = trimmed.length > 0 && !isSending;
  const charCount = text.length;
  const charClass =
    charCount >= maxLength
      ? 'limit'
      : charCount >= maxLength * 0.9
        ? 'warning'
        : '';

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [canSend, trimmed, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxLength) {
      setText(val);
    }
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
  };

  return (
    <div className="ef-inputbar">
      <div className="ef-inputbar-inner">
        {voice && (
          <VoiceControls
            isVoiceEnabled={voice.isVoiceEnabled}
            isSpeakerEnabled={voice.isSpeakerEnabled}
            onToggleVoice={voice.onToggleVoice}
            onToggleSpeaker={voice.onToggleSpeaker}
            onStartListening={voice.onStartListening}
            notice={voice.notice}
            disabled={isSending}
          />
        )}
        <div className="ef-input-wrap">
          <div className="ef-input-field">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={t('chat_input_placeholder')}
              rows={1}
              aria-label={t('chat_input_placeholder')}
              disabled={isSending}
            />
          </div>
          {charCount > 0 && (
            <div className={`ef-char-count ${charClass}`}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
        <button
          type="button"
          className="ef-send"
          onClick={handleSend}
          aria-label={t('chat_send')}
          disabled={!canSend}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
