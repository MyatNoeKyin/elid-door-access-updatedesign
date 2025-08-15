"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Layout,
  Palette,
  Bell,
  Star,
  Clock,
  Settings,
  User,
  Save,
  RotateCcw,
  ChevronRight,
  Grid,
  List,
  BarChart3,
  Plus,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  name: string;
  type: 'metric' | 'chart' | 'list' | 'alert';
  size: 'small' | 'medium' | 'large';
  visible: boolean;
  position: number;
}

interface FavoriteAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  category: string;
}

interface NotificationPreference {
  id: string;
  name: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
}

const defaultWidgets: DashboardWidget[] = [
  { id: 'security-score', name: 'Security Score', type: 'metric', size: 'small', visible: true, position: 0 },
  { id: 'active-alerts', name: 'Active Alerts', type: 'alert', size: 'medium', visible: true, position: 1 },
  { id: 'access-trends', name: 'Access Trends', type: 'chart', size: 'large', visible: true, position: 2 },
  { id: 'recent-events', name: 'Recent Events', type: 'list', size: 'medium', visible: true, position: 3 },
  { id: 'door-status', name: 'Door Status Grid', type: 'metric', size: 'large', visible: true, position: 4 },
  { id: 'compliance', name: 'Compliance Status', type: 'metric', size: 'small', visible: false, position: 5 },
  { id: 'user-activity', name: 'User Activity', type: 'list', size: 'medium', visible: false, position: 6 }
];

const availableActions: FavoriteAction[] = [
  { id: 'lockdown', name: 'Emergency Lockdown', icon: <Settings />, path: '/dashboard/emergency', category: 'Security' },
  { id: 'add-user', name: 'Add New User', icon: <User />, path: '/dashboard/users/new', category: 'Users' },
  { id: 'view-logs', name: 'View Access Logs', icon: <Clock />, path: '/dashboard/logs', category: 'Reports' },
  { id: 'door-control', name: 'Door Control Panel', icon: <Grid />, path: '/dashboard/doors', category: 'Access' },
  { id: 'reports', name: 'Generate Report', icon: <BarChart3 />, path: '/dashboard/reports', category: 'Reports' }
];

const notificationTypes: NotificationPreference[] = [
  { id: 'security-alerts', name: 'Security Alerts', email: true, push: true, inApp: true, sound: true },
  { id: 'access-denied', name: 'Access Denied Events', email: false, push: true, inApp: true, sound: true },
  { id: 'system-health', name: 'System Health', email: true, push: false, inApp: true, sound: false },
  { id: 'compliance', name: 'Compliance Updates', email: true, push: false, inApp: true, sound: false },
  { id: 'maintenance', name: 'Maintenance Notices', email: true, push: false, inApp: true, sound: false }
];

