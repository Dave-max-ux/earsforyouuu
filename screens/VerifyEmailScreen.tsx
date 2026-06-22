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
import { useApp } from '../context/AppContext';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

const OTP_KEY = 'earsforyou_reg_otp';

function generateOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }

export function VerifyEmailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, t } = useApp();

  // Email passed from signup via location state
  const email: string = (location.state as any)?.email ?? user?.email ?? '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Generate and "send" OTP on mount
    const code = generateOTP();
    sessionStorage.setItem(OTP_KEY, code);
    console.info(`[DEV] Registration OTP for ${email}: ${code}`);
    // In production: backend sends real email — no localStorage
  }, [email]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const handleResend = () => {
    const code = generateOTP();
    sessionStorage.setItem(OTP_KEY, code);
    console.info(`[DEV] Resent OTP: ${code}`);
    setCountdown(60);
    setOtp('');
    setError('');
    toast.success('New verification code sent');
    // In production: POST /api/v1/users/resend-otp
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError(t('error_otp_invalid')); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // In production: POST /api/v1/users/verify-user  { email, otp }
    const stored = sessionStorage.getItem(OTP_KEY);
    if (otp !== stored) {
      setError(t('error_otp_invalid'));
      setLoading(false);
      return;
    }
    sessionStorage.removeItem(OTP_KEY);
    setSuccess(true);
    setLoading(false);
    toast.success(t('success_email_verified'));
    setTimeout(() => navigate('/home', { replace: true }), 1400);
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
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
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
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-12 shadow-lg shadow-primary/30"
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</> : 'Verify & Continue'}
              </Button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('forgot_resend_in')} {countdown}s
                  </p>
                ) : (
                  <button type="button" onClick={handleResend} className="text-sm text-primary hover:underline flex items-center gap-1.5 mx-auto">
                    <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                  </button>
                )}
              </div>
            </form>
          </GlassmorphicCard>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Wrong email?{' '}
            <button onClick={() => navigate('/signup')} className="text-primary hover:underline">Go back to signup</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
