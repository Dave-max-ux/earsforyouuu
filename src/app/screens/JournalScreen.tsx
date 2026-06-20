/**
 * JournalScreen - Create, search, edit, and delete journal entries
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Save, BookOpen, Sparkles, Calendar, Search,
  Pencil, Trash2, X, Plus, Check, Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassmorphicCard } from '../components/GlassmorphicCard';
import { BottomNav } from '../components/BottomNav';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { JournalService, JournalEntry } from '../services/JournalService';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

type View = 'list' | 'write' | 'edit';

export function JournalScreen() {
  const navigate = useNavigate();
  const { user, t } = useApp();

  // View state
  const [view, setView] = useState<View>('list');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // List state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Write / edit state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [prompts] = useState(JournalService.getPrompts());
  const [showPrompts, setShowPrompts] = useState(true);

  useEffect(() => { loadEntries(); }, []);

  // Autosave indicator
  useEffect(() => {
    if (!content.trim()) return;
    setAutoSaved(false);
    const t = setTimeout(() => setAutoSaved(true), 2000);
    return () => clearTimeout(t);
  }, [content, title]);

  const loadEntries = () => {
    setLoadingEntries(true);
    const all = JournalService.getAllEntries();
    setEntries(all);
    setLoadingEntries(false);
  };

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { loadEntries(); return; }
    setSearching(true);
    const results = await JournalService.searchEntries(q);
    setEntries(results);
    setSearching(false);
  }, []);

  const openWrite = () => {
    setTitle(''); setContent('');
    setEditingEntry(null);
    setShowPrompts(true);
    setAutoSaved(false);
    setView('write');
  };

  const openEdit = (entry: JournalEntry) => {
    setTitle(entry.title || '');
    setContent(entry.content);
    setEditingEntry(entry);
    setShowPrompts(false);
    setAutoSaved(false);
    setView('edit');
  };

  const handleSave = async () => {
    if (!content.trim()) { toast.error('Please write something'); return; }
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    try {
      if (view === 'edit' && editingEntry) {
        await JournalService.updateEntry(editingEntry.id, {
          title: title.trim() || undefined,
          content: content.trim(),
        });
        toast.success('Entry updated');
      } else {
        await JournalService.createEntry({
          userId: user.id,
          title: title.trim() || undefined,
          content: content.trim(),
          isPrivate: true,
        });
        toast.success('Entry saved!');
      }
      loadEntries();
      setView('list');
    } catch {
      toast.error('Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await JournalService.deleteEntry(id);
    toast.success('Entry deleted');
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const usePrompt = (prompt: string) => {
    setContent(prev => prev ? `${prev}\n\n${prompt}` : prompt);
    setShowPrompts(false);
  };

  const isWriting = view === 'write' || view === 'edit';

  return (
    <div className="relative min-h-screen app-bg-gradient pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-6 py-8 max-w-2xl mx-auto lg:max-w-full lg:px-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => isWriting ? setView('list') : navigate('/home')}
            className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-card/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              {view === 'edit' ? 'Edit Entry' : view === 'write' ? 'New Entry' : t('journal_title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isWriting ? (
                autoSaved && content ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <Check className="w-3 h-3" /> Autosaved
                  </span>
                ) : 'Write your thoughts'
              ) : 'Your private space'}
            </p>
          </div>
          {!isWriting && (
            <button
              onClick={openWrite}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ── List View ── */}
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search entries..."
                  className="pl-10 pr-10 bg-card/60 backdrop-blur-xl border-white/10 rounded-2xl"
                />
                {searchQuery && (
                  <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Entry Count */}
              {searchQuery && !searching && (
                <p className="text-xs text-muted-foreground px-1">
                  {entries.length} result{entries.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}

              {/* Loading */}
              {(loadingEntries || searching) && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
              )}

              {/* Empty state */}
              {!loadingEntries && !searching && entries.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <GlassmorphicCard className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="font-medium mb-1">
                      {searchQuery ? 'No entries found' : t('journal_empty')}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery ? 'Try different keywords' : t('journal_start')}
                    </p>
                    {!searchQuery && (
                      <Button onClick={openWrite} className="bg-primary hover:bg-primary/90 text-white rounded-full">
                        Write First Entry
                      </Button>
                    )}
                  </GlassmorphicCard>
                </motion.div>
              )}

              {/* Entries */}
              {!loadingEntries && !searching && entries.length > 0 && (
                <div className="space-y-3">
                  {entries.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <GlassmorphicCard className="p-0 overflow-hidden">
                        {/* Clickable body */}
                        <button
                          onClick={() => openEdit(entry)}
                          className="w-full text-left p-5 hover:bg-white/3 transition-all"
                        >
                          {entry.title && (
                            <h4 className="font-semibold text-sm mb-1 truncate">{entry.title}</h4>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-3 h-3 text-muted-foreground/60" />
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(entry.timestamp), 'MMM d, yyyy · h:mm a')}
                            </span>
                            {entry.updatedAt !== entry.timestamp && (
                              <span className="text-xs text-muted-foreground/50">(edited)</span>
                            )}
                          </div>
                        </button>

                        {/* Action row */}
                        <div className="flex items-center gap-1 px-4 pb-3 border-t border-white/5 pt-2">
                          <button
                            onClick={() => openEdit(entry)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-accent hover:bg-accent/10 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-destructive hover:bg-destructive/10 transition-all">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  This journal entry will be permanently deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(entry.id)} className="bg-destructive hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </GlassmorphicCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Write / Edit View ── */}
          {isWriting && (
            <motion.div
              key="write"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <GlassmorphicCard glow>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Title (optional)"
                  className="mb-4 bg-transparent border-none text-xl font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
                />
                <Textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Start writing..."
                  className="min-h-[280px] bg-transparent border-none resize-none text-base leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-0 px-0"
                />
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs text-muted-foreground">{content.length} characters</span>
                  <Button
                    onClick={handleSave}
                    disabled={!content.trim() || saving}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/30"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" />{view === 'edit' ? 'Update' : t('journal_save')}</>
                    )}
                  </Button>
                </div>
              </GlassmorphicCard>

              {/* Writing prompts */}
              {showPrompts && view === 'write' && (
                <GlassmorphicCard>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Need Inspiration?
                  </h3>
                  <div className="space-y-2">
                    {prompts.slice(0, 3).map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => usePrompt(prompt)}
                        className="w-full text-left px-4 py-3 rounded-xl bg-card/40 border border-white/10 hover:border-primary/50 hover:bg-card/60 transition-all text-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </GlassmorphicCard>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
