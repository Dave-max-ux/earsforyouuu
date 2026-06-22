/**
 * MoodService - Backend-ready mood tracking service
 * Currently uses localStorage, designed for easy API integration
 */

export type MoodType = 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'stressed';

// Legacy type mapping for backward-compatible stored data migration
const LEGACY_MOOD_MAP: Record<string, MoodType> = {
  amazing: 'happy',
  good: 'calm',
  okay: 'neutral',
  down: 'sad',
  terrible: 'sad',
};

export const MOOD_SCORE: Record<MoodType, number> = {
  happy: 6,
  calm: 5,
  neutral: 4,
  sad: 3,
  anxious: 2,
  stressed: 1,
};

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  intensity: number; // 1–10
  stress: number;    // 1–10
  energy: number;    // 1–10
  focus?: number;    // 1–10
  timestamp: string;
  tags?: string[];
}

export interface MoodStats {
  averageMood: number;
  averageStress: number;
  averageEnergy: number;
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  wellnessScore: number;
  moodDistribution: Record<MoodType, number>;
}

class MoodServiceClass {
  private STORAGE_KEY = 'earsforyou_moods';

  private async simulateDelay(ms = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private migrateMood(entry: MoodEntry): MoodEntry {
    const m = entry.mood as string;
    if (LEGACY_MOOD_MAP[m]) return { ...entry, mood: LEGACY_MOOD_MAP[m] };
    return entry;
  }

  async logMood(data: Omit<MoodEntry, 'id' | 'timestamp'>): Promise<MoodEntry> {
    await this.simulateDelay();
    // In production: POST /api/v1/mood/log
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...data,
    };
    const entries = this.getAllMoods();
    entries.unshift(entry);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    return entry;
  }

  getAllMoods(): MoodEntry[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const raw: MoodEntry[] = stored ? JSON.parse(stored) : [];
    return raw.map(e => this.migrateMood(e));
  }

  async getMoodsByDateRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    await this.simulateDelay(300);
    // In production: GET /api/v1/mood/analytics?start=&end=
    return this.getAllMoods().filter(m => {
      const d = new Date(m.timestamp);
      return d >= startDate && d <= endDate;
    });
  }

  async getTodayMood(): Promise<MoodEntry | null> {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const moods = await this.getMoodsByDateRange(today, tomorrow);
    return moods[0] ?? null;
  }

  async getStats(): Promise<MoodStats> {
    await this.simulateDelay(300);
    // In production: GET /api/v1/mood/analytics
    const moods = this.getAllMoods();

    if (moods.length === 0) {
      return {
        averageMood: 0, averageStress: 0, averageEnergy: 0,
        currentStreak: 0, longestStreak: 0, totalEntries: 0,
        wellnessScore: 0,
        moodDistribution: { happy: 0, calm: 0, neutral: 0, sad: 0, anxious: 0, stressed: 0 },
      };
    }

    const avgMood = moods.reduce((s, m) => s + MOOD_SCORE[m.mood], 0) / moods.length;
    const avgStress = moods.reduce((s, m) => s + m.stress, 0) / moods.length;
    const avgEnergy = moods.reduce((s, m) => s + m.energy, 0) / moods.length;
    const streak = this.calculateStreak(moods);
    const wellnessScore = this.calculateWellnessScore(avgMood, avgStress, avgEnergy);

    const dist = { happy: 0, calm: 0, neutral: 0, sad: 0, anxious: 0, stressed: 0 } as Record<MoodType, number>;
    moods.forEach(m => dist[m.mood]++);

    return {
      averageMood: avgMood, averageStress: avgStress, averageEnergy: avgEnergy,
      currentStreak: streak.current, longestStreak: streak.longest,
      totalEntries: moods.length, wellnessScore,
      moodDistribution: dist,
    };
  }

  async getStreak(): Promise<{ current: number; longest: number }> {
    // In production: GET /api/v1/mood/streak
    return this.calculateStreak(this.getAllMoods());
  }

  private calculateStreak(moods: MoodEntry[]): { current: number; longest: number } {
    if (!moods.length) return { current: 0, longest: 0 };
    const sorted = [...moods].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    let current = 0, longest = 0, temp = 0;
    let lastDate = new Date(); lastDate.setHours(0, 0, 0, 0);

    for (const m of sorted) {
      const d = new Date(m.timestamp); d.setHours(0, 0, 0, 0);
      const diff = Math.floor((lastDate.getTime() - d.getTime()) / 86400000);
      if (diff === 0 || diff === 1) {
        temp++;
        if (current === 0) current = temp;
      } else {
        longest = Math.max(longest, temp);
        temp = 1;
      }
      lastDate = d;
    }
    longest = Math.max(longest, temp);
    return { current, longest };
  }

  private calculateWellnessScore(avgMood: number, avgStress: number, avgEnergy: number): number {
    const moodScore = (avgMood / 6) * 40;
    const stressScore = ((10 - avgStress) / 10) * 30;
    const energyScore = (avgEnergy / 10) * 30;
    return Math.round(moodScore + stressScore + energyScore);
  }

  async deleteMood(id: string): Promise<boolean> {
    await this.simulateDelay();
    // In production: DELETE /api/v1/mood/:id
    const moods = this.getAllMoods().filter(m => m.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(moods));
    return true;
  }
}

export const MoodService = new MoodServiceClass();
