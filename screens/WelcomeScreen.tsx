/**
 * WelcomeScreen — Onboarding
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, BookOpen, LineChart, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { EarsForYouLogo } from '../components/EarsForYouLogo';

const onboardingSlides = [
  {
    icon: Heart,
    title: 'Track Your Emotions',
    description: 'Log your daily mood and understand your emotional patterns over time',
    accent: 'bg-secondary text-[#1A4D5C] dark:bg-primary/15 dark:text-primary',
  },
  {
    icon: BookOpen,
    title: 'Journal Your Thoughts',
    description: 'Write freely in a safe, private space designed for emotional healing',
    accent: 'bg-muted text-secondary dark:bg-secondary dark:text-foreground',
  },
  {
    icon: LineChart,
    title: 'Understand Your Patterns',
    description: 'Receive thoughtful insights tailored to your wellness journey',
    accent: 'bg-[#E4F3EB] text-[#3D8B7A] dark:bg-accent/15 dark:text-accent',
  },
];

export function WelcomeScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const markOnboarded = () => localStorage.setItem('earsforyou_onboarded', 'true');

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      markOnboarded();
      navigate('/signup');
    }
  };

  const slide = onboardingSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden app-bg-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex justify-between items-center p-6">
        <EarsForYouLogo variant="mark" size="sm" />
        <Button
          variant="ghost"
          onClick={() => { markOnboarded(); navigate('/signup'); }}
          className="text-muted-foreground text-sm"
        >
          Skip
        </Button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <GlassmorphicCard className="text-center" glow>
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl ${slide.accent} flex items-center justify-center`}>
                <Icon className="w-8 h-8" strokeWidth={1.75} />
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3 tracking-tight">{slide.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{slide.description}</p>
            </GlassmorphicCard>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-8">
          {onboardingSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6 pb-10 space-y-3 max-w-md mx-auto w-full">
        <Button
          onClick={handleNext}
          className="w-full ef-btn-primary rounded-xl text-base h-14"
        >
          {currentSlide < onboardingSlides.length - 1 ? (
            <>Continue <ChevronRight className="ml-1 w-4 h-4" /></>
          ) : (
            'Create your account'
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate('/login')}
          className="w-full rounded-xl h-12 border-border hover:bg-secondary/50"
        >
          I already have an account
        </Button>

        <div className="text-center pt-1">
          <button
            onClick={() => navigate('/account-recovery')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Can't access your account?{' '}
            <span className="text-primary font-medium">Recover it</span>
          </button>
        </div>
      </div>
    </div>
  );
}
