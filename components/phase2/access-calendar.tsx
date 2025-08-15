"use client";

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Copy,
  Edit,
  Save,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Timer,
  Users,
  DoorOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format, startOfWeek, addDays, isSameDay, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AccessSchedule {
  id: string;
  name: string;
  description?: string;
  type: 'regular' | 'temporary' | 'holiday';
  startDate?: Date;
  endDate?: Date;
  timeSlots: TimeSlot[];
  repeatPattern?: RepeatPattern;
  users: string[];
  doors: string[];
  isActive: boolean;
  priority: number;
}

interface TimeSlot {
  id: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
  date?: Date; // For specific dates
}

interface RepeatPattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

interface Holiday {
  id: string;
  name: string;
  date: Date;
  recurring: boolean;
}

interface ScheduleConflict {
  schedule1: AccessSchedule;
  schedule2: AccessSchedule;
  type: 'time' | 'user' | 'door';
  description: string;
}

export function AccessCalendar() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [schedules, setSchedules] = useState<AccessSchedule[]>([
    {
      id: '1',
      name: 'Standard Business Hours',
      description: 'Regular employee access hours',
      type: 'regular',
      timeSlots: [
        { id: '1-1', dayOfWeek: 1, startTime: '08:00', endTime: '18:00' },
        { id: '1-2', dayOfWeek: 2, startTime: '08:00', endTime: '18:00' },
        { id: '1-3', dayOfWeek: 3, startTime: '08:00', endTime: '18:00' },
        { id: '1-4', dayOfWeek: 4, startTime: '08:00', endTime: '18:00' },
        { id: '1-5', dayOfWeek: 5, startTime: '08:00', endTime: '18:00' },
      ],
      repeatPattern: { type: 'weekly', interval: 1, daysOfWeek: [1, 2, 3, 4, 5] },
      users: ['user-1', 'user-2', 'user-3'],
      doors: ['door-1', 'door-2', 'door-4', 'door-5'],
      isActive: true,
      priority: 1,
    },
    {
      id: '2',
      name: 'IT Support Extended Hours',
      description: 'Extended access for IT staff',
      type: 'regular',
      timeSlots: [
        { id: '2-1', dayOfWeek: 1, startTime: '06:00', endTime: '22:00' },
        { id: '2-2', dayOfWeek: 2, startTime: '06:00', endTime: '22:00' },
        { id: '2-3', dayOfWeek: 3, startTime: '06:00', endTime: '22:00' },
        { id: '2-4', dayOfWeek: 4, startTime: '06:00', endTime: '22:00' },
        { id: '2-5', dayOfWeek: 5, startTime: '06:00', endTime: '22:00' },
        { id: '2-6', dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
      ],
      repeatPattern: { type: 'weekly', interval: 1, daysOfWeek: [1, 2, 3, 4, 5, 6] },
      users: ['user-10', 'user-11'],
      doors: ['door-7', 'door-8', 'door-9'],
      isActive: true,
      priority: 2,
    },
  ]);
  
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: "New Year's Day", date: new Date('2025-01-01'), recurring: true },
    { id: '2', name: 'Christmas Day', date: new Date('2025-12-25'), recurring: true },
  ]);
  
  const [selectedSchedule, setSelectedSchedule] = useState<AccessSchedule | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<AccessSchedule | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  useEffect(() => {
    checkConflicts();
  }, [schedules]);

  const checkConflicts = () => {
    const detectedConflicts: ScheduleConflict[] = [];
    
    // Check for time conflicts
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        const schedule1 = schedules[i];
        const schedule2 = schedules[j];
        
        // Check if they share users or doors
        const sharedUsers = schedule1.users.filter(u => schedule2.users.includes(u));
        const sharedDoors = schedule1.doors.filter(d => schedule2.doors.includes(d));
        
        if (sharedUsers.length > 0 || sharedDoors.length > 0) {
          // Check for time overlap
          const hasTimeOverlap = schedule1.timeSlots.some(slot1 =>
            schedule2.timeSlots.some(slot2 => {
              if (slot1.dayOfWeek === slot2.dayOfWeek) {
                return (
                  (slot1.startTime >= slot2.startTime && slot1.startTime < slot2.endTime) ||
                  (slot2.startTime >= slot1.startTime && slot2.startTime < slot1.endTime)
                );
              }
              return false;
            })
          );
          
          if (hasTimeOverlap) {
            detectedConflicts.push({
              schedule1,
              schedule2,
              type: 'time',
              description: `Time overlap between "${schedule1.name}" and "${schedule2.name}"`,
            });
          }
        }
      }
    }
    
    setConflicts(detectedConflicts);
  };

  const getSchedulesForDate = (date: Date): AccessSchedule[] => {
    const dayOfWeek = getDay(date);
    
    return schedules.filter(schedule => {
      if (!schedule.isActive) return false;
      
      // Check if date is within schedule range
      if (schedule.startDate && date < schedule.startDate) return false;
      if (schedule.endDate && date > schedule.endDate) return false;
      
      // Check if schedule applies to this day
      if (schedule.type === 'regular') {
        return schedule.timeSlots.some(slot => slot.dayOfWeek === dayOfWeek);
      } else if (schedule.type === 'temporary') {
        return schedule.timeSlots.some(slot => 
          slot.date && isSameDay(slot.date, date)
        );
      }
      
      return false;
    });
  };

  const getHolidayForDate = (date: Date): Holiday | undefined => {
    return holidays.find(holiday => 
      holiday.date.getMonth() === date.getMonth() &&
      holiday.date.getDate() === date.getDate()
    );
  };

  const handleCreateSchedule = () => {
    setEditingSchedule({
      id: Date.now().toString(),
      name: '',
      type: 'regular',
      timeSlots: [],
      users: [],
      doors: [],
      isActive: true,
      priority: schedules.length + 1,
    });
    setShowScheduleDialog(true);
  };

  const handleSaveSchedule = () => {
    if (!editingSchedule || !editingSchedule.name) {
      toast({
        title: "Invalid schedule",
        description: "Please provide a schedule name",
        variant: "destructive",
      });
      return;
    }
    
    if (editingSchedule.timeSlots.length === 0) {
      toast({
        title: "No time slots",
        description: "Please add at least one time slot",
        variant: "destructive",
      });
      return;
    }
    
    const isNew = !schedules.find(s => s.id === editingSchedule.id);
    
    if (isNew) {
      setSchedules([...schedules, editingSchedule]);
    } else {
      setSchedules(schedules.map(s => 
        s.id === editingSchedule.id ? editingSchedule : s
      ));
    }
    
    toast({
      title: isNew ? "Schedule created" : "Schedule updated",
      description: `${editingSchedule.name} has been ${isNew ? 'created' : 'updated'}`,
    });
    
    setShowScheduleDialog(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId));
    toast({
      title: "Schedule deleted",
      description: "The schedule has been removed",
    });
  };

  const handleDuplicateSchedule = (schedule: AccessSchedule) => {
    const newSchedule: AccessSchedule = {
      ...schedule,
      id: Date.now().toString(),
      name: `${schedule.name} (Copy)`,
    };
    setSchedules([...schedules, newSchedule]);
    toast({
      title: "Schedule duplicated",
      description: `Created a copy of ${schedule.name}`,
    });
  };

  const addTimeSlot = () => {
    if (!editingSchedule) return;
    
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
    };
    
    setEditingSchedule({
      ...editingSchedule,
      timeSlots: [...editingSchedule.timeSlots, newSlot],
    });
  };

  const removeTimeSlot = (slotId: string) => {
    if (!editingSchedule) return;
    
    setEditingSchedule({
      ...editingSchedule,
      timeSlots: editingSchedule.timeSlots.filter(s => s.id !== slotId),
    });
  };

  const navigateCalendar = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(prev => 
        direction === 'prev'
          ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
          : new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
      );
    } else if (viewMode === 'week') {
      setCurrentDate(prev => addDays(prev, direction === 'prev' ? -7 : 7));
    } else {
      setCurrentDate(prev => addDays(prev, direction === 'prev' ? -1 : 1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Access Schedule Calendar</CardTitle>
              <CardDescription>
                Manage time-based access permissions and holiday schedules
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateSchedule}>
                <Plus className="mr-2 h-4 w-4" />
                New Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{conflicts.length} schedule conflicts detected.</strong>
            {' '}Review and resolve conflicts to ensure proper access control.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateCalendar('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
                </h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateCalendar('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'month' && (
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {daysOfWeek.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {monthDays.map((date, index) => {
                  const daySchedules = getSchedulesForDate(date);
                  const holiday = getHolidayForDate(date);
                  const isToday = isSameDay(date, new Date());
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[100px] rounded-lg border p-2",
                        isToday && "border-primary bg-primary/5",
                        holiday && "bg-red-50 dark:bg-red-950/20"
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className={cn(
                          "text-sm font-medium",
                          date.getMonth() !== currentDate.getMonth() && "text-muted-foreground"
                        )}>
                          {format(date, 'd')}
                        </span>
                        {holiday && (
                          <Badge variant="destructive" className="text-xs">
                            Holiday
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {daySchedules.slice(0, 2).map(schedule => (
                          <TooltipProvider key={schedule.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="cursor-pointer rounded px-1 py-0.5 text-xs truncate"
                                  style={{
                                    backgroundColor: `hsl(${schedule.priority * 60}, 70%, 90%)`,
                                    color: `hsl(${schedule.priority * 60}, 70%, 30%)`,
                                  }}
                                  onClick={() => setSelectedSchedule(schedule)}
                                >
                                  {schedule.name}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{schedule.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {schedule.users.length} users, {schedule.doors.length} doors
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        {daySchedules.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{daySchedules.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {schedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className={cn(
                      "rounded-lg border p-3 cursor-pointer hover:bg-muted",
                      selectedSchedule?.id === schedule.id && "border-primary"
                    )}
                    onClick={() => setSelectedSchedule(schedule)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{schedule.name}</h4>
                          <Badge variant={schedule.isActive ? "default" : "secondary"}>
                            {schedule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {schedule.description && (
                          <p className="text-xs text-muted-foreground">
                            {schedule.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {schedule.users.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <DoorOpen className="h-3 w-3" />
                            {schedule.doors.length}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {schedule.timeSlots.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSchedule(schedule);
                            setShowScheduleDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSchedule(schedule);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSchedule(schedule.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Selected Schedule Details */}
      {selectedSchedule && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{selectedSchedule.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedSchedule(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-sm font-medium">Time Slots</h4>
                <div className="space-y-2">
                  {selectedSchedule.timeSlots.map(slot => (
                    <div key={slot.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        {slot.dayOfWeek !== undefined ? daysOfWeek[slot.dayOfWeek] : format(slot.date!, 'MMM d')}
                      </Badge>
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium">Access Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{selectedSchedule.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <span>{selectedSchedule.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Users:</span>
                    <span>{selectedSchedule.users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doors:</span>
                    <span>{selectedSchedule.doors.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule && schedules.find(s => s.id === editingSchedule.id) 
                ? 'Edit Schedule' 
                : 'Create Schedule'}
            </DialogTitle>
            <DialogDescription>
              Configure time-based access permissions for users and doors
            </DialogDescription>
          </DialogHeader>
          
          {editingSchedule && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schedule-name">Schedule Name</Label>
                  <Input
                    id="schedule-name"
                    value={editingSchedule.name}
                    onChange={(e) => setEditingSchedule({
                      ...editingSchedule,
                      name: e.target.value,
                    })}
                    placeholder="e.g., Standard Business Hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-type">Type</Label>
                  <Select
                    value={editingSchedule.type}
                    onValueChange={(value: any) => setEditingSchedule({
                      ...editingSchedule,
                      type: value,
                    })}
                  >
                    <SelectTrigger id="schedule-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-description">Description</Label>
                <Input
                  id="schedule-description"
                  value={editingSchedule.description || ''}
                  onChange={(e) => setEditingSchedule({
                    ...editingSchedule,
                    description: e.target.value,
                  })}
                  placeholder="Optional description"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Time Slots</Label>
                  <Button size="sm" onClick={addTimeSlot}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Time Slot
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingSchedule.timeSlots.map((slot, index) => (
                    <div key={slot.id} className="flex items-center gap-2">
                      <Select
                        value={slot.dayOfWeek?.toString() || '1'}
                        onValueChange={(value) => {
                          const newSlots = [...editingSchedule.timeSlots];
                          newSlots[index] = { ...slot, dayOfWeek: parseInt(value) };
                          setEditingSchedule({
                            ...editingSchedule,
                            timeSlots: newSlots,
                          });
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => {
                          const newSlots = [...editingSchedule.timeSlots];
                          newSlots[index] = { ...slot, startTime: e.target.value };
                          setEditingSchedule({
                            ...editingSchedule,
                            timeSlots: newSlots,
                          });
                        }}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => {
                          const newSlots = [...editingSchedule.timeSlots];
                          newSlots[index] = { ...slot, endTime: e.target.value };
                          setEditingSchedule({
                            ...editingSchedule,
                            timeSlots: newSlots,
                          });
                        }}
                        className="w-32"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="schedule-active"
                  checked={editingSchedule.isActive}
                  onCheckedChange={(checked) => setEditingSchedule({
                    ...editingSchedule,
                    isActive: checked,
                  })}
                />
                <Label htmlFor="schedule-active">Schedule is active</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowScheduleDialog(false);
              setEditingSchedule(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>
              <Save className="mr-2 h-4 w-4" />
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}