/**
 * AccountRecoveryScreen - Recover account via OTP, then auto-login
 * API: POST /api/v1/auth/recovery/initiate  → POST /api/v1/auth/recovery/confirm
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Mail, ShieldCheck, Loader2, RefreshCw, Key
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { AuthService } from '../services/AuthService';
import { useApp } from '../context/AppContext';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

type Step = 'email' | 'otp' | 'success';

const RECOVERY_OTP_KEY = 'earsforyou_recovery_otp';
const RECOVERY_EMAIL_KEY = 'earsforyou_recovery_email';

function generateOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }

export function AccountRecoveryScreen() {
  const navigate = useNavigate();
  const { setUser, t } = useApp();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error(t('error_email_invalid')); return; }
    setEmailLoading(true);
    await new Promise(r => setTimeout(r, 900));
    // In production: POST /api/v1/auth/recovery/initiate  { email }
    const code = generateOTP();
    sessionStorage.setItem(RECOVERY_OTP_KEY, code);
    sessionStorage.setItem(RECOVERY_EMAIL_KEY, email);
    console.info(`[DEV] Recovery OTP: ${code}`);
    toast.success('Recovery code sent to your email');
    setCountdown(60);
    setEmailLoading(false);
    setStep('otp');
  };

  const handleResend = () => {
    const code = generateOTP();
    sessionStorage.setItem(RECOVERY_OTP_KEY, code);
    console.info(`[DEV] Resent Recovery OTP: ${code}`);
    setCountdown(60);
    setOtp('');
    setError('');
    toast.success('New code sent');
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError(t('error_otp_invalid')); return; }
    setOtpLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // In production: POST /api/v1/auth/recovery/confirm  { email, otp } → returns tokens + user
    const stored = sessionStorage.getItem(RECOVERY_OTP_KEY);
    if (otp !== stored) {
      setError(t('error_otp_invalid'));
      setOtpLoading(false);
      return;
    }

    // Auto-login: find user by stored email and restore session
    const user = AuthService.getCurrentUser();
    if (user && user.email === email) {
      setUser(user);
    }
    sessionStorage.removeItem(RECOVERY_OTP_KEY);
    sessionStorage.removeItem(RECOVERY_EMAIL_KEY);
    setOtpLoading(false);
    setStep('success');
    setTimeout(() => navigate('/home', { replace: true }), 1500);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden app-bg-gradient px-6">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <button onClick={() => navigate('/login')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>

              <div className="mb-8 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <Key className="w-7 h-7 text-accent" />
                </div>
                <h1 className="text-2xl font-bold">Account Recovery</h1>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Enter your email to receive a recovery code
                </p>
              </div>

              <GlassmorphicCard glow>
                <form onSubmit={handleInitiate} className="space-y-5">
                  <div className="space-y-2">
                    <Label>{t('forgot_email_label')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-10 bg-background/50 border-white/10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={emailLoading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30">
                    {emailLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : 'Send Recovery Code'}
                  </Button>
                </form>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('email')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="mb-8 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Enter Recovery Code</h1>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  Sent to <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>

              <GlassmorphicCard glow>
                <form onSubmit={handleConfirm} className="space-y-5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="000000"
                    className={cn(
                      'text-center tracking-[0.5em] text-2xl font-bold h-14 bg-background/50 border-white/10',
                      error && 'border-destructive'
                    )}
                    autoFocus
                  />
                  {error && <p className="text-xs text-destructive text-center">{error}</p>}

                  <Button type="submit" disabled={otpLoading || otp.length !== 6} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30">
                    {otpLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</> : 'Confirm & Recover'}
                  </Button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">Resend in {countdown}s</p>
                    ) : (
                      <button type="button" onClick={handleResend} className="text-sm text-primary hover:underline flex items-center gap-1.5 mx-auto">
                        <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                      </button>
                    )}
                  </div>
                </form>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* ── Step 3: Success ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Account Recovered!</h2>
              <p className="text-muted-foreground">Signing you back in…</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
