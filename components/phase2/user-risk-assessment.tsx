"use client";

import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  MapPin,
  Key,
  Activity,
  UserX,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { User, AccessEvent, AccessResult } from '@/lib/types';
import { apiService } from '@/lib/api/api-service';
import { formatDistanceToNow } from 'date-fns';

interface UserRiskAssessmentProps {
  user: User;
  onRiskUpdate?: (riskScore: number) => void;
}

interface RiskFactor {
  id: string;
  name: string;
  description: string;
  score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon: React.ReactNode;
}

interface AccessPattern {
  hour: number;
  accessCount: number;
  anomalyScore: number;
}

export function UserRiskAssessment({ user, onRiskUpdate }: UserRiskAssessmentProps) {
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [accessPatterns, setAccessPatterns] = useState<AccessPattern[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRiskData();
  }, [user.id]);

  const loadUserRiskData = async () => {
    setLoading(true);
    try {
      // Fetch user's access events
      const events = await apiService.getAccessEvents({ userId: user.id });
      setAccessEvents(events.slice(0, 100)); // Last 100 events

      // Calculate risk factors
      const factors = calculateRiskFactors(events);
      setRiskFactors(factors);

      // Analyze access patterns
      const patterns = analyzeAccessPatterns(events);
      setAccessPatterns(patterns);

      // Detect anomalies
      const detectedAnomalies = detectAnomalies(events);
      setAnomalies(detectedAnomalies);

      // Update risk score
      const newRiskScore = factors.reduce((sum, factor) => sum + factor.score, 0) / factors.length;
      if (onRiskUpdate) {
        onRiskUpdate(Math.round(newRiskScore));
      }
    } catch (error) {
      console.error('Failed to load risk data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskFactors = (events: AccessEvent[]): RiskFactor[] => {
    const factors: RiskFactor[] = [];
    
    // Factor 1: Failed Access Attempts
    const failedAttempts = events.filter(e => e.result === AccessResult.DENIED).length;
    const failedRatio = events.length > 0 ? (failedAttempts / events.length) * 100 : 0;
    factors.push({
      id: 'failed-attempts',
      name: 'Failed Access Attempts',
      description: `${failedAttempts} failed attempts in last 100 accesses`,
      score: Math.min(failedRatio * 2, 100),
      severity: failedRatio > 20 ? 'critical' : failedRatio > 10 ? 'high' : failedRatio > 5 ? 'medium' : 'low',
      icon: <XCircle className="h-5 w-5" />,
    });

    // Factor 2: Off-Hours Access
    const offHoursAccess = events.filter(e => {
      const hour = e.timestamp.getHours();
      return hour < 6 || hour > 22;
    }).length;
    const offHoursRatio = events.length > 0 ? (offHoursAccess / events.length) * 100 : 0;
    factors.push({
      id: 'off-hours',
      name: 'Off-Hours Access',
      description: `${offHoursAccess} accesses outside business hours`,
      score: Math.min(offHoursRatio * 1.5, 100),
      severity: offHoursRatio > 30 ? 'high' : offHoursRatio > 15 ? 'medium' : 'low',
      icon: <Clock className="h-5 w-5" />,
    });

    // Factor 3: Credential Status
    const hasExpiredCreds = user.credentials.some(c => 
      c.validUntil && new Date(c.validUntil) < new Date()
    );
    const hasLostCreds = user.credentials.some(c => c.status === 'LOST');
    let credScore = 0;
    if (hasExpiredCreds) credScore += 40;
    if (hasLostCreds) credScore += 60;
    factors.push({
      id: 'credentials',
      name: 'Credential Issues',
      description: hasExpiredCreds ? 'Has expired credentials' : hasLostCreds ? 'Has lost credentials' : 'All credentials valid',
      score: credScore,
      severity: credScore > 50 ? 'high' : credScore > 0 ? 'medium' : 'low',
      icon: <Key className="h-5 w-5" />,
    });

    // Factor 4: Access Velocity
    const recentEvents = events.filter(e => 
      e.timestamp.getTime() > Date.now() - 3600000 // Last hour
    );
    const accessVelocity = recentEvents.length;
    const velocityScore = accessVelocity > 20 ? 80 : accessVelocity > 10 ? 40 : 0;
    factors.push({
      id: 'velocity',
      name: 'Access Velocity',
      description: `${accessVelocity} accesses in the last hour`,
      score: velocityScore,
      severity: velocityScore > 60 ? 'high' : velocityScore > 30 ? 'medium' : 'low',
      icon: <Activity className="h-5 w-5" />,
    });

    // Factor 5: Location Anomalies
    const uniqueDoors = new Set(events.map(e => e.doorId)).size;
    const locationScore = uniqueDoors > 10 ? 60 : uniqueDoors > 5 ? 30 : 0;
    factors.push({
      id: 'locations',
      name: 'Location Diversity',
      description: `Accessed ${uniqueDoors} different doors`,
      score: locationScore,
      severity: locationScore > 50 ? 'medium' : 'low',
      icon: <MapPin className="h-5 w-5" />,
    });

    return factors;
  };

  const analyzeAccessPatterns = (events: AccessEvent[]): AccessPattern[] => {
    const hourlyAccess = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      accessCount: 0,
      anomalyScore: 0,
    }));

    events.forEach(event => {
      const hour = event.timestamp.getHours();
      hourlyAccess[hour].accessCount++;
      if (event.anomalyScore) {
        hourlyAccess[hour].anomalyScore = Math.max(
          hourlyAccess[hour].anomalyScore,
          event.anomalyScore
        );
      }
    });

    return hourlyAccess;
  };

  const detectAnomalies = (events: AccessEvent[]): any[] => {
    const anomalies = [];
    
    // Rapid sequential access
    for (let i = 1; i < events.length; i++) {
      const timeDiff = events[i-1].timestamp.getTime() - events[i].timestamp.getTime();
      if (timeDiff < 60000 && events[i-1].doorId !== events[i].doorId) { // Less than 1 minute
        anomalies.push({
          type: 'RAPID_ACCESS',
          description: 'Multiple door accesses within 1 minute',
          timestamp: events[i].timestamp,
          severity: 'medium',
        });
      }
    }

    // Unusual access patterns
    const weekendAccess = events.filter(e => {
      const day = e.timestamp.getDay();
      return day === 0 || day === 6;
    });
    if (weekendAccess.length > events.length * 0.3) {
      anomalies.push({
        type: 'WEEKEND_PATTERN',
        description: 'High weekend access frequency',
        severity: 'low',
      });
    }

    return anomalies.slice(0, 5); // Return top 5 anomalies
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: '#DC2626' };
    if (score >= 60) return { level: 'High', color: '#F59E0B' };
    if (score >= 40) return { level: 'Medium', color: '#3B82F6' };
    if (score >= 20) return { level: 'Low', color: '#10B981' };
    return { level: 'Minimal', color: '#6B7280' };
  };

  const overallRiskScore = user.riskScore || 0;
  const riskLevel = getRiskLevel(overallRiskScore);

  const accessDistribution = [
    { name: 'Granted', value: accessEvents.filter(e => e.result === AccessResult.GRANTED).length, color: '#10B981' },
    { name: 'Denied', value: accessEvents.filter(e => e.result === AccessResult.DENIED).length, color: '#EF4444' },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <Card className={`border-2 ${
        overallRiskScore >= 80 ? 'border-red-500' :
        overallRiskScore >= 60 ? 'border-orange-500' :
        overallRiskScore >= 40 ? 'border-blue-500' :
        'border-border'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>
                Security risk analysis for {user.firstName} {user.lastName}
              </CardDescription>
            </div>
            <Badge 
              variant={overallRiskScore >= 60 ? 'destructive' : 'secondary'}
              className="text-lg px-4 py-2"
            >
              {riskLevel.level} Risk
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <ResponsiveContainer width={200} height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: overallRiskScore, fill: riskLevel.color }]}>
                <RadialBar dataKey="value" cornerRadius={10} fill={riskLevel.color} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                  {overallRiskScore}
                </text>
                <text x="50%" y="50%" dy={25} textAnchor="middle" className="text-sm text-muted-foreground">
                  Risk Score
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Factors */}
          <div className="space-y-3">
            {riskFactors.map((factor) => (
              <div key={factor.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    factor.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-950' :
                    factor.severity === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-950' :
                    factor.severity === 'medium' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-950'
                  }`}>
                    {factor.icon}
                  </div>
                  <div>
                    <p className="font-medium">{factor.name}</p>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{factor.score}</p>
                  <Badge variant={
                    factor.severity === 'critical' ? 'destructive' :
                    factor.severity === 'high' ? 'default' :
                    'secondary'
                  }>
                    {factor.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patterns">Access Patterns</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Access Pattern</CardTitle>
              <CardDescription>
                User access frequency by hour of day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={accessPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <ChartTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="accessCount" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Access Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={accessDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accessDistribution.map((entry, index) => (
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
                <CardTitle>Access Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Accesses</span>
                  <span className="font-medium">{accessEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-medium">
                    {((accessDistribution[0].value / accessEvents.length) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Peak Hour</span>
                  <span className="font-medium">
                    {accessPatterns.reduce((max, p) => p.accessCount > max.accessCount ? p : max).hour}:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Access</span>
                  <span className="font-medium">
                    {user.lastActivity ? formatDistanceToNow(user.lastActivity, { addSuffix: true }) : 'Never'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          {anomalies.length > 0 ? (
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <Alert key={index} variant={anomaly.severity === 'high' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{anomaly.type.replace('_', ' ')}</AlertTitle>
                  <AlertDescription>
                    {anomaly.description}
                    {anomaly.timestamp && (
                      <span className="block mt-1 text-xs">
                        {formatDistanceToNow(anomaly.timestamp, { addSuffix: true })}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>No Anomalies Detected</AlertTitle>
              <AlertDescription>
                User access patterns appear normal with no significant anomalies.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Access Activity</CardTitle>
              <CardDescription>
                Last 20 access events with details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {accessEvents.slice(0, 20).map((event, index) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      {event.result === AccessResult.GRANTED ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          Door {event.doorId.replace('door-', '#')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.credentialType} • {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    {event.denialReason && (
                      <Badge variant="destructive" className="text-xs">
                        {event.denialReason}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          Generate Risk Report
        </Button>
        <Button variant="outline" className="flex-1">
          Set Alert Threshold
        </Button>
        {overallRiskScore >= 60 && (
          <Button variant="destructive" className="flex-1">
            Flag for Review
          </Button>
        )}
      </div>
    </div>
  );
}