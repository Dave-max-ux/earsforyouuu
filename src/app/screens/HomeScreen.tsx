/**
 * HomeScreen - Main dashboard with i18n and generation-aware content
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Heart, TrendingUp, Flame, Sparkles, Clock, Battery, Focus } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
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

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            {greeting}, {user?.fullName?.split(' ')[0] || 'Friend'} 👋
          </h1>
          <p className="text-muted-foreground">{t('home_subtitle')}</p>
        </motion.div>

        <div className="space-y-4">
          {/* Daily Affirmation — no AI branding */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {loading ? (
              <GlassmorphicCard><Skeleton className="h-4 w-32 mb-3 bg-white/10" /><Skeleton className="h-3 w-full bg-white/10" /><Skeleton className="h-3 w-3/4 mt-2 bg-white/10" /></GlassmorphicCard>
            ) : (
            <GlassmorphicCard gradient glow className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-3">
                <div>
                  <h3 className="font-medium mb-1">{t('home_affirmation_title')}</h3>
                  <p className="text-muted-foreground leading-relaxed">{affirmation}</p>
                </div>
              </div>
            </GlassmorphicCard>
            )}
          </motion.div>

          {/* Quick Check-In */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Button onClick={() => navigate('/mood')} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-lg shadow-xl shadow-primary/30">
              <Heart className="w-6 h-6 mr-2" />
              {t('home_checkin_btn')}
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <GlassmorphicCard className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                {loading ? <Skeleton className="h-8 w-12 mx-auto mb-1 bg-white/10" /> : <div className="text-3xl font-bold text-primary mb-1">{stats?.wellnessScore || 0}</div>}
                <div className="text-xs text-muted-foreground">{t('home_wellness_score')}</div>
              </GlassmorphicCard>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}>
              <GlassmorphicCard className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                {loading ? <Skeleton className="h-8 w-12 mx-auto mb-1 bg-white/10" /> : <div className="text-3xl font-bold text-primary mb-1">{stats?.currentStreak || 0}</div>}
                <div className="text-xs text-muted-foreground">{t('home_day_streak')}</div>
              </GlassmorphicCard>
            </motion.div>
          </div>

          {/* Recent Patterns */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" /> {t('home_recent_patterns')}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{t('home_stress_level')}</span>
                    <span className="font-medium">{stats?.averageStress ? Math.round(stats.averageStress) : 0}/10</span>
                  </div>
                  <Progress value={(stats?.averageStress || 0) * 10} className="h-2 bg-white/10" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Battery className="w-4 h-4" /> {t('home_energy_level')}
                    </span>
                    <span className="font-medium">{stats?.averageEnergy ? Math.round(stats.averageEnergy) : 0}/10</span>
                  </div>
                  <Progress value={(stats?.averageEnergy || 0) * 10} className="h-2 bg-white/10" />
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4">{t('home_quick_actions')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'home_journal', path: '/journal', Icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10', hover: 'hover:border-primary/50' },
                  { key: 'home_insights', path: '/insights', Icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10', hover: 'hover:border-accent/50' },
                  { key: 'home_support', path: '/support', Icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10', hover: 'hover:border-pink-500/50' },
                  { key: 'home_sos', path: '/sos', Icon: Focus, color: 'text-destructive', bg: 'bg-destructive/10', hover: 'hover:border-destructive/50' },
                ].map(item => (
                  <Button key={item.path} variant="outline" onClick={() => navigate(item.path)} className={`h-auto py-4 flex-col gap-2 border-white/10 ${item.hover}`}>
                    <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                      <item.Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-sm">{t(item.key as any)}</span>
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
