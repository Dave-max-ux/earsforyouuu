/**
 * AccountScreen - Central account management hub
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  User, Shield, Bell, Settings,
  ChevronRight, LogOut, ArrowLeft, Trash2, AlertTriangle
} from 'lucide-react';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import { Button } from '../../components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { useApp } from '../../context/AppContext';
import { AuthService } from '../../services/AuthService';
import { toast } from 'sonner';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  description: string;
  path: string;
  color: string;
  bgColor: string;
}

const menuGroups: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Profile',
    items: [
      {
        icon: User,
        label: 'Edit Profile',
        description: 'Name, photo, personal info',
        path: '/account/profile',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      },
    ],
  },
  {
    title: 'Security',
    items: [
      {
        icon: Shield,
        label: 'Security Settings',
        description: 'Password, email, sessions',
        path: '/account/security',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        icon: Bell,
        label: 'Notifications',
        description: 'Push, email, reminders',
        path: '/account/notifications',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
      },
      {
        icon: Settings,
        label: 'App Preferences',
        description: 'Theme, language, accessibility',
        path: '/account/preferences',
        color: 'text-pink-400',
        bgColor: 'bg-pink-400/10',
      },
    ],
  },
];

export function AccountScreen() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await AuthService.deleteAccount();
      setUser(null);
      toast.success('Account deleted permanently');
      navigate('/welcome');
    } catch {
      toast.error('Failed to delete account');
      setDeleting(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const initials = user.fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative min-h-screen app-bg-gradient pb-28">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Account</h1>
            <p className="text-sm text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassmorphicCard gradient glow>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-secondary dark:bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-white text-xl font-bold">{initials}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0B0B1A]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg truncate">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => navigate('/account/profile')}
                className="shrink-0 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/30 transition-all"
              >
                Edit
              </button>
            </div>
          </GlassmorphicCard>
        </motion.div>

        <div className="space-y-4">
          {menuGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + gi * 0.05 }}
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {group.title}
              </p>
              <GlassmorphicCard className="p-0 overflow-hidden">
                {group.items.map((item, ii) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all ${
                        ii < group.items.length - 1 ? 'border-b border-white/5' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl ${item.bgColor} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </GlassmorphicCard>
            </motion.div>
          ))}

          {/* Danger Zone — Delete Account only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Danger Zone
            </p>
            <GlassmorphicCard className="border-destructive/20">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <p className="text-xs text-muted-foreground">Permanent actions that cannot be undone</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10 rounded-2xl h-12">
                    <Trash2 className="w-4 h-4 mr-3" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">Delete Account?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This is irreversible. All your data — moods, journals, settings — will be permanently erased.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {deleting ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </GlassmorphicCard>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <GlassmorphicCard className="p-0 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-destructive/5 transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-destructive">Logout</p>
                  <p className="text-xs text-muted-foreground">Sign out of this device</p>
                </div>
              </button>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
