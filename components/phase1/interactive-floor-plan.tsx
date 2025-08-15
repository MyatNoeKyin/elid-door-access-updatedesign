"use client";

import { useEffect, useRef, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3,
  Lock,
  Unlock,
  AlertTriangle,
  Users,
  Activity
} from 'lucide-react';
import { useDoorStore, useZoneStore, useAccessEventStore } from '@/lib/state/store';
import { Door, Zone, DoorStatus, AccessEvent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { getWebSocketService } from '@/lib/services/websocket';
import { WebSocketMessageType } from '@/lib/types';
import { apiService } from '@/lib/api/api-service';
import { formatDistanceToNow } from 'date-fns';

interface FloorPlanProps {
  floorId?: string;
  interactive?: boolean;
  showHeatmap?: boolean;
}

export function InteractiveFloorPlan({ 
  floorId = 'floor-1', 
  interactive = true,
  showHeatmap = false 
}: FloorPlanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { doors, doorStatus } = useDoorStore();
  const { zones } = useZoneStore();
  const { recentEvents } = useAccessEventStore();
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
  const [hoveredDoor, setHoveredDoor] = useState<Door | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [heatmapData, setHeatmapData] = useState<Map<string, number>>(new Map());

  // Filter doors and zones for current floor
  const floorDoors = doors.filter(door => door.floorId === floorId);
  const floorZones = zones.filter(zone => zone.floorId === floorId);

  useEffect(() => {
    // Subscribe to door status updates
    const ws = getWebSocketService();
    const unsubscribe = ws.subscribe(WebSocketMessageType.DOOR_STATUS_UPDATE, (message) => {
      const door = message.payload as Door;
      if (door.floorId === floorId) {
        useDoorStore.getState().updateDoor(door);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [floorId]);

  useEffect(() => {
    // Calculate heatmap data based on recent access events
    if (showHeatmap && recentEvents.length > 0) {
      const heatmap = new Map<string, number>();
      const now = Date.now();
      const hourAgo = now - 3600000; // 1 hour
      
      recentEvents
        .filter(event => event.timestamp.getTime() > hourAgo)
        .forEach(event => {
          const count = heatmap.get(event.doorId) || 0;
          heatmap.set(event.doorId, count + 1);
        });
      
      setHeatmapData(heatmap);
    }
  }, [recentEvents, showHeatmap]);

  useEffect(() => {
    drawFloorPlan();
  }, [floorDoors, floorZones, zoom, pan, showGrid, showLabels, hoveredDoor, heatmapData, showHeatmap]);

  const drawFloorPlan = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context state
    ctx.save();
    
    // Apply zoom and pan transformations
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, canvas.width / zoom, canvas.height / zoom);
    }

    // Draw zones
    floorZones.forEach(zone => {
      drawZone(ctx, zone);
    });

    // Draw doors
    floorDoors.forEach(door => {
      drawDoor(ctx, door);
    });

    // Draw heatmap overlay
    if (showHeatmap) {
      drawHeatmapOverlay(ctx);
    }

    // Restore context state
    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)'; // gray-400 with opacity
    ctx.lineWidth = 0.5;
    
    const gridSize = 50;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawZone = (ctx: CanvasRenderingContext2D, zone: Zone) => {
    // Define zone boundaries (in a real app, these would come from data)
    const zoneBounds = getZoneBounds(zone.id);
    
    ctx.fillStyle = getZoneColor(zone);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    
    ctx.fillRect(zoneBounds.x, zoneBounds.y, zoneBounds.width, zoneBounds.height);
    ctx.strokeRect(zoneBounds.x, zoneBounds.y, zoneBounds.width, zoneBounds.height);
    
    // Draw zone label
    if (showLabels) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(zone.name, zoneBounds.x + zoneBounds.width / 2, zoneBounds.y + 20);
      
      // Draw occupancy
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `${zone.occupancy}/${zone.maxOccupancy} people`,
        zoneBounds.x + zoneBounds.width / 2,
        zoneBounds.y + 35
      );
    }
  };

  const drawDoor = (ctx: CanvasRenderingContext2D, door: Door) => {
    const doorSize = 30;
    const x = door.coordinates?.x || 0;
    const y = door.coordinates?.y || 0;
    
    // Draw door background
    ctx.fillStyle = getDoorColor(door);
    ctx.strokeStyle = door === hoveredDoor ? '#000' : 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = door === hoveredDoor ? 3 : 2;
    
    ctx.beginPath();
    ctx.roundRect(x - doorSize / 2, y - doorSize / 2, doorSize, doorSize, 5);
    ctx.fill();
    ctx.stroke();
    
    // Draw door icon
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const icon = door.status === DoorStatus.LOCKED ? '🔒' : 
                 door.status === DoorStatus.UNLOCKED ? '🔓' :
                 door.status === DoorStatus.FORCED_OPEN ? '⚠️' :
                 door.status === DoorStatus.HELD_OPEN ? '🚪' : '❌';
    
    ctx.fillText(icon, x, y);
    
    // Draw door label
    if (showLabels) {
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.fillText(door.name, x, y + doorSize / 2 + 10);
    }
    
    // Draw activity indicator
    const accessCount = heatmapData.get(door.id) || 0;
    if (accessCount > 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; // red-500
      ctx.beginPath();
      ctx.arc(x + doorSize / 2, y - doorSize / 2, Math.min(accessCount * 2, 15), 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(accessCount.toString(), x + doorSize / 2, y - doorSize / 2);
    }
  };

  const drawHeatmapOverlay = (ctx: CanvasRenderingContext2D) => {
    heatmapData.forEach((count, doorId) => {
      const door = floorDoors.find(d => d.id === doorId);
      if (!door || !door.coordinates) return;
      
      const intensity = Math.min(count / 20, 1); // Normalize to 0-1
      const radius = 50 + count * 5;
      
      // Create radial gradient
      const gradient = ctx.createRadialGradient(
        door.coordinates.x,
        door.coordinates.y,
        0,
        door.coordinates.x,
        door.coordinates.y,
        radius
      );
      
      gradient.addColorStop(0, `rgba(239, 68, 68, ${intensity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(239, 68, 68, ${intensity * 0.2})`);
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(door.coordinates.x, door.coordinates.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const getZoneBounds = (zoneId: string) => {
    // In a real app, these would be stored in the zone data
    const bounds: Record<string, { x: number; y: number; width: number; height: number }> = {
      'zone-1': { x: 50, y: 50, width: 200, height: 150 },
      'zone-2': { x: 300, y: 50, width: 250, height: 150 },
      'zone-3': { x: 50, y: 250, width: 150, height: 100 },
      'zone-4': { x: 250, y: 250, width: 200, height: 100 },
      'zone-5': { x: 500, y: 250, width: 150, height: 100 },
    };
    
    return bounds[zoneId] || { x: 0, y: 0, width: 100, height: 100 };
  };

  const getZoneColor = (zone: Zone) => {
    if (zone.activeAlerts > 0) {
      return 'rgba(239, 68, 68, 0.2)'; // red-500
    }
    
    switch (zone.securityLevel) {
      case 'CRITICAL':
        return 'rgba(220, 38, 38, 0.1)'; // red-600
      case 'HIGH':
        return 'rgba(245, 158, 11, 0.1)'; // amber-500
      case 'MEDIUM':
        return 'rgba(59, 130, 246, 0.1)'; // blue-500
      default:
        return 'rgba(156, 163, 175, 0.1)'; // gray-400
    }
  };

  const getDoorColor = (door: Door) => {
    if (!door.isOnline) {
      return '#6B7280'; // gray-500
    }
    
    switch (door.status) {
      case DoorStatus.LOCKED:
        return '#10B981'; // green-500
      case DoorStatus.UNLOCKED:
        return '#3B82F6'; // blue-500
      case DoorStatus.FORCED_OPEN:
      case DoorStatus.HELD_OPEN:
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;
    
    // Check if click is on a door
    const clickedDoor = floorDoors.find(door => {
      if (!door.coordinates) return false;
      const doorSize = 30;
      return Math.abs(x - door.coordinates.x) < doorSize / 2 &&
             Math.abs(y - door.coordinates.y) < doorSize / 2;
    });
    
    setSelectedDoor(clickedDoor || null);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x) / zoom;
    const y = (event.clientY - rect.top - pan.y) / zoom;
    
    if (isDragging) {
      setPan({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      });
    } else {
      // Check if hovering over a door
      const hoveredDoor = floorDoors.find(door => {
        if (!door.coordinates) return false;
        const doorSize = 30;
        return Math.abs(x - door.coordinates.x) < doorSize / 2 &&
               Math.abs(y - door.coordinates.y) < doorSize / 2;
      });
      
      setHoveredDoor(hoveredDoor || null);
      canvas.style.cursor = hoveredDoor ? 'pointer' : isDragging ? 'grabbing' : 'grab';
    }
  };

  const handleDoorAction = async (door: Door, action: 'lock' | 'unlock') => {
    try {
      const newStatus = action === 'lock' ? DoorStatus.LOCKED : DoorStatus.UNLOCKED;
      await apiService.updateDoorStatus(door.id, newStatus);
      useDoorStore.getState().updateDoor({ ...door, status: newStatus });
      setSelectedDoor(null);
    } catch (error) {
      console.error('Failed to update door status:', error);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Floor Plan - {floorId.replace('-', ' ').toUpperCase()}</CardTitle>
          <div className="flex items-center gap-2">
            <Toggle
              size="sm"
              pressed={showGrid}
              onPressedChange={setShowGrid}
              aria-label="Toggle grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={showHeatmap}
              onPressedChange={() => {}}
              aria-label="Toggle heatmap"
            >
              <Activity className="h-4 w-4" />
            </Toggle>
            <Button size="sm" variant="outline" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
            <Button size="sm" variant="outline" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleResetView}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="relative h-[600px] overflow-hidden bg-gray-50 dark:bg-gray-900">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="absolute inset-0"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseDown={(e) => {
              if (!hoveredDoor) {
                setIsDragging(true);
                setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => {
              setIsDragging(false);
              setHoveredDoor(null);
            }}
          />
          
          {/* Door Info Popover */}
          {selectedDoor && interactive && (
            <Popover open={!!selectedDoor} onOpenChange={() => setSelectedDoor(null)}>
              <PopoverTrigger asChild>
                <div
                  className="absolute"
                  style={{
                    left: `${(selectedDoor.coordinates?.x || 0) * zoom + pan.x}px`,
                    top: `${(selectedDoor.coordinates?.y || 0) * zoom + pan.y}px`,
                  }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">{selectedDoor.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedDoor.location}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={selectedDoor.status === DoorStatus.LOCKED ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {selectedDoor.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Online:</span>
                      <Badge
                        variant={selectedDoor.isOnline ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {selectedDoor.isOnline ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedDoor.lastHeartbeat && (
                    <p className="text-xs text-muted-foreground">
                      Last heartbeat: {formatDistanceToNow(selectedDoor.lastHeartbeat, { addSuffix: true })}
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    {selectedDoor.status === DoorStatus.LOCKED ? (
                      <Button
                        size="sm"
                        onClick={() => handleDoorAction(selectedDoor, 'unlock')}
                        className="flex-1"
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Unlock
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleDoorAction(selectedDoor, 'lock')}
                        className="flex-1"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Lock
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1">
                      View Logs
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 rounded-lg bg-white/90 dark:bg-gray-900/90 p-3 shadow-md">
            <h5 className="mb-2 text-xs font-semibold">Legend</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-500" />
                <span>Locked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-blue-500" />
                <span>Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-500" />
                <span>Alert</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-gray-500" />
                <span>Offline</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}