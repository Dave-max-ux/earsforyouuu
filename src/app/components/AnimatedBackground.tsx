/**
 * AnimatedBackground — subtle ambient depth
 */

import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div
        className="ef-ambient-orb absolute -top-[20%] -right-[10%] w-[55%] h-[55%] rounded-full opacity-[0.45] dark:opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, rgba(143, 201, 176, 0.4) 0%, transparent 70%)',
          animation: 'ef-drift 20s ease-in-out infinite',
        }}
      />
      <div
        className="ef-ambient-orb absolute -bottom-[15%] -left-[10%] w-[45%] h-[45%] rounded-full opacity-[0.35] dark:opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, rgba(95, 168, 160, 0.3) 0%, transparent 70%)',
          animation: 'ef-drift 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="ef-ambient-orb absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full opacity-[0.25] dark:opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, rgba(168, 212, 192, 0.35) 0%, transparent 70%)',
          animation: 'ef-drift 18s ease-in-out infinite 2s',
        }}
      />
      <style>{`
        @keyframes ef-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -1%) scale(1.03); }
          66% { transform: translate(-1%, 2%) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
