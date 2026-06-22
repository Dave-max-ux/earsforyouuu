import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { FeedbackType, triggerFeedback } from '../utils/feedback';

export function useFeedback() {
  const { preferences } = useApp();

  const onInteraction = useCallback(
    (type: FeedbackType = 'tap') => {
      triggerFeedback(type, {
        haptic: preferences.hapticFeedback,
        sound: preferences.soundEffects,
      });
    },
    [preferences.hapticFeedback, preferences.soundEffects]
  );

  return { onInteraction };
}
