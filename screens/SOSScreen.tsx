/**
 * SOSScreen - Emergency emotional support with breathing exercises
 */

import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Heart, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BreathingAnimation } from '../components/BreathingAnimation';
import { TherapistService } from '../services/TherapistService';

export function SOSScreen() {
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
    <div className="relative min-h-screen app-bg-gradient">
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
        </div>

        <div className="space-y-8">
          {/* Reassurance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-3">You're Not Alone</h1>
            <p className="text-lg text-muted-foreground">
              Take a deep breath. We're here for you.
            </p>
          </motion.div>

          {/* Breathing Exercise */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassmorphicCard className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
              <h3 className="text-center font-medium mb-2">Calm Your Mind</h3>
              <p className="text-center text-sm text-muted-foreground mb-4">
                Follow the breathing exercise below
              </p>
              <BreathingAnimation />
            </GlassmorphicCard>
          </motion.div>

          {/* Grounding Exercise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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

          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassmorphicCard className="bg-gradient-to-br from-destructive/20 to-transparent border-destructive/30">
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
                    <div className="p-4 rounded-xl bg-card/60 border-2 border-destructive/30 hover:border-destructive/50 transition-all">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-destructive">{resource.name}</h4>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{resource.number}</div>
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

          {/* Talk to Someone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => navigate('/support')}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 text-lg shadow-xl shadow-primary/30"
            >
              <User className="w-5 h-5 mr-2" />
              Talk to a Therapist
            </Button>
          </motion.div>

          {/* Reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-muted-foreground py-4"
          >
            <p>You matter. Your feelings are valid. This moment will pass.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
