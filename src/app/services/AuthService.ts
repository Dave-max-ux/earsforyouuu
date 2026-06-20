/**
 * AuthService - Backend-ready authentication service
 * Currently uses localStorage, designed to easily swap with API calls
 */

export type GenerationKey = 'gen-alpha' | 'gen-z' | 'millennial' | 'gen-x' | 'boomer';

export interface User {
  id: string;
  email: string;
  fullName: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  employmentStatus?: 'employed' | 'unemployed' | 'student' | 'self-employed';
  generation?: GenerationKey;
  dateOfBirth?: string;
  createdAt: string;
  language: 'en' | 'pidgin';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export function getGenerationFromDOB(dob: string): GenerationKey {
  const birthYear = new Date(dob).getFullYear();
  const age = 2026 - birthYear;
  if (age <= 16) return 'gen-alpha';
  if (age <= 29) return 'gen-z';
  if (age <= 45) return 'millennial';
  if (age <= 61) return 'gen-x';
  return 'boomer';
}

export const GENERATION_LABELS: Record<GenerationKey, string> = {
  'gen-alpha': 'Generation Alpha (0–16)',
  'gen-z': 'Generation Z (17–29)',
  'millennial': 'Millennial (30–45)',
  'gen-x': 'Generation X (46–61)',
  'boomer': 'Baby Boomer (62–80)',
};

class AuthServiceClass {
  private STORAGE_KEY = 'earsforyou_user';
  private SESSION_KEY = 'earsforyou_session';

  private async simulateDelay(ms = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async register(data: {
    email: string;
    password: string;
    fullName: string;
    gender: string;
    maritalStatus: string;
    employmentStatus: string;
    generation?: string;
    dateOfBirth?: string;
  }): Promise<AuthResponse> {
    await this.simulateDelay();

    // In production: POST /api/auth/register
    const generation: GenerationKey = data.dateOfBirth
      ? getGenerationFromDOB(data.dateOfBirth)
      : (data.generation as GenerationKey | undefined) ?? 'gen-z';

    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      fullName: data.fullName,
      gender: data.gender as User['gender'],
      maritalStatus: data.maritalStatus as User['maritalStatus'],
      employmentStatus: data.employmentStatus as User['employmentStatus'],
      generation,
      dateOfBirth: data.dateOfBirth,
      createdAt: new Date().toISOString(),
      language: 'en',
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.SESSION_KEY, 'active');
    return { success: true, user };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    await this.simulateDelay();
    // In production: POST /api/auth/login
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const user: User = JSON.parse(stored);
      if (user.email === email) {
        localStorage.setItem(this.SESSION_KEY, 'active');
        return { success: true, user };
      }
    }
    return { success: false, message: 'Invalid credentials' };
  }

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    await this.simulateDelay();
    // In production: POST /api/auth/verify-otp
    if (otp.length === 6) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return { success: true, user: JSON.parse(stored) };
    }
    return { success: false, message: 'Invalid OTP' };
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    await this.simulateDelay();
    // In production: POST /api/auth/reset-password
    return { success: true, message: 'Reset link sent to email' };
  }

  async logout(): Promise<void> {
    // In production: POST /api/auth/logout
    localStorage.removeItem(this.SESSION_KEY);
  }

  async deleteAccount(): Promise<AuthResponse> {
    await this.simulateDelay();
    // In production: DELETE /api/auth/account
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    return { success: true, message: 'Account deleted' };
  }

  getCurrentUser(): User | null {
    if (localStorage.getItem(this.SESSION_KEY) !== 'active') return null;
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;
    const user: User = JSON.parse(stored);
    if (!user.generation && user.dateOfBirth) {
      user.generation = getGenerationFromDOB(user.dateOfBirth);
    }
    return user;
  }

  updateUser(updates: Partial<User>): User | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    const updatedUser = { ...user, ...updates };
    if (updates.dateOfBirth) updatedUser.generation = getGenerationFromDOB(updates.dateOfBirth);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.SESSION_KEY) === 'active';
  }
}

export const AuthService = new AuthServiceClass();
