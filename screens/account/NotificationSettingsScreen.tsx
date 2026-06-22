/**
 * NotificationSettingsScreen - Push, email, and reminder settings
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Bell, Mail, Heart, BookOpen, Calendar,
  Users, Loader2, Clock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import { useApp } from '../../context/AppContext';
import { AccountService, NotificationSettings } from '../../services/AccountService';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

export function NotificationSettingsScreen() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [settings, setSettings] = useState<NotificationSettings>(
    AccountService.getNotificationSettings()
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const toggle = (key: keyof Omit<NotificationSettings, 'moodReminderTime' | 'journalReminderTime'>) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AccountService.saveNotificationSettings(settings);
      toast.success('Notification settings saved');
    } finally {
      setSaving(false);
    }
  };

  const channelRows = [
    { key: 'pushEnabled' as const, icon: Bell, label: 'Push Notifications', desc: 'In-app and device notifications', color: 'text-primary', bg: 'bg-primary/10' },
    { key: 'emailEnabled' as const, icon: Mail, label: 'Email Notifications', desc: 'Summary and alerts via email', color: 'text-accent', bg: 'bg-accent/10' },
  ];

  const reminderRows = [
    { key: 'moodReminders' as const, icon: Heart, label: 'Mood Reminders', desc: 'Daily prompts to log your mood', color: 'text-pink-400', timeKey: 'moodReminderTime' as const },
    { key: 'journalReminders' as const, icon: BookOpen, label: 'Journal Reminders', desc: 'Evening journaling prompts', color: 'text-teal-400', timeKey: 'journalReminderTime' as const },
    { key: 'therapyReminders' as const, icon: Calendar, label: 'Therapy Session Reminders', desc: 'Upcoming session alerts', color: 'text-yellow-400', timeKey: null },
    { key: 'communityActivity' as const, icon: Users, label: 'Community Activity', desc: 'Replies and community updates', color: 'text-green-400', timeKey: null },
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
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">Customize your alerts</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Channels */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Channels
            </p>
            <GlassmorphicCard>
              {channelRows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={row.key} className={cn('flex items-center justify-between py-4', i === 0 && 'border-b border-white/5')}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${row.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${row.color}`} />
                      </div>
                      <div>
                        <Label className="text-sm font-medium cursor-pointer">{row.label}</Label>
                        <p className="text-xs text-muted-foreground">{row.desc}</p>
                      </div>
                    </div>
                    <Switch checked={settings[row.key]} onCheckedChange={() => toggle(row.key)} />
                  </div>
                );
              })}
            </GlassmorphicCard>
          </motion.div>

          {/* Reminders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Reminders
            </p>
            <GlassmorphicCard>
              <div className="space-y-0">
                {reminderRows.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.key}
                      className={cn('py-4', i < reminderRows.length - 1 && 'border-b border-white/5')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${row.color}`} />
                          <div>
                            <Label className="text-sm font-medium cursor-pointer">{row.label}</Label>
                            <p className="text-xs text-muted-foreground">{row.desc}</p>
                          </div>
                        </div>
                        <Switch checked={settings[row.key]} onCheckedChange={() => toggle(row.key)} />
                      </div>
                      {row.timeKey && settings[row.key] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 flex items-center gap-3 pl-7"
                        >
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-muted-foreground">Reminder time</Label>
                            <Input
                              type="time"
                              value={settings[row.timeKey]}
                              onChange={e => setSettings(prev => ({ ...prev, [row.timeKey!]: e.target.value }))}
                              className="w-32 h-8 text-sm bg-background/50 border-white/10"
                            />
                          </div>
                        </motion.div>
                      )}
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
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : 'Save Notification Settings'}
            </Button>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
