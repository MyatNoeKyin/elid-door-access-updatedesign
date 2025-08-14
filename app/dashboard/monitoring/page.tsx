"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, Lock, Unlock, AlertTriangle, WifiOff, Volume2, VolumeX, Eye, Shield, Activity } from "lucide-react"

export default function MonitoringPage() {
  const [audioAlerts, setAudioAlerts] = useState(true)
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null)

  const doorStatus = [
    { id: 1, name: "Main Entrance", area: "Building A", status: "secured", x: 20, y: 30 },
    { id: 2, name: "Server Room", area: "Building B", status: "secured", x: 60, y: 20 },
    { id: 3, name: "Conference Room", area: "Building A", status: "open", x: 40, y: 50 },
    { id: 4, name: "Emergency Exit", area: "Building A", status: "alarm", x: 80, y: 70 },
    { id: 5, name: "Storage Room", area: "Building B", status: "offline", x: 70, y: 40 },
  ]

  const alarms = [
    {
      id: 1,
      type: "Door Forced Open",
      location: "Emergency Exit",
      severity: "high",
      timestamp: "2025-06-19 14:35:00",
      acknowledged: false,
    },
    {
      id: 2,
      type: "Device Offline",
      location: "Storage Room",
      severity: "medium",
      timestamp: "2025-06-19 14:20:00",
      acknowledged: false,
    },
    {
      id: 3,
      type: "Multiple Failed Attempts",
      location: "Server Room",
      severity: "medium",
      timestamp: "2025-06-19 13:55:00",
      acknowledged: true,
    },
  ]

  const handleDoorControl = (doorId: number, action: "lock" | "unlock") => {
    console.log(`${action} door ${doorId}`)
  }

  const handleAlarmAction = (alarmId: number, action: "acknowledge" | "clear") => {
    console.log(`${action} alarm ${alarmId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Real-time Monitoring</h1>
          <p className="text-muted-foreground">Monitor doors, devices, and security events in real-time</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setAudioAlerts(!audioAlerts)}
            className={audioAlerts ? "bg-green-50 border-green-200" : ""}
          >
            {audioAlerts ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
            Audio Alerts
          </Button>
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" /> System Health
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secured Doors</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doorStatus.filter((d) => d.status === "secured").length}</div>
            <p className="text-xs text-muted-foreground">All secure</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Doors</CardTitle>
            <Unlock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doorStatus.filter((d) => d.status === "open").length}</div>
            <p className="text-xs text-muted-foreground">Currently open</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alarms.filter((a) => !a.acknowledged).length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">Require attention</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline Devices</CardTitle>
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doorStatus.filter((d) => d.status === "offline").length}</div>
            <p className="text-xs text-muted-foreground">Connection issues</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map">
        <TabsList>
          <TabsTrigger value="map">Visual Map</TabsTrigger>
          <TabsTrigger value="list">Door List</TabsTrigger>
          <TabsTrigger value="alarms">Active Alarms</TabsTrigger>
          <TabsTrigger value="events">Live Events</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="mr-2 h-5 w-5" />
                Facility Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-slate-100 rounded-lg h-96 overflow-hidden">
                {/* Simple facility map representation */}
                <div className="absolute inset-4 bg-white rounded border-2 border-slate-300">
                  <div className="absolute top-2 left-2 text-xs font-medium text-slate-600">Building A</div>
                  <div className="absolute top-2 right-2 text-xs font-medium text-slate-600">Building B</div>

                  {doorStatus.map((door) => (
                    <div
                      key={door.id}
                      className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all hover:scale-125 ${
                        door.status === "secured"
                          ? "bg-green-500"
                          : door.status === "open"
                            ? "bg-blue-500"
                            : door.status === "alarm"
                              ? "bg-red-500 animate-pulse"
                              : "bg-gray-400"
                      }`}
                      style={{ left: `${door.x}%`, top: `${door.y}%` }}
                      onClick={() => setSelectedDoor(door.id)}
                      title={`${door.name} - ${door.status}`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded border shadow">
                  <h4 className="text-sm font-medium mb-2">Status Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      Secured
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      Open
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      Alarm
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                      Offline
                    </div>
                  </div>
                </div>
              </div>

              {selectedDoor && (
                <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                  {(() => {
                    const door = doorStatus.find((d) => d.id === selectedDoor)
                    return door ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{door.name}</h4>
                          <p className="text-sm text-slate-600">{door.area}</p>
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
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleDoorControl(door.id, "lock")}>
                            <Lock className="h-4 w-4 mr-1" /> Lock
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDoorControl(door.id, "unlock")}>
                            <Unlock className="h-4 w-4 mr-1" /> Unlock
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" /> Details
                          </Button>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Door Status List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {doorStatus.map((door) => (
                  <div key={door.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          door.status === "secured"
                            ? "bg-green-500"
                            : door.status === "open"
                              ? "bg-blue-500"
                              : door.status === "alarm"
                                ? "bg-red-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{door.name}</p>
                        <p className="text-sm text-slate-500">{door.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleDoorControl(door.id, "lock")}>
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDoorControl(door.id, "unlock")}>
                          <Unlock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Active Alarms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      alarm.severity === "high"
                        ? "border-red-200 bg-red-50"
                        : alarm.severity === "medium"
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-200 bg-slate-50"
                    } ${alarm.acknowledged ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          alarm.severity === "high"
                            ? "text-red-500"
                            : alarm.severity === "medium"
                              ? "text-amber-500"
                              : "text-slate-500"
                        }`}
                      />
                      <div>
                        <h4
                          className={`font-medium ${
                            alarm.severity === "high"
                              ? "text-red-800"
                              : alarm.severity === "medium"
                                ? "text-amber-800"
                                : "text-slate-800"
                          }`}
                        >
                          {alarm.type}
                        </h4>
                        <p
                          className={`text-sm ${
                            alarm.severity === "high"
                              ? "text-red-700"
                              : alarm.severity === "medium"
                                ? "text-amber-700"
                                : "text-slate-700"
                          }`}
                        >
                          {alarm.location} - {alarm.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={alarm.severity === "high" ? "destructive" : "outline"}
                        className={
                          alarm.severity === "high"
                            ? "bg-red-500"
                            : alarm.severity === "medium"
                              ? "text-amber-500 border-amber-500"
                              : "bg-slate-500"
                        }
                      >
                        {alarm.severity.charAt(0).toUpperCase() + alarm.severity.slice(1)}
                      </Badge>
                      {!alarm.acknowledged ? (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAlarmAction(alarm.id, "acknowledge")}
                          >
                            <Shield className="h-4 w-4 mr-1" /> Acknowledge
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAlarmAction(alarm.id, "clear")}>
                            Clear
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-500">
                          Acknowledged
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Events Stream</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <p className="text-muted-foreground">Live events stream will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
