import React from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isVoiceEnabled: boolean;
  isSpeakerEnabled: boolean;
  onToggleVoice: () => void;
  onToggleSpeaker: () => void;
  onStartListening: () => void;
  notice?: string | null;
  disabled?: boolean;
}

export default function VoiceControls({
  isVoiceEnabled,
  isSpeakerEnabled,
  onToggleVoice,
  onToggleSpeaker,
  onStartListening,
  notice,
  disabled = false,
}: Props) {
  const { t } = useApp();

  return (
    <div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className={`ef-voice-btn placeholder ${isVoiceEnabled ? 'active' : ''}`}
          onClick={onStartListening}
          disabled={disabled}
          aria-label={t('chat_voice_input')}
          title={t('chat_voice_coming_soon')}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`ef-voice-btn placeholder ${isSpeakerEnabled ? 'active' : ''}`}
          onClick={onToggleSpeaker}
          disabled={disabled}
          aria-label={t('chat_voice_output')}
          title={t('chat_voice_coming_soon')}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      {notice && <p className="ef-voice-notice">{notice}</p>}
    </div>
  );
}
