import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Settings, Clock, Shield } from "lucide-react"

export default function DoorSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Door Settings</h1>
          <p className="text-muted-foreground">Configure individual door parameters and behavior</p>
        </div>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Basic Door Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="door-name">Select Door</Label>
                    <Select defaultValue="main-entrance">
                      <SelectTrigger>
                        <SelectValue placeholder="Select door to configure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-entrance">Main Entrance</SelectItem>
                        <SelectItem value="server-room">Server Room</SelectItem>
                        <SelectItem value="office-101">Office 101</SelectItem>
                        <SelectItem value="conference-room">Conference Room</SelectItem>
                        <SelectItem value="executive-office">Executive Office</SelectItem>
                        <SelectItem value="storage-room">Storage Room</SelectItem>
                        <SelectItem value="emergency-exit">Emergency Exit</SelectItem>
                        <SelectItem value="reception-area">Reception Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="door-description">Description</Label>
                    <Input id="door-description" defaultValue="Primary building entrance" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="controller-id">Controller ID</Label>
                    <Input id="controller-id" defaultValue="CTRL-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="door-area">Area</Label>
                    <Select defaultValue="entrance">
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrance">Building Entrance</SelectItem>
                        <SelectItem value="office">Office Area</SelectItem>
                        <SelectItem value="restricted">Restricted Area</SelectItem>
                        <SelectItem value="server">Server Room</SelectItem>
                        <SelectItem value="meeting">Meeting Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-mode">Work Mode</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="always-open">Always Open</SelectItem>
                        <SelectItem value="always-closed">Always Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority-level">Alarm Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Door Status</Label>
                      <p className="text-sm text-muted-foreground">Enable this door for access control</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Timing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="release-time">Door Release Time (seconds)</Label>
                    <Input id="release-time" type="number" defaultValue="5" min="1" max="255" />
                    <p className="text-xs text-muted-foreground">How long the door stays unlocked after access</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="open-timeout">Door Open Timeout (seconds)</Label>
                    <Input id="open-timeout" type="number" defaultValue="30" min="5" max="300" />
                    <p className="text-xs text-muted-foreground">Maximum time door can remain open</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auto-open-start">Auto-Open Start Time</Label>
                    <Input id="auto-open-start" type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auto-open-end">Auto-Open End Time</Label>
                    <Input id="auto-open-end" type="time" defaultValue="18:00" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pin-disable-start">PIN Disable Start Time</Label>
                    <Input id="pin-disable-start" type="time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pin-disable-end">PIN Disable End Time</Label>
                    <Input id="pin-disable-end" type="time" defaultValue="06:00" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Open Enabled</Label>
                      <p className="text-sm text-muted-foreground">Automatically open during specified hours</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>PIN Disable Schedule</Label>
                      <p className="text-sm text-muted-foreground">Disable PIN access during specified hours</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="security-pin">Security PIN</Label>
                    <Input id="security-pin" type="password" placeholder="Enter security PIN" />
                    <p className="text-xs text-muted-foreground">Emergency PIN for manual override</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Max Failed Attempts</Label>
                    <Input id="max-attempts" type="number" defaultValue="3" min="1" max="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockout-time">Lockout Time (minutes)</Label>
                    <Input id="lockout-time" type="number" defaultValue="5" min="1" max="60" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Security PIN Enabled</Label>
                      <p className="text-sm text-muted-foreground">Enable emergency override PIN</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Anti-Passback</Label>
                      <p className="text-sm text-muted-foreground">Prevent entry without proper exit</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Duress Alarm</Label>
                      <p className="text-sm text-muted-foreground">Enable silent alarm for duress situations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Door Forced Alarm</Label>
                      <p className="text-sm text-muted-foreground">Alert when door is forced open</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reader-type">Card Reader Type</Label>
                    <Select defaultValue="wiegand">
                      <SelectTrigger>
                        <SelectValue placeholder="Select reader type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wiegand">Wiegand 26-bit</SelectItem>
                        <SelectItem value="wiegand34">Wiegand 34-bit</SelectItem>
                        <SelectItem value="rs485">RS485</SelectItem>
                        <SelectItem value="tcp">TCP/IP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="communication">Communication Protocol</Label>
                    <Select defaultValue="tcp">
                      <SelectTrigger>
                        <SelectValue placeholder="Select protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP/IP</SelectItem>
                        <SelectItem value="rs485">RS485</SelectItem>
                        <SelectItem value="serial">Serial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ip-address">Controller IP Address</Label>
                    <Input id="ip-address" defaultValue="192.168.1.100" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="port">Communication Port</Label>
                    <Input id="port" type="number" defaultValue="4370" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Heartbeat Monitoring</Label>
                      <p className="text-sm text-muted-foreground">Monitor controller connectivity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Buffering</Label>
                      <p className="text-sm text-muted-foreground">Buffer events during network outages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Real-time Monitoring</Label>
                      <p className="text-sm text-muted-foreground">Enable real-time status updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Configuration</Button>
      </div>
    </div>
  )
}
