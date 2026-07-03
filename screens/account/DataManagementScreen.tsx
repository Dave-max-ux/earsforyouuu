/**
 * DataManagementScreen - Export, download, deactivate, delete
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Download, FileText, Heart, Database,
  UserX, Trash2, AlertTriangle, Loader2, CheckCircle2
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
import { AccountService } from '../../services/AccountService';
import { AuthService } from '../../services/AuthService';
import { toast } from 'sonner';

type ExportType = 'all' | 'journal' | 'mood';

export function DataManagementScreen() {
  const navigate = useNavigate();
  const { user, setUser } = useApp();
  const [exportingType, setExportingType] = useState<ExportType | null>(null);
  const [deactivating, setDeactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleExport = async (type: ExportType) => {
    setExportingType(type);
    try {
      const result = await AccountService.requestDataExport(type);
      if (result.success && result.downloadUrl) {
        const a = document.createElement('a');
        a.href = result.downloadUrl;
        a.download = `earsforyou-${type}-export.json`;
        a.click();
        toast.success('Export downloaded successfully');
      }
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setExportingType(null);
    }
  };

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      const result = await AccountService.deactivateAccount();
      if (result.success) {
        toast.success(result.message);
        await AuthService.logout();
        setUser(null);
        navigate('/welcome');
      }
    } finally {
      setDeactivating(false);
    }
  };

  const handleDelete = async () => {
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

  const exportItems = [
    { type: 'all' as const, icon: Database, label: 'All Personal Data', desc: 'Complete export of all your data', color: 'text-primary', bg: 'bg-primary/10' },
    { type: 'journal' as const, icon: FileText, label: 'Journal Entries', desc: 'All your journal entries as JSON', color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { type: 'mood' as const, icon: Heart, label: 'Mood History', desc: 'All mood check-ins and patterns', color: 'text-pink-400', bg: 'bg-pink-400/10' },
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
          <div>
            <h1 className="text-2xl font-bold">Data Management</h1>
            <p className="text-sm text-muted-foreground">Export & manage your data</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Export */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Export Data
            </p>
            <GlassmorphicCard>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <p className="text-xs text-muted-foreground">Download a copy of your data per GDPR / NDPR</p>
              </div>
              <div className="space-y-3">
                {exportItems.map(item => {
                  const Icon = item.icon;
                  const isExporting = exportingType === item.type;
                  return (
                    <button
                      key={item.type}
                      onClick={() => handleExport(item.type)}
                      disabled={exportingType !== null}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/6 transition-all disabled:opacity-50 text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                        {isExporting ? (
                          <Loader2 className={`w-5 h-5 ${item.color} animate-spin`} />
                        ) : (
                          <Icon className={`w-5 h-5 ${item.color}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  );
                })}
              </div>
            </GlassmorphicCard>
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Danger Zone
            </p>
            <GlassmorphicCard>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <p className="text-xs text-muted-foreground">These actions are difficult or impossible to reverse</p>
              </div>

              <div className="space-y-3">
                {/* Deactivate */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 rounded-2xl">
                      <UserX className="w-4 h-4 mr-3" />
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deactivate Account?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Your account will be paused. Your data is preserved and you can reactivate by logging back in.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeactivate} disabled={deactivating} className="bg-yellow-500 hover:bg-yellow-500/90 text-black">
                        {deactivating ? 'Deactivating...' : 'Deactivate'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10 rounded-2xl">
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete Account Permanently
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-destructive">Permanently Delete Account?</AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground space-y-2">
                        <span className="block">This is irreversible. All your data — moods, journals, settings — will be permanently erased.</span>
                        <span className="block mt-3 font-medium text-foreground">
                          Type <span className="text-destructive font-bold">DELETE</span> to confirm:
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="px-6">
                      <Input
                        value={deleteConfirmText}
                        onChange={e => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="bg-background/50 border-destructive/30"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteConfirmText !== 'DELETE' || deleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {deleting ? 'Deleting...' : 'Delete Permanently'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </GlassmorphicCard>
          </motion.div>

          <p className="text-xs text-muted-foreground text-center px-4">
            Data retention: anonymized analytics are retained for 90 days after deletion.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
