/**
 * InsightService - Generation-aware emotional insights
 * In production: replace with POST /api/insights/generate (AI backend)
 */

import { MoodEntry, MoodService } from './MoodService';
import { AuthService, GenerationKey } from './AuthService';

export interface Insight {
  id: string;
  type: 'pattern' | 'encouragement' | 'suggestion' | 'observation';
  title: string;
  message: string;
  severity?: 'info' | 'warning' | 'positive';
  timestamp: string;
}

// ── Generation-specific affirmations ───────────────────────────────────────────
const AFFIRMATIONS: Record<GenerationKey, string[]> = {
  'gen-alpha': [
    "You are learning and growing every single day.",
    "It's okay to ask for help — that's a sign of strength.",
    "Your feelings matter, and it's safe to talk about them.",
    "Every mistake is a chance to learn something new.",
    "You bring something unique to the world — embrace it.",
    "Your wellbeing comes first, always.",
    "Being kind to yourself is the best habit you can build.",
  ],
  'gen-z': [
    "Your mental health matters just as much as your achievements.",
    "You don't have to figure everything out right now.",
    "Progress over perfection — always.",
    "It's okay to unplug and take space for yourself.",
    "Your authenticity is your greatest strength.",
    "Boundaries are a form of self-respect.",
    "You are more than your productivity.",
    "Rest is not a reward — it's a right.",
  ],
  'millennial': [
    "Balance is not a destination, it's a daily practice.",
    "You are doing an incredible job, even when it doesn't feel like it.",
    "It's okay to let go of who you thought you'd be by now.",
    "Asking for support is wisdom, not weakness.",
    "Your worth is not measured by your career achievements.",
    "Small consistent steps create lasting change.",
    "You can hold space for others and still protect your peace.",
    "Your journey is valid at every stage.",
  ],
  'gen-x': [
    "Experience is one of your greatest assets — trust it.",
    "You have navigated challenges before and you will again.",
    "Your wellbeing deserves the same energy you give to others.",
    "It's never too late to invest in your mental health.",
    "Wisdom comes from every chapter — including the difficult ones.",
    "You are allowed to redefine what success means to you.",
    "Slowing down is not giving up — it's strategic.",
  ],
  'boomer': [
    "Every day is an opportunity for joy and connection.",
    "Your life experiences carry immense value and wisdom.",
    "Purpose and meaning can be found at every stage of life.",
    "Taking care of your mental health is an act of courage.",
    "You have built a life worth celebrating.",
    "It's okay to ask for support and to accept it gracefully.",
    "Rest, reflection, and joy are your rights, not luxuries.",
    "Your legacy is being written in every kind act.",
  ],
};

// ── Generation-specific wellness suggestions ────────────────────────────────────
const GENERATION_SUGGESTIONS: Record<GenerationKey, string[]> = {
  'gen-alpha': [
    'Talk to a trusted adult about how you\'re feeling',
    'Take a break from screens and go outside',
    'Draw or write what\'s on your mind',
    'Do something creative you enjoy',
  ],
  'gen-z': [
    'Try a 5-minute digital detox',
    'Practice the 4-7-8 breathing technique',
    'Reach out to a friend via voice call, not just text',
    'Set one boundary with your time today',
    'Journal about what you\'re feeling right now',
  ],
  'millennial': [
    'Block 15 minutes of unstructured time today',
    'Delegate one task you don\'t have to do yourself',
    'Check in with a close friend you haven\'t spoken to recently',
    'Take a proper lunch break away from your screen',
    'Practice saying no to one non-essential commitment',
  ],
  'gen-x': [
    'Schedule a health check-up if you haven\'t recently',
    'Connect with a mentor or trusted peer',
    'Revisit a hobby you\'ve been putting off',
    'Share your experience — mentoring others reduces stress',
    'Take a walk without your phone',
  ],
  'boomer': [
    'Call or video chat with a friend or family member',
    'Spend time in nature — even a short walk helps',
    'Engage in a fulfilling activity or community group',
    'Practice gentle movement or stretching',
    'Write down three things you are grateful for today',
  ],
};

// ── Fallback affirmations ───────────────────────────────────────────────────────
const DEFAULT_AFFIRMATIONS = [
  "You are exactly where you need to be.",
  "Your feelings are valid and important.",
  "You have the strength to overcome today's challenges.",
  "It's okay to take things one step at a time.",
  "You deserve peace, love, and happiness.",
  "Your mental health matters.",
  "You are not alone in this journey.",
  "Progress, not perfection.",
  "You are doing better than you think.",
  "Be gentle with yourself today.",
];

class InsightServiceClass {
  private async simulateDelay(ms = 700): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCurrentGeneration(): GenerationKey | null {
    const user = AuthService.getCurrentUser();
    return user?.generation ?? null;
  }

