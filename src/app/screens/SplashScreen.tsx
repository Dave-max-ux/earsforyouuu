/**
 * SplashScreen - Animated loading screen
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Headphones, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function SplashScreen() {
  const navigate = useNavigate();
  const { user, isOnboarded } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate('/home');
      } else if (isOnboarded) {
        navigate('/login');
      } else {
        navigate('/welcome');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, user, isOnboarded]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden app-bg-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            duration: 1 
          }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-2xl shadow-primary/50">
            <Headphones className="w-16 h-16 text-white" />
          </div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/40 blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2 justify-center">
            EarsForYou
            <Sparkles className="w-6 h-6 text-accent" />
          </h1>
          <p className="text-muted-foreground">Your emotional wellness companion</p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
