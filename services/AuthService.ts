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
  location?: string;
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
  private PENDING_REGISTRATION_KEY = 'earsforyou_pending_registration';
  private PENDING_REGISTRATION_OTP_KEY = 'earsforyou_pending_registration_otp';
  private PENDING_OTP_TTL = 5 * 60 * 1000;

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
    location?: string;
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
      location: data.location,
      createdAt: new Date().toISOString(),
      language: 'en',
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  }

  private getStoredPendingRegistration(): { email: string; data: { email: string; password: string; fullName: string; gender: string; maritalStatus: string; employmentStatus: string; location?: string; generation?: string; dateOfBirth?: string; }; } | null {
    const raw = sessionStorage.getItem(this.PENDING_REGISTRATION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private getStoredPendingOtp(): { otp: string; expiresAt: number } | null {
    const raw = sessionStorage.getItem(this.PENDING_REGISTRATION_OTP_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private savePendingRegistration(email: string, data: { email: string; password: string; fullName: string; gender: string; maritalStatus: string; employmentStatus: string; location?: string; generation?: string; dateOfBirth?: string; }) {
    sessionStorage.setItem(this.PENDING_REGISTRATION_KEY, JSON.stringify({ email, data }));
  }

  private savePendingOtp(otp: string, expiresAt: number) {
    sessionStorage.setItem(this.PENDING_REGISTRATION_OTP_KEY, JSON.stringify({ otp, expiresAt }));
  }

  private clearPendingRegistration() {
    sessionStorage.removeItem(this.PENDING_REGISTRATION_KEY);
    sessionStorage.removeItem(this.PENDING_REGISTRATION_OTP_KEY);
  }

  async beginPendingRegistration(data: {
    email: string;
    password: string;
    fullName: string;
    gender: string;
    maritalStatus: string;
    employmentStatus: string;
    location?: string;
    generation?: string;
    dateOfBirth?: string;
  }): Promise<{ success: boolean; message?: string; otp?: string }> {
    await this.simulateDelay();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + this.PENDING_OTP_TTL;
    try {
      this.savePendingRegistration(data.email, data);
      this.savePendingOtp(otp, expiresAt);
      // Helpful for local development to surface the OTP in console
      // eslint-disable-next-line no-console
      console.debug(`[AuthService] Pending registration OTP for ${data.email}: ${otp}`);
      return { success: true, otp };
    } catch {
      return { success: false, message: 'Unable to start signup' };
    }
  }

  async resendPendingRegistrationOtp(email: string): Promise<{ success: boolean; message?: string; otp?: string }> {
    await this.simulateDelay();
    const pending = this.getStoredPendingRegistration();
    if (!pending || pending.email !== email) {
      return { success: false, message: 'No pending signup found' };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + this.PENDING_OTP_TTL;
    this.savePendingOtp(otp, expiresAt);
    // eslint-disable-next-line no-console
    console.debug(`[AuthService] Resent pending registration OTP for ${email}: ${otp}`);
    return { success: true, otp, message: 'OTP resent' };
  }

  async getPendingRegistration(email: string): Promise<{ otp: string; expiresAt: number } | null> {
    const pending = this.getStoredPendingRegistration();
    if (!pending || pending.email !== email) return null;
    const otpRecord = this.getStoredPendingOtp();
    if (!otpRecord) return null;
    return otpRecord;
  }

  async verifyPendingRegistration(email: string, otp: string): Promise<AuthResponse> {
    await this.simulateDelay();
    const pending = this.getStoredPendingRegistration();
    if (!pending || pending.email !== email) {
      return { success: false, message: 'No pending signup found' };
    }
    const otpRecord = this.getStoredPendingOtp();
    if (!otpRecord) {
      this.clearPendingRegistration();
      return { success: false, message: 'OTP expired' };
    }
    if (Date.now() > otpRecord.expiresAt) {
      this.clearPendingRegistration();
      return { success: false, message: 'OTP expired' };
    }
    if (otp !== otpRecord.otp) {
      return { success: false, message: 'Invalid OTP' };
    }
    const registrationResult = await this.register(pending.data);
    if (!registrationResult.success) {
      this.clearPendingRegistration();
      return registrationResult;
    }
    localStorage.setItem(this.SESSION_KEY, 'active');
    this.clearPendingRegistration();
    return { success: true, user: registrationResult.user, message: 'OTP verified' };
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

  async sendOTP(email: string): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay();
    // In production: POST /api/auth/send-otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    try {
      localStorage.setItem(`earsforyou_otp_${email}`, JSON.stringify({ otp, expiresAt }));
      // Helpful for local development to surface the OTP in console
      // eslint-disable-next-line no-console
      console.debug(`[AuthService] Generated OTP for ${email}: ${otp}`);
    } catch (e) {
      // ignore storage errors
    }
    return { success: true, message: `OTP sent to ${email}` };
  }

  async resendOTP(email: string): Promise<{ success: boolean; message?: string }> {
    // mirror sendOTP for API parity
    return this.sendOTP(email);
  }

  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    await this.simulateDelay();
    // In production: POST /api/auth/verify-otp
    const key = `earsforyou_otp_${email}`;
    const raw = localStorage.getItem(key);
    if (!raw) return { success: false, message: 'No OTP found for this email' };
    try {
      const { otp: expected, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(key);
        return { success: false, message: 'OTP expired' };
      }
      if (otp === expected) {
        localStorage.removeItem(key);
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) return { success: true, user: JSON.parse(stored), message: 'OTP verified' };
        return { success: true, message: 'OTP verified' };
      }
    } catch (e) {
      // fall through to invalid OTP
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
