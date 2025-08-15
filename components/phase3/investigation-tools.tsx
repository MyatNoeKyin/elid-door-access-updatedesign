"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  Search,
  Users,
  DoorOpen,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  FileText,
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Filter,
  Eye,
  Video,
  Activity
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface AccessEvent {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  doorId: string;
  doorName: string;
  result: 'granted' | 'denied';
  method: 'card' | 'pin' | 'fingerprint' | 'face';
  anomalyScore: number;
  videoAvailable: boolean;
}

interface UserMovement {
  userId: string;
  userName: string;
  path: Location[];
  anomalies: string[];
}

interface Location {
  doorId: string;
  doorName: string;
  timestamp: Date;
  duration: number;
}

const mockEvents: AccessEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000),
    userId: 'USR001',
    userName: 'John Doe',
    doorId: 'DOOR-SR-01',
    doorName: 'Server Room',
    result: 'granted',
    method: 'card',
    anomalyScore: 0.8,
    videoAvailable: true
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3300000),
    userId: 'USR001',
    userName: 'John Doe',
    doorId: 'DOOR-LAB-01',
    doorName: 'Research Lab',
    result: 'denied',
    method: 'card',
    anomalyScore: 0.9,
    videoAvailable: true
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 3000000),
    userId: 'USR002',
    userName: 'Jane Smith',
    doorId: 'DOOR-MAIN-01',
    doorName: 'Main Entrance',
    result: 'granted',
    method: 'fingerprint',
    anomalyScore: 0.1,
    videoAvailable: false
  }
];

export function InvestigationTools() {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [events, setEvents] = useState<AccessEvent[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<AccessEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const userMovements: UserMovement[] = [
    {
      userId: 'USR001',
      userName: 'John Doe',
      path: [
        { doorId: 'DOOR-MAIN-01', doorName: 'Main Entrance', timestamp: new Date(Date.now() - 3600000), duration: 5 },
        { doorId: 'DOOR-SR-01', doorName: 'Server Room', timestamp: new Date(Date.now() - 3300000), duration: 45 },
        { doorId: 'DOOR-LAB-01', doorName: 'Research Lab', timestamp: new Date(Date.now() - 1800000), duration: 0 }
      ],
      anomalies: ['Unusual access pattern', 'After-hours access']
    }
  ];

  const anomalyPatterns = [
    { pattern: 'Impossible Travel', count: 2, severity: 'high', description: 'User accessed two distant locations within impossible timeframe' },
    { pattern: 'Unusual Hours', count: 5, severity: 'medium', description: 'Access attempts outside normal working hours' },
    { pattern: 'Failed Attempts Spike', count: 3, severity: 'high', description: 'Multiple failed attempts followed by success' },
    { pattern: 'Credential Sharing', count: 1, severity: 'critical', description: 'Same credential used in multiple locations simultaneously' }
  ];

  const getAnomalyColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.5) return 'text-orange-600';
    return 'text-green-600';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500">Medium</Badge>;
      default: return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Investigation Parameters</CardTitle>
          <CardDescription>Configure search criteria for forensic analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>User Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div className="space-y-2">
              <Label>Location Filter</Label>
              <Input placeholder="Filter by door or area..." />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Search Events
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Event Timeline</TabsTrigger>
          <TabsTrigger value="movement">Movement Tracking</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="video">Video Analysis</TabsTrigger>
        </TabsList>

        {/* Event Timeline */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Event Timeline Correlation</CardTitle>
              <CardDescription>Analyze chronological sequence of security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Timeline Visualization */}
                <div className="relative h-24 bg-muted rounded-lg p-4">
                  <div className="absolute inset-x-4 top-1/2 h-1 bg-border -translate-y-1/2" />
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${(index / (events.length - 1)) * 90 + 5}%` }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        event.result === 'denied' ? 'bg-red-500 border-red-600' : 'bg-green-500 border-green-600'
                      }`} />
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Event List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedEvent?.id === event.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{event.userName}</span>
                            <span className="text-sm text-muted-foreground">({event.userId})</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DoorOpen className="h-3 w-3" />
                            <span>{event.doorName}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className={event.result === 'granted' ? 'text-green-600' : 'text-red-600'}>
                              {event.result.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{event.timestamp.toLocaleString()}</span>
                            <span>•</span>
                            <span>Method: {event.method}</span>
                            {event.videoAvailable && (
                              <>
                                <span>•</span>
                                <Video className="h-3 w-3" />
                                <span>Video available</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getAnomalyColor(event.anomalyScore)}`}>
                            Anomaly: {(event.anomalyScore * 100).toFixed(0)}%
                          </div>
                          {event.anomalyScore > 0.7 && (
                            <Badge variant="outline" className="text-xs">Investigate</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movement Tracking */}
        <TabsContent value="movement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Movement Tracking</CardTitle>
              <CardDescription>Visualize user paths through the facility</CardDescription>
            </CardHeader>
            <CardContent>
              {userMovements.map((movement) => (
                <div key={movement.userId} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{movement.userName}</span>
                    </div>
                    {movement.anomalies.length > 0 && (
                      <Badge variant="destructive">{movement.anomalies.length} Anomalies</Badge>
                    )}
                  </div>

                  {/* Movement Path */}
                  <div className="relative pl-6">
                    {movement.path.map((location, index) => (
                      <div key={index} className="flex items-start gap-4 pb-6">
                        <div className="absolute left-0 top-0 flex flex-col items-center h-full">
                          <div className={`w-4 h-4 rounded-full ${
                            index === 0 ? 'bg-primary' : 'bg-muted-foreground'
                          }`} />
                          {index < movement.path.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 ml-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{location.doorName}</p>
                              <p className="text-sm text-muted-foreground">
                                {location.timestamp.toLocaleTimeString()}
                                {location.duration > 0 && ` • Duration: ${location.duration} min`}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Anomalies */}
                  {movement.anomalies.length > 0 && (
                    <div className="space-y-2">
                      <Label>Detected Anomalies</Label>
                      <div className="flex flex-wrap gap-2">
                        {movement.anomalies.map((anomaly, index) => (
                          <Badge key={index} variant="outline" className="text-red-600 border-red-600">
                            {anomaly}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomaly Detection */}
        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Anomaly Detection</CardTitle>
              <CardDescription>AI-powered pattern recognition and threat detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {anomalyPatterns.map((anomaly, index) => (
                <div key={index} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">{anomaly.pattern}</span>
                        {getSeverityBadge(anomaly.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{anomaly.count}</div>
                      <div className="text-xs text-muted-foreground">occurrences</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Analysis */}
        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Integration & Analysis</CardTitle>
              <CardDescription>Correlate access events with video footage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEvent && selectedEvent.videoAvailable ? (
                <>
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Video Player Placeholder</p>
                      <p className="text-sm opacity-75">
                        {selectedEvent.doorName} - {selectedEvent.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Timeline Markers */}
                  <div className="space-y-2">
                    <Label>Event Markers</Label>
                    <div className="h-2 bg-muted rounded-full relative">
                      <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-2 h-2 bg-red-500 rounded-full" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-2 h-2 bg-orange-500 rounded-full" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-3/4 w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Click markers to jump to specific events
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {selectedEvent ? 'No video available for this event' : 'Select an event to view video'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}