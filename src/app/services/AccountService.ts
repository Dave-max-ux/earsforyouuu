/**
 * AccountService - Backend-ready account management service
 * Designed for easy swap with real API endpoints
 */

import { AuthService, User } from './AuthService';

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  os: string;
  browser: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  moodReminders: boolean;
  journalReminders: boolean;
  therapyReminders: boolean;
  communityActivity: boolean;
  moodReminderTime: string;
  journalReminderTime: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  dataSharing: boolean;
  aiPersonalization: boolean;
  wellnessRecommendations: boolean;
  analyticsOptIn: boolean;
}

export interface AppPreferences {
  darkMode: boolean;
  language: 'en' | 'pidgin';
  accessibilityLargeText: boolean;
  accessibilityReduceMotion: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
}

// Admin types
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  status: 'active' | 'suspended' | 'deactivated';
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
  moodEntries: number;
  journalEntries: number;
  role: 'user' | 'admin';
}

class AccountServiceClass {
  private NOTIFICATIONS_KEY = 'earsforyou_notifications';
  private PRIVACY_KEY = 'earsforyou_privacy';
  private PREFS_KEY = 'earsforyou_prefs';
  private SESSIONS_KEY = 'earsforyou_sessions';
  private ACTIVITY_KEY = 'earsforyou_activity';

  private async simulateDelay(ms = 600): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ── Profile ──────────────────────────────────────────────
  async updateProfile(updates: Partial<User> & { displayName?: string }): Promise<{ success: boolean; user?: User; message?: string }> {
    await this.simulateDelay();
    // In production: PUT /api/account/profile
    const updated = AuthService.updateUser(updates);
    if (updated) return { success: true, user: updated };
    return { success: false, message: 'Update failed' };
  }

  async uploadProfilePicture(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
    await this.simulateDelay(1200);
    // In production: POST /api/account/avatar  (multipart/form-data)
    const url = URL.createObjectURL(file);
    return { success: true, url };
  }

