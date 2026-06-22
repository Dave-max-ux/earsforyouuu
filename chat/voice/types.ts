/** Placeholder types for future voice input / playback integration */

export type VoiceInputState = 'idle' | 'listening' | 'processing' | 'error';

export type VoicePlaybackState = 'idle' | 'playing' | 'paused' | 'error';

export interface VoiceInputResult {
  transcript: string;
  language?: string;
  confidence?: number;
}

export interface VoiceService {
  /** Start capturing microphone input — not implemented yet */
  startListening: () => Promise<void>;
  /** Stop capturing and return transcript — not implemented yet */
  stopListening: () => Promise<VoiceInputResult | null>;
  /** Speak text aloud — not implemented yet */
  speak: (text: string, language?: string) => Promise<void>;
  /** Stop current playback — not implemented yet */
  stopSpeaking: () => void;
}

export interface VoicePlaceholderState {
  inputState: VoiceInputState;
  playbackState: VoicePlaybackState;
  isVoiceEnabled: boolean;
  isSpeakerEnabled: boolean;
}
