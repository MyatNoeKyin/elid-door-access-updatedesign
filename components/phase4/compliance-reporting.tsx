"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  TrendingUp,
  Calendar,
  Lock,
  Key,
  UserCheck,
  Fingerprint,
  Database,
  Award,
  FileSignature,
  AlertCircle
} from 'lucide-react';

interface ComplianceMetric {
  id: string;
  name: string;
  score: number;
  status: 'pass' | 'warning' | 'fail';
  lastAudit: Date;
  requirements: Requirement[];
}

interface Requirement {
  id: string;
  description: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  evidence: string[];
  lastChecked: Date;
}

interface Violation {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  occurredAt: Date;
  resolvedAt?: Date;
  userId?: string;
  remediation: string;
}

const complianceFrameworks: ComplianceMetric[] = [
  {
    id: 'iso27001',
    name: 'ISO 27001',
    score: 98,
    status: 'pass',
    lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    requirements: [
      {
        id: 'A.9.1',
        description: 'Access control policy',
        status: 'compliant',
        evidence: ['access_policy_v2.pdf', 'audit_log_2024.xlsx'],
        lastChecked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'A.9.2',
        description: 'User access management',
        status: 'compliant',
        evidence: ['user_provisioning_process.pdf'],
        lastChecked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'A.9.4',
        description: 'System and application access control',
        status: 'partial',
        evidence: ['system_access_review.xlsx'],
        lastChecked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    score: 95,
    status: 'pass',
    lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    requirements: [
      {
        id: 'CC6.1',
        description: 'Logical and physical access controls',
        status: 'compliant',
        evidence: ['physical_access_controls.pdf'],
        lastChecked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'CC6.2',
        description: 'New user access authorization',
        status: 'compliant',
        evidence: ['onboarding_procedure.pdf'],
        lastChecked: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    score: 92,
    status: 'warning',
    lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    requirements: [
      {
        id: 'Art.32',
        description: 'Security of processing',
        status: 'compliant',
        evidence: ['encryption_policy.pdf', 'access_logs.csv'],
        lastChecked: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'Art.33',
        description: 'Notification of breach',
        status: 'partial',
        evidence: ['breach_notification_process.pdf'],
        lastChecked: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      }
    ]
  }
];

const recentViolations: Violation[] = [
  {
    id: '1',
    type: 'Unauthorized Access Attempt',
    severity: 'high',
    description: 'Multiple failed login attempts detected for admin account',
    occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    userId: 'USR-1234',
    remediation: 'Account locked, password reset required'
  },
  {
    id: '2',
    type: 'Data Retention Policy',
    severity: 'medium',
    description: 'Access logs older than 90 days not properly archived',
    occurredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    remediation: 'Automated archival process implemented'
  },
  {
    id: '3',
    type: 'Access Review',
    severity: 'low',
    description: 'Quarterly access review delayed by 2 weeks',
    occurredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    remediation: 'Review scheduled and reminder system updated'
  }
];

export function ComplianceReporting() {
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30days');
  const [showResolved, setShowResolved] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
      case 'compliant':
        return 'text-green-600';
      case 'warning':
      case 'partial':
        return 'text-orange-600';
      case 'fail':
      case 'non-compliant':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'fail':
      case 'non-compliant':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  const filteredFrameworks = selectedFramework === 'all' 
    ? complianceFrameworks 
    : complianceFrameworks.filter(f => f.id === selectedFramework);

  const filteredViolations = showResolved 
    ? recentViolations 
    : recentViolations.filter(v => !v.resolvedAt);

  const overallScore = Math.round(
    complianceFrameworks.reduce((acc, f) => acc + f.score, 0) / complianceFrameworks.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Compliance Reporting</h2>
          <p className="text-muted-foreground">
            Track regulatory compliance and generate audit reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Overall Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold">{overallScore}%</div>
              <div>
                <p className="text-sm font-medium">Compliance Rate</p>
                <p className="text-xs text-muted-foreground">Across all frameworks</p>
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <Progress value={overallScore} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {complianceFrameworks.filter(f => f.status === 'pass').length}
              </div>
              <p className="text-sm text-muted-foreground">Compliant</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {complianceFrameworks.filter(f => f.status === 'warning').length}
              </div>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {complianceFrameworks.filter(f => f.status === 'fail').length}
              </div>
              <p className="text-sm text-muted-foreground">Non-Compliant</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="frameworks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="frameworks">Compliance Frameworks</TabsTrigger>
          <TabsTrigger value="violations">Violations & Remediation</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="evidence">Evidence Package</TabsTrigger>
        </TabsList>

        {/* Frameworks Tab */}
        <TabsContent value="frameworks" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="iso27001">ISO 27001</SelectItem>
                <SelectItem value="soc2">SOC 2 Type II</SelectItem>
                <SelectItem value="gdpr">GDPR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredFrameworks.map(framework => (
              <Card key={framework.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{framework.name}</CardTitle>
                        <CardDescription>
                          Last audit: {framework.lastAudit.toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getStatusColor(framework.status)}`}>
                          {framework.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">Compliance Score</p>
                      </div>
                      {getStatusIcon(framework.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Requirements Status</h4>
                    {framework.requirements.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(req.status)}
                          <div>
                            <p className="font-medium text-sm">{req.id}: {req.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Last checked: {req.lastChecked.toLocaleDateString()} • 
                              {req.evidence.length} evidence files
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showResolved}
                  onChange={(e) => setShowResolved(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show resolved violations</span>
              </label>
            </div>
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {filteredViolations.filter(v => !v.resolvedAt).length} Active
            </Badge>
          </div>

          <div className="space-y-3">
            {filteredViolations.map(violation => (
              <Card key={violation.id} className={violation.resolvedAt ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold">{violation.type}</h4>
                        {getSeverityBadge(violation.severity)}
                        {violation.resolvedAt && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{violation.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Occurred: {violation.occurredAt.toLocaleString()}</span>
                        {violation.userId && <span>User: {violation.userId}</span>}
                        {violation.resolvedAt && (
                          <span>Resolved: {violation.resolvedAt.toLocaleString()}</span>
                        )}
                      </div>
                      <Alert>
                        <AlertDescription className="text-sm">
                          <span className="font-medium">Remediation: </span>
                          {violation.remediation}
                        </AlertDescription>
                      </Alert>
                    </div>
                    {!violation.resolvedAt && (
                      <Button size="sm">Mark Resolved</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Audit Trail</CardTitle>
              <CardDescription>Complete record of all access control activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Total Events Logged
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">1,234,567</p>
                      <p className="text-xs text-muted-foreground">Last 90 days</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Audit Log Integrity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">Verified</p>
                      <p className="text-xs text-muted-foreground">Cryptographically signed</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Retention Period
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">7 Years</p>
                      <p className="text-xs text-muted-foreground">Automated archival</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Recent Audit Events</h4>
                  <div className="space-y-2">
                    {[
                      { action: 'User Access Granted', user: 'Admin', time: '2 minutes ago', icon: <UserCheck className="h-4 w-4" /> },
                      { action: 'Security Policy Updated', user: 'System', time: '1 hour ago', icon: <Shield className="h-4 w-4" /> },
                      { action: 'Compliance Report Generated', user: 'Scheduler', time: '3 hours ago', icon: <FileText className="h-4 w-4" /> },
                      { action: 'Access Review Completed', user: 'Manager', time: '1 day ago', icon: <Key className="h-4 w-4" /> },
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-muted">
                            {event.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{event.action}</p>
                            <p className="text-xs text-muted-foreground">By {event.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{event.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Full Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Package Tab */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Package Generation</CardTitle>
              <CardDescription>Compile and digitally sign compliance evidence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Select Evidence Type</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { name: 'Access Control Policies', count: 12, icon: <FileText className="h-4 w-4" /> },
                    { name: 'User Access Reviews', count: 24, icon: <UserCheck className="h-4 w-4" /> },
                    { name: 'Audit Logs', count: 90, icon: <Database className="h-4 w-4" /> },
                    { name: 'Incident Reports', count: 8, icon: <AlertTriangle className="h-4 w-4" /> },
                    { name: 'Training Records', count: 156, icon: <Award className="h-4 w-4" /> },
                    { name: 'System Configurations', count: 34, icon: <Settings className="h-4 w-4" /> },
                  ].map((type, index) => (
                    <label key={index} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <div className="flex items-center gap-2">
                          {type.icon}
                          <span className="font-medium">{type.name}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">{type.count} files</Badge>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Digital Signature</Label>
                <Alert>
                  <FileSignature className="h-4 w-4" />
                  <AlertDescription>
                    All evidence will be digitally signed with SHA-256 hash and timestamp
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Evidence Package
                </Button>
                <Button variant="outline">
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Verify Integrity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}