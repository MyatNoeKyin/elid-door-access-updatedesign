"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Activity, Wifi, WifiOff, Lock, Unlock, AlertTriangle } from "lucide-react"

export default function DoorMonitoringPage() {
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null)

  const doors = [
    {
      id: 1,
      name: "Main Entrance",
      location: "Building A - Ground Floor",
      status: "secured",
      connection: "online",
      lastActivity: "2 minutes ago",
      batteryLevel: 85,
      temperature: 22,
      accessCount: 145,
      failedAttempts: 2,
    },
    {
      id: 2,
      name: "Server Room",
      location: "Building B - Basement",
      status: "secured",
      connection: "online",
      lastActivity: "15 minutes ago",
      batteryLevel: 92,
      temperature: 18,
      accessCount: 23,
      failedAttempts: 0,
    },
    {
      id: 3,
      name: "Conference Room A",
      location: "Building A - 2nd Floor",
      status: "open",
      connection: "online",
      lastActivity: "5 minutes ago",
      batteryLevel: 78,
      temperature: 24,
      accessCount: 67,
      failedAttempts: 1,
    },
    {
      id: 4,
      name: "Executive Office",
      location: "Building A - 3rd Floor",
      status: "secured",
      connection: "offline",
      lastActivity: "2 hours ago",
      batteryLevel: 45,
      temperature: 23,
      accessCount: 12,
      failedAttempts: 0,
    },
    {
      id: 5,
      name: "Storage Room",
      location: "Building B - 1st Floor",
      status: "alarm",
      connection: "online",
      lastActivity: "1 minute ago",
      batteryLevel: 15,
      temperature: 25,
      accessCount: 8,
      failedAttempts: 5,
    },
  ]

  const recentEvents = [
    {
      id: 1,
      doorName: "Main Entrance",
      event: "Access Granted",
      user: "John Smith",
      timestamp: "2025-06-19 14:32:15",
      method: "Card",
    },
    {
      id: 2,
      doorName: "Storage Room",
      event: "Door Forced Open",
      user: "Unknown",
      timestamp: "2025-06-19 14:30:42",
      method: "Force",
    },
    {
      id: 3,
      doorName: "Conference Room A",
      event: "Access Granted",
      user: "Sarah Johnson",
      timestamp: "2025-06-19 14:28:15",
      method: "PIN",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Door Monitoring</h1>
          <p className="text-muted-foreground">Real-time monitoring of all door systems</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" /> System Health
          </Button>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Doors</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doors.filter((d) => d.connection === "online").length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((doors.filter((d) => d.connection === "online").length / doors.length) * 100)}% connectivity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secured Doors</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doors.filter((d) => d.status === "secured").length}</div>
            <p className="text-xs text-muted-foreground">All doors secured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doors.filter((d) => d.status === "alarm").length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">Requires attention</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Battery</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doors.filter((d) => d.batteryLevel < 20).length}</div>
            <p className="text-xs text-muted-foreground">Need battery replacement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-time">Real-time Status</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Door Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doors.map((door) => (
                    <div
                      key={door.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedDoor(door.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {door.connection === "online" ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                          ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                          )}
                          {door.status === "secured" ? (
                            <Lock className="h-4 w-4 text-green-500" />
                          ) : door.status === "open" ? (
                            <Unlock className="h-4 w-4 text-blue-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{door.name}</p>
                          <p className="text-sm text-slate-500">{door.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            door.status === "secured" ? "success" : door.status === "open" ? "outline" : "destructive"
                          }
                          className={
                            door.status === "secured"
                              ? "bg-green-500"
                              : door.status === "open"
                                ? "text-blue-500 border-blue-500"
                                : "bg-red-500"
                          }
                        >
                          {door.status.charAt(0).toUpperCase() + door.status.slice(1)}
                        </Badge>
                        <Badge
                          variant={door.connection === "online" ? "success" : "destructive"}
                          className={door.connection === "online" ? "bg-green-500" : "bg-red-500"}
                        >
                          {door.connection.charAt(0).toUpperCase() + door.connection.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall System Health</span>
                    <Badge className="bg-green-500">Excellent</Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Connectivity</span>
                        <span>80%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Security Status</span>
                        <span>95%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Battery Health</span>
                        <span>70%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="real-time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Door Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search doors..." className="pl-8" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-medium p-2 pl-0">Door Name</th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-left font-medium p-2">Connection</th>
                      <th className="text-left font-medium p-2">Battery</th>
                      <th className="text-left font-medium p-2">Temperature</th>
                      <th className="text-left font-medium p-2">Last Activity</th>
                      <th className="text-left font-medium p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doors.map((door) => (
                      <tr key={door.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 pl-0">
                          <div>
                            <p className="font-medium">{door.name}</p>
                            <p className="text-xs text-slate-500">{door.location}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              door.status === "secured" ? "success" : door.status === "open" ? "outline" : "destructive"
                            }
                            className={
                              door.status === "secured"
                                ? "bg-green-500"
                                : door.status === "open"
                                  ? "text-blue-500 border-blue-500"
                                  : "bg-red-500"
                            }
                          >
                            {door.status.charAt(0).toUpperCase() + door.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {door.connection === "online" ? (
                              <Wifi className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <WifiOff className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span className={door.connection === "online" ? "text-green-600" : "text-red-600"}>
                              {door.connection}
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <span
                              className={
                                door.batteryLevel > 50
                                  ? "text-green-600"
                                  : door.batteryLevel > 20
                                    ? "text-amber-600"
                                    : "text-red-600"
                              }
                            >
                              {door.batteryLevel}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3">{door.temperature}°C</td>
                        <td className="py-3">{door.lastActivity}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            Control
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center p-4 rounded-lg border ${
                      event.event === "Door Forced Open" ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-medium ${
                            event.event === "Door Forced Open" ? "text-red-800" : "text-slate-800"
                          }`}
                        >
                          {event.event}
                        </h4>
                        <span className="text-xs text-slate-500">{event.timestamp}</span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          event.event === "Door Forced Open" ? "text-red-700" : "text-slate-700"
                        }`}
                      >
                        {event.doorName} - {event.user} ({event.method})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Diagnostic information will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
