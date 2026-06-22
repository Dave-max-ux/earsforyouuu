/**
 * AppContext - Centralized state management
 * Handles: auth, language, theme, preferences, admin session
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthService } from '../services/AuthService';
import { AdminAuthService } from '../services/AdminAuthService';
import { AccountService, AppPreferences } from '../services/AccountService';
import { t as translate, Language, TranslationKey } from '../i18n/translations';
import { applyAccessibilityPreferences } from '../utils/accessibility';
import { FeedbackType, triggerFeedback } from '../utils/feedback';

export type { Language };

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  isAdmin: boolean;
  adminEmail: string | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  preferences: AppPreferences;
  updatePreferences: (partial: Partial<AppPreferences>) => void;
  savePreferences: () => Promise<void>;
  triggerInteractionFeedback: (type?: FeedbackType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function applyTheme(t: 'light' | 'dark') {
  if (t === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

function persistPreferences(prefs: AppPreferences) {
  localStorage.setItem('earsforyou_prefs', JSON.stringify(prefs));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [language, setLanguageState] = useState<Language>('en');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [preferences, setPreferences] = useState<AppPreferences>(() => AccountService.getAppPreferences());
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUserState(currentUser);

    if (currentUser) {
      setLanguageState(currentUser.language as Language);
      setIsOnboarded(true);
    } else {
      const onboarded = localStorage.getItem('earsforyou_onboarded');
      setIsOnboarded(onboarded === 'true');
    }

    const savedLang = localStorage.getItem('earsforyou_lang') as Language | null;
    if (savedLang === 'en' || savedLang === 'pidgin') setLanguageState(savedLang);

    const savedTheme = (localStorage.getItem('earsforyou_theme') as 'light' | 'dark' | null) ?? 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    const savedPrefs = AccountService.getAppPreferences();
    setPreferences(savedPrefs);
    applyAccessibilityPreferences(savedPrefs);

    const session = AdminAuthService.getSession();
    if (session) { setIsAdmin(true); setAdminEmail(session.email); }

    const onStorage = () => {
      const s = AdminAuthService.getSession();
      setIsAdmin(!!s);
      setAdminEmail(s?.email ?? null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    applyAccessibilityPreferences(preferences);
  }, [preferences.accessibilityLargeText, preferences.accessibilityReduceMotion]);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) { setLanguageState(u.language as Language); setIsOnboarded(true); }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('earsforyou_lang', lang);
    if (user) {
      const updated = AuthService.updateUser({ language: lang });
      if (updated) setUserState(updated);
    }
    setPreferences(prev => {
      const next = { ...prev, language: lang };
      persistPreferences(next);
      return next;
    });
  }, [user]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('earsforyou_theme', next);
      applyTheme(next);
      setPreferences(p => {
        const updated = { ...p, darkMode: next === 'dark' };
        persistPreferences(updated);
        return updated;
      });
      return next;
    });
  }, []);

  const updatePreferences = useCallback((partial: Partial<AppPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...partial };
      persistPreferences(next);
      return next;
    });
  }, []);

  const savePreferences = useCallback(async () => {
    await AccountService.saveAppPreferences({ ...preferences, darkMode: theme === 'dark', language });
  }, [preferences, theme, language]);

  const triggerInteractionFeedback = useCallback((type: FeedbackType = 'tap') => {
    triggerFeedback(type, {
      haptic: preferences.hapticFeedback,
      sound: preferences.soundEffects,
    });
  }, [preferences.hapticFeedback, preferences.soundEffects]);

  const tFn = useCallback((key: TranslationKey): string => {
    return translate(language, key);
  }, [language]);

  return (
    <AppContext.Provider value={{
      user, setUser,
      isOnboarded, setIsOnboarded,
      isAdmin, adminEmail,
      language, setLanguage,
      t: tFn,
      theme, toggleTheme,
      preferences, updatePreferences, savePreferences,
      triggerInteractionFeedback,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
