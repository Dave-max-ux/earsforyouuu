/**
 * BottomNav — refined bottom navigation with hover animations
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Home, Heart, BookOpen, BarChart3, MessageSquare, User } from 'lucide-react';
import { cn } from './ui/utils';
import { useFeedback } from '../hooks/useFeedback';
import { useApp } from '../context/AppContext';
import { TranslationKey } from '../i18n/translations';

interface NavItem {
  path: string;
  icon: React.ElementType;
  labelKey: TranslationKey;
}

const navItems: NavItem[] = [
  { path: '/home', icon: Home, labelKey: 'nav_home' },
  { path: '/mood', icon: Heart, labelKey: 'nav_mood' },
  { path: '/journal', icon: BookOpen, labelKey: 'nav_journal' },
  { path: '/insights', icon: BarChart3, labelKey: 'nav_insights' },
  { path: '/chat', icon: MessageSquare, labelKey: 'nav_chat' },
  { path: '/profile', icon: User, labelKey: 'nav_profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useApp();
  const { onInteraction } = useFeedback();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="relative rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-xl p-1.5 transition-shadow duration-300 hover:shadow-2xl">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onInteraction('navigate');
                    navigate(item.path);
                  }}
                  className={cn(
                    'relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[3rem]',
                    'hover:scale-105 active:scale-95',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/15 shadow-sm"
                      layoutId="nav-bg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'relative w-5 h-5 transition-transform duration-200',
                      isActive && 'stroke-[2.25] scale-110',
                      !isActive && 'group-hover:scale-110'
                    )}
                  />
                  <span className={cn('relative text-[10px] font-medium transition-all', isActive && 'font-semibold')}>
                    {t(item.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
