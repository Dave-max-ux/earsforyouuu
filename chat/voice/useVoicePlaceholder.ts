import { useCallback, useState } from 'react';
import type { VoiceInputState, VoicePlaybackState, VoicePlaceholderState } from './types';

const NOT_IMPLEMENTED = 'Voice features coming soon';

/**
 * Placeholder hook for future voice input and playback.
 * UI controls are wired but backend processing is not implemented.
 */
export function useVoicePlaceholder() {
  const [inputState] = useState<VoiceInputState>('idle');
  const [playbackState] = useState<VoicePlaybackState>('idle');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = useCallback(() => {
    setNotice(NOT_IMPLEMENTED);
    window.setTimeout(() => setNotice(null), 2500);
  }, []);

  const toggleVoiceInput = useCallback(() => {
    setIsVoiceEnabled((v) => !v);
    showNotice();
  }, [showNotice]);

  const toggleSpeaker = useCallback(() => {
    setIsSpeakerEnabled((v) => !v);
    showNotice();
  }, [showNotice]);

  const startListening = useCallback(() => {
    showNotice();
  }, [showNotice]);

  const speakMessage = useCallback((_text: string, _language?: string) => {
    showNotice();
  }, [showNotice]);

  const state: VoicePlaceholderState = {
    inputState,
    playbackState,
    isVoiceEnabled,
    isSpeakerEnabled,
  };

  return {
    ...state,
    notice,
    toggleVoiceInput,
    toggleSpeaker,
    startListening,
    speakMessage,
    isAvailable: false,
  };
}
