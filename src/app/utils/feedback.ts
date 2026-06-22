/**
 * Haptic and audio feedback for user interactions.
 */

export type FeedbackType = 'tap' | 'toggle' | 'success' | 'error' | 'navigate';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
}

export function triggerHaptic(type: FeedbackType = 'tap'): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

  const patterns: Record<FeedbackType, number | number[]> = {
    tap: 8,
    toggle: 12,
    navigate: 10,
    success: [10, 40, 10],
    error: [20, 60, 20, 60, 20],
  };

  try {
    navigator.vibrate(patterns[type]);
  } catch {
    // Vibration blocked or unsupported
  }
}

export function playSound(type: FeedbackType = 'tap'): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const presets: Record<FeedbackType, { frequency: number; duration: number; volume: number; type?: OscillatorType }> = {
    tap: { frequency: 520, duration: 0.04, volume: 0.06, type: 'sine' },
    toggle: { frequency: 640, duration: 0.05, volume: 0.07, type: 'triangle' },
    navigate: { frequency: 480, duration: 0.035, volume: 0.05, type: 'sine' },
    success: { frequency: 880, duration: 0.08, volume: 0.08, type: 'sine' },
    error: { frequency: 220, duration: 0.12, volume: 0.07, type: 'square' },
  };

  const preset = presets[type];
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = preset.type ?? 'sine';
  oscillator.frequency.setValueAtTime(preset.frequency, ctx.currentTime);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(preset.volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + preset.duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + preset.duration + 0.02);
}

export function triggerFeedback(
  type: FeedbackType,
  options: { haptic?: boolean; sound?: boolean } = {}
): void {
  if (options.haptic) triggerHaptic(type);
  if (options.sound) playSound(type);
}
