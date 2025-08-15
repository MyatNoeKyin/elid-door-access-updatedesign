"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  TrendingDown,
  Shield,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Target,
  Zap,
  Building,
  Calendar
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

interface KPI {
  id: string;
  name: string;
  value: number | string;
  target: number | string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

const kpis: KPI[] = [
  {
    id: 'security-score',
    name: 'Security Score',
    value: 92,
    target: 95,
    trend: 'up',
    trendValue: 3,
    status: 'warning',
    icon: <Shield className="h-4 w-4" />
  },
  {
    id: 'compliance',
    name: 'Compliance Rate',
    value: 98,
    target: 100,
    trend: 'up',
    trendValue: 2,
    status: 'good',
    icon: <CheckCircle className="h-4 w-4" />
  },
  {
    id: 'incident-response',
    name: 'Avg Response Time',
    value: '1.2 min',
    target: '< 2 min',
    trend: 'down',
    trendValue: 15,
    status: 'good',
    icon: <Clock className="h-4 w-4" />
  },
  {
    id: 'cost-efficiency',
    name: 'Cost per Access',
    value: '$0.12',
    target: '$0.15',
    trend: 'down',
    trendValue: 20,
    status: 'good',
    icon: <DollarSign className="h-4 w-4" />
  }
];

// Mock data for charts
const trendData = [
  { month: 'Jan', security: 88, compliance: 94, incidents: 12, cost: 45000 },
  { month: 'Feb', security: 89, compliance: 95, incidents: 10, cost: 43000 },
  { month: 'Mar', security: 90, compliance: 96, incidents: 8, cost: 42000 },
  { month: 'Apr', security: 91, compliance: 97, incidents: 7, cost: 41000 },
  { month: 'May', security: 92, compliance: 98, incidents: 5, cost: 40000 },
  { month: 'Jun', security: 92, compliance: 98, incidents: 6, cost: 39000 }
];

const departmentData = [
  { department: 'IT', incidents: 2, compliance: 99, users: 45 },
  { department: 'Finance', incidents: 1, compliance: 100, users: 32 },
  { department: 'HR', incidents: 0, compliance: 98, users: 28 },
  { department: 'Operations', incidents: 3, compliance: 95, users: 67 },
  { department: 'R&D', incidents: 1, compliance: 97, users: 38 }
];

const riskMatrix = [
  { subject: 'Physical Security', A: 95, fullMark: 100 },
  { subject: 'Access Control', A: 92, fullMark: 100 },
  { subject: 'Incident Response', A: 88, fullMark: 100 },
  { subject: 'Compliance', A: 98, fullMark: 100 },
  { subject: 'User Training', A: 85, fullMark: 100 },
  { subject: 'System Availability', A: 99, fullMark: 100 }
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export function ExecutiveOverview() {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900/50';
      case 'warning': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/50';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/50';
      default: return '';
    }
  };

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') {
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-3 w-3 text-green-600" />;
    }
    return <Activity className="h-3 w-3 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Executive Dashboard</h2>
          <p className="text-muted-foreground">
            High-level security and operational metrics • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {timeRange === '6months' ? 'Last 6 Months' : 'Custom Range'}
          </Button>
          <Button size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {kpi.icon}
                  {kpi.name}
                </CardTitle>
                <Badge className={getStatusColor(kpi.status)}>
                  {kpi.status.charAt(0).toUpperCase() + kpi.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  <span className="text-sm text-muted-foreground">Target: {kpi.target}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(kpi.trend, kpi.trendValue)}
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.trendValue}%
                  </span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
                {typeof kpi.value === 'number' && typeof kpi.target === 'number' && (
                  <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance Trends</CardTitle>
                <CardDescription>Monthly performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="security" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Security Score"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="compliance" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Compliance %"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost & Incident Analysis</CardTitle>
                <CardDescription>Operational efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#F59E0B" 
                      fill="#F59E0B"
                      fillOpacity={0.3}
                      name="Monthly Cost ($)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="incidents" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Incidents"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance Matrix</CardTitle>
              <CardDescription>Click on a department for detailed view</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="department" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" fill="#EF4444" name="Incidents" />
                    <Bar dataKey="compliance" fill="#10B981" name="Compliance %" />
                    <Bar dataKey="users" fill="#3B82F6" name="Active Users" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  <h4 className="font-semibold">Department Rankings</h4>
                  <div className="space-y-2">
                    {departmentData
                      .sort((a, b) => b.compliance - a.compliance)
                      .map((dept, index) => (
                        <div 
                          key={dept.department}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedDepartment === dept.department 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedDepartment(dept.department)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-green-100 text-green-700' :
                              index === 1 ? 'bg-blue-100 text-blue-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{dept.department}</p>
                              <p className="text-xs text-muted-foreground">
                                {dept.users} users • {dept.incidents} incidents
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{dept.compliance}%</p>
                            <p className="text-xs text-muted-foreground">Compliance</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Risk Assessment Matrix</CardTitle>
              <CardDescription>Multi-dimensional risk analysis across key areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={riskMatrix}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" className="text-xs" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar 
                      name="Current Score" 
                      dataKey="A" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.6} 
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Mitigation Priorities</h4>
                  <div className="space-y-3">
                    {riskMatrix
                      .filter(item => item.A < 90)
                      .sort((a, b) => a.A - b.A)
                      .map((risk) => (
                        <div key={risk.subject} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{risk.subject}</span>
                            <Badge variant={risk.A < 85 ? "destructive" : "secondary"}>
                              {risk.A}%
                            </Badge>
                          </div>
                          <Progress value={risk.A} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {risk.A < 85 
                              ? 'Immediate attention required' 
                              : 'Monitor and improve'}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics & Forecasting</CardTitle>
              <CardDescription>AI-powered insights and maintenance predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Maintenance Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">3 Controllers</p>
                      <p className="text-sm text-muted-foreground">
                        Predicted to require maintenance within 30 days
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      Access Pattern Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">+23%</p>
                      <p className="text-sm text-muted-foreground">
                        Expected increase in access events next month
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Prepare Resources
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Threat Prediction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">78%</p>
                      <p className="text-sm text-muted-foreground">
                        Probability of tailgating attempts this week
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Enhance Monitoring
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Cost Optimization Opportunities</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Consolidate Door Controllers</p>
                      <p className="text-sm text-muted-foreground">
                        Merge underutilized controllers in Building B
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">$2,400/year</p>
                      <p className="text-xs text-muted-foreground">Potential savings</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Optimize Access Schedules</p>
                      <p className="text-sm text-muted-foreground">
                        Reduce after-hours access by 30%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">$1,800/year</p>
                      <p className="text-xs text-muted-foreground">Overtime reduction</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}