  async generateInsights(): Promise<Insight[]> {
    await this.simulateDelay();
    // In production: POST /api/insights/generate (AI backend)
    const moods = MoodService.getAllMoods();
    const insights: Insight[] = [];

    if (moods.length === 0) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'encouragement',
        title: 'Welcome! 🌟',
        message: 'Start tracking your mood to unlock personalized insights.',
        severity: 'info',
        timestamp: new Date().toISOString(),
      });
      return insights;
    }

    const stressPattern = this.detectStressPattern(moods);
    if (stressPattern) insights.push(stressPattern);

    const weekdayPattern = this.detectWeekdayPattern(moods);
    if (weekdayPattern) insights.push(weekdayPattern);

    const stats = await MoodService.getStats();
    if (stats.currentStreak >= 7) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'encouragement',
        title: '🔥 Amazing Streak!',
        message: `You've logged your mood for ${stats.currentStreak} days straight. Keep going!`,
        severity: 'positive',
        timestamp: new Date().toISOString(),
      });
    }

    if (stats.wellnessScore >= 80) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'observation',
        title: '✨ Thriving',
        message: 'Your wellness score is excellent. You\'re doing great!',
        severity: 'positive',
        timestamp: new Date().toISOString(),
      });
    } else if (stats.wellnessScore < 50) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'suggestion',
        title: '💙 Self-Care Time',
        message: 'Your wellness score suggests you might need extra support. Consider reaching out.',
        severity: 'warning',
        timestamp: new Date().toISOString(),
      });
    }

    return insights.slice(0, 4);
  }

  private detectStressPattern(moods: MoodEntry[]): Insight | null {
    const recentMoods = moods.slice(0, 7);
    const avgStress = recentMoods.reduce((sum, m) => sum + m.stress, 0) / recentMoods.length;
    if (avgStress > 7) {
      return {
        id: crypto.randomUUID(),
        type: 'pattern',
        title: '⚠️ High Stress Detected',
        message: 'Your stress levels have been elevated this week. Try breathing exercises or reach out for support.',
        severity: 'warning',
        timestamp: new Date().toISOString(),
      };
    }
    return null;
  }

  private detectWeekdayPattern(moods: MoodEntry[]): Insight | null {
    const moodsByDay: { [key: number]: number[] } = {};
    moods.forEach(mood => {
      const day = new Date(mood.timestamp).getDay();
      if (!moodsByDay[day]) moodsByDay[day] = [];
      moodsByDay[day].push(mood.stress);
    });
    const weekdayStress = [1, 2, 3, 4, 5].filter(d => moodsByDay[d]?.length).flatMap(d => moodsByDay[d]);
    const weekendStress = [0, 6].filter(d => moodsByDay[d]?.length).flatMap(d => moodsByDay[d]);
    if (weekdayStress.length > 3 && weekendStress.length > 0) {
      const avgWD = weekdayStress.reduce((a, b) => a + b, 0) / weekdayStress.length;
      const avgWE = weekendStress.reduce((a, b) => a + b, 0) / weekendStress.length;
      if (avgWD - avgWE > 2) {
        return {
          id: crypto.randomUUID(),
          type: 'pattern',
          title: '📊 Weekday Stress',
          message: 'You tend to feel more stressed on weekdays. Consider work-life balance strategies.',
          severity: 'info',
          timestamp: new Date().toISOString(),
        };
      }
    }
    return null;
  }

  async getDailyAffirmation(): Promise<string> {
    await this.simulateDelay(300);
    // In production: GET /api/insights/affirmation?generation=...
    const gen = this.getCurrentGeneration();
    const pool = gen ? AFFIRMATIONS[gen] : DEFAULT_AFFIRMATIONS;
    const index = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % pool.length;
    return pool[index];
  }

  async getSuggestions(mood: string, stress: number): Promise<string[]> {
    await this.simulateDelay(400);
    // In production: POST /api/insights/suggestions?generation=...
    const gen = this.getCurrentGeneration();
    const genSuggestions = gen ? GENERATION_SUGGESTIONS[gen] : [];
    const suggestions: string[] = [];

    if (stress > 7) {
      suggestions.push('Try the 4-7-8 breathing technique');
      suggestions.push('Take a short walk outside');
    }

    if (mood === 'sad' || mood === 'anxious' || mood === 'stressed') {
      suggestions.push('Reach out to a friend or loved one');
      suggestions.push('Journal about what you\'re feeling');
      suggestions.push('Consider professional support');
    }

    // Add generation-specific suggestions
    if (genSuggestions.length > 0) {
      suggestions.push(...genSuggestions.slice(0, 2));
    }

    if (suggestions.length === 0) {
      suggestions.push('Practice gratitude journaling');
      suggestions.push('Stay hydrated and get enough rest');
    }

    return [...new Set(suggestions)].slice(0, 4);
  }
}

export const InsightService = new InsightServiceClass();
