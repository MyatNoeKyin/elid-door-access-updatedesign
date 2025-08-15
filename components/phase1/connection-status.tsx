"use client";

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getWebSocketService } from '@/lib/services/websocket';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ConnectionStatus() {
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED');
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const ws = getWebSocketService();
    
    // Check connection state every second
    const interval = setInterval(() => {
      const state = ws.getConnectionState();
      setConnectionState(state);
      setIsReconnecting(state === 'CONNECTING');
    }, 1000);

    // Initial connection
    ws.connect().catch(console.error);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleReconnect = () => {
    const ws = getWebSocketService();
    ws.connect().catch(console.error);
  };

  const getStatusColor = () => {
    switch (connectionState) {
      case 'CONNECTED':
        return 'bg-green-500';
      case 'CONNECTING':
        return 'bg-yellow-500';
      case 'DISCONNECTED':
      case 'CLOSING':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionState) {
      case 'CONNECTED':
        return <Wifi className="h-4 w-4" />;
      case 'CONNECTING':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1.5 px-2 py-1 ${
                connectionState === 'CONNECTED'
                  ? 'border-green-500 text-green-700 dark:text-green-400'
                  : connectionState === 'CONNECTING'
                  ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
                  : 'border-red-500 text-red-700 dark:text-red-400'
              }`}
            >
              <div className={`h-2 w-2 rounded-full ${getStatusColor()} ${
                isReconnecting ? 'animate-pulse' : ''
              }`} />
              {getStatusIcon()}
              <span className="text-xs font-medium">
                {connectionState === 'CONNECTED' ? 'Live' : 
                 connectionState === 'CONNECTING' ? 'Connecting' : 
                 'Offline'}
              </span>
            </Badge>
            {connectionState === 'DISCONNECTED' && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReconnect}
                className="h-7 px-2 text-xs"
              >
                Reconnect
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>WebSocket {connectionState.toLowerCase()}</p>
          {connectionState === 'CONNECTED' && (
            <p className="text-xs text-muted-foreground">Real-time updates active</p>
          )}
          {connectionState === 'DISCONNECTED' && (
            <p className="text-xs text-muted-foreground">Click reconnect to restore live updates</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}