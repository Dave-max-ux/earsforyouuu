/**
 * EditProfileScreen - Profile management (no photo upload per spec)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, User, Pencil, Calendar, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import { useApp } from '../../context/AppContext';
import { AccountService } from '../../services/AccountService';
import { GENERATION_LABELS } from '../../services/AuthService';
import { toast } from 'sonner';

export function EditProfileScreen() {
  const navigate = useNavigate();
  const { user, setUser, t } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [displayName, setDisplayName] = useState(user?.fullName?.split(' ')[0] || '');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'details'>('profile');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = async () => {
    if (!fullName.trim()) { toast.error(t('error_required')); return; }
    setSaving(true);
    try {
      const result = await AccountService.updateProfile({ fullName: fullName.trim() });
      if (result.success && result.user) {
        setUser(result.user);
        toast.success(t('success_profile_updated'));
        navigate('/account');
      } else {
        toast.error(result.message || t('error_generic'));
      }
    } finally {
      setSaving(false);
    }
  };

  const infoRows = [
    { label: t('profile_gender'), value: user.gender?.replace('-', ' ') || '—' },
    { label: t('profile_marital'), value: user.maritalStatus || '—' },
    { label: t('profile_employment'), value: user.employmentStatus?.replace('-', ' ') || '—' },
    { label: t('profile_generation'), value: user.generation ? GENERATION_LABELS[user.generation] : '—' },
    { label: 'Date of Birth', value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
    { label: t('account_member_since'), value: new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
  ];

  return (
    <div className="relative min-h-screen app-bg-gradient pb-28">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/account')} className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 hover:scale-105 active:scale-95 transition-all duration-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t('account_edit_profile')}</h1>
            <p className="text-sm text-muted-foreground">Update your personal information</p>
          </div>
        </div>

        {/* Avatar — initials only, no photo upload */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-2xl bg-secondary dark:bg-primary/15 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">{initials}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">{fullName || 'Your Name'}</p>
        </motion.div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10">
          {(['profile', 'details'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]' : 'text-muted-foreground hover:text-foreground hover:bg-card/40'}`}>
              {tab === 'profile' ? 'Edit Info' : 'Account Details'}
            </button>
          ))}
        </div>

        {activeTab === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <GlassmorphicCard>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="pl-10 bg-background/50 border-white/10 ef-input-hover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Display Name</Label>
                  <div className="relative">
                    <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How others see your name" className="pl-10 bg-background/50 border-white/10 ef-input-hover" />
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 shadow-lg shadow-primary/30">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('saving')}</> : t('save')}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="details" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <GlassmorphicCard>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" /> Account Information
              </h3>
              <div className="space-y-3">
                {infoRows.map((row, i) => (
                  <div key={row.label} className={`flex justify-between items-center py-2.5 text-sm ${i < infoRows.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium capitalize">{row.value}</span>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
            <p className="text-xs text-muted-foreground text-center mt-4">Contact support to update demographic information</p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
