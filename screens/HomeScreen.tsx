/**
 * HomeScreen - Main dashboard
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Heart, TrendingUp, Flame, BookOpen, LifeBuoy, BarChart3,
  Clock, Battery, ChevronRight, CalendarDays
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { EarsForYouLogo } from '../components/EarsForYouLogo';
import { useApp } from '../context/AppContext';
import { MoodService, MoodStats, MoodEntry, MOOD_META } from '../services/MoodService';
import { InsightService } from '../services/InsightService';

function formatMoodDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const entryDay = new Date(d);
  entryDay.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - entryDay.getTime()) / 86400000);
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function HomeScreen() {
  const { user, t } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [affirmation, setAffirmation] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [moodStats, daily] = await Promise.all([
      MoodService.getStats(),
      InsightService.getDailyAffirmation(),
    ]);
    setStats(moodStats);
    setMoods(MoodService.getAllMoods());
    setAffirmation(daily);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('home_greeting_morning'));
    else if (hour < 18) setGreeting(t('home_greeting_afternoon'));
    else setGreeting(t('home_greeting_evening'));
    setLoading(false);
  };

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-6 max-w-2xl mx-auto lg:max-w-3xl lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-7"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">{greeting}</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight">{firstName}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t('home_subtitle')}</p>
          </div>
          <EarsForYouLogo variant="mark" size="sm" />
        </motion.div>

        <div className="space-y-5">
          {/* Affirmation */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            {loading ? (
              <GlassmorphicCard><Skeleton className="h-4 w-32 mb-3" /><Skeleton className="h-3 w-full" /></GlassmorphicCard>
            ) : (
              <GlassmorphicCard gradient glow className="border-l-[3px] border-l-primary py-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2">{t('home_affirmation_title')}</p>
                <p className="text-foreground/90 leading-relaxed font-display text-base italic">&ldquo;{affirmation}&rdquo;</p>
              </GlassmorphicCard>
            )}
          </motion.div>

          {/* Check-in CTA */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <Button onClick={() => navigate('/mood')} className="w-full ef-btn-primary rounded-xl h-13 text-base shadow-lg shadow-primary/20">
              <Heart className="w-5 h-5 mr-2" strokeWidth={1.75} />
              {t('home_checkin_btn')}
            </Button>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <GlassmorphicCard className="text-center py-5">
                <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-secondary dark:bg-primary/15 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
                {loading ? <Skeleton className="h-8 w-12 mx-auto mb-1" /> : (
                  <div className="font-display text-3xl font-semibold tabular-nums">{stats?.wellnessScore || 0}</div>
                )}
                <div className="text-xs text-muted-foreground mt-0.5">{t('home_wellness_score')}</div>
              </GlassmorphicCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <GlassmorphicCard className="text-center py-5">
                <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-muted dark:bg-secondary flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#C4775B]" strokeWidth={1.75} />
                </div>
                {loading ? <Skeleton className="h-8 w-12 mx-auto mb-1" /> : (
                  <div className="font-display text-3xl font-semibold tabular-nums">{stats?.currentStreak || 0}</div>
                )}
                <div className="text-xs text-muted-foreground mt-0.5">{t('home_day_streak')}</div>
              </GlassmorphicCard>
            </motion.div>
          </div>

          {/* Mood History */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <GlassmorphicCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  {t('home_mood_history')}
                </h3>
                {moods.length > 0 && (
                  <button
                    onClick={() => navigate('/insights')}
                    className="text-xs text-primary flex items-center gap-0.5 hover:underline"
                  >
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : moods.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">📝</div>
                  <p className="text-sm font-medium mb-1">{t('home_no_moods')}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t('home_no_moods_desc')}</p>
                  <Button size="sm" variant="outline" onClick={() => navigate('/mood')} className="rounded-xl">
                    {t('home_checkin_btn')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {moods.map((entry, i) => {
                    const meta = MOOD_META[entry.mood];
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.02 * i }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border hover:border-primary/20 transition-colors"
                      >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                          {meta.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{meta.label}</p>
                            <span className="text-xs text-muted-foreground tabular-nums">Intensity {entry.intensity}/10</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{formatMoodDate(entry.timestamp)}</p>
                        </div>
                        <div className="text-right shrink-0 space-y-0.5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Stress</p>
                          <p className="text-xs font-medium tabular-nums">{entry.stress}/10</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </GlassmorphicCard>
          </motion.div>

          {/* Recent Patterns */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" /> {t('home_recent_patterns')}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{t('home_stress_level')}</span>
                    <span className="font-medium tabular-nums">{stats?.averageStress ? Math.round(stats.averageStress) : 0}/10</span>
                  </div>
                  <Progress value={(stats?.averageStress || 0) * 10} className="h-1.5 bg-muted" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5" /> {t('home_energy_level')}
                    </span>
                    <span className="font-medium tabular-nums">{stats?.averageEnergy ? Math.round(stats.averageEnergy) : 0}/10</span>
                  </div>
                  <Progress value={(stats?.averageEnergy || 0) * 10} className="h-1.5 bg-muted" />
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 text-sm">{t('home_quick_actions')}</h3>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'home_journal', path: '/journal', Icon: BookOpen },
                  { key: 'home_insights', path: '/insights', Icon: BarChart3 },
                  { key: 'home_support', path: '/support', Icon: LifeBuoy },
                ].map(item => (
                  <Button
                    key={item.path}
                    variant="outline"
                    onClick={() => navigate(item.path)}
                    className="h-auto py-4 flex-col gap-2 border-border rounded-xl hover:bg-secondary/60 hover:border-primary/20"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <item.Icon className="w-4 h-4 text-primary" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-medium">{t(item.key as any)}</span>
                  </Button>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
