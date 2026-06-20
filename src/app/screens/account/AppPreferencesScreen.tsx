/**
 * AppPreferencesScreen - Theme, language, accessibility
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Moon, Globe, Type, Zap, Smartphone, Volume2, Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import { useApp } from '../../context/AppContext';
import { AccountService, AppPreferences } from '../../services/AccountService';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

const languageOptions = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'pidgin', label: 'Nigerian Pidgin', flag: '🇳🇬' },
] as const;

export function AppPreferencesScreen() {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, language, setLanguage } = useApp();
  const [prefs, setPrefs] = useState<AppPreferences>(AccountService.getAppPreferences());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const toggle = (key: keyof Omit<AppPreferences, 'language'>) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    if (key === 'darkMode') toggleTheme();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AccountService.saveAppPreferences({ ...prefs, darkMode: theme === 'dark', language });
      toast.success('Preferences saved');
    } finally {
      setSaving(false);
    }
  };

  const accessibilityRows = [
    { key: 'accessibilityLargeText' as const, icon: Type, label: 'Large Text', desc: 'Increase font size across the app' },
    { key: 'accessibilityReduceMotion' as const, icon: Zap, label: 'Reduce Motion', desc: 'Minimize animations and transitions' },
    { key: 'hapticFeedback' as const, icon: Smartphone, label: 'Haptic Feedback', desc: 'Vibration on interactions (mobile)' },
    { key: 'soundEffects' as const, icon: Volume2, label: 'Sound Effects', desc: 'Audio cues for actions' },
  ];

  return (
    <div className="relative min-h-screen app-bg-gradient pb-28">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/account')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">App Preferences</h1>
            <p className="text-sm text-muted-foreground">Personalize your experience</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Appearance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Appearance
            </p>
            <GlassmorphicCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-400/10 flex items-center justify-center">
                    <Moon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium cursor-pointer">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={() => toggle('darkMode')} />
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Language */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Language
            </p>
            <GlassmorphicCard>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-teal-400" />
                <p className="text-sm font-medium">App Language</p>
              </div>
              <div className="flex gap-3">
                {languageOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setLanguage(opt.value)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all',
                      language === opt.value
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-white/10 bg-white/3 text-muted-foreground hover:bg-white/5'
                    )}
                  >
                    <span>{opt.flag}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Accessibility */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Accessibility & Personalization
            </p>
            <GlassmorphicCard>
              <div className="space-y-0">
                {accessibilityRows.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.key}
                      className={cn('flex items-center justify-between py-4', i < accessibilityRows.length - 1 && 'border-b border-white/5')}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium cursor-pointer">{row.label}</Label>
                          <p className="text-xs text-muted-foreground">{row.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={prefs[row.key]}
                        onCheckedChange={() => toggle(row.key)}
                      />
                    </div>
                  );
                })}
              </div>
            </GlassmorphicCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30"
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Preferences'}
            </Button>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
