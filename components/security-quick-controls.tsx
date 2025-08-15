"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Unlock, 
  Shield, 
  Siren, 
  Camera, 
  DoorOpen,
  AlertTriangle,
  UserX,
  ChevronRight
} from 'lucide-react';

export function SecurityQuickControls() {
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [afterHoursMode, setAfterHoursMode] = useState(false);
  const [visitorRestriction, setVisitorRestriction] = useState(false);
  const [enhancedMonitoring, setEnhancedMonitoring] = useState(true);

  const quickActions = [
    {
      icon: <Lock className="h-5 w-5" />,
      label: "Lock All Doors",
      description: "Secure all access points",
      variant: "default" as const,
      action: () => console.log("Locking all doors...")
    },
    {
      icon: <Unlock className="h-5 w-5" />,
      label: "Unlock Main Entrance",
      description: "Temporary 5-min access",
      variant: "secondary" as const,
      action: () => console.log("Unlocking main entrance...")
    },
    {
      icon: <UserX className="h-5 w-5" />,
      label: "Revoke Access",
      description: "Emergency credential block",
      variant: "destructive" as const,
      action: () => console.log("Opening revoke access...")
    },
    {
      icon: <Camera className="h-5 w-5" />,
      label: "Camera Control",
      description: "View security cameras",
      variant: "outline" as const,
      action: () => console.log("Opening camera control...")
    }
  ];

  const securityModes = [
    {
      id: 'emergency',
      label: 'Emergency Lockdown',
      description: 'Lock all doors, alert security',
      enabled: emergencyLockdown,
      onChange: setEmergencyLockdown,
      color: 'destructive'
    },
    {
      id: 'afterhours',
      label: 'After Hours Mode',
      description: 'Restricted access, heightened alerts',
      enabled: afterHoursMode,
      onChange: setAfterHoursMode,
      color: 'warning'
    },
    {
      id: 'visitor',
      label: 'Visitor Restriction',
      description: 'No temporary badges allowed',
      enabled: visitorRestriction,
      onChange: setVisitorRestriction,
      color: 'default'
    },
    {
      id: 'monitoring',
      label: 'Enhanced Monitoring',
      description: 'AI-powered threat detection',
      enabled: enhancedMonitoring,
      onChange: setEnhancedMonitoring,
      color: 'success'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Quick Controls
        </CardTitle>
        <CardDescription>
          Immediate access to critical security functions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto flex-col items-start justify-start p-4 space-y-2"
                onClick={action.action}
              >
                <div className="flex items-center justify-between w-full">
                  {action.icon}
                  <ChevronRight className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Security Modes */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Security Modes</h3>
          <div className="space-y-3">
            {securityModes.map((mode) => (
              <div
                key={mode.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  mode.enabled 
                    ? mode.color === 'destructive' 
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                      : mode.color === 'warning'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                      : mode.color === 'success'
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Switch
                    id={mode.id}
                    checked={mode.enabled}
                    onCheckedChange={mode.onChange}
                  />
                  <Label htmlFor={mode.id} className="cursor-pointer">
                    <div className="font-medium">{mode.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {mode.description}
                    </div>
                  </Label>
                </div>
                {mode.enabled && (
                  <Badge 
                    variant={mode.color === 'destructive' ? 'destructive' : 'default'}
                    className="animate-pulse"
                  >
                    ACTIVE
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Button */}
        {emergencyLockdown && (
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              size="lg" 
              className="w-full gap-2"
              onClick={() => setEmergencyLockdown(false)}
            >
              <Siren className="h-5 w-5 animate-pulse" />
              DEACTIVATE EMERGENCY LOCKDOWN
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}