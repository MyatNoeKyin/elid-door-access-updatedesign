"use client";

import { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Phone, 
  Siren,
  AlertTriangle,
  Users,
  MapPin,
  Timer
} from 'lucide-react';
import { useEmergencyStore, useZoneStore, useDoorStore, useAlertStore } from '@/lib/state/store';
import { Zone, Door, DoorStatus, AlertType, AlertSeverity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/lib/api/api-service';
import { getWebSocketService } from '@/lib/services/websocket';
import { WebSocketMessageType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function EmergencyResponse() {
  const { isEmergencyMode, emergencyZones, activateEmergency, deactivateEmergency } = useEmergencyStore();
  const { zones } = useZoneStore();
  const { doors, updateMultipleDoors } = useDoorStore();
  const { addAlert } = useAlertStore();
  const { toast } = useToast();
  
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lockdownProgress, setLockdownProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [evacuationMode, setEvacuationMode] = useState(false);

  useEffect(() => {
    // Load zones if not already loaded
    if (zones.length === 0) {
      apiService.getZones().then(zones => {
        useZoneStore.getState().setZones(zones);
      });
    }
  }, [zones.length]);

  const handleEmergencyLockdown = async () => {
    setIsProcessing(true);
    setLockdownProgress(0);
    
    try {
      // Send emergency lockdown message via WebSocket
      const ws = getWebSocketService();
      ws.send({
        type: WebSocketMessageType.EMERGENCY_LOCKDOWN,
        payload: {
          zones: selectedZones.length > 0 ? selectedZones : 'ALL',
          evacuationMode,
          timestamp: new Date(),
        },
        timestamp: new Date(),
      });

      // Lock doors via API
      const lockedDoors = await apiService.lockAllDoors(
        selectedZones.length > 0 ? selectedZones : undefined
      );
      
      // Update progress
      const totalDoors = lockedDoors.length;
      let processedDoors = 0;
      
      // Simulate progressive lockdown
      const progressInterval = setInterval(() => {
        processedDoors += Math.ceil(totalDoors / 10);
        const progress = Math.min((processedDoors / totalDoors) * 100, 100);
        setLockdownProgress(progress);
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          
          // Update door states
          updateMultipleDoors(lockedDoors);
          
          // Activate emergency mode
          activateEmergency(selectedZones);
          
          // Create emergency alert
          addAlert({
            id: `alert-emergency-${Date.now()}`,
            type: AlertType.EMERGENCY,
            severity: AlertSeverity.CRITICAL,
            title: 'Emergency Lockdown Activated',
            message: `${selectedZones.length > 0 ? 'Partial' : 'Full'} lockdown initiated. ${lockedDoors.length} doors secured.`,
            timestamp: new Date(),
            acknowledged: false,
          });
          
          toast({
            title: "Emergency Lockdown Activated",
            description: `${lockedDoors.length} doors have been secured.`,
            variant: "destructive",
          });
          
          setIsProcessing(false);
          setShowConfirmDialog(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('Emergency lockdown failed:', error);
      toast({
        title: "Lockdown Failed",
        description: "Unable to complete emergency lockdown. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleDeactivateEmergency = async () => {
    setIsProcessing(true);
    
    try {
      // Deactivate emergency mode
      deactivateEmergency();
      
      // Send deactivation message
      const ws = getWebSocketService();
      ws.send({
        type: WebSocketMessageType.EMERGENCY_LOCKDOWN,
        payload: {
          action: 'DEACTIVATE',
          timestamp: new Date(),
        },
        timestamp: new Date(),
      });
      
      // Create alert
      addAlert({
        id: `alert-emergency-clear-${Date.now()}`,
        type: AlertType.EMERGENCY,
        severity: AlertSeverity.HIGH,
        title: 'Emergency Lockdown Deactivated',
        message: 'Emergency mode has been cleared. Normal operations resumed.',
        timestamp: new Date(),
        acknowledged: false,
      });
      
      toast({
        title: "Emergency Cleared",
        description: "Emergency lockdown has been deactivated.",
      });
      
      setSelectedZones([]);
      setEvacuationMode(false);
    } catch (error) {
      console.error('Failed to deactivate emergency:', error);
      toast({
        title: "Deactivation Failed",
        description: "Unable to clear emergency mode. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleZoneSelection = (zoneId: string) => {
    setSelectedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const emergencyContacts = [
    { name: 'Security Chief', number: '+1-555-0001', role: 'Primary' },
    { name: 'Police Department', number: '911', role: 'External' },
    { name: 'Fire Department', number: '911', role: 'External' },
    { name: 'Building Manager', number: '+1-555-0002', role: 'Secondary' },
  ];

  return (
    <>
      <div className="grid gap-6">
        {/* Emergency Status Card */}
        <Card className={`border-2 ${isEmergencyMode ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-border'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-3 ${isEmergencyMode ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                  {isEmergencyMode ? <Siren className="h-6 w-6 animate-pulse" /> : <Shield className="h-6 w-6" />}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {isEmergencyMode ? 'EMERGENCY MODE ACTIVE' : 'Emergency Response System'}
                  </CardTitle>
                  <CardDescription>
                    {isEmergencyMode 
                      ? `Lockdown active in ${emergencyZones.length || 'all'} zones` 
                      : 'All systems operating normally'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEmergencyMode ? (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleDeactivateEmergency}
                    disabled={isProcessing}
                  >
                    <Unlock className="mr-2 h-5 w-5" />
                    Deactivate Emergency
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isProcessing}
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Activate Emergency Lockdown
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Zone Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Zone Control
              </CardTitle>
              <CardDescription>
                Select specific zones for targeted lockdown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="select-all">Select All Zones</Label>
                <Switch
                  id="select-all"
                  checked={selectedZones.length === zones.length && zones.length > 0}
                  onCheckedChange={(checked) => {
                    setSelectedZones(checked ? zones.map(z => z.id) : []);
                  }}
                />
              </div>
              <div className="space-y-3">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`rounded-lg border p-3 ${
                      selectedZones.includes(zone.id) ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedZones.includes(zone.id)}
                          onCheckedChange={() => toggleZoneSelection(zone.id)}
                        />
                        <div>
                          <p className="font-medium">{zone.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {zone.occupancy} people
                            </span>
                            <span>
                              {zone.doors.length} doors
                            </span>
                            <Badge variant={zone.activeAlerts > 0 ? "destructive" : "secondary"}>
                              {zone.activeAlerts} alerts
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        zone.securityLevel === 'CRITICAL' ? 'destructive' :
                        zone.securityLevel === 'HIGH' ? 'default' :
                        'secondary'
                      }>
                        {zone.securityLevel}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Options & Contacts */}
          <div className="space-y-6">
            {/* Emergency Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="evacuation-mode">Evacuation Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep exit doors unlocked for evacuation
                    </p>
                  </div>
                  <Switch
                    id="evacuation-mode"
                    checked={evacuationMode}
                    onCheckedChange={setEvacuationMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="silent-mode">Silent Alarm</Label>
                    <p className="text-sm text-muted-foreground">
                      Activate without audible alerts
                    </p>
                  </div>
                  <Switch id="silent-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-notify">Auto-Notify Authorities</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically contact emergency services
                    </p>
                  </div>
                  <Switch id="auto-notify" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.number}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{contact.role}</Badge>
                        <Button size="sm" variant="ghost">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Emergency Status */}
        {isEmergencyMode && (
          <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <Timer className="h-5 w-5" />
                Emergency Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Affected Zones</p>
                    <p className="text-2xl font-bold">{emergencyZones.length || 'All'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Locked Doors</p>
                    <p className="text-2xl font-bold">
                      {doors.filter(d => d.status === DoorStatus.LOCKED).length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-2xl font-bold">
                      <Timer className="inline h-5 w-5" /> Active
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="destructive" className="text-lg">LOCKDOWN</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              Confirm Emergency Lockdown
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                You are about to activate emergency lockdown for{' '}
                <strong>
                  {selectedZones.length === 0 
                    ? 'ALL ZONES' 
                    : `${selectedZones.length} selected zone(s)`}
                </strong>.
              </p>
              <p>This action will:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Immediately lock all doors in affected zones</li>
                <li>Trigger emergency alerts to all operators</li>
                <li>Notify emergency contacts</li>
                {evacuationMode && <li>Keep exit doors unlocked for evacuation</li>}
              </ul>
              <p className="font-semibold">Are you sure you want to proceed?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmergencyLockdown}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <>
                  <Siren className="mr-2 h-4 w-4 animate-pulse" />
                  Activating... {Math.round(lockdownProgress)}%
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Activate Lockdown
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
          {isProcessing && (
            <Progress value={lockdownProgress} className="mt-2" />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}