/**
 * MoodSelector - Six-mood emotional selector matching the spec
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from './ui/utils';
import { MoodType } from '../services/MoodService';

interface MoodOption {
  value: MoodType;
  label: string;
  emoji: string;
  gradient: string;
  ring: string;
}

const moodOptions: MoodOption[] = [
  { value: 'happy',   label: 'Happy',   emoji: '😊', gradient: 'from-yellow-400 to-amber-500',   ring: 'ring-yellow-400' },
  { value: 'calm',    label: 'Calm',    emoji: '😌', gradient: 'from-teal-400 to-cyan-500',      ring: 'ring-teal-400'   },
  { value: 'neutral', label: 'Neutral', emoji: '😐', gradient: 'from-slate-400 to-gray-500',     ring: 'ring-slate-400'  },
  { value: 'sad',     label: 'Sad',     emoji: '😢', gradient: 'from-blue-400 to-indigo-500',    ring: 'ring-blue-400'   },
  { value: 'anxious', label: 'Anxious', emoji: '😰', gradient: 'from-orange-400 to-amber-500',   ring: 'ring-orange-400' },
  { value: 'stressed',label: 'Stressed',emoji: '😤', gradient: 'from-red-400 to-rose-500',       ring: 'ring-red-400'    },
];

interface MoodSelectorProps {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {moodOptions.map((mood) => {
        const isSelected = selected === mood.value;
        return (
          <motion.button
            key={mood.value}
            onClick={() => onSelect(mood.value)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'relative flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all',
              isSelected
                ? 'border-primary/60 bg-primary/10'
                : 'border-white/10 bg-card/40 hover:bg-card/60 hover:border-white/20'
            )}
          >
            {/* Emoji orb */}
            <div className={cn(
              'w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg',
              mood.gradient,
              isSelected && `ring-2 ring-offset-2 ring-offset-transparent ${mood.ring}`
            )}>
              {mood.emoji}
            </div>

            <span className={cn(
              'text-xs font-medium',
              isSelected ? 'text-primary' : 'text-muted-foreground'
            )}>
              {mood.label}
            </span>

            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-primary/10"
                layoutId="mood-selection"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
