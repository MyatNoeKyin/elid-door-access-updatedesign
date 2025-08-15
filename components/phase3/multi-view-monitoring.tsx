"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Maximize2, 
  Minimize2, 
  Grid3x3, 
  Square, 
  PictureInPicture,
  Save,
  RotateCw,
  Monitor,
  Camera,
  DoorOpen,
  Users
} from 'lucide-react';

interface ViewLayout {
  id: string;
  name: string;
  grid: 'single' | '2x2' | '3x3' | 'pip';
  zones: string[];
}

const presetLayouts: ViewLayout[] = [
  { id: 'main-entrance', name: 'Main Entrance Focus', grid: 'single', zones: ['entrance'] },
  { id: 'all-floors', name: 'All Floors', grid: '2x2', zones: ['floor-1', 'floor-2', 'floor-3', 'floor-4'] },
  { id: 'critical-zones', name: 'Critical Zones', grid: '3x3', zones: ['server-room', 'lab', 'executive', 'vault', 'it-room', 'records'] },
  { id: 'perimeter', name: 'Perimeter Security', grid: 'pip', zones: ['parking', 'loading-dock', 'main-entrance', 'emergency-exits'] }
];

export function MultiViewMonitoring() {
  const [selectedLayout, setSelectedLayout] = useState<ViewLayout>(presetLayouts[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedView, setSelectedView] = useState<string | null>(null);

  const zones = [
    { id: 'entrance', name: 'Main Entrance', status: 'normal', activeUsers: 45, doors: 2, cameras: 4 },
    { id: 'floor-1', name: 'Floor 1', status: 'normal', activeUsers: 120, doors: 8, cameras: 12 },
    { id: 'floor-2', name: 'Floor 2', status: 'alert', activeUsers: 89, doors: 8, cameras: 12 },
    { id: 'floor-3', name: 'Floor 3', status: 'normal', activeUsers: 67, doors: 6, cameras: 10 },
    { id: 'server-room', name: 'Server Room', status: 'critical', activeUsers: 2, doors: 1, cameras: 4 },
    { id: 'lab', name: 'Research Lab', status: 'normal', activeUsers: 15, doors: 3, cameras: 6 },
  ];

  const getGridClass = () => {
    switch (selectedLayout.grid) {
      case '2x2': return 'grid-cols-2 grid-rows-2';
      case '3x3': return 'grid-cols-3 grid-rows-3';
      case 'pip': return 'grid-cols-4 grid-rows-3';
      default: return 'grid-cols-1';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'alert': return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      default: return 'border-green-500 bg-green-50 dark:bg-green-950/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'alert': return <Badge variant="outline" className="text-orange-600 border-orange-600">Alert</Badge>;
      default: return <Badge variant="outline" className="text-green-600 border-green-600">Normal</Badge>;
    }
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6' : ''}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedLayout.id} onValueChange={(value) => {
            const layout = presetLayouts.find(l => l.id === value);
            if (layout) setSelectedLayout(layout);
          }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {presetLayouts.map(layout => (
                <SelectItem key={layout.id} value={layout.id}>
                  {layout.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setSelectedLayout({...selectedLayout, grid: 'single'})}>
              <Square className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setSelectedLayout({...selectedLayout, grid: '2x2'})}>
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setSelectedLayout({...selectedLayout, grid: 'pip'})}>
              <PictureInPicture className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save Layout
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RotateCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Multi-View Grid */}
      <div className={`grid gap-4 ${getGridClass()} ${isFullscreen ? 'h-[calc(100vh-8rem)]' : 'h-[600px]'}`}>
        {selectedLayout.grid === 'pip' ? (
          <>
            {/* Main view */}
            <div className="col-span-3 row-span-3">
              <MonitoringView 
                zone={zones.find(z => z.id === selectedLayout.zones[0]) || zones[0]}
                isMain={true}
                onSelect={() => setSelectedView(selectedLayout.zones[0])}
              />
            </div>
            {/* PIP views */}
            <div className="col-span-1 row-span-3 space-y-4">
              {selectedLayout.zones.slice(1, 4).map((zoneId, index) => {
                const zone = zones.find(z => z.id === zoneId) || zones[index + 1];
                return (
                  <MonitoringView 
                    key={zoneId}
                    zone={zone}
                    isCompact={true}
                    onSelect={() => setSelectedView(zoneId)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          selectedLayout.zones.map((zoneId) => {
            const zone = zones.find(z => z.id === zoneId) || zones[0];
            return (
              <MonitoringView 
                key={zoneId}
                zone={zone}
                onSelect={() => setSelectedView(zoneId)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

interface MonitoringViewProps {
  zone: {
    id: string;
    name: string;
    status: string;
    activeUsers: number;
    doors: number;
    cameras: number;
  };
  isMain?: boolean;
  isCompact?: boolean;
  onSelect?: () => void;
}

function MonitoringView({ zone, isMain = false, isCompact = false, onSelect }: MonitoringViewProps) {
  const statusColor = zone.status === 'critical' ? 'border-red-500' : 
                      zone.status === 'alert' ? 'border-orange-500' : 
                      'border-green-500';

  return (
    <Card 
      className={`h-full cursor-pointer transition-all hover:shadow-lg ${statusColor} border-2`}
      onClick={onSelect}
    >
      <CardHeader className={isCompact ? 'p-3' : 'pb-3'}>
        <div className="flex items-center justify-between">
          <CardTitle className={isCompact ? 'text-sm' : isMain ? 'text-xl' : 'text-lg'}>
            {zone.name}
          </CardTitle>
          {zone.status === 'critical' ? 
            <Badge variant="destructive">Critical</Badge> : 
            zone.status === 'alert' ? 
            <Badge variant="outline" className="text-orange-600 border-orange-600">Alert</Badge> :
            <Badge variant="outline" className="text-green-600 border-green-600">Normal</Badge>
          }
        </div>
      </CardHeader>
      <CardContent className={isCompact ? 'p-3 pt-0' : ''}>
        {isCompact ? (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {zone.activeUsers}
            </span>
            <span className="flex items-center gap-1">
              <DoorOpen className="h-3 w-3" />
              {zone.doors}
            </span>
            <span className="flex items-center gap-1">
              <Camera className="h-3 w-3" />
              {zone.cameras}
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Placeholder for actual monitoring content */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Monitor className="h-12 w-12 text-muted-foreground" />
            </div>
            
            {/* Zone stats */}
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center p-2 rounded bg-muted">
                <Users className="h-4 w-4 mx-auto mb-1" />
                <div className="font-semibold">{zone.activeUsers}</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center p-2 rounded bg-muted">
                <DoorOpen className="h-4 w-4 mx-auto mb-1" />
                <div className="font-semibold">{zone.doors}</div>
                <div className="text-xs text-muted-foreground">Doors</div>
              </div>
              <div className="text-center p-2 rounded bg-muted">
                <Camera className="h-4 w-4 mx-auto mb-1" />
                <div className="font-semibold">{zone.cameras}</div>
                <div className="text-xs text-muted-foreground">Cameras</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}