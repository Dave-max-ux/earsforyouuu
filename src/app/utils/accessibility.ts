/**
 * Applies accessibility preferences to the document root.
 */

import type { AppPreferences } from '../services/AccountService';

export function applyAccessibilityPreferences(prefs: Pick<AppPreferences, 'accessibilityLargeText' | 'accessibilityReduceMotion'>) {
  const root = document.documentElement;

  if (prefs.accessibilityLargeText) {
    root.dataset.largeText = 'true';
  } else {
    delete root.dataset.largeText;
  }

  if (prefs.accessibilityReduceMotion) {
    root.dataset.reduceMotion = 'true';
  } else {
    delete root.dataset.reduceMotion;
  }
}

export function getSystemPrefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
