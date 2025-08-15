"use client";

import { ConnectionStatus } from '@/components/phase1/connection-status';
import { AlertDashboard } from '@/components/phase1/alert-dashboard';
import { EmergencyResponse } from '@/components/phase1/emergency-response';
import { InteractiveFloorPlan } from '@/components/phase1/interactive-floor-plan';
import { SecurityMetricsDashboard } from '@/components/phase1/security-metrics-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Map, AlertTriangle, Activity, Siren } from 'lucide-react';

export default function RealTimeMonitoringPage() {
  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Security Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor live security events, door status, and system alerts
          </p>
        </div>
        <ConnectionStatus />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="floorplan" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Floor Plan
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <Siren className="h-4 w-4" />
            Emergency
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Compact Alert Dashboard */}
            <AlertDashboard compact />
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Online Doors</p>
                    <p className="text-2xl font-bold">28/30</p>
                    <Badge variant="default">93.3%</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">342</p>
                    <Badge variant="secondary">In Building</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Today's Access</p>
                    <p className="text-2xl font-bold">1,234</p>
                    <Badge variant="outline">+12% vs avg</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Security Score</p>
                    <p className="text-2xl font-bold">92%</p>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Floor Plan Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Floor 1 - Live View</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <InteractiveFloorPlan floorId="floor-1" showHeatmap />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <AlertDashboard />
        </TabsContent>

        {/* Floor Plan Tab */}
        <TabsContent value="floorplan" className="space-y-6">
          <div className="grid gap-6">
            <InteractiveFloorPlan floorId="floor-1" />
            <InteractiveFloorPlan floorId="floor-2" />
            <InteractiveFloorPlan floorId="floor-3" />
          </div>
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
  );
}