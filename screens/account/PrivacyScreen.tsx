/**
 * PrivacyScreen - Reserved for future privacy controls
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield } from 'lucide-react';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import { useApp } from '../../context/AppContext';

export function PrivacyScreen() {
  const navigate = useNavigate();
  const { user } = useApp();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="relative min-h-screen app-bg-gradient pb-28">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/account')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Privacy Settings</h1>
            <p className="text-sm text-muted-foreground">Your privacy matters to us</p>
          </div>
        </div>

        <GlassmorphicCard className="text-center py-12">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Your wellness data is private and never sold to third parties.
          </p>
        </GlassmorphicCard>
      </div>

      <BottomNav />
    </div>
  );
}
