/**
 * ResponsiveLayout - Adaptive container for mobile/tablet/desktop
 */

import React, { ReactNode } from 'react';
import { useLocation } from 'react-router';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const location = useLocation();
  
  // Full screen routes (no container)
  const fullScreenRoutes = ['/', '/welcome', '/login', '/signup', '/forgot-password'];
  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  if (isFullScreen) {
    return <>{children}</>;
  }

  // App routes get a centered container on desktop
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl">
        {children}
      </div>
    </div>
  );
}
