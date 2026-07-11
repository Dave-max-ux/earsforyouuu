/**
 * ProfileScreen - User profile and settings with i18n
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, User, Globe, Moon, Sun, LogOut, Shield, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';
import { GENERATION_LABELS } from '../services/AuthService';
import { toast } from 'sonner';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, setUser, language, setLanguage, theme, toggleTheme, t } = useApp();

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    toast.success(t('success_logout'));
    navigate('/login');
  };

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t('profile_title')}</h1>
            <p className="text-sm text-muted-foreground">{t('profile_subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassmorphicCard glow className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-secondary dark:bg-primary/15 flex items-center justify-center">
                <User className="w-9 h-9 text-primary" strokeWidth={1.75} />
              </div>
              <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>

              {user.generation && (
                <p className="text-xs text-accent mb-3">{GENERATION_LABELS[user.generation]}</p>
              )}
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-xs text-accent">{t('profile_verified')}</span>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4">{t('profile_preferences')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                    <div>
                      <Label className="cursor-pointer">{t('profile_dark_mode')}</Label>
                      <p className="text-xs text-muted-foreground">{theme === 'dark' ? t('profile_dark_enabled') : t('profile_dark_disabled')}</p>
                    </div>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-accent" />
                    <div>
                      <Label>{t('profile_language')}</Label>
                      <p className="text-xs text-muted-foreground">{language === 'en' ? 'English' : 'Nigerian Pidgin'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')} className="text-xs">EN</Button>
                    <Button size="sm" variant={language === 'pidgin' ? 'default' : 'outline'} onClick={() => setLanguage('pidgin')} className="text-xs">Pidgin</Button>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Account Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4">{t('profile_account_details')}</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: t('profile_gender'), value: user.gender?.replace('-', ' ') },
                  { label: t('profile_marital'), value: user.maritalStatus },
                  { label: t('profile_employment'), value: user.employmentStatus?.replace('-', ' ') },
                  { label: t('profile_generation'), value: user.generation ? GENERATION_LABELS[user.generation] : '—' },
                ].map((row, i, arr) => (
                  <div key={row.label} className={`flex justify-between py-2 ${i < arr.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="capitalize">{row.value || '—'}</span>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassmorphicCard>
              <div className="space-y-3">
                <Button onClick={() => navigate('/account')} variant="outline" className="w-full justify-start border-white/10 hover:border-primary/50">
                  <Settings className="w-4 h-4 mr-2" />
                  {t('profile_manage_account')}
                </Button>
                <Button onClick={handleLogout} variant="outline" className="w-full justify-start border-white/10 hover:border-primary/50">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('profile_logout')}
                </Button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
