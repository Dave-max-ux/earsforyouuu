/**
 * Translation utilities for English and Nigerian Pidgin
 */

export type Language = 'en' | 'pidgin';

export const translations = {
  en: {
    // Auth
    welcome: 'Welcome to EarsForYou',
    welcomeSubtitle: 'Your personal emotional wellness companion',
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    
    // Onboarding
    onboarding1Title: 'Track Your Emotions',
    onboarding1Text: 'Log your daily mood and understand your emotional patterns',
    onboarding2Title: 'Journal Your Thoughts',
    onboarding2Text: 'Write freely in a safe, private space designed for healing',
    onboarding3Title: 'Get Personalized Insights',
    onboarding3Text: 'Receive AI-powered suggestions tailored to your wellness journey',
    getStarted: 'Get Started',
    skip: 'Skip',
    next: 'Next',
    
    // Home
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    howAreYouFeeling: 'How are you feeling today?',
    checkIn: 'Quick Check-In',
    viewInsights: 'View Insights',
    
    // Mood
    amazing: 'Amazing',
    good: 'Good',
    okay: 'Okay',
    down: 'Down',
    terrible: 'Terrible',
    stress: 'Stress Level',
    energy: 'Energy Level',
    focus: 'Focus',
    addNotes: 'Add notes',
    saveMood: 'Save Mood',
    
    // Journal
    writeJournal: 'Write in your journal',
    journalPrompts: 'Need inspiration?',
    saveEntry: 'Save Entry',
    
    // Navigation
    home: 'Home',
    mood: 'Mood',
    journal: 'Journal',
    insights: 'Insights',
    support: 'Support',
    
    // Support
    reachOut: 'Reach Out for Support',
    therapists: 'Professional Therapists',
    crisisHelp: 'Crisis Support',
    
    // SOS
    sosTitle: 'You\'re Not Alone',
    sosSubtitle: 'Take a deep breath. We\'re here for you.',
    breathe: 'Breathe',
    getHelp: 'Get Immediate Help',
  },
  
  pidgin: {
    // Auth
    welcome: 'Welcome to EarsForYou',
    welcomeSubtitle: 'Your own emotional wellness partner',
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Your Full Name',
    forgotPassword: 'You forget password?',
    
    // Onboarding
    onboarding1Title: 'Track How You Dey Feel',
    onboarding1Text: 'Log how you dey feel everyday and understand yourself well well',
    onboarding2Title: 'Write Wetin Dey Your Mind',
    onboarding2Text: 'Write freely for safe place wey dey heal you',
    onboarding3Title: 'Get Personal Help',
    onboarding3Text: 'Receive AI suggestions wey go fit your wellness journey',
    getStarted: 'Make We Start',
    skip: 'Skip',
    next: 'Next',
    
    // Home
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    howAreYouFeeling: 'How you dey feel today?',
    checkIn: 'Quick Check-In',
    viewInsights: 'See Your Progress',
    
    // Mood
    amazing: 'I Dey Kampe',
    good: 'E Good',
    okay: 'E Okay',
    down: 'I Dey Down',
    terrible: 'E Bad Well Well',
    stress: 'Stress Level',
    energy: 'Energy Level',
    focus: 'Focus',
    addNotes: 'Add notes',
    saveMood: 'Save Am',
    
    // Journal
    writeJournal: 'Write for your journal',
    journalPrompts: 'You need inspiration?',
    saveEntry: 'Save Entry',
    
    // Navigation
    home: 'Home',
    mood: 'Mood',
    journal: 'Journal',
    insights: 'Insights',
    support: 'Support',
    
    // Support
    reachOut: 'Reach Out Make We Help You',
    therapists: 'Professional Therapists',
    crisisHelp: 'Emergency Help',
    
    // SOS
    sosTitle: 'You No Dey Alone',
    sosSubtitle: 'Take deep breath. We dey here for you.',
    breathe: 'Breathe',
    getHelp: 'Get Help Now Now',
  },
};

export function t(key: string, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
