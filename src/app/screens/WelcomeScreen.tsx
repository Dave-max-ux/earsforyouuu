/**
 * WelcomeScreen - Onboarding with Login, Register, and Account Recovery entry points
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';

const onboardingSlides = [
  {
    icon: Heart,
    title: 'Track Your Emotions',
    description: 'Log your daily mood and understand your emotional patterns over time',
    color: 'from-pink-400 to-rose-500',
  },
  {
    icon: BookOpen,
    title: 'Journal Your Thoughts',
    description: 'Write freely in a safe, private space designed for emotional healing',
    color: 'from-purple-400 to-violet-500',
  },
  {
    icon: Sparkles,
    title: 'Get Personalized Insights',
    description: 'Receive personalized wellness content tailored to your life stage',
    color: 'from-cyan-400 to-blue-500',
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

      {/* Skip */}
      <div className="relative z-10 flex justify-end p-6">
        <Button variant="ghost" onClick={() => { markOnboarded(); navigate('/signup'); }} className="text-muted-foreground">
          Skip
        </Button>
      </div>

      {/* Slide */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.28 }}
            className="w-full max-w-md"
          >
            <GlassmorphicCard className="text-center" glow>
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-2xl`}>
                <Icon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{slide.description}</p>
            </GlassmorphicCard>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-8">
          {onboardingSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 px-6 pb-10 space-y-3 max-w-md mx-auto w-full">
        {/* Primary CTA */}
        <Button
          onClick={handleNext}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-14 text-lg shadow-lg shadow-primary/30"
        >
          {currentSlide < onboardingSlides.length - 1 ? (
            <>Next <ChevronRight className="ml-2 w-5 h-5" /></>
          ) : (
            'Get Started'
          )}
        </Button>

        {/* Login button — always visible */}
        <Button
          variant="outline"
          onClick={() => navigate('/login')}
          className="w-full border-white/10 rounded-full h-12 hover:border-primary/50"
        >
          I already have an account
        </Button>

        {/* Account recovery link */}
        <div className="text-center pt-1">
          <button
            onClick={() => navigate('/account-recovery')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Can't access your account?{' '}
            <span className="text-primary underline underline-offset-2">Recover it</span>
          </button>
        </div>
      </div>
    </div>
  );
}
