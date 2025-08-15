"use client";

import { useState } from 'react';
import { ConnectionStatus } from '@/components/phase1/connection-status';
import { AlertDashboard } from '@/components/phase1/alert-dashboard';
import { EmergencyResponse } from '@/components/phase1/emergency-response';
import { InteractiveFloorPlan } from '@/components/phase1/interactive-floor-plan';
import { SecurityMetricsDashboard } from '@/components/phase1/security-metrics-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  DoorOpen, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Clock,
  ShieldCheck,
  Siren,
  Map,
  BarChart3,
  Lock,
  Unlock,
  UserX,
  CheckCircle
} from 'lucide-react';

export default function SecurityDashboard() {
  const [selectedFloor, setSelectedFloor] = useState('floor-1');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  // Mock data for demonstration
  const securityStats = {
    activeThreats: 2,
    resolvedToday: 14,
    averageResponseTime: '1.2 min',
    complianceScore: 92,
    activeUsers: 342,
    lockedDoors: 28,
    unlockedDoors: 2,
    offlineDoors: 0,
  };

  const recentIncidents = [
    { id: 1, type: 'forced_entry', location: 'Server Room', time: '2 min ago', severity: 'critical' },
    { id: 2, type: 'tailgating', location: 'Main Entrance', time: '15 min ago', severity: 'warning' },
    { id: 3, type: 'credential_expired', location: 'Lab Access', time: '1 hour ago', severity: 'info' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Mode Overlay */}
      {isEmergencyMode && (
        <div className="fixed inset-0 bg-red-900/20 z-50 pointer-events-none">
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Badge variant="destructive" className="text-lg px-4 py-2 animate-pulse">
              EMERGENCY MODE ACTIVE
            </Badge>
          </div>
        </div>
      )}

      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              Enterprise Security Command Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring and control for 10,000+ access points
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ConnectionStatus />
            <Button 
              variant={isEmergencyMode ? "destructive" : "outline"}
              size="lg"
              onClick={() => setIsEmergencyMode(!isEmergencyMode)}
              className="gap-2"
            >
              <Siren className="h-5 w-5" />
              {isEmergencyMode ? "Deactivate Emergency" : "Emergency Mode"}
            </Button>
          </div>
        </div>

        {/* Critical Metrics Bar */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Active Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{securityStats.activeThreats}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-500/50 bg-green-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Resolved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{securityStats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Average: {securityStats.averageResponseTime}</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-blue-500/50 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{securityStats.complianceScore}%</div>
              <Progress value={securityStats.complianceScore} className="mt-2 h-2" />
            </CardContent>
          </Card>
          
          <Card className="border-2 border-orange-500/50 bg-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{securityStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in building</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="floorplan" className="gap-2">
              <Map className="h-4 w-4" />
              Floor Plans
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2">
              <Siren className="h-4 w-4" />
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Door Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status Overview</CardTitle>
                  <CardDescription>Real-time door and access point status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Locked & Secure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{securityStats.lockedDoors}</span>
                        <Badge variant="outline" className="text-green-600">Normal</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Unlock className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Unlocked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{securityStats.unlockedDoors}</span>
                        <Badge variant="outline" className="text-orange-600">Monitor</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserX className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Offline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{securityStats.offlineDoors}</span>
                        <Badge variant="outline" className="text-gray-600">None</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Incidents */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Incidents</CardTitle>
                  <CardDescription>Latest events requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentIncidents.map((incident) => (
                      <div 
                        key={incident.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          incident.severity === 'critical' 
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                            : incident.severity === 'warning'
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            incident.severity === 'critical' 
                              ? 'bg-red-100 dark:bg-red-900/50' 
                              : incident.severity === 'warning'
                              ? 'bg-orange-100 dark:bg-orange-900/50'
                              : 'bg-blue-100 dark:bg-blue-900/50'
                          }`}>
                            {incident.type === 'forced_entry' && <DoorOpen className="h-4 w-4" />}
                            {incident.type === 'tailgating' && <Users className="h-4 w-4" />}
                            {incident.type === 'credential_expired' && <Clock className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {incident.type.replace('_', ' ').charAt(0).toUpperCase() + 
                               incident.type.replace('_', ' ').slice(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">{incident.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{incident.time}</p>
                          <Button size="sm" variant="ghost">Investigate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compact Metrics */}
            <SecurityMetricsDashboard />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <AlertDashboard />
          </TabsContent>

          {/* Floor Plan Tab */}
          <TabsContent value="floorplan" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Interactive Floor Plans</h3>
              <div className="flex gap-2">
                <Button 
                  variant={selectedFloor === 'floor-1' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFloor('floor-1')}
                >
                  Floor 1
                </Button>
                <Button 
                  variant={selectedFloor === 'floor-2' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFloor('floor-2')}
                >
                  Floor 2
                </Button>
                <Button 
                  variant={selectedFloor === 'floor-3' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFloor('floor-3')}
                >
                  Floor 3
                </Button>
              </div>
            </div>
            <InteractiveFloorPlan floorId={selectedFloor} showHeatmap />
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <SecurityMetricsDashboard />
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency">
            <EmergencyResponse />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}