/**
 * HomeScreen - Main dashboard
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Heart, TrendingUp, Flame, BookOpen, Clock, Battery, Focus, LifeBuoy, BarChart3 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { EarsForYouLogo } from '../components/EarsForYouLogo';
import { useApp } from '../context/AppContext';
import { MoodService, MoodStats } from '../services/MoodService';
import { InsightService } from '../services/InsightService';

export function HomeScreen() {
  const { user, t } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [affirmation, setAffirmation] = useState('');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const moodStats = await MoodService.getStats();
    setStats(moodStats);
    const daily = await InsightService.getDailyAffirmation();
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

      <div className="relative z-10 px-6 py-6 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-0.5">{greeting}</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {firstName}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">{t('home_subtitle')}</p>
          </div>
          <EarsForYouLogo variant="mark" size="sm" />
        </motion.div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            {loading ? (
              <GlassmorphicCard><Skeleton className="h-4 w-32 mb-3" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-3/4 mt-2" /></GlassmorphicCard>
            ) : (
              <GlassmorphicCard gradient glow className="border-l-[3px] border-l-primary">
                <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">{t('home_affirmation_title')}</p>
                <p className="text-foreground/90 leading-relaxed font-display text-lg italic">"{affirmation}"</p>
              </GlassmorphicCard>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Button onClick={() => navigate('/mood')} className="w-full ef-btn-primary rounded-xl h-14 text-base">
              <Heart className="w-5 h-5 mr-2" strokeWidth={1.75} />
              {t('home_checkin_btn')}
            </Button>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <GlassmorphicCard className="text-center py-5">
                <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-secondary dark:bg-primary/15 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
                {loading ? <Skeleton className="h-8 w-12 mx-auto mb-1" /> : <div className="font-display text-3xl font-semibold text-foreground mb-0.5">{stats?.wellnessScore || 0}</div>}
                <div className="text-xs text-muted-foreground">{t('home_wellness_score')}</div>
              </GlassmorphicCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
              <GlassmorphicCard className="text-center py-5">
                <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-muted dark:bg-secondary flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#C4775B]" strokeWidth={1.75} />
                </div>
                {loading ? <Skeleton className="h-8 w-12 mx-auto mb-1" /> : <div className="font-display text-3xl font-semibold text-foreground mb-0.5">{stats?.currentStreak || 0}</div>}
                <div className="text-xs text-muted-foreground">{t('home_day_streak')}</div>
              </GlassmorphicCard>
            </motion.div>
          </div>

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

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 text-sm">{t('home_quick_actions')}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: 'home_journal', path: '/journal', Icon: BookOpen },
                  { key: 'home_insights', path: '/insights', Icon: BarChart3 },
                  { key: 'home_support', path: '/support', Icon: LifeBuoy },
                  { key: 'home_sos', path: '/sos', Icon: Focus },
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
