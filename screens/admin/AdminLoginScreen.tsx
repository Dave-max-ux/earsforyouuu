/**
 * AdminLoginScreen - Secure admin-only login gate
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Crown, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { GlassmorphicCard } from '../../components/GlassmorphicCard';
import { AdminAuthService } from '../../services/AdminAuthService';
import { toast } from 'sonner';

export function AdminLoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already authenticated, go straight to dashboard
  useEffect(() => {
    if (AdminAuthService.isAuthenticated()) navigate('/admin', { replace: true });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const result = await AdminAuthService.login(email, password);
      if (result.success) {
        toast.success('Admin access granted');
        navigate('/admin', { replace: true });
      } else {
        toast.error(result.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden app-bg-gradient px-6">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => navigate('/home')}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-xl shadow-amber-500/40">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">EarsForYou · Authorized Access Only</p>
          </div>

          <GlassmorphicCard glow className="border-amber-500/20">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-sm text-muted-foreground">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="dev@email.com"
                    className="pl-10 bg-background/50 border-white/10"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm text-muted-foreground">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-10 pr-10 bg-background/50 border-white/10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-500/90 text-black font-semibold rounded-2xl h-12 shadow-lg shadow-amber-500/30"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Authenticating...</>
                ) : (
                  'Access Admin Dashboard'
                )}
              </Button>
            </form>
          </GlassmorphicCard>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Unauthorized access attempts are logged and monitored.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
