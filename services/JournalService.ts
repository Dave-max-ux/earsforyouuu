/**
 * JournalService - Backend-ready journaling service
 */

export interface JournalEntry {
  id: string;
  userId: string;
  title?: string;
  content: string;
  mood?: string;
  tags?: string[];
  timestamp: string;
  updatedAt: string;
  isPrivate: boolean;
}

class JournalServiceClass {
  private STORAGE_KEY = 'earsforyou_journal';

  private async simulateDelay(ms = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createEntry(data: Omit<JournalEntry, 'id' | 'timestamp' | 'updatedAt'>): Promise<JournalEntry> {
    await this.simulateDelay();

    // In production: POST /api/journal
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    const entries = this.getAllEntries();
    entries.unshift(entry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));

    return entry;
  }

  getAllEntries(): JournalEntry[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async getEntryById(id: string): Promise<JournalEntry | null> {
    await this.simulateDelay(200);

    // In production: GET /api/journal/:id
    const entries = this.getAllEntries();
    return entries.find(e => e.id === id) || null;
  }

  async updateEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | null> {
    await this.simulateDelay();

    // In production: PATCH /api/journal/:id
    const entries = this.getAllEntries();
    const index = entries.findIndex(e => e.id === id);

    if (index === -1) return null;

    entries[index] = {
      ...entries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    return entries[index];
  }

  async deleteEntry(id: string): Promise<boolean> {
    await this.simulateDelay();

    // In production: DELETE /api/journal/:id
    const entries = this.getAllEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  async searchEntries(query: string): Promise<JournalEntry[]> {
    await this.simulateDelay(300);

    // In production: GET /api/journal/search?q=...
    const entries = this.getAllEntries();
    const lowerQuery = query.toLowerCase();

    return entries.filter(entry =>
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.title?.toLowerCase().includes(lowerQuery) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getPrompts(): string[] {
    return [
      "What are you grateful for today?",
      "What's one thing that made you smile?",
      "How are you feeling right now?",
      "What's weighing on your mind?",
      "What do you need to let go of?",
      "What brought you peace today?",
      "What challenged you today?",
      "What did you learn about yourself?",
      "What are you looking forward to?",
      "How can you be kinder to yourself?",
    ];
  }
}

export const JournalService = new JournalServiceClass();
