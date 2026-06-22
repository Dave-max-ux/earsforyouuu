/**
 * EarsForYou — Emotional Wellness Application
 */

import { RouterProvider } from 'react-router';
import { MotionConfig } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import { AppProvider, useApp } from './context/AppContext';
import { router } from './routes';

function AppShell() {
  const { preferences } = useApp();

  return (
    <MotionConfig reducedMotion={preferences.accessibilityReduceMotion ? 'always' : 'user'}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </MotionConfig>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
