"use client";

import { useEffect } from 'react';

export function WebSocketInit() {
  useEffect(() => {
    // Only in development and on client side
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      // Dynamically import to avoid SSR issues
      import('@/lib/services/mock-websocket').then((module) => {
        (window as any).WebSocket = module.MockWebSocket;
        console.log('MockWebSocket initialized for development');
      });
    }
  }, []);

  return null;
}