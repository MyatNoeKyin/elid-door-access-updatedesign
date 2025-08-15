"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Brain,
  AlertTriangle,
  TrendingUp,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Shield,
  Users,
  DoorOpen,
  Fingerprint,
  CreditCard,
  UserX
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'access' | 'alert' | 'anomaly' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  location: string;
  user?: string;
  description: string;
  relatedEvents: string[];
  aiInsight?: string;
  pattern?: string;
}

const mockEvents: SecurityEvent[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60000),
    type: 'anomaly',
    severity: 'high',
    category: 'Unusual Access Pattern',
    location: 'Server Room',
    user: 'John Doe',
    description: 'User accessed server room outside normal hours',
    relatedEvents: ['2', '3'],
    aiInsight: 'This user typically accesses the server room between 9 AM - 5 PM. Current access at 11:45 PM is unusual.',
    pattern: 'after-hours-access'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 5 * 60000),
    type: 'alert',
    severity: 'critical',
    category: 'Multiple Failed Attempts',
    location: 'Executive Floor',
    user: 'Unknown',
    description: '5 failed access attempts in 2 minutes',
    relatedEvents: ['1'],
    aiInsight: 'Potential unauthorized access attempt. Pattern matches previous security breach attempts.',
    pattern: 'brute-force'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 10 * 60000),
    type: 'access',
    severity: 'info',
    category: 'Normal Access',
    location: 'Main Entrance',
    user: 'Alice Johnson',
    description: 'Successful entry with badge',
    relatedEvents: [],
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 15 * 60000),
    type: 'anomaly',
    severity: 'medium',
    category: 'Tailgating Detected',
    location: 'Parking Garage',
    description: 'Multiple persons detected following single badge scan',
    relatedEvents: [],
    aiInsight: '3 individuals entered on 1 badge scan. Video analysis confirms tailgating event.',
    pattern: 'tailgating'
  }
];

export function IntelligentEventFeed() {
  const [events, setEvents] = useState<SecurityEvent[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate new events
      const newEvent: SecurityEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: ['access', 'alert', 'anomaly', 'system'][Math.floor(Math.random() * 4)] as SecurityEvent['type'],
        severity: ['critical', 'high', 'medium', 'low', 'info'][Math.floor(Math.random() * 5)] as SecurityEvent['severity'],
        category: 'Real-time Event',
        location: ['Main Entrance', 'Server Room', 'Executive Floor'][Math.floor(Math.random() * 3)],
        description: 'New security event detected',
        relatedEvents: []
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 100)); // Keep last 100 events
    }, 5000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isLive, playbackSpeed]);

  const getEventIcon = (type: string, category: string) => {
    if (category.includes('Failed')) return <UserX className="h-4 w-4" />;
    if (category.includes('Tailgating')) return <Users className="h-4 w-4" />;
    if (category.includes('Access Pattern')) return <Brain className="h-4 w-4" />;
    if (type === 'access') return <CreditCard className="h-4 w-4" />;
    if (type === 'alert') return <AlertTriangle className="h-4 w-4" />;
    if (type === 'anomaly') return <Shield className="h-4 w-4" />;
    return <DoorOpen className="h-4 w-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/50';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/50';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/50';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/50';
    }
  };

  const filteredEvents = events.filter(event => 
    searchQuery === '' || 
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.user?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const patterns = [
    { id: 'after-hours-access', name: 'After Hours Access', count: 3, trend: 'up' },
    { id: 'tailgating', name: 'Tailgating', count: 5, trend: 'down' },
    { id: 'brute-force', name: 'Brute Force Attempts', count: 2, trend: 'up' },
    { id: 'unusual-location', name: 'Unusual Location Access', count: 1, trend: 'stable' }
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by description, location, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isLive ? "default" : "secondary"} className="gap-1">
            {isLive ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                LIVE
              </>
            ) : (
              'PAUSED'
            )}
          </Badge>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <select 
            className="px-3 py-1 rounded-md border text-sm"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* AI Pattern Recognition */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Pattern Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patterns.map(pattern => (
              <div
                key={pattern.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedPattern === pattern.id 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPattern(pattern.id === selectedPattern ? null : pattern.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{pattern.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{pattern.count}</Badge>
                    {pattern.trend === 'up' && <TrendingUp className="h-3 w-3 text-red-600" />}
                    {pattern.trend === 'down' && <TrendingUp className="h-3 w-3 text-green-600 rotate-180" />}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground">
                AI has identified 4 security patterns in the last hour
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Event Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Security Event Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    event.severity === 'critical' || event.severity === 'high' 
                      ? 'border-red-200 dark:border-red-900' 
                      : ''
                  } ${index === 0 && isLive ? 'security-slide-in' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                        {getEventIcon(event.type, event.category)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{event.category}</span>
                          <Badge variant={
                            event.severity === 'critical' ? 'destructive' :
                            event.severity === 'high' ? 'default' :
                            'secondary'
                          } className="text-xs">
                            {event.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm">{event.description}</p>
                        {event.user && (
                          <p className="text-xs text-muted-foreground">User: {event.user}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {event.location} • {event.timestamp.toLocaleTimeString()}
                        </p>
                        
                        {event.aiInsight && (
                          <div className="mt-2 p-2 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                            <p className="text-xs flex items-start gap-1">
                              <Brain className="h-3 w-3 text-blue-600 mt-0.5" />
                              <span className="text-blue-700 dark:text-blue-300">{event.aiInsight}</span>
                            </p>
                          </div>
                        )}
                        
                        {event.relatedEvents.length > 0 && (
                          <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
                            View {event.relatedEvents.length} related events
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}