/**
 * AdminAuthService - Frontend-only admin authentication
 * Replace whitelist check + password with real API call when backend is ready:
 *   POST /api/admin/auth/login  → { token, email }
 */

const ADMIN_WHITELIST = ['dev1@email.com', 'dev2@email.com', 'dev3@email.com'];
const ADMIN_PASSWORD = 'EarsForYouAdmin2026';
const SESSION_KEY = 'earsforyou_admin_session';

export interface AdminSession {
  email: string;
  loginAt: string;
}

export interface AdminAuthResponse {
  success: boolean;
  session?: AdminSession;
  message?: string;
}

class AdminAuthServiceClass {
  private async simulateDelay(ms = 700): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(email: string, password: string): Promise<AdminAuthResponse> {
    await this.simulateDelay();
    // In production: POST /api/admin/auth/login
    if (!ADMIN_WHITELIST.includes(email.toLowerCase().trim())) {
      return { success: false, message: 'Unauthorized account' };
    }
    if (password !== ADMIN_PASSWORD) {
      return { success: false, message: 'Invalid credentials' };
    }
    const session: AdminSession = { email: email.toLowerCase().trim(), loginAt: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  logout(): void {
    // In production: POST /api/admin/auth/logout
    localStorage.removeItem(SESSION_KEY);
  }

  getSession(): AdminSession | null {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AdminSession;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}

export const AdminAuthService = new AdminAuthServiceClass();
