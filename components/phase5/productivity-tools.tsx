"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Command,
  Search,
  Keyboard,
  Zap,
  Clock,
  Terminal,
  ArrowRight,
  ChevronRight,
  Plus,
  Settings,
  FileText,
  Users,
  DoorOpen,
  Shield,
  BarChart3,
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  Play,
  History,
  Star
} from 'lucide-react';

interface CommandItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
  action: () => void;
  recent?: boolean;
  favorite?: boolean;
}

interface Shortcut {
  id: string;
  keys: string[];
  description: string;
  category: string;
  customizable: boolean;
}

interface QuickAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  lastUsed?: Date;
}

const commandItems: CommandItem[] = [
  {
    id: 'lockdown',
    name: 'Emergency Lockdown',
    description: 'Initiate emergency lockdown protocol',
    icon: <Lock />,
    category: 'Security',
    shortcut: '⌘⇧L',
    action: () => console.log('Emergency lockdown')
  },
  {
    id: 'add-user',
    name: 'Add New User',
    description: 'Create a new user account',
    icon: <Users />,
    category: 'Users',
    shortcut: '⌘N',
    action: () => console.log('Add user')
  },
  {
    id: 'door-status',
    name: 'View Door Status',
    description: 'Check all door statuses',
    icon: <DoorOpen />,
    category: 'Access',
    shortcut: '⌘D',
    action: () => console.log('Door status')
  },
  {
    id: 'generate-report',
    name: 'Generate Report',
    description: 'Create access report',
    icon: <FileText />,
    category: 'Reports',
    shortcut: '⌘R',
    action: () => console.log('Generate report')
  },
  {
    id: 'view-alerts',
    name: 'View Active Alerts',
    description: 'Show all active security alerts',
    icon: <AlertTriangle />,
    category: 'Security',
    action: () => console.log('View alerts')
  }
];

const shortcuts: Shortcut[] = [
  { id: 'cmd-palette', keys: ['⌘', 'K'], description: 'Open command palette', category: 'Global', customizable: false },
  { id: 'search', keys: ['⌘', '/'], description: 'Global search', category: 'Global', customizable: true },
  { id: 'lockdown', keys: ['⌘', '⇧', 'L'], description: 'Emergency lockdown', category: 'Security', customizable: true },
  { id: 'new-user', keys: ['⌘', 'N'], description: 'Add new user', category: 'Users', customizable: true },
  { id: 'door-status', keys: ['⌘', 'D'], description: 'View door status', category: 'Access', customizable: true },
  { id: 'refresh', keys: ['⌘', 'R'], description: 'Refresh data', category: 'Global', customizable: true },
  { id: 'export', keys: ['⌘', 'E'], description: 'Export data', category: 'Data', customizable: true },
  { id: 'help', keys: ['⌘', '?'], description: 'Show help', category: 'Global', customizable: false }
];

const quickActions: QuickAction[] = [
  { id: 'lock-all', name: 'Lock All Doors', icon: <Lock />, color: 'text-red-600', action: () => console.log('Lock all') },
  { id: 'unlock-all', name: 'Unlock All Doors', icon: <Unlock />, color: 'text-green-600', action: () => console.log('Unlock all') },
  { id: 'sync', name: 'Sync Devices', icon: <RefreshCw />, color: 'text-blue-600', action: () => console.log('Sync') },
  { id: 'export', name: 'Export Logs', icon: <Download />, color: 'text-purple-600', action: () => console.log('Export') }
];

