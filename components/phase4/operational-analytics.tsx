"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  Activity,
  TrendingUp,
  Clock,
  Users,
  DoorOpen,
  BarChart3,
  Calendar,
  Download,
  Filter,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Zap
} from 'lucide-react';
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import { DateRange } from 'react-day-picker';

// Mock data
const peakUsageData = [
  { hour: '00:00', monday: 5, tuesday: 4, wednesday: 6, thursday: 5, friday: 4, saturday: 2, sunday: 1 },
  { hour: '06:00', monday: 15, tuesday: 18, wednesday: 16, thursday: 17, friday: 15, saturday: 8, sunday: 5 },
  { hour: '08:00', monday: 85, tuesday: 88, wednesday: 90, thursday: 87, friday: 82, saturday: 25, sunday: 15 },
  { hour: '10:00', monday: 65, tuesday: 68, wednesday: 70, thursday: 66, friday: 64, saturday: 35, sunday: 20 },
  { hour: '12:00', monday: 95, tuesday: 92, wednesday: 98, thursday: 94, friday: 90, saturday: 45, sunday: 30 },
  { hour: '14:00', monday: 75, tuesday: 78, wednesday: 80, thursday: 76, friday: 72, saturday: 40, sunday: 25 },
  { hour: '16:00', monday: 60, tuesday: 62, wednesday: 65, thursday: 61, friday: 58, saturday: 30, sunday: 18 },
  { hour: '18:00', monday: 88, tuesday: 85, wednesday: 82, thursday: 86, friday: 45, saturday: 20, sunday: 12 },
  { hour: '20:00', monday: 25, tuesday: 28, wednesday: 30, thursday: 35, friday: 20, saturday: 15, sunday: 8 },
  { hour: '22:00', monday: 10, tuesday: 12, wednesday: 15, thursday: 18, friday: 12, saturday: 10, sunday: 5 }
];

const doorUtilization = [
  { door: 'Main Entrance', usage: 2845, capacity: 3000, efficiency: 95, incidents: 2 },
  { door: 'Server Room', usage: 145, capacity: 200, efficiency: 72, incidents: 5 },
  { door: 'Executive Floor', usage: 89, capacity: 150, efficiency: 59, incidents: 0 },
  { door: 'Lab Access', usage: 234, capacity: 300, efficiency: 78, incidents: 1 },
  { door: 'Parking Gate', usage: 1567, capacity: 2000, efficiency: 78, incidents: 3 },
  { door: 'Emergency Exit A', usage: 12, capacity: 500, efficiency: 2, incidents: 0 },
  { door: 'Loading Dock', usage: 456, capacity: 600, efficiency: 76, incidents: 4 }
];

const behaviorPatterns = [
  { pattern: 'Regular Hours Access', count: 1234, percentage: 78, trend: 'stable' },
  { pattern: 'After Hours Access', count: 234, percentage: 15, trend: 'up' },
  { pattern: 'Weekend Access', count: 89, percentage: 5, trend: 'down' },
  { pattern: 'Multiple Location Access', count: 34, percentage: 2, trend: 'up' }
];

const incidentTrends = [
  { month: 'Jan', tailgating: 5, forced: 2, unauthorized: 8, system: 3 },
  { month: 'Feb', tailgating: 4, forced: 1, unauthorized: 6, system: 2 },
  { month: 'Mar', tailgating: 6, forced: 3, unauthorized: 7, system: 1 },
  { month: 'Apr', tailgating: 3, forced: 1, unauthorized: 5, system: 2 },
  { month: 'May', tailgating: 4, forced: 2, unauthorized: 4, system: 1 },
  { month: 'Jun', tailgating: 5, forced: 1, unauthorized: 3, system: 0 }
];

