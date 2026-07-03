/**
 * AdminDashboardScreen - User management, analytics, moderation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Users, Search, Shield, ShieldOff, Trash2,
  Mail, CheckCircle, XCircle, BarChart3, RefreshCw,
  Crown, TrendingUp, UserCheck, AlertTriangle, Loader2,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { BottomNav } from '../../components/BottomNav';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { useApp } from '../../context/AppContext';
import { AccountService, AdminUser } from '../../services/AccountService';
import { AdminAuthService } from '../../services/AdminAuthService';
import { toast } from 'sonner';
import { cn } from '../../components/ui/utils';

type AdminTab = 'overview' | 'users';

export function AdminDashboardScreen() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, activeToday: 0, suspended: 0, newThisWeek: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
  }, [activeTab, search]);

  const loadStats = async () => {
    setStatsLoading(true);
    const s = await AccountService.getAdminStats();
    setStats(s);
    setStatsLoading(false);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const u = await AccountService.getAdminUsers(search);
    setUsers(u);
    setUsersLoading(false);
  };

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleSuspend = async (u: AdminUser) => {
    setActionLoading(u.id + '-suspend');
    try {
      await AccountService.adminSuspendUser(u.id);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'suspended' } : x));
      toast.success(`${u.fullName} suspended`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReactivate = async (u: AdminUser) => {
    setActionLoading(u.id + '-reactivate');
    try {
      await AccountService.adminReactivateUser(u.id);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'active' } : x));
      toast.success(`${u.fullName} reactivated`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (u: AdminUser) => {
    setActionLoading(u.id + '-delete');
    try {
      await AccountService.adminDeleteUser(u.id);
      setUsers(prev => prev.filter(x => x.id !== u.id));
      toast.success(`${u.fullName} deleted`);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePasswordReset = async (u: AdminUser) => {
    setActionLoading(u.id + '-reset');
    try {
      await AccountService.adminSendPasswordReset(u.id);
      toast.success(`Password reset sent to ${u.email}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyEmail = async (u: AdminUser) => {
    setActionLoading(u.id + '-verify');
    try {
      await AccountService.adminVerifyEmail(u.id);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, emailVerified: true } : x));
      toast.success(`Email verified for ${u.fullName}`);
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: AdminUser['status']) => ({
    active: 'bg-green-400/10 text-green-400',
    suspended: 'bg-yellow-400/10 text-yellow-400',
    deactivated: 'bg-white/5 text-muted-foreground',
  }[status]);

  const overviewStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Today', value: stats.activeToday, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Suspended', value: stats.suspended, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'New This Week', value: stats.newThisWeek, icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="relative min-h-screen app-bg-gradient pb-28">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/account')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-sm text-muted-foreground">User management & analytics</p>
          </div>
          <button
            onClick={() => { AdminAuthService.logout(); navigate('/account'); }}
            className="text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
          >
            Admin Logout
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10">
          {(['overview', 'users'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'overview' ? (
                <span className="flex items-center justify-center gap-1.5">
                  <BarChart3 className="w-4 h-4" /> Overview
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Users className="w-4 h-4" /> Users
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {overviewStats.map(s => {
                  const Icon = s.icon;
                  return (
                    <GlassmorphicCard key={s.label} className="text-center">
                      <div className={`w-10 h-10 mx-auto mb-3 rounded-2xl ${s.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <p className={`text-2xl font-bold ${s.color}`}>
                        {statsLoading ? '—' : s.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                    </GlassmorphicCard>
                  );
                })}
              </div>

              <GlassmorphicCard>
                <h3 className="font-medium mb-4 text-sm">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'View All Users', action: () => setActiveTab('users'), icon: Users, color: 'text-primary' },
                    { label: 'Refresh Stats', action: loadStats, icon: RefreshCw, color: 'text-accent' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/3 hover:bg-white/6 transition-all border border-white/5 text-left"
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <p className="text-sm font-medium text-amber-400">Backend Integration Note</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All admin actions are wired to <code className="text-amber-400/80">/api/admin/*</code> endpoints.
                  Replace mock data in <code className="text-amber-400/80">AccountService.ts</code> with real API calls when backend is ready.
                </p>
              </GlassmorphicCard>
            </motion.div>
          ) : (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users by name or email…"
                  className="pl-10 bg-card/60 backdrop-blur-xl border-white/10 rounded-2xl"
                />
              </div>

              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map(u => {
                    const isExpanded = expandedUser === u.id;
                    return (
                      <GlassmorphicCard key={u.id} className="p-0 overflow-hidden">
                        {/* User Row */}
                        <button
                          onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                          className="w-full flex items-center gap-3 p-4 hover:bg-white/3 transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center shrink-0">
                            <span className="text-white text-sm font-bold">
                              {u.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{u.fullName}</p>
                              {u.role === 'admin' && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn('text-xs px-2 py-1 rounded-full capitalize', statusBadge(u.status))}>
                              {u.status}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </button>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-white/5"
                            >
                              <div className="p-4 space-y-3">
                                {/* Info */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  {[
                                    { label: 'Joined', value: new Date(u.createdAt).toLocaleDateString('en-GB') },
                                    { label: 'Last Login', value: new Date(u.lastLogin).toLocaleDateString('en-GB') },
                                    { label: 'Mood Entries', value: u.moodEntries },
                                    { label: 'Journal Entries', value: u.journalEntries },
                                  ].map(row => (
                                    <div key={row.label} className="bg-white/3 rounded-xl p-2.5">
                                      <p className="text-muted-foreground">{row.label}</p>
                                      <p className="font-medium mt-0.5">{row.value}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* Email Status */}
                                <div className="flex items-center gap-2 text-xs">
                                  {u.emailVerified
                                    ? <CheckCircle className="w-4 h-4 text-green-400" />
                                    : <XCircle className="w-4 h-4 text-destructive" />}
                                  <span className={u.emailVerified ? 'text-green-400' : 'text-destructive'}>
                                    Email {u.emailVerified ? 'verified' : 'not verified'}
                                  </span>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {u.status === 'active' && (
                                    <button
                                      onClick={() => handleSuspend(u)}
                                      disabled={actionLoading === u.id + '-suspend'}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-400/10 text-yellow-400 text-xs hover:bg-yellow-400/20 transition-all disabled:opacity-50"
                                    >
                                      {actionLoading === u.id + '-suspend' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldOff className="w-3 h-3" />}
                                      Suspend
                                    </button>
                                  )}
                                  {(u.status === 'suspended' || u.status === 'deactivated') && (
                                    <button
                                      onClick={() => handleReactivate(u)}
                                      disabled={actionLoading === u.id + '-reactivate'}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-400/10 text-green-400 text-xs hover:bg-green-400/20 transition-all disabled:opacity-50"
                                    >
                                      {actionLoading === u.id + '-reactivate' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                                      Reactivate
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handlePasswordReset(u)}
                                    disabled={actionLoading === u.id + '-reset'}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 text-accent text-xs hover:bg-accent/20 transition-all disabled:opacity-50"
                                  >
                                    {actionLoading === u.id + '-reset' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                                    Reset Password
                                  </button>
                                  {!u.emailVerified && (
                                    <button
                                      onClick={() => handleVerifyEmail(u)}
                                      disabled={actionLoading === u.id + '-verify'}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-400/10 text-teal-400 text-xs hover:bg-teal-400/20 transition-all disabled:opacity-50"
                                    >
                                      {actionLoading === u.id + '-verify' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                      Verify Email
                                    </button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive text-xs hover:bg-destructive/20 transition-all">
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-card border-white/10">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete {u.fullName}?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground">
                                          This will permanently delete this user account and all associated data.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(u)} disabled={actionLoading === u.id + '-delete'} className="bg-destructive hover:bg-destructive/90">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassmorphicCard>
                    );
                  })}

                  {users.length === 0 && !usersLoading && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
