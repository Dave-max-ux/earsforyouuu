/**
 * SupportScreen - Crisis support, breathing exercises, and helplines
 */

import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Heart, LifeBuoy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { BreathingAnimation } from '../components/BreathingAnimation';
import { TherapistService } from '../services/TherapistService';

export function SupportScreen() {
  const navigate = useNavigate();
  const crisisResources = TherapistService.getCrisisResources();

  const groundingExercises = [
    '5 things you can see',
    '4 things you can touch',
    '3 things you can hear',
    '2 things you can smell',
    '1 thing you can taste',
  ];

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Support</h1>
            <p className="text-sm text-muted-foreground">Help when you need it most</p>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LifeBuoy className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">You&apos;re Not Alone</h2>
            <p className="text-muted-foreground">
              Take a deep breath. We&apos;re here for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <GlassmorphicCard className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
              <h3 className="text-center font-medium mb-1">Calm Your Mind</h3>
              <p className="text-center text-sm text-muted-foreground mb-4">
                Follow the breathing exercise below
              </p>
              <BreathingAnimation />
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent" />
                5-4-3-2-1 Grounding Exercise
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Notice these things around you to feel present:
              </p>
              <ul className="space-y-2">
                {groundingExercises.map((exercise, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium shrink-0">
                      {5 - index}
                    </div>
                    <span className="text-sm">{exercise}</span>
                  </li>
                ))}
              </ul>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassmorphicCard className="bg-gradient-to-br from-destructive/10 to-transparent border-destructive/20">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-destructive" />
                Get Immediate Help
              </h3>
              <div className="space-y-3">
                {crisisResources.map((resource, index) => (
                  <a
                    key={index}
                    href={`tel:${resource.number}`}
                    className="block"
                  >
                    <div className="p-4 rounded-xl bg-card/60 border border-destructive/20 hover:border-destructive/40 transition-all">
                      <div className="flex justify-between items-center gap-4">
                        <div>
                          <h4 className="font-medium">{resource.name}</h4>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-medium tabular-nums">{resource.number}</div>
                          <Button size="sm" variant="destructive" className="mt-2">
                            Call Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-muted-foreground py-2"
          >
            You matter. Your feelings are valid. This moment will pass.
          </motion.p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
