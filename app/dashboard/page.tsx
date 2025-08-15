"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Building, DoorClosed, AlertTriangle, Clock, ShieldAlert, Shield, Activity, TrendingUp, Lock, Unlock, UserCheck, Siren } from "lucide-react"
import RecentActivityTable from "@/components/recent-activity-table"
import DoorStatusGrid from "@/components/door-status-grid"
import { ConnectionStatus } from '@/components/phase1/connection-status'
import Link from 'next/link'

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [threatLevel, setThreatLevel] = useState('normal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-950';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-950';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950';
      default: return 'text-green-600 bg-green-100 dark:bg-green-950';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Security Operations Center
          </h1>
          <p className="text-muted-foreground mt-1">
            System Status: {mounted && currentTime ? currentTime.toLocaleString() : 'Loading...'} • Monitoring 30 doors across 3 floors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <div className={`px-4 py-2 rounded-lg ${getThreatLevelColor()}`}>
            <span className="text-sm font-medium">Threat Level: {threatLevel.toUpperCase()}</span>
          </div>
          <Link href="/dashboard/security-dashboard">
            <Button variant="default" className="gap-2">
              <Activity className="h-4 w-4" />
              Command Center
            </Button>
          </Link>
        </div>
      </div>

      {/* Security Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secure Doors</CardTitle>
            <Lock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">28/30</div>
            <Progress value={93} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">93% secured</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">342</div>
            <p className="text-xs text-muted-foreground">Currently in building</p>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+15% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Events</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">1,248</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
            <div className="text-xs mt-1">Peak: 10:00 AM</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">3</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">1 Critical</Badge>
              <Badge variant="outline" className="text-xs">2 Medium</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">98%</div>
            <Progress value={98} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Alert Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
          <Siren className="h-4 w-4 text-red-600 animate-pulse" />
          <AlertTitle className="text-red-800 dark:text-red-400">Critical Security Alert</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-300">
            Unauthorized access attempt detected at Server Room. Security team has been dispatched.
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="destructive">View Details</Button>
              <Button size="sm" variant="outline">Acknowledge</Button>
            </div>
          </AlertDescription>
        </Alert>
        
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 dark:text-blue-400">Scheduled Maintenance</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Door controller firmware update scheduled for tonight at 2:00 AM. Affected doors: Main Entrance, Parking Gate.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest access events across all doors</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityTable />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Door Status</CardTitle>
            <CardDescription>Real-time status of all access points</CardDescription>
          </CardHeader>
          <CardContent>
            <DoorStatusGrid />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="security-events" className="mt-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="security-events" className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Security Events
          </TabsTrigger>
          <TabsTrigger value="access-logs" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Access Logs
          </TabsTrigger>
          <TabsTrigger value="system-alerts" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            System Alerts
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="security-events" className="space-y-4 pt-4">
          <div className="space-y-3">
            {/* Critical Alert */}
            <div className="flex items-center p-4 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/20">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
                <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />
              </div>
              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-red-800 dark:text-red-400">Forced Entry Detected</h4>
                  <Badge variant="destructive">CRITICAL</Badge>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">Server Room Door - 2 minutes ago</p>
                <p className="text-xs text-muted-foreground mt-1">Security team notified • Response time: 45 seconds</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="destructive">Respond</Button>
                <Button size="sm" variant="outline">Details</Button>
              </div>
            </div>
            
            {/* Warning Alert */}
            <div className="flex items-center p-4 rounded-lg border border-orange-400 bg-orange-50 dark:bg-orange-950/20">
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-400">Door Held Open</h4>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">WARNING</Badge>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">Loading Dock B - Open for 5:23</p>
                <p className="text-xs text-muted-foreground mt-1">Authorized by: John Smith (Maintenance)</p>
              </div>
              <Button size="sm" variant="outline" className="ml-4">Override</Button>
            </div>
            
            {/* Info Alert */}
            <div className="flex items-center p-4 rounded-lg border border-blue-400 bg-blue-50 dark:bg-blue-950/20">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-400">Tailgating Detected</h4>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">MEDIUM</Badge>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">Main Entrance - 15 minutes ago</p>
                <p className="text-xs text-muted-foreground mt-1">2 unauthorized entries following authorized badge</p>
              </div>
              <Button size="sm" variant="outline" className="ml-4">Review</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="access-logs" className="pt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Access Activity</CardTitle>
              <CardDescription>Real-time access log monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { user: "Alice Johnson", door: "Main Entrance", time: "09:45:23", status: "granted" },
                  { user: "Bob Smith", door: "Server Room", time: "09:44:15", status: "denied" },
                  { user: "Carol Williams", door: "Lab Access", time: "09:43:47", status: "granted" },
                  { user: "David Brown", door: "Executive Floor", time: "09:42:12", status: "granted" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${log.status === 'granted' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="font-medium text-sm">{log.user}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{log.door}</span>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system-alerts" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">System performing optimally</p>
                <p className="text-sm text-muted-foreground mt-2">Last system scan: 5 minutes ago</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="pt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Compliance Status</CardTitle>
              <CardDescription>Security compliance metrics and audit readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">ISO 27001 Compliance</span>
                    <span className="text-sm font-bold text-green-600">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">SOC 2 Type II</span>
                    <span className="text-sm font-bold text-green-600">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Audit Trail Completeness</span>
                    <span className="text-sm font-bold text-green-600">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
