/**
 * AppPreferencesScreen - Theme, language, accessibility
 */

import React, { useEffect } from 'react';
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
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';
import type { AppPreferences } from '../../services/AccountService';
import { playSound, triggerHaptic } from '../../utils/feedback';

const languageOptions = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'pidgin', label: 'Nigerian Pidgin', flag: '🇳🇬' },
] as const;

export function AppPreferencesScreen() {
  const navigate = useNavigate();
  const {
    user,
    theme,
    toggleTheme,
    language,
    setLanguage,
    preferences,
    updatePreferences,
    savePreferences,
    triggerInteractionFeedback,
  } = useApp();
  const [saving, setSaving] = React.useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const setPref = <K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) => {
    if (key === 'darkMode' && typeof value === 'boolean') {
      if ((value && theme !== 'dark') || (!value && theme === 'dark')) toggleTheme();
      return;
    }
    updatePreferences({ [key]: value });

    if (key === 'hapticFeedback' && value === true) {
      triggerHaptic('toggle');
    }
    if (key === 'soundEffects' && value === true) {
      playSound('success');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePreferences();
      triggerInteractionFeedback('success');
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
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/account')}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">App Preferences</h1>
            <p className="text-sm text-muted-foreground">Personalize your experience</p>
          </div>
        </div>

        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Appearance
            </p>
            <GlassmorphicCard>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                    <Moon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium cursor-pointer">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setPref('darkMode', checked)}
                />
              </div>
            </GlassmorphicCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Language
            </p>
            <GlassmorphicCard>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium">App Language</p>
              </div>
              <div className="flex gap-3">
                {languageOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      triggerInteractionFeedback('tap');
                      setLanguage(opt.value);
                    }}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors',
                      language === opt.value
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border bg-background text-muted-foreground hover:bg-secondary'
                    )}
                  >
                    <span>{opt.flag}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>

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
                      className={cn('flex items-center justify-between py-4', i < accessibilityRows.length - 1 && 'border-b border-border')}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <Label className="text-sm font-medium cursor-pointer">{row.label}</Label>
                          <p className="text-xs text-muted-foreground">{row.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences[row.key]}
                        onCheckedChange={(checked) => setPref(row.key, checked)}
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
              className="w-full ef-btn-primary rounded-xl h-12"
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
