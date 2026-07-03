/**
 * SecurityScreen - Password, email, sessions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Lock, Smartphone, ChevronRight,
  Shield, Loader2, LogOut, Trash2, Eye, EyeOff, Key, Mail
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { useApp } from '../../context/AppContext';
import { AccountService, Session } from '../../services/AccountService';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

type ActiveSection = 'menu' | 'password' | 'otp' | 'sessions' | 'change-email';

export function SecurityScreen() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeSection, setActiveSection] = useState<ActiveSection>('menu');

  // Password change — step 1: verify, step 2: reset with OTP
  const [pwdStep, setPwdStep] = useState<'verify' | 'reset'>('verify');
  const [pwdEmail, setPwdEmail] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [pwdOtp, setPwdOtp] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdResendCountdown, setPwdResendCountdown] = useState(0);
  const PWD_OTP_KEY = 'earsforyou_pwd_change_otp';

  // OTP state (email verification)
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Change email state
  const [emailStep, setEmailStep] = useState<'form' | 'otp'>('form');
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const CHANGE_EMAIL_OTP_KEY = 'earsforyou_change_email_otp';

  // Sessions
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (activeSection === 'sessions') {
      setSessions(AccountService.getSessions());
    }
  }, [activeSection]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  useEffect(() => {
    if (pwdResendCountdown <= 0) return;
    const t = setTimeout(() => setPwdResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [pwdResendCountdown]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (user && activeSection === 'password' && pwdStep === 'verify') {
      setPwdEmail(user.email);
    }
  }, [user, activeSection, pwdStep]);

  if (!user) return null;

  const resetPasswordSection = () => {
    setPwdStep('verify');
    setPwdEmail(user.email);
    setCurrentPwd('');
    setPwdOtp('');
    setNewPwd('');
    setConfirmPwd('');
  };

  const handleSendPasswordOTP = async () => {
    if (!pwdEmail.trim()) { toast.error('Enter your email address'); return; }
    if (pwdEmail.toLowerCase() !== user.email.toLowerCase()) {
      toast.error('Email does not match your account');
      return;
    }
    if (!currentPwd) { toast.error('Enter your current password'); return; }
    setPwdLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sessionStorage.setItem(PWD_OTP_KEY, otp);
      console.info(`[DEV] Password change OTP: ${otp}`);
      toast.success(`Verification code sent to ${user.email}`);
      setPwdStep('reset');
      setPwdResendCountdown(60);
    } finally {
      setPwdLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (pwdOtp.length !== 6) { toast.error('Enter 6-digit code'); return; }
    if (!newPwd || !confirmPwd) { toast.error('Please fill in all fields'); return; }
    if (newPwd !== confirmPwd) { toast.error('New passwords do not match'); return; }
    if (newPwd.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setPwdLoading(true);
    try {
      const stored = sessionStorage.getItem(PWD_OTP_KEY);
      if (pwdOtp !== stored) { toast.error('Invalid verification code'); return; }
      const result = await AccountService.changePassword(currentPwd, newPwd);
      if (result.success) {
        sessionStorage.removeItem(PWD_OTP_KEY);
        toast.success('Password changed successfully');
        resetPasswordSection();
        setActiveSection('menu');
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } finally {
      setPwdLoading(false);
    }
  };

  const handleResendPasswordOTP = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(PWD_OTP_KEY, otp);
    console.info(`[DEV] Password change OTP: ${otp}`);
    setPwdResendCountdown(60);
    toast.success(`New code sent to ${user.email}`);
  };

  const handleSendOTP = async () => {
    setOtpLoading(true);
    try {
      const result = await AccountService.sendOTP(user.email);
      if (result.success) {
        setOtpSent(true);
        setResendCountdown(60);
        toast.success(result.message);
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) { toast.error('Enter 6-digit code'); return; }
    setOtpLoading(true);
    try {
      const result = await AccountService.verifyOTP(user.email, otpCode);
      if (result.success) {
        toast.success(result.message);
        setActiveSection('menu');
      } else {
        toast.error(result.message);
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const result = await AccountService.resendOTP(user.email);
    if (result.success) {
      setResendCountdown(60);
      toast.success('New OTP sent');
    }
  };

  const handleTerminateSession = async (id: string) => {
    const result = await AccountService.terminateSession(id);
    if (result.success) {
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success('Session terminated');
    }
  };

  const handleTerminateAll = async () => {
    const result = await AccountService.terminateAllSessions();
    if (result.success) {
      setSessions(prev => prev.filter(s => s.isCurrent));
      toast.success('All other sessions terminated');
    }
  };

  const menuItems = [
    { id: 'password', icon: Lock, label: 'Change Password', desc: 'Verify email and update password', color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'change-email', icon: Mail, label: 'Change Email', desc: 'Update your email address', color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { id: 'otp', icon: Key, label: 'Email Verification', desc: 'Verify or re-verify your email', color: 'text-accent', bg: 'bg-accent/10' },
    { id: 'sessions', icon: Smartphone, label: 'Active Sessions', desc: 'Manage devices & sessions', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ] as const;

  const sectionTitles: Record<ActiveSection, string> = {
    menu: 'Security Settings',
    password: 'Change Password',
    'change-email': 'Change Email',
    otp: 'Email Verification',
    sessions: 'Active Sessions',
  };

  const renderSection = () => {
    if (activeSection === 'menu') {
      return (
        <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <GlassmorphicCard gradient glow className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Account Secured</p>
              <p className="text-xs text-muted-foreground">Your account is protected</p>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-0 overflow-hidden">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all ${i < menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </GlassmorphicCard>
        </motion.div>
      );
    }

    if (activeSection === 'password') {
      if (pwdStep === 'verify') {
        return (
          <motion.div key="password-verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <GlassmorphicCard>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" /> Verify Your Identity
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Enter your email and current password. We&apos;ll send a verification code to your email.
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={pwdEmail}
                      onChange={e => setPwdEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10 bg-background/50 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showCurrentPwd ? 'text' : 'password'}
                      value={currentPwd}
                      onChange={e => setCurrentPwd(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-background/50 border-white/10"
                    />
                    <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
            <Button onClick={handleSendPasswordOTP} disabled={pwdLoading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30">
              {pwdLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending code…</> : 'Send Verification Code'}
            </Button>
          </motion.div>
        );
      }

      return (
        <motion.div key="password-reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <GlassmorphicCard gradient>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Code sent to</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard>
            <h3 className="font-medium mb-5 flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" /> Set New Password
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Verification Code</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pwdOtp}
                  onChange={e => setPwdOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="text-center tracking-[0.5em] bg-background/50 border-white/10 text-lg font-bold"
                />
              </div>
              {[
                { label: 'New Password', value: newPwd, setter: setNewPwd, show: showNewPwd, setShow: setShowNewPwd },
                { label: 'Confirm New Password', value: confirmPwd, setter: setConfirmPwd, show: showNewPwd, setShow: setShowNewPwd },
              ].map(({ label, value, setter, show, setShow }) => (
                <div key={label} className="space-y-2">
                  <Label className="text-sm text-muted-foreground">{label}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={show ? 'text' : 'password'}
                      value={value}
                      onChange={e => setter(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-background/50 border-white/10"
                    />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {newPwd && (
                <div className="flex gap-1.5 mt-1">
                  {[newPwd.length >= 8, /[A-Z]/.test(newPwd), /[0-9]/.test(newPwd)].map((ok, i) => (
                    <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', ok ? 'bg-green-400' : 'bg-white/10')} />
                  ))}
                </div>
              )}
            </div>
          </GlassmorphicCard>

          <Button onClick={handleChangePassword} disabled={pwdLoading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30">
            {pwdLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Changing…</> : 'Change Password'}
          </Button>

          <div className="text-center space-y-2">
            {pwdResendCountdown > 0 ? (
              <p className="text-xs text-muted-foreground">Resend in {pwdResendCountdown}s</p>
            ) : (
              <button onClick={handleResendPasswordOTP} className="text-sm text-primary hover:underline">Resend code</button>
            )}
            <button onClick={resetPasswordSection} className="block w-full text-sm text-muted-foreground hover:text-foreground">← Back</button>
          </div>
        </motion.div>
      );
    }

    if (activeSection === 'otp') {
      return (
        <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <GlassmorphicCard gradient>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-teal-400/10 flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Verification</h3>
              <p className="text-sm text-muted-foreground mb-1">Sending code to</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard>
            {!otpSent ? (
              <Button onClick={handleSendOTP} disabled={otpLoading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30">
                {otpLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : 'Send Verification Code'}
              </Button>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Enter 6-digit OTP</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="text-center tracking-[0.5em] bg-background/50 border-white/10 text-lg font-bold"
                  />
                </div>
                <Button onClick={handleVerifyOTP} disabled={otpLoading || otpCode.length !== 6} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30">
                  {otpLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : 'Verify'}
                </Button>
                <div className="text-center">
                  {resendCountdown > 0 ? (
                    <p className="text-xs text-muted-foreground">Resend in {resendCountdown}s</p>
                  ) : (
                    <button onClick={handleResendOTP} className="text-sm text-primary hover:underline">Resend OTP</button>
                  )}
                </div>
              </div>
            )}
          </GlassmorphicCard>
        </motion.div>
      );
    }

    if (activeSection === 'sessions') {
      return (
        <motion.div key="sessions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {sessions.length > 1 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 rounded-2xl">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout All Other Devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout All Devices?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This will end all sessions except your current one.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleTerminateAll} className="bg-destructive hover:bg-destructive/90">Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="space-y-3">
            {sessions.map(s => (
              <GlassmorphicCard key={s.id} glow={s.isCurrent} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${s.isCurrent ? 'bg-primary/20' : 'bg-white/5'}`}>
                  <Smartphone className={`w-5 h-5 ${s.isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{s.device}</p>
                    {s.isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {new Date(s.lastActive).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                {!s.isCurrent && (
                  <button
                    onClick={() => handleTerminateSession(s.id)}
                    className="text-destructive hover:text-destructive/80 shrink-0 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </GlassmorphicCard>
            ))}
          </div>
        </motion.div>
      );
    }

    if (activeSection === 'change-email') {
      const handleInitiateEmailChange = async () => {
        if (!oldEmail.trim()) { toast.error('Enter your old email address'); return; }
        if (oldEmail.toLowerCase() !== user.email.toLowerCase()) {
          toast.error('Old email does not match your account');
          return;
        }
        if (!/\S+@\S+\.\S+/.test(newEmail)) { toast.error('Enter a valid new email address'); return; }
        if (oldEmail.toLowerCase() === newEmail.toLowerCase()) {
          toast.error('New email must be different from old email');
          return;
        }
        setEmailLoading(true);
        await new Promise(r => setTimeout(r, 800));
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        sessionStorage.setItem(CHANGE_EMAIL_OTP_KEY, otp);
        console.info(`[DEV] Change email OTP: ${otp}`);
        toast.success(`Verification code sent to ${oldEmail}`);
        setEmailLoading(false);
        setEmailStep('otp');
      };

      const handleConfirmEmailChange = async () => {
        if (emailOtp.length !== 6) { toast.error('Enter 6-digit code'); return; }
        setEmailLoading(true);
        await new Promise(r => setTimeout(r, 600));
        const stored = sessionStorage.getItem(CHANGE_EMAIL_OTP_KEY);
        if (emailOtp !== stored) { toast.error('Invalid code'); setEmailLoading(false); return; }
        sessionStorage.removeItem(CHANGE_EMAIL_OTP_KEY);
        toast.success('Email updated successfully');
        setEmailLoading(false);
        setEmailStep('form');
        setOldEmail(''); setNewEmail(''); setEmailOtp('');
        setActiveSection('menu');
      };

      return (
        <motion.div key="change-email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {emailStep === 'form' ? (
            <GlassmorphicCard>
              <h3 className="font-medium mb-5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" /> Change Email Address
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Old Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={oldEmail}
                      onChange={e => setOldEmail(e.target.value)}
                      placeholder={user.email}
                      className="pl-10 bg-background/50 border-white/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">New Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new@example.com" className="pl-10 bg-background/50 border-white/10" />
                  </div>
                </div>
              </div>
              <Button onClick={handleInitiateEmailChange} disabled={emailLoading} className="w-full mt-5 bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30">
                {emailLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending code…</> : 'Send Verification Code'}
              </Button>
            </GlassmorphicCard>
          ) : (
            <GlassmorphicCard>
              <h3 className="font-medium mb-5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" /> Verify Email Change
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the code sent to <span className="text-foreground font-medium">{oldEmail}</span>
              </p>
              <Input
                type="text" inputMode="numeric" maxLength={6}
                value={emailOtp} onChange={e => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center tracking-[0.5em] text-xl font-bold bg-background/50 border-white/10 mb-4"
              />
              <Button onClick={handleConfirmEmailChange} disabled={emailLoading || emailOtp.length !== 6} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30">
                {emailLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying…</> : 'Confirm Email Change'}
              </Button>
              <button onClick={() => setEmailStep('form')} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground text-center">← Back</button>
            </GlassmorphicCard>
          )}
        </motion.div>
      );
    }
  };

  const handleBack = () => {
    if (activeSection === 'menu') {
      navigate('/account');
    } else if (activeSection === 'password') {
      resetPasswordSection();
      setActiveSection('menu');
    } else if (activeSection === 'change-email') {
      setEmailStep('form');
      setOldEmail('');
      setNewEmail('');
      setEmailOtp('');
      setActiveSection('menu');
    } else {
      setActiveSection('menu');
    }
  };

  return (
    <div className="relative min-h-screen app-bg-gradient pb-28">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{sectionTitles[activeSection]}</h1>
            <p className="text-sm text-muted-foreground">Keep your account safe</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {renderSection()}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
