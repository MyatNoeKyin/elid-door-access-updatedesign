"use client";

import { useEffect } from 'react';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Import mock WebSocket in development
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/services/mock-websocket');
    }
  }, []);

  return <>{children}</>;
}