  // ── Security ─────────────────────────────────────────────
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay();
    // In production: PUT /api/account/password
    if (currentPassword.length < 6) return { success: false, message: 'Current password is incorrect' };
    return { success: true, message: 'Password changed successfully' };
  }

  async sendOTP(email: string): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay();
    // In production: POST /api/auth/send-otp
    return { success: true, message: `OTP sent to ${email}` };
  }

  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay();
    // In production: POST /api/auth/verify-otp
    if (otp.length === 6) return { success: true, message: 'Email verified successfully' };
    return { success: false, message: 'Invalid OTP code' };
  }

  async resendOTP(email: string): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay(500);
    // In production: POST /api/auth/resend-otp
    return { success: true, message: 'New OTP sent' };
  }

  getSessions(): Session[] {
    const stored = localStorage.getItem(this.SESSIONS_KEY);
    if (stored) return JSON.parse(stored);

    // Mock sessions
    const sessions: Session[] = [
      {
        id: 'current',
        device: 'Chrome on macOS',
        location: 'Lagos, Nigeria',
        lastActive: new Date().toISOString(),
        isCurrent: true,
        os: 'macOS 14',
        browser: 'Chrome 124',
      },
      {
        id: 'mobile-1',
        device: 'iPhone 15 Pro',
        location: 'Abuja, Nigeria',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isCurrent: false,
        os: 'iOS 17.4',
        browser: 'Safari',
      },
      {
        id: 'tablet-1',
        device: 'iPad Air',
        location: 'Port Harcourt, Nigeria',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isCurrent: false,
        os: 'iPadOS 17',
        browser: 'Safari',
      },
    ];
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return sessions;
  }

  async terminateSession(sessionId: string): Promise<{ success: boolean }> {
    await this.simulateDelay(400);
    // In production: DELETE /api/account/sessions/:id
    const sessions = this.getSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return { success: true };
  }

  async terminateAllSessions(): Promise<{ success: boolean }> {
    await this.simulateDelay();
    // In production: DELETE /api/account/sessions/all
    const sessions = this.getSessions().filter(s => s.isCurrent);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return { success: true };
  }

  getActivityLog(): ActivityLog[] {
    const stored = localStorage.getItem(this.ACTIVITY_KEY);
    if (stored) return JSON.parse(stored);

    // Mock activity log
    const log: ActivityLog[] = [
      { id: '1', action: 'Login', timestamp: new Date().toISOString(), ip: '105.112.24.1', device: 'Chrome on macOS', status: 'success' },
      { id: '2', action: 'Password Changed', timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), ip: '105.112.24.1', device: 'Chrome on macOS', status: 'success' },
      { id: '3', action: 'Login Attempt', timestamp: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), ip: '197.255.110.23', device: 'Firefox on Windows', status: 'failed' },
      { id: '4', action: 'Profile Updated', timestamp: new Date(Date.now() - 7 * 24 * 3600000).toISOString(), ip: '105.112.24.1', device: 'iPhone Safari', status: 'success' },
      { id: '5', action: 'Email Verified', timestamp: new Date(Date.now() - 14 * 24 * 3600000).toISOString(), ip: '105.112.24.1', device: 'Chrome on macOS', status: 'success' },
      { id: '6', action: 'Account Created', timestamp: new Date(Date.now() - 30 * 24 * 3600000).toISOString(), ip: '105.112.24.1', device: 'Chrome on macOS', status: 'success' },
    ];
    localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(log));
    return log;
  }

  // ── Notifications ─────────────────────────────────────────
  getNotificationSettings(): NotificationSettings {
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (stored) return JSON.parse(stored);
    return {
      pushEnabled: true,
      emailEnabled: true,
      moodReminders: true,
      journalReminders: false,
      therapyReminders: true,
      communityActivity: false,
      moodReminderTime: '09:00',
      journalReminderTime: '21:00',
    };
  }

  async saveNotificationSettings(settings: NotificationSettings): Promise<{ success: boolean }> {
    await this.simulateDelay(400);
    // In production: PUT /api/account/notifications
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(settings));
    return { success: true };
  }

  // ── Privacy ───────────────────────────────────────────────
  getPrivacySettings(): PrivacySettings {
    const stored = localStorage.getItem(this.PRIVACY_KEY);
    if (stored) return JSON.parse(stored);
    return {
      profileVisibility: 'private',
      dataSharing: false,
      aiPersonalization: true,
      wellnessRecommendations: true,
      analyticsOptIn: true,
    };
  }

  async savePrivacySettings(settings: PrivacySettings): Promise<{ success: boolean }> {
    await this.simulateDelay(400);
    // In production: PUT /api/account/privacy
    localStorage.setItem(this.PRIVACY_KEY, JSON.stringify(settings));
    return { success: true };
  }

  // ── App Preferences ───────────────────────────────────────
  getAppPreferences(): AppPreferences {
    const stored = localStorage.getItem(this.PREFS_KEY);
    if (stored) return JSON.parse(stored);
    return {
      darkMode: true,
      language: 'en',
      accessibilityLargeText: false,
      accessibilityReduceMotion: false,
      hapticFeedback: true,
      soundEffects: true,
    };
  }

  async saveAppPreferences(prefs: AppPreferences): Promise<{ success: boolean }> {
    await this.simulateDelay(400);
    // In production: PUT /api/account/preferences
    localStorage.setItem(this.PREFS_KEY, JSON.stringify(prefs));
    return { success: true };
  }

  // ── Data Management ───────────────────────────────────────
  async requestDataExport(type: 'all' | 'journal' | 'mood'): Promise<{ success: boolean; downloadUrl?: string; fileName?: string; message?: string }> {
    await this.simulateDelay(2000);
    // In production: POST /api/account/data-export  → returns signed S3 URL
    const user = AuthService.getCurrentUser();
    const data = {
      exportType: type,
      requestedAt: new Date().toISOString(),
      user,
      note: 'Export ready – in production this would be a real download URL',
    };

    const sectionContent = JSON.stringify(data, null, 2)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EarsForYou Data Export</title>
  <style>
    :root { color-scheme: dark; color: #f9fafb; background: #081018; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: radial-gradient(circle at top left, rgba(73, 214, 255, 0.18), transparent 25%), radial-gradient(circle at bottom right, rgba(155, 89, 182, 0.16), transparent 20%), #081018; }
    .wrapper { width: min(100%, 980px); border-radius: 32px; background: rgba(12, 18, 32, 0.92); box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,0.05); overflow: hidden; }
    .header { padding: 3rem 3rem 2rem; background: linear-gradient(180deg, rgba(106, 172, 255, 0.14), transparent); }
    .badge { display: inline-flex; gap: 0.5rem; align-items: center; padding: 0.55rem 1rem; border-radius: 999px; background: rgba(81, 86, 248, 0.16); color: #c7d2fe; font-size: 0.86rem; letter-spacing: 0.12em; text-transform: uppercase; }
    .title { margin: 1rem 0 0.5rem; font-size: clamp(2rem, 2.7vw, 3.25rem); line-height: 1.05; letter-spacing: -0.04em; }
    .subtitle { color: #94a3b8; max-width: 40rem; line-height: 1.8; }
    .content { display: grid; gap: 1.5rem; padding: 2rem 3rem 3rem; }
    .card { padding: 1.75rem; border-radius: 28px; background: rgba(12, 20, 38, 0.96); border: 1px solid rgba(255,255,255,0.07); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
    .card h2 { margin: 0 0 0.85rem; font-size: 1.1rem; color: #fff; }
    .card p { margin: 0; color: #9ca3af; line-height: 1.8; }
    pre { margin: 1rem 0 0; padding: 1rem; border-radius: 22px; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255,255,255,0.06); overflow-x: auto; font-size: 0.92rem; line-height: 1.6; color: #e2e8f0; }
    .legend { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-top: 1.5rem; }
    .pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.85rem; border-radius: 999px; background: rgba(99, 102, 241, 0.16); color: #e0e7ff; font-size: 0.88rem; }
    .pill::before { content: '•'; color: #93c5fd; }
    footer { padding: 1rem 3rem 2rem; color: #7c84a3; font-size: 0.88rem; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="badge">EarsForYou Data Export</div>
      <h1 class="title">Your personal wellness report</h1>
      <p class="subtitle">This export is designed as a calm, supportive snapshot of your data. Use it as a reflective report or keep it for your own emotional wellness journal.</p>
    </div>
    <div class="content">
      <div class="card">
        <h2>Export details</h2>
        <p><strong>Type:</strong> ${type === 'all' ? 'Complete wellness export' : type === 'journal' ? 'Journal entries' : 'Mood history'}</p>
        <p><strong>Exported on:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Generated for:</strong> ${user?.fullName ?? 'Unknown user'} (${user?.email ?? 'no email'})</p>
      </div>
      <div class="card">
        <h2>How to use this export</h2>
        <p>Keep this report as a gentle reflection of your mental wellness journey. Share with a trusted friend, therapist, or keep it private for later review.</p>
        <div class="legend">
          <span class="pill">Slow down and breathe</span>
          <span class="pill">Review with kindness</span>
          <span class="pill">Notice patterns, not perfection</span>
        </div>
      </div>
      <div class="card">
        <h2>Raw export content</h2>
        <pre>${sectionContent}</pre>
      </div>
    </div>
    <footer>Thank you for caring for your emotional wellbeing with EarsForYou.</footer>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    return { success: true, downloadUrl: URL.createObjectURL(blob), fileName: `earsforyou-${type}-export.html`, message: 'Export ready' };
  }

  async deactivateAccount(): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay();
    // In production: POST /api/account/deactivate
    return { success: true, message: 'Account deactivated. You can reactivate by logging back in.' };
  }

  // ── Admin ─────────────────────────────────────────────────
  async getAdminUsers(search = ''): Promise<AdminUser[]> {
    await this.simulateDelay(800);
    // In production: GET /api/admin/users?search=...
    const users: AdminUser[] = [
      { id: '1', email: 'adaeze.obi@email.com', fullName: 'Adaeze Obi', status: 'active', emailVerified: true, createdAt: '2024-01-15T10:00:00Z', lastLogin: new Date().toISOString(), moodEntries: 45, journalEntries: 12, role: 'user' },
      { id: '2', email: 'emeka.chukwu@email.com', fullName: 'Emeka Chukwu', status: 'active', emailVerified: true, createdAt: '2024-02-20T09:00:00Z', lastLogin: new Date(Date.now() - 2 * 3600000).toISOString(), moodEntries: 78, journalEntries: 30, role: 'user' },
      { id: '3', email: 'fatima.bello@email.com', fullName: 'Fatima Bello', status: 'suspended', emailVerified: false, createdAt: '2024-03-10T14:00:00Z', lastLogin: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), moodEntries: 8, journalEntries: 2, role: 'user' },
      { id: '4', email: 'tunde.adesanya@email.com', fullName: 'Tunde Adesanya', status: 'active', emailVerified: true, createdAt: '2024-01-28T11:00:00Z', lastLogin: new Date(Date.now() - 1 * 3600000).toISOString(), moodEntries: 120, journalEntries: 55, role: 'admin' },
      { id: '5', email: 'chioma.eze@email.com', fullName: 'Chioma Eze', status: 'active', emailVerified: true, createdAt: '2024-04-05T08:00:00Z', lastLogin: new Date(Date.now() - 3 * 3600000).toISOString(), moodEntries: 32, journalEntries: 18, role: 'user' },
      { id: '6', email: 'ibrahim.musa@email.com', fullName: 'Ibrahim Musa', status: 'deactivated', emailVerified: true, createdAt: '2024-02-14T15:00:00Z', lastLogin: new Date(Date.now() - 10 * 24 * 3600000).toISOString(), moodEntries: 15, journalEntries: 5, role: 'user' },
    ];
    if (!search) return users;
    return users.filter(u =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  async adminSuspendUser(userId: string): Promise<{ success: boolean }> {
    await this.simulateDelay(600);
    // In production: POST /api/admin/users/:id/suspend
    return { success: true };
  }

  async adminReactivateUser(userId: string): Promise<{ success: boolean }> {
    await this.simulateDelay(600);
    // In production: POST /api/admin/users/:id/reactivate
    return { success: true };
  }

  async adminDeleteUser(userId: string): Promise<{ success: boolean }> {
    await this.simulateDelay(800);
    // In production: DELETE /api/admin/users/:id
    return { success: true };
  }

  async adminSendPasswordReset(userId: string): Promise<{ success: boolean }> {
    await this.simulateDelay(600);
    // In production: POST /api/admin/users/:id/password-reset
    return { success: true };
  }

  async adminVerifyEmail(userId: string): Promise<{ success: boolean }> {
    await this.simulateDelay(600);
    // In production: POST /api/admin/users/:id/verify-email
    return { success: true };
  }

  async getAdminStats(): Promise<{ totalUsers: number; activeToday: number; suspended: number; newThisWeek: number }> {
    await this.simulateDelay(400);
    // In production: GET /api/admin/stats
    return { totalUsers: 1284, activeToday: 342, suspended: 8, newThisWeek: 67 };
  }
}

export const AccountService = new AccountServiceClass();
