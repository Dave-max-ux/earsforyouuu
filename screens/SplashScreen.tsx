/**
 * SplashScreen — brand loading screen
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { EarsForYouLogo } from '../components/EarsForYouLogo';

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
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate, user, isOnboarded]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden app-bg-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <EarsForYouLogo variant="full" size="xl" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-muted-foreground text-sm tracking-wide"
        >
          Emotional wellness, on your terms
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/60"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
