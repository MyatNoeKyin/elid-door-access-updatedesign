"use client";

import { useEffect, useState } from 'react';
import { Bell, BellOff, Check, X, AlertTriangle, Info, ShieldAlert, Siren } from 'lucide-react';
import { useAlertStore } from '@/lib/state/store';
import { Alert, AlertSeverity, AlertType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { getWebSocketService } from '@/lib/services/websocket';
import { WebSocketMessageType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AlertDashboardProps {
  compact?: boolean;
}

export function AlertDashboard({ compact = false }: AlertDashboardProps) {
  const { alerts, unacknowledgedCount, addAlert, acknowledgeAlert, clearAlert } = useAlertStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'ALL'>('ALL');
  const { toast } = useToast();

  useEffect(() => {
    const ws = getWebSocketService();
    
    // Subscribe to new alerts
    const unsubscribe = ws.subscribe(WebSocketMessageType.NEW_ALERT, (message) => {
      const alert = message.payload as Alert;
      addAlert(alert);
      
      // Show toast notification for high severity alerts
      if (alert.severity === AlertSeverity.CRITICAL || alert.severity === AlertSeverity.HIGH) {
        toast({
          title: alert.title,
          description: alert.message,
          variant: "destructive",
        });
        
        // Play sound if enabled
        if (soundEnabled) {
          playAlertSound(alert.severity);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [addAlert, soundEnabled, toast]);

  const playAlertSound = (severity: AlertSeverity) => {
    // In a real implementation, you would play different sounds based on severity
    const audio = new Audio('/sounds/alert.mp3');
    audio.volume = severity === AlertSeverity.CRITICAL ? 1.0 : 0.7;
    audio.play().catch(console.error);
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <Siren className="h-4 w-4" />;
      case AlertSeverity.HIGH:
        return <ShieldAlert className="h-4 w-4" />;
      case AlertSeverity.MEDIUM:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return 'bg-red-500 hover:bg-red-600';
      case AlertSeverity.HIGH:
        return 'bg-orange-500 hover:bg-orange-600';
      case AlertSeverity.MEDIUM:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case AlertSeverity.LOW:
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.EMERGENCY:
        return '🚨';
      case AlertType.SECURITY:
        return '🔒';
      case AlertType.ACCESS:
        return '🚪';
      case AlertType.SYSTEM:
        return '⚙️';
      default:
        return '📢';
    }
  };

  const filteredAlerts = filterSeverity === 'ALL' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filterSeverity);

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Sort by acknowledgment status first (unacknowledged first)
    if (a.acknowledged !== b.acknowledged) {
      return a.acknowledged ? 1 : -1;
    }
    
    // Then by severity
    const severityOrder = {
      [AlertSeverity.CRITICAL]: 0,
      [AlertSeverity.HIGH]: 1,
      [AlertSeverity.MEDIUM]: 2,
      [AlertSeverity.LOW]: 3,
      [AlertSeverity.INFO]: 4,
    };
    
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    
    // Finally by timestamp (newest first)
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, 'current-user'); // In real app, get from auth
  };

  if (compact) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <Badge variant="destructive">
              {unacknowledgedCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-2 p-4 pt-0">
              {sortedAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-3 ${
                    !alert.acknowledged ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 ${getSeverityColor(alert.severity)} rounded-full p-1 text-white`}>
                        {getSeverityIcon(alert.severity)}
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {alert.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Alert Management Center</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="sound-toggle" className="text-sm">
                Sound Alerts
              </Label>
              <Switch
                id="sound-toggle"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
              {soundEnabled ? (
                <Bell className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <Badge variant="destructive" className="text-lg px-3 py-1">
              {unacknowledgedCount} Unacknowledged
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ALL" onValueChange={(value) => setFilterSeverity(value as AlertSeverity | 'ALL')}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="ALL">All ({alerts.length})</TabsTrigger>
            <TabsTrigger value={AlertSeverity.CRITICAL}>
              Critical ({alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length})
            </TabsTrigger>
            <TabsTrigger value={AlertSeverity.HIGH}>
              High ({alerts.filter(a => a.severity === AlertSeverity.HIGH).length})
            </TabsTrigger>
            <TabsTrigger value={AlertSeverity.MEDIUM}>
              Medium ({alerts.filter(a => a.severity === AlertSeverity.MEDIUM).length})
            </TabsTrigger>
            <TabsTrigger value={AlertSeverity.LOW}>
              Low ({alerts.filter(a => a.severity === AlertSeverity.LOW).length})
            </TabsTrigger>
            <TabsTrigger value={AlertSeverity.INFO}>
              Info ({alerts.filter(a => a.severity === AlertSeverity.INFO).length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={filterSeverity} className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {sortedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-lg border p-4 transition-all ${
                      !alert.acknowledged 
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20 shadow-sm' 
                        : 'opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getTypeIcon(alert.type)}</span>
                          <span className={`${getSeverityColor(alert.severity)} rounded-full p-2 text-white`}>
                            {getSeverityIcon(alert.severity)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-semibold">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                            </span>
                            {alert.relatedEntityId && (
                              <span>
                                Related: {alert.relatedEntityType} #{alert.relatedEntityId}
                              </span>
                            )}
                            {alert.acknowledged && alert.acknowledgedBy && (
                              <span className="text-green-600 dark:text-green-400">
                                ✓ Acknowledged by {alert.acknowledgedBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!alert.acknowledged ? (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Acknowledge
                          </Button>
                        ) : (
                          <Badge variant="secondary">Acknowledged</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => clearAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}