export function PersonalizationFeatures() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const [favoriteActions, setFavoriteActions] = useState<string[]>(['lockdown', 'add-user', 'view-logs']);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [compactMode, setCompactMode] = useState(false);
  const [notifications, setNotifications] = useState(notificationTypes);
  const [dashboardLayout, setDashboardLayout] = useState<'grid' | 'list'>('grid');

  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  };

  const toggleFavorite = (actionId: string) => {
    if (favoriteActions.includes(actionId)) {
      setFavoriteActions(favoriteActions.filter(id => id !== actionId));
    } else {
      setFavoriteActions([...favoriteActions, actionId]);
    }
  };

  const updateNotification = (id: string, field: 'email' | 'push' | 'inApp' | 'sound', value: boolean) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, [field]: value } : n
    ));
  };

  const resetToDefaults = () => {
    setWidgets(defaultWidgets);
    setFavoriteActions(['lockdown', 'add-user', 'view-logs']);
    setTheme('system');
    setCompactMode(false);
    setNotifications(notificationTypes);
    setDashboardLayout('grid');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Personalization Settings</h2>
          <p className="text-muted-foreground">
            Customize your dashboard and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard Layout</TabsTrigger>
          <TabsTrigger value="favorites">Favorite Actions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Dashboard Layout Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Widget Configuration</CardTitle>
              <CardDescription>Choose which widgets to display and customize their layout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layout Style */}
              <div className="space-y-3">
                <Label>Layout Style</Label>
                <div className="flex gap-2">
                  <Button
                    variant={dashboardLayout === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDashboardLayout('grid')}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid View
                  </Button>
                  <Button
                    variant={dashboardLayout === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDashboardLayout('list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Widget Selection */}
              <div className="space-y-3">
                <Label>Dashboard Widgets</Label>
                <div className="space-y-2">
                  {widgets.sort((a, b) => a.position - b.position).map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <div className="flex items-center gap-2">
                          {widget.visible ? (
                            <Eye className="h-4 w-4 text-primary" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">{widget.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {widget.type} • {widget.size}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={widget.visible ? 'default' : 'secondary'}>
                          {widget.visible ? 'Visible' : 'Hidden'}
                        </Badge>
                        <Switch
                          checked={widget.visible}
                          onCheckedChange={() => toggleWidget(widget.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <Label>Preview</Label>
                <div className="p-4 rounded-lg border bg-muted/20">
                  <div className={`grid gap-4 ${
                    dashboardLayout === 'grid' 
                      ? 'md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {widgets.filter(w => w.visible).map((widget) => (
                      <div
                        key={widget.id}
                        className={`h-24 rounded-lg border bg-background/50 flex items-center justify-center text-sm text-muted-foreground ${
                          widget.size === 'large' ? 'md:col-span-2' : ''
                        }`}
                      >
                        {widget.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Favorite Actions Tab */}
        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Actions Menu</CardTitle>
              <CardDescription>Quick access to your most-used actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Favorites */}
              <div className="space-y-3">
                <Label>Current Favorites ({favoriteActions.length}/5)</Label>
                <div className="flex flex-wrap gap-2">
                  {favoriteActions.map(actionId => {
                    const action = availableActions.find(a => a.id === actionId);
                    if (!action) return null;
                    return (
                      <Badge
                        key={actionId}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {action.icon}
                        {action.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => toggleFavorite(actionId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Available Actions */}
              <div className="space-y-3">
                <Label>Available Actions</Label>
                <div className="space-y-4">
                  {['Security', 'Users', 'Access', 'Reports'].map(category => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                      <div className="grid gap-2">
                        {availableActions
                          .filter(action => action.category === category)
                          .map(action => (
                            <div
                              key={action.id}
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted">
                                  {action.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{action.name}</p>
                                  <p className="text-xs text-muted-foreground">{action.path}</p>
                                </div>
                              </div>
                              <Button
                                variant={favoriteActions.includes(action.id) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => toggleFavorite(action.id)}
                                disabled={!favoriteActions.includes(action.id) && favoriteActions.length >= 5}
                              >
                                {favoriteActions.includes(action.id) ? (
                                  <>
                                    <Star className="h-4 w-4 mr-2 fill-current" />
                                    Favorited
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                  </>
                                )}
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Notification Channels Header */}
                <div className="grid grid-cols-5 gap-4 text-sm font-medium">
                  <div className="col-span-2">Notification Type</div>
                  <div className="text-center">Email</div>
                  <div className="text-center">Push</div>
                  <div className="text-center">In-App</div>
                  <div className="text-center">Sound</div>
                </div>
                <Separator />

                {/* Notification Settings */}
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="grid grid-cols-5 gap-4 items-center">
                      <div className="col-span-2">
                        <p className="font-medium">{notification.name}</p>
                      </div>
                      <div className="text-center">
                        <Switch
                          checked={notification.email}
                          onCheckedChange={(value) => updateNotification(notification.id, 'email', value)}
                        />
                      </div>
                      <div className="text-center">
                        <Switch
                          checked={notification.push}
                          onCheckedChange={(value) => updateNotification(notification.id, 'push', value)}
                        />
                      </div>
                      <div className="text-center">
                        <Switch
                          checked={notification.inApp}
                          onCheckedChange={(value) => updateNotification(notification.id, 'inApp', value)}
                        />
                      </div>
                      <div className="text-center">
                        <Switch
                          checked={notification.sound}
                          onCheckedChange={(value) => updateNotification(notification.id, 'sound', value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Additional Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Quiet Hours</p>
                      <p className="text-sm text-muted-foreground">Mute non-critical notifications</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="time" defaultValue="22:00" className="w-24" />
                      <span className="text-sm">to</span>
                      <Input type="time" defaultValue="08:00" className="w-24" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Digest</p>
                      <p className="text-sm text-muted-foreground">Receive daily summary instead of individual emails</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Customize your overall experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Display Options */}
              <div className="space-y-4">
                <Label>Display Options</Label>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                  </div>
                  <Switch
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Animations</p>
                    <p className="text-sm text-muted-foreground">Enable smooth transitions and effects</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-refresh Data</p>
                    <p className="text-sm text-muted-foreground">Automatically update dashboard data</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Regional Settings */}
              <div className="space-y-4">
                <Label>Regional Settings</Label>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time</SelectItem>
                        <SelectItem value="utc-5">Eastern Time</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European</SelectItem>
                        <SelectItem value="utc+8">Beijing Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="mm/dd/yyyy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select defaultValue="12h">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
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