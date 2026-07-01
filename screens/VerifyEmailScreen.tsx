/**
 * VerifyEmailScreen - OTP verification after registration
 * API: POST /api/v1/users/verify-user
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { MailCheck, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { AuthService } from '../services/AuthService';
import { useApp } from '../context/AppContext';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

export function VerifyEmailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, t } = useApp();

  // Email passed from signup via location state
  const email: string = (location.state as any)?.email ?? user?.email ?? '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiryCountdown, setExpiryCountdown] = useState(5 * 60);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [success, setSuccess] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState(email);

  useEffect(() => {
    (async () => {
      if (!email) {
        navigate('/signup', { replace: true });
        return;
      }

      const pending = await AuthService.getPendingRegistration(email);
      if (!pending) {
        toast.error('No pending signup found. Please start again.');
        navigate('/signup', { replace: true });
        return;
      }

      setPendingEmail(email);
      setDemoOtp(pending.otp);
      setExpiryCountdown(Math.max(0, Math.ceil((pending.expiresAt - Date.now()) / 1000)));
      setResendCountdown(60);
    })();
  }, [email, navigate]);

  useEffect(() => {
    if (expiryCountdown <= 0) return;
    const id = setTimeout(() => setExpiryCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(id);
  }, [expiryCountdown]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const id = setTimeout(() => setResendCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(id);
  }, [resendCountdown]);

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    try {
      const response = await AuthService.resendPendingRegistrationOtp(pendingEmail);
      if (!response.success || !response.otp) {
        toast.error(response.message || t('error_generic'));
        return;
      }
      setDemoOtp(response.otp);
      setExpiryCountdown(5 * 60);
      setResendCountdown(60);
      setOtp('');
      setError('');
      toast.success('New verification code sent');
    } catch {
      toast.error(t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError(t('error_otp_invalid')); return; }
    setLoading(true);
    try {
      const verifyRes = await AuthService.verifyPendingRegistration(pendingEmail, otp);
      if (verifyRes.success) {
        if (verifyRes.user) setUser(verifyRes.user);
        setSuccess(true);
        toast.success(t('success_email_verified'));
        setTimeout(() => navigate('/home', { replace: true }), 1400);
      } else {
        setError(verifyRes.message || t('error_otp_invalid'));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen app-bg-gradient flex items-center justify-center px-6">
        <AnimatedBackground />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/50">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
          <p className="text-muted-foreground">Taking you to your dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden app-bg-gradient px-6">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center">Verify Your Email</h1>
            <p className="text-muted-foreground text-sm text-center mt-2">
              We sent a 6-digit code to
            </p>
            <p className="font-medium text-sm text-center">{email}</p>
          </div>

          <GlassmorphicCard glow>
            <div className="space-y-4 mb-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-inner shadow-black/10 backdrop-blur-md">
                <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">Demo OTP (Development Only)</div>
                <div className="text-4xl font-semibold text-primary text-center">{demoOtp || '------'}</div>
              </div>
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4">
                <div className="text-sm text-primary font-medium">Verify your account</div>
                <div className="text-xs text-muted-foreground mt-1">A one-time code was generated after Create Account. Enter it below to complete signup.</div>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter the 6-digit code sent to your email</Label>
                <div className="relative">
                  <Input id="otp" type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }} placeholder="123456" className={cn('pl-4 bg-background/50 border-white/10', error && 'border-destructive')} required />
                </div>
                <p className="text-xs text-muted-foreground">Code expires in {Math.max(0, expiryCountdown)} seconds. Resend available in {Math.max(0, resendCountdown)} seconds.</p>
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>

              <Button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</> : 'Verify & Continue'}
              </Button>

              <div className="text-center">
                {resendCountdown > 0 ? (
                  <p className="text-sm text-muted-foreground">Resend available in {resendCountdown}s</p>
                ) : (
                  <button type="button" onClick={handleResend} className="text-sm text-primary hover:underline inline-flex items-center gap-1.5 mx-auto">
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                  </button>
                )}
              </div>
            </form>
          </GlassmorphicCard>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Prefer to sign in?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">Back to login</button>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-2">
            Wrong email?{' '}
            <button onClick={() => navigate('/signup')} className="text-primary hover:underline">Go back to signup</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
