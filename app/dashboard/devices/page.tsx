"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Cpu, Wifi, WifiOff, Settings, RefreshCw, Edit, Trash2 } from "lucide-react"

export default function DevicesPage() {
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)

  const devices = [
    {
      id: 1,
      name: "Main Controller",
      type: "Access Controller",
      model: "AC-2000",
      ipAddress: "192.168.1.100",
      port: 4370,
      communication: "TCP/IP",
      status: "online",
      firmware: "v2.1.5",
      lastSync: "2025-06-19 14:30",
      doorCount: 4,
    },
    {
      id: 2,
      name: "Building B Controller",
      type: "Access Controller",
      model: "AC-1000",
      ipAddress: "192.168.1.101",
      port: 4370,
      communication: "TCP/IP",
      status: "online",
      firmware: "v2.0.8",
      lastSync: "2025-06-19 14:28",
      doorCount: 2,
    },
    {
      id: 3,
      name: "Emergency Exit Reader",
      type: "Card Reader",
      model: "CR-500",
      ipAddress: "192.168.1.150",
      port: 4370,
      communication: "RS485",
      status: "offline",
      firmware: "v1.5.2",
      lastSync: "2025-06-19 12:15",
      doorCount: 1,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">Manage controllers, readers, and network devices</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Sync All
          </Button>
          <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Device
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="pt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="network">Network</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="device-name">Device Name</Label>
                      <Input id="device-name" placeholder="Enter device name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device-type">Device Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="controller">Access Controller</SelectItem>
                          <SelectItem value="reader">Card Reader</SelectItem>
                          <SelectItem value="biometric">Biometric Reader</SelectItem>
                          <SelectItem value="relay">Relay Module</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="device-model">Model</Label>
                      <Input id="device-model" placeholder="Enter device model" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serial-number">Serial Number</Label>
                      <Input id="serial-number" placeholder="Enter serial number" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="network" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ip-address">IP Address</Label>
                      <Input id="ip-address" placeholder="192.168.1.100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Port</Label>
                      <Input id="port" type="number" placeholder="4370" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="communication">Communication</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select communication method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tcp">TCP/IP</SelectItem>
                          <SelectItem value="rs485">RS485</SelectItem>
                          <SelectItem value="serial">Serial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subnet">Subnet Mask</Label>
                      <Input id="subnet" placeholder="255.255.255.0" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto Sync</Label>
                        <p className="text-sm text-muted-foreground">Automatically sync device data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Heartbeat Monitoring</Label>
                        <p className="text-sm text-muted-foreground">Monitor device connectivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Event Buffering</Label>
                        <p className="text-sm text-muted-foreground">Buffer events during network outages</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDeviceOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDeviceOpen(false)}>Add Device</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-muted-foreground">Managed devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Devices</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.filter((d) => d.status === "online").length}</div>
            <p className="text-xs text-muted-foreground">Currently connected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Devices</CardTitle>
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.filter((d) => d.status === "offline").length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">Need attention</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controllers</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.filter((d) => d.type === "Access Controller").length}</div>
            <p className="text-xs text-muted-foreground">Access controllers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search devices..." className="pl-8" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium p-2 pl-0">Device Name</th>
                  <th className="text-left font-medium p-2">Type</th>
                  <th className="text-left font-medium p-2">IP Address</th>
                  <th className="text-left font-medium p-2">Communication</th>
                  <th className="text-left font-medium p-2">Status</th>
                  <th className="text-left font-medium p-2">Firmware</th>
                  <th className="text-left font-medium p-2">Last Sync</th>
                  <th className="text-left font-medium p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pl-0">
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-xs text-slate-500">{device.model}</p>
                      </div>
                    </td>
                    <td className="py-3">{device.type}</td>
                    <td className="py-3">
                      {device.ipAddress}:{device.port}
                    </td>
                    <td className="py-3">
                      <Badge variant="outline">{device.communication}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {device.status === "online" ? (
                          <Wifi className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <Badge
                          variant={device.status === "online" ? "success" : "destructive"}
                          className={device.status === "online" ? "bg-green-500" : "bg-red-500"}
                        >
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3">{device.firmware}</td>
                    <td className="py-3 text-xs">{device.lastSync}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
