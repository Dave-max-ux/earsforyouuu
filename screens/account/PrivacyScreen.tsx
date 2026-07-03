/**
 * PrivacyScreen - Profile visibility, data sharing, AI preferences
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Share2, Brain, Heart, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import { useApp } from '../../context/AppContext';
import { AccountService, PrivacySettings } from '../../services/AccountService';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

const visibilityOptions = [
  { value: 'public', label: 'Public', desc: 'Anyone can find your profile' },
  { value: 'friends', label: 'Friends', desc: 'Only connected users' },
  { value: 'private', label: 'Private', desc: 'Only you can see it' },
] as const;

export function PrivacyScreen() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [settings, setSettings] = useState<PrivacySettings>(AccountService.getPrivacySettings());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const toggle = (key: keyof Omit<PrivacySettings, 'profileVisibility'>) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AccountService.savePrivacySettings(settings);
      toast.success('Privacy settings saved');
    } finally {
      setSaving(false);
    }
  };

  const toggleRows = [
    { key: 'dataSharing' as const, icon: Share2, label: 'Data Sharing', desc: 'Share anonymized data to improve our service', color: 'text-teal-400' },
    { key: 'aiPersonalization' as const, icon: Brain, label: 'Personal Recommendations', desc: 'Tailor insights based on your patterns', color: 'text-accent' },
    { key: 'wellnessRecommendations' as const, icon: Heart, label: 'Wellness Recommendations', desc: 'Receive personalized wellness tips', color: 'text-pink-400' },
    { key: 'analyticsOptIn' as const, icon: BarChart3, label: 'Usage Analytics', desc: 'Help us improve app performance', color: 'text-yellow-400' },
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
            <h1 className="text-2xl font-bold">Privacy Settings</h1>
            <p className="text-sm text-muted-foreground">Control your data & visibility</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Profile Visibility */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Profile Visibility
            </p>
            <GlassmorphicCard>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium">Who can see your profile?</p>
              </div>
              <div className="space-y-2">
                {visibilityOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSettings(prev => ({ ...prev, profileVisibility: opt.value }))}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left',
                      settings.profileVisibility === opt.value
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-white/5 bg-white/3 hover:bg-white/5'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                      settings.profileVisibility === opt.value ? 'border-primary' : 'border-white/20'
                    )}>
                      {settings.profileVisibility === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Toggle Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Data Preferences
            </p>
            <GlassmorphicCard>
              <div className="space-y-1">
                {toggleRows.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.key}
                      className={cn(
                        'flex items-center justify-between py-4',
                        i < toggleRows.length - 1 && 'border-b border-white/5'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${row.color}`} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium cursor-pointer">{row.label}</Label>
                          <p className="text-xs text-muted-foreground">{row.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings[row.key]}
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
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Privacy Settings'}
            </Button>
          </motion.div>

          <p className="text-xs text-muted-foreground text-center px-4">
            Your wellness data is never sold to third parties. Read our Privacy Policy for more details.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
