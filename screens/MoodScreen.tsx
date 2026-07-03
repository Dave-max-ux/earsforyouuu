/**
 * MoodScreen - Mood tracking with sliders
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
// Textarea removed (notes removed)
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { MoodSelector } from '../components/MoodSelector';
import { BottomNav } from '../components/BottomNav';
import { MoodType, MoodService } from '../services/MoodService';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function MoodScreen() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [mood, setMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [energy, setEnergy] = useState([5]);
  const [focus, setFocus] = useState([5]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!mood) {
      toast.error('Please select your mood');
      return;
    }

    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setSaving(true);

    try {
      await MoodService.logMood({
        userId: user.id,
        mood,
        intensity: intensity[0],
        stress: stress[0],
        energy: energy[0],
        focus: focus[0],
      });

      setSuccess(true);
      toast.success('Mood saved successfully!');

      setTimeout(() => {
        navigate('/insights');
      }, 1500);
    } catch (error) {
      toast.error('Failed to save mood');
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen app-bg-gradient flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Mood Saved!</h2>
          <p className="text-muted-foreground">Taking you to your insights...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">How are you feeling?</h1>
            <p className="text-sm text-muted-foreground">Track your emotional state</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Mood Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassmorphicCard glow>
              <h3 className="font-medium mb-4">Select Your Mood</h3>
              <MoodSelector selected={mood} onSelect={setMood} />
            </GlassmorphicCard>
          </motion.div>

          {/* Sliders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassmorphicCard>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium">Mood Intensity</label>
                    <span className="text-sm text-muted-foreground">{intensity[0]}/10</span>
                  </div>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    min={1}
                    max={10}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium">Stress Level</label>
                    <span className="text-sm text-muted-foreground">{stress[0]}/10</span>
                  </div>
                  <Slider
                    value={stress}
                    onValueChange={setStress}
                    min={1}
                    max={10}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium">Energy Level</label>
                    <span className="text-sm text-muted-foreground">{energy[0]}/10</span>
                  </div>
                  <Slider
                    value={energy}
                    onValueChange={setEnergy}
                    min={1}
                    max={10}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium">Focus</label>
                    <span className="text-sm text-muted-foreground">{focus[0]}/10</span>
                  </div>
                  <Slider
                    value={focus}
                    onValueChange={setFocus}
                    min={1}
                    max={10}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Notes section removed */}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleSave}
              disabled={!mood || saving}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 text-lg shadow-xl shadow-primary/30 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Mood'}
            </Button>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
