/**
 * AdminRoute - Route guard that silently redirects non-admins to /home
 * Prevents content flash: renders nothing until auth is confirmed.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminAuthService } from '../services/AdminAuthService';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // In production: validate token with /api/admin/auth/verify
    const auth = AdminAuthService.isAuthenticated();
    if (!auth) {
      navigate('/home', { replace: true });
    } else {
      setAuthorized(true);
    }
    setChecked(true);
  }, [navigate]);

  if (!checked || !authorized) return null;
  return <>{children}</>;
}
