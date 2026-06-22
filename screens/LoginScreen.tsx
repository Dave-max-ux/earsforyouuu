/**
 * LoginScreen - User login with i18n
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { EarsForYouLogo } from '../components/EarsForYouLogo';
import { AuthService } from '../services/AuthService';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function LoginScreen() {
  const navigate = useNavigate();
  const { setUser, t } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await AuthService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        toast.success(t('success_login'));
        navigate('/home');
      } else {
        toast.error(t('error_login_failed'));
      }
    } catch {
      toast.error(t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden app-bg-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <EarsForYouLogo variant="full" size="lg" className="mb-6" />
            <h1 className="font-display text-2xl font-semibold tracking-tight">{t('login_title')}</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">{t('login_subtitle')}</p>
          </div>

          <GlassmorphicCard glow>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login_email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 bg-background border-border rounded-xl h-11" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('login_password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 bg-background border-border rounded-xl h-11" required />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-primary hover:underline font-medium">
                {t('login_forgot')}
              </button>
              <Button type="submit" disabled={loading} className="w-full ef-btn-primary rounded-xl h-12">
                {loading ? t('login_loading') : t('login_btn')}
              </Button>
            </form>
          </GlassmorphicCard>

          <div className="text-center mt-6">
            <p className="text-muted-foreground text-sm">
              {t('login_no_account')}{' '}
              <button onClick={() => navigate('/signup')} className="text-primary hover:underline font-medium">{t('login_signup')}</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
