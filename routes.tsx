/**
 * App Routes - React Router configuration with lazy loading and admin route guards
 */

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';

// ── Eager-loaded (critical path) ────────────────────────────────────────────
import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { VerifyEmailScreen } from './screens/VerifyEmailScreen';
import { AccountRecoveryScreen } from './screens/AccountRecoveryScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AdminRoute } from './components/AdminRoute';

// ── Lazy-loaded (on demand) ─────────────────────────────────────────────────
const MoodScreen = lazy(() => import('./screens/MoodScreen').then(m => ({ default: m.MoodScreen })));
const JournalScreen = lazy(() => import('./screens/JournalScreen').then(m => ({ default: m.JournalScreen })));
const InsightsScreen = lazy(() => import('./screens/InsightsScreen').then(m => ({ default: m.InsightsScreen })));
const SupportScreen = lazy(() => import('./screens/SupportScreen').then(m => ({ default: m.SupportScreen })));
const SOSScreen = lazy(() => import('./screens/SOSScreen').then(m => ({ default: m.SOSScreen })));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const ChatScreen = lazy(() => import('./screens/ChatScreen').then(m => ({ default: m.ChatScreen })));

// Account management
const AccountScreen = lazy(() => import('./screens/account/AccountScreen').then(m => ({ default: m.AccountScreen })));
const EditProfileScreen = lazy(() => import('./screens/account/EditProfileScreen').then(m => ({ default: m.EditProfileScreen })));
const SecurityScreen = lazy(() => import('./screens/account/SecurityScreen').then(m => ({ default: m.SecurityScreen })));
const PrivacyScreen = lazy(() => import('./screens/account/PrivacyScreen').then(m => ({ default: m.PrivacyScreen })));
const NotificationSettingsScreen = lazy(() => import('./screens/account/NotificationSettingsScreen').then(m => ({ default: m.NotificationSettingsScreen })));
const AppPreferencesScreen = lazy(() => import('./screens/account/AppPreferencesScreen').then(m => ({ default: m.AppPreferencesScreen })));
const DataManagementScreen = lazy(() => import('./screens/account/DataManagementScreen').then(m => ({ default: m.DataManagementScreen })));

// Admin
const AdminLoginScreen = lazy(() => import('./screens/admin/AdminLoginScreen').then(m => ({ default: m.AdminLoginScreen })));
const AdminDashboardScreen = lazy(() => import('./screens/account/AdminDashboardScreen').then(m => ({ default: m.AdminDashboardScreen })));

const Loader = () => (
  <div className="min-h-screen app-bg-gradient flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // ── Auth / onboarding ──────────────────────────────────────────────────────
  { path: '/', element: <SplashScreen /> },
  { path: '/welcome', element: <WelcomeScreen /> },
  { path: '/login', element: <LoginScreen /> },
  { path: '/signup', element: <SignupScreen /> },
  { path: '/forgot-password', element: <ForgotPasswordScreen /> },
  { path: '/verify-email', element: <VerifyEmailScreen /> },
  { path: '/account-recovery', element: <AccountRecoveryScreen /> },

  // ── Main app ───────────────────────────────────────────────────────────────
  { path: '/home', element: <HomeScreen /> },
  { path: '/mood', element: <Lazy><MoodScreen /></Lazy> },
  { path: '/journal', element: <Lazy><JournalScreen /></Lazy> },
  { path: '/insights', element: <Lazy><InsightsScreen /></Lazy> },
  { path: '/support', element: <Lazy><SupportScreen /></Lazy> },
  { path: '/sos', element: <Lazy><SOSScreen /></Lazy> },
  { path: '/profile', element: <Lazy><ProfileScreen /></Lazy> },
  { path: '/chat', element: <Lazy><ChatScreen /></Lazy> },

  // ── Account management ─────────────────────────────────────────────────────
  { path: '/account', element: <Lazy><AccountScreen /></Lazy> },
  { path: '/account/profile', element: <Lazy><EditProfileScreen /></Lazy> },
  { path: '/account/security', element: <Lazy><SecurityScreen /></Lazy> },
  { path: '/account/privacy', element: <Lazy><PrivacyScreen /></Lazy> },
  { path: '/account/notifications', element: <Lazy><NotificationSettingsScreen /></Lazy> },
  { path: '/account/preferences', element: <Lazy><AppPreferencesScreen /></Lazy> },
  { path: '/account/data', element: <Lazy><DataManagementScreen /></Lazy> },

  // ── Admin (protected) ──────────────────────────────────────────────────────
  { path: '/admin/login', element: <Lazy><AdminLoginScreen /></Lazy> },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <Lazy><AdminDashboardScreen /></Lazy>
      </AdminRoute>
    ),
  },

  { path: '*', element: <SplashScreen /> },
]);