export function OperationalAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [selectedDoor, setSelectedDoor] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('usage');

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ChevronUp className="h-3 w-3 text-red-600" />;
    if (trend === 'down') return <ChevronDown className="h-3 w-3 text-green-600" />;
    return <Activity className="h-3 w-3 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Operational Analytics</h2>
          <p className="text-muted-foreground">
            Deep insights into access patterns and system performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="peak-usage" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="peak-usage">Peak Usage</TabsTrigger>
          <TabsTrigger value="door-utilization">Door Utilization</TabsTrigger>
          <TabsTrigger value="behavior-patterns">User Behavior</TabsTrigger>
          <TabsTrigger value="incident-trends">Security Trends</TabsTrigger>
          <TabsTrigger value="performance">System Performance</TabsTrigger>
        </TabsList>

        {/* Peak Usage Analysis */}
        <TabsContent value="peak-usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Usage Analysis</CardTitle>
              <CardDescription>Hourly access patterns across the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      Peak: 12:00 PM
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      Max: 98 users/hour
                    </Badge>
                  </div>
                  <Select defaultValue="heatmap">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heatmap">Heat Map</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="stacked">Stacked Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={peakUsageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="hour" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="monday" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="tuesday" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="wednesday" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="thursday" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="friday" stroke="#EF4444" strokeWidth={2} />
                    <ReferenceLine y={80} stroke="red" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Busiest Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">Wednesday</p>
                      <p className="text-xs text-muted-foreground">Average: 78 users/hour</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Quietest Period</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">Sunday 2-6 AM</p>
                      <p className="text-xs text-muted-foreground">Average: 2 users/hour</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Capacity Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                      <p className="text-xs text-muted-foreground">Times exceeded 90% capacity</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Door Utilization */}
        <TabsContent value="door-utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Door Utilization Reports</CardTitle>
              <CardDescription>Efficiency and usage metrics per access point</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={doorUtilization}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="door" angle={-45} textAnchor="end" height={80} className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage" fill="#3B82F6" name="Daily Usage" />
                    <Bar dataKey="capacity" fill="#E5E7EB" name="Capacity" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  <h4 className="font-semibold">Utilization Details</h4>
                  <div className="space-y-2">
                    {doorUtilization.map((door) => (
                      <div key={door.door} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <DoorOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{door.door}</p>
                            <p className="text-sm text-muted-foreground">
                              {door.usage.toLocaleString()} / {door.capacity.toLocaleString()} daily accesses
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-lg font-semibold ${getEfficiencyColor(door.efficiency)}`}>
                              {door.efficiency}%
                            </p>
                            <p className="text-xs text-muted-foreground">Efficiency</p>
                          </div>
                          {door.incidents > 0 && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {door.incidents}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Behavior Patterns */}
        <TabsContent value="behavior-patterns" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Access Behavior Patterns</CardTitle>
                <CardDescription>User movement and access trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {behaviorPatterns.map((pattern) => (
                    <div key={pattern.pattern} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pattern.pattern}</span>
                          {getTrendIcon(pattern.trend)}
                        </div>
                        <Badge variant="secondary">{pattern.count} users</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{pattern.percentage}% of total</span>
                          <span className="text-muted-foreground">{pattern.percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${pattern.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Detection Insights</CardTitle>
                <CardDescription>AI-identified unusual patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium">Unusual Weekend Activity</p>
                        <p className="text-sm text-muted-foreground">
                          15% increase in weekend access over the past month, primarily in R&D department
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Investigate Pattern
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <p className="text-2xl font-bold">23%</p>
                        <p className="text-xs text-muted-foreground">Users with irregular patterns</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-2xl font-bold">4.2</p>
                        <p className="text-xs text-muted-foreground">Avg doors accessed per user</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-2xl font-bold">67</p>
                        <p className="text-xs text-muted-foreground">Cross-department accesses</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-muted-foreground">Credential sharing suspects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Incident Trends */}
        <TabsContent value="incident-trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Incident Trends</CardTitle>
              <CardDescription>Historical analysis of security events</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={incidentTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="tailgating" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="forced" stackId="1" stroke="#EF4444" fill="#EF4444" />
                  <Area type="monotone" dataKey="unauthorized" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                  <Area type="monotone" dataKey="system" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid gap-4 md:grid-cols-4 mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      Tailgating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">27 total</p>
                    <p className="text-xs text-muted-foreground">Most common incident</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      Forced Entry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">10 total</p>
                    <p className="text-xs text-muted-foreground">Decreasing trend</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      Unauthorized
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">33 total</p>
                    <p className="text-xs text-muted-foreground">Improving</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-bold">9 total</p>
                    <p className="text-xs text-muted-foreground">Well controlled</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Performance */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Response Times</CardTitle>
                <CardDescription>Door controller performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="time" name="Time" className="text-xs" />
                    <YAxis dataKey="response" name="Response (ms)" className="text-xs" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter
                      name="Response Time"
                      data={Array.from({ length: 50 }, (_, i) => ({
                        time: i,
                        response: Math.random() * 200 + 50
                      }))}
                      fill="#3B82F6"
                    />
                    <ReferenceLine y={200} stroke="red" strokeDasharray="5 5" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health Metrics</CardTitle>
                <CardDescription>Real-time system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm font-bold">23%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '23%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-sm font-bold">67%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: '67%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network Latency</span>
                      <span className="text-sm font-bold">12ms</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '12%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Load</span>
                      <span className="text-sm font-bold">45%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                    </div>
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