/**
 * ForgotPasswordScreen - Frontend-only 4-step OTP password recovery
 * Architecture is modular — replace localStorage OTP with real email API later.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Check, Lock, Eye, EyeOff, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { useApp } from '../context/AppContext';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

type Step = 'email' | 'otp' | 'reset' | 'success';

const OTP_KEY = 'earsforyou_pwd_otp';
const OTP_EMAIL_KEY = 'earsforyou_pwd_reset_email';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email: string, otp: string) {
  sessionStorage.setItem(OTP_KEY, otp);
  sessionStorage.setItem(OTP_EMAIL_KEY, email);
}

function getStoredOTP(): { otp: string; email: string } | null {
  const otp = sessionStorage.getItem(OTP_KEY);
  const email = sessionStorage.getItem(OTP_EMAIL_KEY);
  if (!otp || !email) return null;
  return { otp, email };
}

function clearOTP() {
  sessionStorage.removeItem(OTP_KEY);
  sessionStorage.removeItem(OTP_EMAIL_KEY);
}

function simulateSendEmail(email: string, otp: string): Promise<void> {
  // In production: POST /api/auth/send-otp  { email }
  // The OTP would be generated server-side and stored in DB, not localStorage
  console.info(`[DEV] OTP for ${email}: ${otp}`);
  return new Promise(resolve => setTimeout(resolve, 900));
}

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [step, setStep] = useState<Step>('email');

  // Step 1
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Step 2
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Step 3
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Step 1 — Email ──────────────────────────────────────────────────────────
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) { toast.error(t('error_email_invalid')); return; }
    setEmailLoading(true);
    try {
      const otp = generateOTP();
      storeOTP(email, otp);
      await simulateSendEmail(email, otp);
      toast.success(t('success_otp_sent'));
      setCountdown(60);
      setStep('otp');
    } catch {
      toast.error(t('error_generic'));
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Step 2 — OTP ───────────────────────────────────────────────────────────
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length !== 6) { setOtpError(t('error_otp_invalid')); return; }
    setOtpLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const stored = getStoredOTP();
    if (!stored || stored.otp !== otpInput) {
      setOtpError(t('error_otp_invalid'));
      setOtpLoading(false);
      return;
    }
    setOtpError('');
    setOtpLoading(false);
    setStep('reset');
  };

  const handleResendOTP = async () => {
    const otp = generateOTP();
    storeOTP(email, otp);
    await simulateSendEmail(email, otp);
    setCountdown(60);
    setOtpInput('');
    setOtpError('');
    toast.success('New code sent!');
  };

  // ── Step 3 — New Password ──────────────────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { toast.error(t('error_password_short')); return; }
    if (newPassword !== confirmPassword) { toast.error(t('error_passwords_no_match')); return; }
    setResetLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // In production: POST /api/auth/reset-password  { token, newPassword }
    clearOTP();
    setResetLoading(false);
    setStep('success');
  };

  const pwdStrength = [newPassword.length >= 8, /[A-Z]/.test(newPassword), /[0-9]/.test(newPassword)];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden app-bg-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Email ── */}
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <button onClick={() => navigate('/login')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" /> {t('back')}
                </button>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2">{t('forgot_title')}</h1>
                  <p className="text-muted-foreground">{t('forgot_subtitle')}</p>
                </div>
                <GlassmorphicCard glow>
                  <form onSubmit={handleSendOTP} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('forgot_email_label')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 bg-background/50 border-white/10" required />
                      </div>
                    </div>
                    <Button type="submit" disabled={emailLoading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30">
                      {emailLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('sending')}</> : t('forgot_send_btn')}
                    </Button>
                  </form>
                </GlassmorphicCard>
              </motion.div>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('email')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" /> {t('back')}
                </button>
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{t('forgot_otp_title')}</h1>
                  <p className="text-muted-foreground text-sm">{t('forgot_otp_subtitle')} <span className="text-foreground font-medium">{email}</span></p>
                </div>
                <GlassmorphicCard glow>
                  <form onSubmit={handleVerifyOTP} className="space-y-5">
                    <div className="space-y-2">
                      <Label>{t('forgot_otp_label')}</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpInput}
                        onChange={e => { setOtpInput(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                        placeholder="000000"
                        className={cn('text-center tracking-[0.5em] text-xl font-bold bg-background/50 border-white/10', otpError && 'border-destructive')}
                      />
                      {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                    </div>
                    <Button type="submit" disabled={otpLoading || otpInput.length !== 6} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30">
                      {otpLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('verifying')}</> : t('forgot_otp_btn')}
                    </Button>
                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-xs text-muted-foreground">{t('forgot_resend_in')} {countdown}s</p>
                      ) : (
                        <button type="button" onClick={handleResendOTP} className="text-sm text-primary hover:underline flex items-center gap-1.5 mx-auto">
                          <RefreshCw className="w-3.5 h-3.5" /> {t('forgot_resend')}
                        </button>
                      )}
                    </div>
                  </form>
                </GlassmorphicCard>
              </motion.div>
            )}

            {/* ── Step 3: New Password ── */}
            {step === 'reset' && (
              <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('otp')} className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" /> {t('back')}
                </button>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-2">{t('forgot_reset_title')}</h1>
                  <p className="text-muted-foreground text-sm">{t('forgot_reset_subtitle')}</p>
                </div>
                <GlassmorphicCard glow>
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label>{t('forgot_new_password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type={showPwd ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 bg-background/50 border-white/10" required />
                        <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {newPassword && (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            {pwdStrength.map((ok, i) => (
                              <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', ok ? 'bg-green-400' : 'bg-white/10')} />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {pwdStrength.filter(Boolean).length === 3 ? '✓ Strong password' : 'Use 8+ chars, uppercase & numbers'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{t('forgot_confirm_password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pl-10 bg-background/50 border-white/10" required />
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-xs text-destructive">{t('error_passwords_no_match')}</p>
                      )}
                    </div>
                    <Button type="submit" disabled={resetLoading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30">
                      {resetLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Resetting...</> : t('forgot_reset_btn')}
                    </Button>
                  </form>
                </GlassmorphicCard>
              </motion.div>
            )}

            {/* ── Step 4: Success ── */}
            {step === 'success' && (
              <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{t('forgot_success_title')}</h2>
                <p className="text-muted-foreground mb-8">{t('forgot_success_subtitle')}</p>
                <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 shadow-lg shadow-primary/30">
                  {t('forgot_back_login')}
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
