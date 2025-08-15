"use client";

import { useState, useEffect } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided
} from '@hello-pangea/dnd';
import { 
  Users, 
  DoorOpen, 
  Lock, 
  Unlock, 
  Shield,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Copy,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Door, Zone } from '@/lib/types';
import { apiService } from '@/lib/api/api-service';
import { cn } from '@/lib/utils';

interface AccessRight {
  userId: string;
  doorId: string;
  hasAccess: boolean;
  inherited: boolean;
  source?: string;
}

interface AccessTemplate {
  id: string;
  name: string;
  description: string;
  doors: string[];
}

export function AccessMatrix() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [doors, setDoors] = useState<Door[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [accessRights, setAccessRights] = useState<Map<string, AccessRight>>(new Map());
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDoors, setSelectedDoors] = useState<string[]>([]);
  const [expandedZones, setExpandedZones] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showInherited, setShowInherited] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [viewMode, setViewMode] = useState<'users' | 'doors'>('users');

  const templates: AccessTemplate[] = [
    {
      id: 'employee-basic',
      name: 'Employee Basic',
      description: 'Standard employee access',
      doors: ['door-1', 'door-2', 'door-4', 'door-5'],
    },
    {
      id: 'manager',
      name: 'Manager Access',
      description: 'Manager level access',
      doors: ['door-1', 'door-2', 'door-3', 'door-4', 'door-5', 'door-6'],
    },
    {
      id: 'it-admin',
      name: 'IT Administrator',
      description: 'IT department full access',
      doors: ['door-7', 'door-8', 'door-9'],
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, doorsData, zonesData] = await Promise.all([
        apiService.getUsers(),
        apiService.getDoors(),
        apiService.getZones(),
      ]);
      
      setUsers(usersData);
      setDoors(doorsData);
      setZones(zonesData);
      
      // Initialize access rights (in real app, would load from API)
      const rights = new Map<string, AccessRight>();
      usersData.forEach(user => {
        doorsData.forEach(door => {
          const key = `${user.id}-${door.id}`;
          const hasAccess = Math.random() > 0.7; // Mock data
          rights.set(key, {
            userId: user.id,
            doorId: door.id,
            hasAccess,
            inherited: Math.random() > 0.8,
            source: Math.random() > 0.8 ? 'Department Policy' : undefined,
          });
        });
      });
      setAccessRights(rights);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to load users and doors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === 'users' && destination.droppableId.startsWith('door-')) {
      // User dragged to door - grant access
      const userId = draggableId;
      const doorId = destination.droppableId;
      updateAccess(userId, doorId, true);
    } else if (source.droppableId === 'doors' && destination.droppableId.startsWith('user-')) {
      // Door dragged to user - grant access
      const doorId = draggableId;
      const userId = destination.droppableId;
      updateAccess(userId, doorId, true);
    }
  };

  const updateAccess = (userId: string, doorId: string, hasAccess: boolean) => {
    const key = `${userId}-${doorId}`;
    const newRights = new Map(accessRights);
    newRights.set(key, {
      userId,
      doorId,
      hasAccess,
      inherited: false,
    });
    setAccessRights(newRights);
    setHasChanges(true);
  };

  const toggleAccess = (userId: string, doorId: string) => {
    const key = `${userId}-${doorId}`;
    const current = accessRights.get(key);
    updateAccess(userId, doorId, !current?.hasAccess);
  };

  const applyTemplate = (template: AccessTemplate, userIds: string[]) => {
    const newRights = new Map(accessRights);
    
    userIds.forEach(userId => {
      doors.forEach(door => {
        const key = `${userId}-${door.id}`;
        const hasAccess = template.doors.includes(door.id);
        newRights.set(key, {
          userId,
          doorId: door.id,
          hasAccess,
          inherited: false,
        });
      });
    });
    
    setAccessRights(newRights);
    setHasChanges(true);
    
    toast({
      title: "Template applied",
      description: `${template.name} applied to ${userIds.length} users`,
    });
  };

  const bulkUpdate = (action: 'grant' | 'revoke') => {
    if (selectedUsers.length === 0 || selectedDoors.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select users and doors to update",
        variant: "destructive",
      });
      return;
    }

    const newRights = new Map(accessRights);
    
    selectedUsers.forEach(userId => {
      selectedDoors.forEach(doorId => {
        const key = `${userId}-${doorId}`;
        newRights.set(key, {
          userId,
          doorId,
          hasAccess: action === 'grant',
          inherited: false,
        });
      });
    });
    
    setAccessRights(newRights);
    setHasChanges(true);
    setSelectedUsers([]);
    setSelectedDoors([]);
    
    toast({
      title: `Access ${action === 'grant' ? 'granted' : 'revoked'}`,
      description: `Updated ${selectedUsers.length} users × ${selectedDoors.length} doors`,
    });
  };

  const saveChanges = async () => {
    try {
      // In real app, would save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      toast({
        title: "Changes saved",
        description: "Access rights have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || user.departmentId === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const getDoorsByZone = (zoneId: string) => {
    return doors.filter(door => door.zoneId === zoneId);
  };

  const toggleZoneExpansion = (zoneId: string) => {
    setExpandedZones(prev =>
      prev.includes(zoneId)
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const hasAccess = (userId: string, doorId: string) => {
    const key = `${userId}-${doorId}`;
    return accessRights.get(key)?.hasAccess || false;
  };

  const isInherited = (userId: string, doorId: string) => {
    const key = `${userId}-${doorId}`;
    return accessRights.get(key)?.inherited || false;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Access Rights Matrix</CardTitle>
                <CardDescription>
                  Manage user access permissions across all doors and zones
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <Badge variant="destructive">Unsaved changes</Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadData()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={saveChanges}
                  disabled={!hasChanges}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="department">Department</Label>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger id="department">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="dept-1">Engineering</SelectItem>
                      <SelectItem value="dept-2">Sales</SelectItem>
                      <SelectItem value="dept-3">HR</SelectItem>
                      <SelectItem value="dept-4">Finance</SelectItem>
                      <SelectItem value="dept-5">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => bulkUpdate('grant')}
                    disabled={selectedUsers.length === 0 || selectedDoors.length === 0}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Grant Selected
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => bulkUpdate('revoke')}
                    disabled={selectedUsers.length === 0 || selectedDoors.length === 0}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Revoke Selected
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-inherited"
                      checked={showInherited}
                      onCheckedChange={setShowInherited}
                    />
                    <Label htmlFor="show-inherited">Show inherited permissions</Label>
                  </div>
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'users' | 'doors')}>
                    <TabsList>
                      <TabsTrigger value="users">By Users</TabsTrigger>
                      <TabsTrigger value="doors">By Doors</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedUsers.length} users, {selectedDoors.length} doors selected
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Templates Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Access Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-lg border p-3 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    if (selectedUsers.length > 0) {
                      applyTemplate(template, selectedUsers);
                    } else {
                      toast({
                        title: "Select users first",
                        description: "Please select users to apply the template",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.doors.length} doors
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Access Matrix */}
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] w-full">
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="sticky left-0 bg-background p-2 text-left">
                          <Checkbox
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onCheckedChange={(checked) => {
                              setSelectedUsers(checked ? filteredUsers.map(u => u.id) : []);
                            }}
                          />
                        </th>
                        <th className="sticky left-8 bg-background p-2 text-left">User</th>
                        {zones.map((zone) => (
                          <th
                            key={zone.id}
                            className="p-2 text-center"
                            colSpan={getDoorsByZone(zone.id).length}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => toggleZoneExpansion(zone.id)}
                                className="flex items-center gap-1 text-sm font-medium hover:text-primary"
                              >
                                {expandedZones.includes(zone.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                {zone.name}
                              </button>
                              <Badge variant="secondary" className="text-xs">
                                {getDoorsByZone(zone.id).length}
                              </Badge>
                            </div>
                          </th>
                        ))}
                      </tr>
                      {expandedZones.length > 0 && (
                        <tr>
                          <th colSpan={2}></th>
                          {zones.map((zone) =>
                            expandedZones.includes(zone.id) ? (
                              getDoorsByZone(zone.id).map((door) => (
                                <th key={door.id} className="p-2 text-center">
                                  <div className="flex flex-col items-center gap-1">
                                    <Checkbox
                                      checked={selectedDoors.includes(door.id)}
                                      onCheckedChange={(checked) => {
                                        setSelectedDoors(prev =>
                                          checked
                                            ? [...prev, door.id]
                                            : prev.filter(id => id !== door.id)
                                        );
                                      }}
                                    />
                                    <span className="text-xs font-normal">
                                      {door.name}
                                    </span>
                                  </div>
                                </th>
                              ))
                            ) : (
                              <th
                                key={zone.id}
                                colSpan={getDoorsByZone(zone.id).length}
                              ></th>
                            )
                          )}
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="sticky left-0 bg-background p-2">
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => {
                                setSelectedUsers(prev =>
                                  checked
                                    ? [...prev, user.id]
                                    : prev.filter(id => id !== user.id)
                                );
                              }}
                            />
                          </td>
                          <td className="sticky left-8 bg-background p-2">
                            <Droppable droppableId={`user-${user.id}`}>
                              {(provided: DroppableProvided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="flex items-center gap-2"
                                >
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </td>
                          {zones.map((zone) =>
                            expandedZones.includes(zone.id) ? (
                              getDoorsByZone(zone.id).map((door) => {
                                const access = hasAccess(user.id, door.id);
                                const inherited = isInherited(user.id, door.id);
                                
                                return (
                                  <td key={door.id} className="p-2 text-center">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            onClick={() => toggleAccess(user.id, door.id)}
                                            className={cn(
                                              "h-8 w-8 rounded-md border transition-colors",
                                              access
                                                ? inherited
                                                  ? "border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-950"
                                                  : "border-green-500 bg-green-100 text-green-700 dark:bg-green-950"
                                                : "border-gray-300 bg-gray-50 text-gray-400 dark:bg-gray-900",
                                              !inherited && "hover:opacity-80"
                                            )}
                                            disabled={inherited && !showInherited}
                                          >
                                            {access ? (
                                              <Check className="h-4 w-4 mx-auto" />
                                            ) : (
                                              <X className="h-4 w-4 mx-auto" />
                                            )}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{access ? 'Access granted' : 'No access'}</p>
                                          {inherited && (
                                            <p className="text-xs">Inherited from group</p>
                                          )}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </td>
                                );
                              })
                            ) : (
                              <td
                                key={zone.id}
                                colSpan={getDoorsByZone(zone.id).length}
                                className="p-2 text-center"
                              >
                                <span className="text-xs text-muted-foreground">
                                  {getDoorsByZone(zone.id).filter(door => 
                                    hasAccess(user.id, door.id)
                                  ).length} / {getDoorsByZone(zone.id).length}
                                </span>
                              </td>
                            )
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-around text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-green-500 bg-green-100 dark:bg-green-950" />
                <span>Direct Access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-blue-500 bg-blue-100 dark:bg-blue-950" />
                <span>Inherited Access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-gray-300 bg-gray-50 dark:bg-gray-900" />
                <span>No Access</span>
              </div>
              <div className="flex items-center gap-2">
                <DoorOpen className="h-4 w-4" />
                <span>Drag users to doors or vice versa to grant access</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DragDropContext>
  );
}