const sampleWorkflows: Workflow[] = [
  {
    id: 'onboarding',
    name: 'New Employee Onboarding',
    description: 'Complete access setup for new employees',
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    steps: [
      { id: '1', name: 'Create user account', description: 'Set up basic user profile', completed: false },
      { id: '2', name: 'Assign access card', description: 'Issue and activate access card', completed: false },
      { id: '3', name: 'Configure door access', description: 'Set up department-specific access', completed: false },
      { id: '4', name: 'Schedule training', description: 'Book security orientation', completed: false },
      { id: '5', name: 'Send welcome email', description: 'Email credentials and guidelines', completed: false }
    ]
  },
  {
    id: 'incident',
    name: 'Security Incident Response',
    description: 'Standard procedure for security incidents',
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    steps: [
      { id: '1', name: 'Lock affected areas', description: 'Secure incident location', completed: false },
      { id: '2', name: 'Review access logs', description: 'Check recent access events', completed: false },
      { id: '3', name: 'Export video footage', description: 'Save relevant camera recordings', completed: false },
      { id: '4', name: 'Create incident report', description: 'Document all findings', completed: false },
      { id: '5', name: 'Notify stakeholders', description: 'Send alerts to management', completed: false }
    ]
  }
];

export function ProductivityTools() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCommand, setSelectedCommand] = useState(0);
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Command palette keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      
      if (isCommandPaletteOpen && e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Focus command input when palette opens
  useEffect(() => {
    if (isCommandPaletteOpen && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [isCommandPaletteOpen]);

  const filteredCommands = commandItems.filter(cmd =>
    cmd.name.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.description.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.category.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const handleCommandSelect = (command: CommandItem) => {
    command.action();
    setIsCommandPaletteOpen(false);
    setCommandSearch('');
  };

  const toggleWorkflowStep = (workflowId: string, stepId: string) => {
    setWorkflows(workflows.map(w => {
      if (w.id === workflowId) {
        return {
          ...w,
          steps: w.steps.map(s => 
            s.id === stepId ? { ...s, completed: !s.completed } : s
          )
        };
      }
      return w;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Productivity Tools</h2>
          <p className="text-muted-foreground">
            Keyboard shortcuts, quick actions, and workflow automation
          </p>
        </div>
        <Button onClick={() => setIsCommandPaletteOpen(true)}>
          <Command className="h-4 w-4 mr-2" />
          Command Palette (⌘K)
        </Button>
      </div>

      {/* Command Palette Overlay */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="container flex items-start justify-center pt-20">
            <div className="w-full max-w-2xl bg-background border rounded-lg shadow-2xl">
              <div className="flex items-center border-b px-4">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  ref={commandInputRef}
                  placeholder="Type a command or search..."
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="border-0 focus:ring-0 text-lg"
                />
                <kbd className="px-2 py-1 text-xs border rounded bg-muted">ESC</kbd>
              </div>
              
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No commands found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCommands.map((cmd, index) => (
                      <button
                        key={cmd.id}
                        className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                          index === selectedCommand ? 'bg-muted' : ''
                        }`}
                        onClick={() => handleCommandSelect(cmd)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-muted">
                            {cmd.icon}
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{cmd.name}</p>
                            <p className="text-sm text-muted-foreground">{cmd.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {cmd.category}
                          </Badge>
                          {cmd.shortcut && (
                            <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-t p-4 text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 border rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 border rounded">↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 border rounded">↵</kbd>
                    Select
                  </span>
                </div>
                <span>Type ? for help</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="quick-actions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Automation</TabsTrigger>
          <TabsTrigger value="help">Contextual Help</TabsTrigger>
        </TabsList>

        {/* Quick Actions Tab */}
        <TabsContent value="quick-actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions Toolbar</CardTitle>
              <CardDescription>One-click access to common operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Actions */}
              <div className="grid gap-4 md:grid-cols-4">
                {quickActions.map(action => (
                  <Card 
                    key={action.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={action.action}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className={`p-4 rounded-full bg-muted ${action.color}`}>
                          {action.icon}
                        </div>
                        <p className="font-medium">{action.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold">Recent Actions</h4>
                <div className="space-y-2">
                  {[
                    { time: '2 min ago', action: 'Generated daily access report', icon: <FileText /> },
                    { time: '15 min ago', action: 'Updated user permissions for John Doe', icon: <Users /> },
                    { time: '1 hour ago', action: 'Synchronized door controllers', icon: <RefreshCw /> },
                    { time: '3 hours ago', action: 'Reviewed security alerts', icon: <AlertTriangle /> }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-muted">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <History className="h-4 w-4 mr-2" />
                        Repeat
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Actions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Custom Actions</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Action
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create custom actions for your specific workflow needs
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keyboard Shortcuts Tab */}
        <TabsContent value="shortcuts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
              <CardDescription>Master these shortcuts to work faster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['Global', 'Security', 'Users', 'Access', 'Data'].map(category => {
                  const categoryShortcuts = shortcuts.filter(s => s.category === category);
                  if (categoryShortcuts.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground">{category}</h4>
                      <div className="space-y-2">
                        {categoryShortcuts.map(shortcut => (
                          <div 
                            key={shortcut.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                {shortcut.keys.map((key, index) => (
                                  <kbd key={index} className="px-2 py-1 text-sm border rounded bg-muted">
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                              <span className="font-medium">{shortcut.description}</span>
                            </div>
                            {shortcut.customizable && (
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  <strong>Pro tip:</strong> Press <kbd className="px-1.5 py-0.5 text-xs border rounded">⌘</kbd> + <kbd className="px-1.5 py-0.5 text-xs border rounded">?</kbd> at any time to see available shortcuts for the current page.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Automation Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workflow Automation</CardTitle>
                  <CardDescription>Automate repetitive tasks with predefined workflows</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeWorkflow ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{activeWorkflow.name}</h3>
                      <p className="text-sm text-muted-foreground">{activeWorkflow.description}</p>
                    </div>
                    <Button variant="outline" onClick={() => setActiveWorkflow(null)}>
                      Close Workflow
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {activeWorkflow.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`p-4 rounded-lg border ${
                          step.completed ? 'bg-muted/50 opacity-75' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <input
                              type="checkbox"
                              checked={step.completed}
                              onChange={() => toggleWorkflowStep(activeWorkflow.id, step.id)}
                              className="rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${step.completed ? 'line-through' : ''}`}>
                              {index + 1}. {step.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      Progress: {activeWorkflow.steps.filter(s => s.completed).length} / {activeWorkflow.steps.length} steps
                    </div>
                    <Button>
                      Complete Workflow
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {workflows.map(workflow => (
                    <Card
                      key={workflow.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setActiveWorkflow(workflow)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{workflow.name}</CardTitle>
                            <CardDescription>{workflow.description}</CardDescription>
                          </div>
                          <Zap className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{workflow.steps.length} steps</span>
                            {workflow.lastUsed && (
                              <span className="text-muted-foreground">
                                Last used: {workflow.lastUsed.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Play className="h-4 w-4 mr-2" />
                            Start Workflow
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contextual Help Tab */}
        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contextual Help System</CardTitle>
              <CardDescription>Get help exactly when and where you need it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Interactive Tutorials</h4>
                  <div className="space-y-2">
                    {[
                      'Getting Started with Access Control',
                      'Managing User Permissions',
                      'Setting Up Time Schedules',
                      'Responding to Security Alerts',
                      'Generating Compliance Reports'
                    ].map((tutorial, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="font-medium">{tutorial}</span>
                        <Button variant="ghost" size="sm">
                          Start
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Quick Tips</h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                      <p className="text-sm">
                        <strong>Did you know?</strong> You can press <kbd className="px-1 py-0.5 text-xs border rounded">Space</kbd> while hovering over any button to see what it does.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                      <p className="text-sm">
                        <strong>Pro tip:</strong> Use the command palette (<kbd className="px-1 py-0.5 text-xs border rounded">⌘K</kbd>) to quickly navigate anywhere in the system.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900">
                      <p className="text-sm">
                        <strong>Time saver:</strong> Star your frequently used reports to access them instantly from the quick actions menu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Need more help?</p>
                    <p className="text-sm text-muted-foreground">Access our comprehensive documentation and support resources</p>
                  </div>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}