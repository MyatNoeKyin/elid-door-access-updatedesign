"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle,
  Shield,
  Users,
  Clock,
  FileText,
  Camera,
  Download,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Paperclip,
  PlayCircle,
  User,
  ChevronRight
} from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  type: 'security_breach' | 'unauthorized_access' | 'system_failure' | 'policy_violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTo: string;
  createdAt: Date;
  location: string;
  affectedSystems: string[];
  timeline: TimelineEvent[];
  evidence: Evidence[];
  notes: string;
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  details: string;
}

interface Evidence {
  id: string;
  type: 'screenshot' | 'log' | 'video' | 'document';
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
}

const mockIncident: Incident = {
  id: 'INC-2024-001',
  title: 'Unauthorized Server Room Access Attempt',
  type: 'unauthorized_access',
  severity: 'critical',
  status: 'investigating',
  assignedTo: 'John Smith',
  createdAt: new Date(Date.now() - 30 * 60000),
  location: 'Server Room - Floor 2',
  affectedSystems: ['Door Controller SR-01', 'Access Control System', 'CCTV System'],
  timeline: [
    {
      id: '1',
      timestamp: new Date(Date.now() - 30 * 60000),
      action: 'Incident Created',
      user: 'System',
      details: 'Multiple failed access attempts detected'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 25 * 60000),
      action: 'Assigned',
      user: 'Admin',
      details: 'Incident assigned to John Smith'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 20 * 60000),
      action: 'Evidence Added',
      user: 'John Smith',
      details: 'CCTV footage uploaded'
    }
  ],
  evidence: [
    {
      id: '1',
      type: 'video',
      name: 'CCTV_ServerRoom_2024-01-15_1145.mp4',
      uploadedBy: 'John Smith',
      uploadedAt: new Date(Date.now() - 20 * 60000)
    },
    {
      id: '2',
      type: 'log',
      name: 'access_logs_2024-01-15.txt',
      uploadedBy: 'System',
      uploadedAt: new Date(Date.now() - 30 * 60000)
    }
  ],
  notes: ''
};

export function IncidentResponseWorkflow() {
  const [incident, setIncident] = useState<Incident>(mockIncident);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [assignee, setAssignee] = useState(incident.assignedTo);
  const [status, setStatus] = useState(incident.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
      case 'investigating': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400';
      default: return '';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'low': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Camera className="h-4 w-4" />;
      case 'screenshot': return <Camera className="h-4 w-4" />;
      case 'log': return <FileText className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Paperclip className="h-4 w-4" />;
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const newTimelineEvent: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: 'Note Added',
      user: 'Current User',
      details: newNote
    };
    
    setIncident({
      ...incident,
      timeline: [...incident.timeline, newTimelineEvent],
      notes: incident.notes + '\n\n' + newNote
    });
    
    setNewNote('');
  };

  const handleStatusUpdate = (newStatus: string) => {
    setStatus(newStatus);
    
    const newTimelineEvent: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: 'Status Updated',
      user: 'Current User',
      details: `Status changed from ${incident.status} to ${newStatus}`
    };
    
    setIncident({
      ...incident,
      status: newStatus as Incident['status'],
      timeline: [...incident.timeline, newTimelineEvent]
    });
  };

  return (
    <div className="space-y-6">
      {/* Incident Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{incident.title}</CardTitle>
                {getSeverityIcon(incident.severity)}
              </div>
              <CardDescription className="flex items-center gap-4">
                <span>ID: {incident.id}</span>
                <span>•</span>
                <span>{incident.location}</span>
                <span>•</span>
                <span>Created: {incident.createdAt.toLocaleString()}</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(incident.status)}>
                {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-2xl font-bold">
                  {Math.floor((Date.now() - incident.createdAt.getTime()) / 60000)} min
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-lg font-semibold">{incident.assignedTo}</p>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Evidence Collected</p>
                <p className="text-2xl font-bold">{incident.evidence.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Affected Systems</p>
                <p className="text-2xl font-bold">{incident.affectedSystems.length}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <p className="text-sm font-medium">{incident.type.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(incident.severity)}
                    <span className="text-sm font-medium">{incident.severity.toUpperCase()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                      <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Affected Systems</Label>
                <div className="flex flex-wrap gap-2">
                  {incident.affectedSystems.map((system, index) => (
                    <Badge key={index} variant="secondary">{system}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Add Note</Label>
                <Textarea
                  placeholder="Add investigation notes..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} className="w-full sm:w-auto">
                  <Send className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>Chronological record of all incident activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incident.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-muted'
                      }`} />
                      {index < incident.timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{event.action}</p>
                          <p className="text-sm text-muted-foreground">{event.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            by {event.user} • {event.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidence Collection</CardTitle>
              <CardDescription>All evidence related to this incident</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Upload New Evidence
                </Button>
                
                <div className="grid gap-4">
                  {incident.evidence.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-muted">
                          {getEvidenceIcon(item.type)}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded by {item.uploadedBy} • {item.uploadedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Immediate Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" className="w-full justify-start">
                  <XCircle className="h-4 w-4 mr-2" />
                  Lock Down Affected Area
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Notify Security Team
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Revoke Access Credentials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Review Additional Footage
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Conduct Security Audit</span>
                  <Button size="sm" variant="outline">Schedule</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Update Access Policies</span>
                  <Button size="sm" variant="outline">Create Task</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Staff Training</span>
                  <Button size="sm" variant="outline">Plan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident Report</CardTitle>
              <CardDescription>Generate comprehensive report for this incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select defaultValue="full">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                    <SelectItem value="full">Full Report</SelectItem>
                    <SelectItem value="technical">Technical Details</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Include Sections</Label>
                <div className="space-y-2">
                  {['Timeline', 'Evidence', 'Root Cause Analysis', 'Recommendations'].map((section) => (
                    <label key={section} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">{section}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}