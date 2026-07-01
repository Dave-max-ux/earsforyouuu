/**
 * SignupScreen - User registration with generation auto-calculation from DOB
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Check, Calendar, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { EarsForYouLogo } from '../components/EarsForYouLogo';
import { AuthService, getGenerationFromDOB, GENERATION_LABELS } from '../services/AuthService';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

export function SignupScreen() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    employmentStatus: '',
    location: '',
  });

  

  const derivedGeneration = formData.dateOfBirth
    ? getGenerationFromDOB(formData.dateOfBirth)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('error_passwords_no_match'));
      return;
    }
    if (formData.password.length < 8) {
      toast.error(t('error_password_short'));
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error('Please enter your date of birth');
      return;
    }
    if (!formData.gender) {
      toast.error('Please select your gender');
      return;
    }
    if (!formData.maritalStatus) {
      toast.error('Please select your marital status');
      return;
    }
    if (!formData.employmentStatus) {
      toast.error('Please select your employment status');
      return;
    }
    if (!formData.location.trim()) {
      toast.error('Please provide your country');
      return;
    }

    setLoading(true);
    try {
      const pendingResult = await AuthService.beginPendingRegistration({
        ...formData,
        generation: derivedGeneration ?? undefined,
      });

      if (!pendingResult.success) {
        toast.error(pendingResult.message || t('error_generic'));
        return;
      }

      navigate('/verify-email', { state: { email: formData.email } });
    } catch {
      toast.error(t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      handleSubmit(e);
    }
  };

  const SegmentedOption = ({
    label, selected, onClick,
  }: { label: string; selected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-background text-muted-foreground hover:border-primary/30'
      )}
    >
      {label}
      {selected && <Check className="absolute top-2 right-2 w-4 h-4 text-primary" />}
    </button>
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden app-bg-gradient">
      <AnimatedBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <EarsForYouLogo variant="mark" size="md" className="mb-4" />
            <h1 className="font-display text-2xl font-semibold tracking-tight">{t('signup_title')}</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">{t('signup_step')} {step} {t('signup_of')} 2</p>
          </div>

          <GlassmorphicCard glow>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('signup_fullname')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="fullName" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" className="pl-10 bg-background/50 border-white/10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('signup_email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="pl-10 bg-background/50 border-white/10" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('signup_password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="pl-10 bg-background/50 border-white/10" required />
                    </div>
                    {formData.password && (
                      <div className="flex gap-1 mt-1">
                        {[formData.password.length >= 8, /[A-Z]/.test(formData.password), /[0-9]/.test(formData.password)].map((ok, i) => (
                          <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', ok ? 'bg-blue-500' : 'bg-white/10')} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('signup_confirm_password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" className="pl-10 bg-background/50 border-white/10" required />
                    </div>
                  </div>

                  <Button type="button" onClick={() => setStep(2)} className="w-full ef-btn-primary rounded-xl h-12">
                    {t('next')}
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dob">{t('signup_dob')}</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        max={new Date().toISOString().split('T')[0]}
                        className="pl-10 bg-background/50 border-white/10"
                        required
                      />
                    </div>
                    {derivedGeneration && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20"
                      >
                        <Check className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-primary font-medium">{GENERATION_LABELS[derivedGeneration]}</span>
                      </motion.div>
                    )}
                    <p className="text-xs text-muted-foreground">{t('signup_generation_auto')}</p>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label>{t('signup_gender')}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'male', label: t('signup_gender_male') },
                        { value: 'female', label: t('signup_gender_female') },
                        { value: 'non-binary', label: t('signup_gender_nonbinary') },
                        { value: 'prefer-not-to-say', label: t('signup_gender_prefer_not') },
                      ].map(o => (
                        <SegmentedOption key={o.value} label={o.label} selected={formData.gender === o.value} onClick={() => setFormData({ ...formData, gender: o.value })} />
                      ))}
                    </div>
                  </div>

                  {/* Marital Status */}
                  <div className="space-y-2">
                    <Label>{t('signup_marital')}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'single', label: t('signup_marital_single') },
                        { value: 'married', label: t('signup_marital_married') },
                        { value: 'divorced', label: t('signup_marital_divorced') },
                        { value: 'widowed', label: t('signup_marital_widowed') },
                      ].map(o => (
                        <SegmentedOption key={o.value} label={o.label} selected={formData.maritalStatus === o.value} onClick={() => setFormData({ ...formData, maritalStatus: o.value })} />
                      ))}
                    </div>
                  </div>

                  {/* Employment */}
                  <div className="space-y-2">
                    <Label>{t('signup_employment')}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'employed', label: t('signup_employment_employed') },
                        { value: 'student', label: t('signup_employment_student') },
                        { value: 'self-employed', label: t('signup_employment_self') },
                        { value: 'unemployed', label: t('signup_employment_unemployed') },
                      ].map(o => (
                        <SegmentedOption key={o.value} label={o.label} selected={formData.employmentStatus === o.value} onClick={() => setFormData({ ...formData, employmentStatus: o.value })} />
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Country</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Country" className="pl-10 bg-background/50 border-white/10" required />
                    </div>
                    
                    <p className="text-xs text-muted-foreground">We only use location to improve your experience.</p>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-xl h-12 border-border">{t('back')}</Button>
                    <Button type="submit" disabled={loading} className="flex-1 ef-btn-primary rounded-xl h-12">
                      {loading ? t('signup_creating') : t('signup_btn')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </GlassmorphicCard>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {t('signup_have_account')}{' '}
              <button onClick={() => navigate('/login')} className="text-primary hover:underline font-medium">{t('login_btn')}</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
