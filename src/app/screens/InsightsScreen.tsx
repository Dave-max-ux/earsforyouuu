/**
 * InsightsScreen - Analytics and emotional insights
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Calendar, Lightbulb, AlertCircle, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { MoodService } from '../services/MoodService';
import { InsightService, Insight } from '../services/InsightService';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

export function InsightsScreen() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [moodData, setMoodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Load insights
    const generatedInsights = await InsightService.generateInsights();
    setInsights(generatedInsights);

    // Load mood data for charts
    const moods = MoodService.getAllMoods();
    const last7Days = moods.slice(0, 7).reverse();

    const chartData = last7Days.map((mood) => {
      const date = new Date(mood.timestamp);
      return {
        date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        stress: mood.stress,
        energy: mood.energy,
        moodValue: getMoodValue(mood.mood),
      };
    });

    setMoodData(chartData);
    setLoading(false);
  };

  const getMoodValue = (mood: string): number => {
    const values: Record<string, number> = {
      amazing: 5,
      good: 4,
      okay: 3,
      down: 2,
      terrible: 1,
    };
    return values[mood] || 3;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern':
        return TrendingUp;
      case 'encouragement':
        return Sparkles;
      case 'suggestion':
        return Lightbulb;
      case 'observation':
        return Calendar;
      default:
        return AlertCircle;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'positive':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'warning':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Insights
            </h1>
            <p className="text-sm text-muted-foreground">Your emotional patterns</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mood Trend Chart */}
            {moodData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassmorphicCard glow>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    7-Day Mood Trends
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="rgba(255,255,255,0.5)"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.5)"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(18, 18, 42, 0.9)',
                            border: '1px solid rgba(124, 92, 255, 0.3)',
                            borderRadius: '12px',
                            color: 'var(--color-text-primary)',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="moodValue"
                          stroke="var(--color-green-deep)"
                          strokeWidth={3}
                          dot={{ fill: 'var(--color-green-deep)', r: 4 }}
                          name="Mood"
                        />
                        <Line
                          type="monotone"
                          dataKey="energy"
                          stroke="var(--color-green-mid)"
                          strokeWidth={2}
                          dot={{ fill: 'var(--color-green-mid)', r: 3 }}
                          name="Energy"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            )}

            {/* Stress vs Energy Chart */}
            {moodData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassmorphicCard>
                  <h3 className="font-medium mb-4">Stress vs Energy</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="rgba(255,255,255,0.5)"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.5)"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(18, 18, 42, 0.9)',
                            border: '1px solid rgba(124, 92, 255, 0.3)',
                            borderRadius: '12px',
                            color: 'var(--color-text-primary)',
                          }}
                        />
                        <Bar dataKey="stress" fill="var(--destructive)" radius={[8, 8, 0, 0]} name="Stress" />
                        <Bar dataKey="energy" fill="var(--color-green-primary)" radius={[8, 8, 0, 0]} name="Energy" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            )}

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassmorphicCard>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  AI-Powered Insights
                </h3>

                {insights.length > 0 ? (
                  <div className="space-y-3">
                    {insights.map((insight) => {
                      const Icon = getInsightIcon(insight.type);
                      return (
                        <div
                          key={insight.id}
                          className={`p-4 rounded-xl border ${getSeverityColor(insight.severity)}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-current/10 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{insight.title}</h4>
                              <p className="text-sm opacity-90">{insight.message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start tracking your mood to unlock insights</p>
                  </div>
                )}
              </GlassmorphicCard>
            </motion.div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
