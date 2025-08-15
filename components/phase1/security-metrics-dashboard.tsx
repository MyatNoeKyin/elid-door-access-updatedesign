"use client";

import { useEffect, useState } from 'react';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Users,
  DoorOpen,
  Activity,
  ShieldCheck,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { useAlertStore, useDoorStore, useAccessEventStore } from '@/lib/state/store';
import { apiService } from '@/lib/api/api-service';
import { AccessMetrics } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  subValue?: string;
}

function MetricCard({ title, value, change, icon, status = 'neutral', subValue }: MetricCardProps) {
  const statusColors = {
    success: 'text-green-600 bg-green-50 dark:bg-green-950/20',
    warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20',
    danger: 'text-red-600 bg-red-50 dark:bg-red-950/20',
    neutral: 'text-gray-600 bg-gray-50 dark:bg-gray-950/20',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {subValue && (
                <span className="text-sm text-muted-foreground">{subValue}</span>
              )}
            </div>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(change)}%</span>
                <span className="text-muted-foreground">vs last hour</span>
              </div>
            )}
          </div>
          <div className={`rounded-full p-3 ${statusColors[status]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SecurityMetricsDashboard() {
  const { alerts } = useAlertStore();
  const { doors } = useDoorStore();
  const { recentEvents } = useAccessEventStore();
  const [metrics, setMetrics] = useState<AccessMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [complianceScore, setComplianceScore] = useState(92);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const [metricsData, healthData] = await Promise.all([
        apiService.getAccessMetrics(),
        apiService.getSystemHealth()
      ]);
      setMetrics(metricsData);
      setSystemHealth(healthData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setLoading(false);
    }
  };

  // Calculate threat level based on various factors
  const calculateThreatLevel = () => {
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length;
    const highAlerts = alerts.filter(a => a.severity === 'HIGH' && !a.acknowledged).length;
    const offlineDoors = doors.filter(d => !d.isOnline).length;
    const deniedAccess = metrics?.denied || 0;
    
    let score = 100;
    score -= criticalAlerts * 20;
    score -= highAlerts * 10;
    score -= offlineDoors * 5;
    score -= (deniedAccess > 10 ? 15 : deniedAccess);
    
    return Math.max(0, Math.min(100, score));
  };

  const threatLevel = calculateThreatLevel();
  const threatStatus = threatLevel >= 80 ? 'Low' : threatLevel >= 60 ? 'Medium' : threatLevel >= 40 ? 'High' : 'Critical';
  const threatColor = threatLevel >= 80 ? '#10B981' : threatLevel >= 60 ? '#F59E0B' : threatLevel >= 40 ? '#EF4444' : '#DC2626';

  // Prepare data for charts
  const accessTrendData = metrics?.trends || [];
  
  const doorStatusData = [
    { name: 'Locked', value: doors.filter(d => d.status === 'LOCKED').length, color: '#10B981' },
    { name: 'Unlocked', value: doors.filter(d => d.status === 'UNLOCKED').length, color: '#3B82F6' },
    { name: 'Offline', value: doors.filter(d => !d.isOnline).length, color: '#6B7280' },
    { name: 'Alert', value: doors.filter(d => d.status === 'FORCED_OPEN' || d.status === 'HELD_OPEN').length, color: '#EF4444' },
  ];

  const alertDistribution = [
    { name: 'Critical', value: alerts.filter(a => a.severity === 'CRITICAL').length, color: '#DC2626' },
    { name: 'High', value: alerts.filter(a => a.severity === 'HIGH').length, color: '#F59E0B' },
    { name: 'Medium', value: alerts.filter(a => a.severity === 'MEDIUM').length, color: '#3B82F6' },
    { name: 'Low', value: alerts.filter(a => a.severity === 'LOW').length, color: '#10B981' },
  ];

  const threatGaugeData = [
    { name: 'Threat Level', value: threatLevel, fill: threatColor }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Access Today"
          value={metrics?.totalAccess || 0}
          change={12}
          icon={<DoorOpen className="h-6 w-6" />}
          status="neutral"
        />
        <MetricCard
          title="Access Granted"
          value={metrics?.granted || 0}
          subValue={`${((metrics?.granted || 0) / (metrics?.totalAccess || 1) * 100).toFixed(1)}%`}
          change={5}
          icon={<CheckCircle className="h-6 w-6" />}
          status="success"
        />
        <MetricCard
          title="Access Denied"
          value={metrics?.denied || 0}
          change={-8}
          icon={<AlertTriangle className="h-6 w-6" />}
          status={metrics?.denied && metrics.denied > 50 ? 'danger' : 'warning'}
        />
        <MetricCard
          title="Active Alerts"
          value={alerts.filter(a => !a.acknowledged).length}
          subValue={`${alerts.length} total`}
          icon={<Shield className="h-6 w-6" />}
          status={alerts.filter(a => !a.acknowledged).length > 10 ? 'danger' : 'warning'}
        />
      </div>

      {/* Threat Level and Compliance */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Threat Level Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Security Threat Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={threatGaugeData}>
                  <RadialBar dataKey="value" cornerRadius={10} fill={threatColor} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                    {threatLevel}%
                  </text>
                  <text x="50%" y="50%" dy={25} textAnchor="middle" className="text-sm text-muted-foreground">
                    {threatStatus}
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Unacknowledged Alerts</span>
                <Badge variant={alerts.filter(a => !a.acknowledged).length > 5 ? 'destructive' : 'secondary'}>
                  {alerts.filter(a => !a.acknowledged).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Offline Doors</span>
                <Badge variant={doors.filter(d => !d.isOnline).length > 0 ? 'destructive' : 'secondary'}>
                  {doors.filter(d => !d.isOnline).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Anomalies Detected</span>
                <Badge variant={metrics?.anomalies && metrics.anomalies > 5 ? 'destructive' : 'secondary'}>
                  {metrics?.anomalies || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{complianceScore}%</span>
                  <Badge variant={complianceScore >= 90 ? 'default' : complianceScore >= 75 ? 'secondary' : 'destructive'}>
                    {complianceScore >= 90 ? 'Excellent' : complianceScore >= 75 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </div>
                <Progress value={complianceScore} className="h-3" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Access Policy Compliance</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Audit Trail Completeness</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credential Validity</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Uptime</span>
                  <span className="text-sm font-medium">{systemHealth?.uptime || 99.98}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="access" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="access">Access Trends</TabsTrigger>
          <TabsTrigger value="doors">Door Status</TabsTrigger>
          <TabsTrigger value="alerts">Alert Analysis</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Activity - Last 24 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={accessTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <ChartTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Door Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={doorStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {doorStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Door Activity by Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { zone: 'Main Lobby', accesses: 245 },
                    { zone: 'Office Area', accesses: 180 },
                    { zone: 'Server Room', accesses: 45 },
                    { zone: 'Laboratory', accesses: 67 },
                    { zone: 'Storage', accesses: 23 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="accesses" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={alertDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {alertDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Alert Summary</h4>
                  {alertDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value} alerts</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Alerts</span>
                      <span className="text-lg font-bold">{alerts.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">{systemHealth?.cpuUsage || 0}%</span>
                  </div>
                  <Progress value={systemHealth?.cpuUsage || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">{systemHealth?.memoryUsage || 0}%</span>
                  </div>
                  <Progress value={systemHealth?.memoryUsage || 0} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Active Connections</span>
                    <span className="text-sm font-medium">{systemHealth?.activeConnections || 0}</span>
                  </div>
                  <Progress value={(systemHealth?.activeConnections || 0) / 2} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WebSocket Server</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Controller Network</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup System</span>
                    <Badge variant="secondary">Standby</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last System Check</span>
                    <span className="text-sm text-muted-foreground">2 minutes ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}