/**
 * ProfileScreen - User profile and settings with i18n
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, User, Globe, Moon, Sun, LogOut, Trash2, Shield, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '../components/ui/alert-dialog';
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
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    toast.success(t('success_logout'));
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await AuthService.deleteAccount();
      setUser(null);
      toast.success('Account deleted');
      navigate('/welcome');
    } catch {
      toast.error(t('error_generic'));
      setDeleting(false);
    }
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
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all">
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/50">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-white/10 hover:border-destructive/50 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('profile_delete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('profile_delete_confirm')}</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">{t('profile_delete_desc')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} disabled={deleting} className="bg-destructive hover:bg-destructive/90">
                        {deleting ? t('profile_deleting') : t('profile_delete_btn')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
