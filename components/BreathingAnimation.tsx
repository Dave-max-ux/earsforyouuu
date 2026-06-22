/**
 * BreathingAnimation - Calming breathing guide for SOS mode
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function BreathingAnimation() {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    const phases = [
      { name: 'inhale' as const, duration: 4000, text: 'Breathe In' },
      { name: 'hold' as const, duration: 7000, text: 'Hold' },
      { name: 'exhale' as const, duration: 8000, text: 'Breathe Out' },
    ];

    let currentPhaseIndex = 0;
    let countdownInterval: NodeJS.Timeout;

    const startPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase.name);

      const countDuration = currentPhase.duration / 1000;
      setCount(Math.floor(countDuration));

      let remaining = countDuration;
      countdownInterval = setInterval(() => {
        remaining -= 1;
        setCount(Math.max(0, Math.floor(remaining)));
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        startPhase();
      }, currentPhase.duration);
    };

    startPhase();

    return () => clearInterval(countdownInterval);
  }, []);

  const getText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="relative w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(79, 209, 197, 0.3) 0%, rgba(56, 189, 248, 0.1) 100%)',
        }}
        animate={{
          scale: getScale(),
        }}
        transition={{
          duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0.5,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-light text-accent mb-2">{count}</div>
          <div className="text-lg text-muted-foreground">{getText()}</div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(79, 209, 197, 0.6) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{
            scale: getScale(),
            opacity: phase === 'hold' ? 0.7 : 0.3,
          }}
          transition={{
            duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 8 : 0.5,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      <div className="mt-8 text-center text-muted-foreground max-w-xs">
        <p className="text-sm">
          Follow the circle. Breathe slowly and deeply. You're doing great.
        </p>
      </div>
    </div>
  );
}
