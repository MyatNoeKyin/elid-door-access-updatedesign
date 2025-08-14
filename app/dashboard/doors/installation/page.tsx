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
import { Search, Plus, Calendar, MapPin, User, Wrench } from "lucide-react"

export default function InstallationTrackingPage() {
  const [isAddInstallationOpen, setIsAddInstallationOpen] = useState(false)

  const installations = [
    {
      id: 1,
      doorName: "Executive Office Door",
      location: "Building A - 3rd Floor",
      status: "scheduled",
      installer: "John Smith",
      scheduledDate: "2025-06-25",
      estimatedTime: "2 hours",
      priority: "high",
    },
    {
      id: 2,
      doorName: "Server Room Access",
      location: "Building B - Basement",
      status: "in-progress",
      installer: "Mike Johnson",
      scheduledDate: "2025-06-20",
      estimatedTime: "3 hours",
      priority: "critical",
    },
    {
      id: 3,
      doorName: "Conference Room A",
      location: "Building A - 2nd Floor",
      status: "completed",
      installer: "Sarah Wilson",
      scheduledDate: "2025-06-18",
      estimatedTime: "1.5 hours",
      priority: "medium",
    },
    {
      id: 4,
      doorName: "Main Entrance Upgrade",
      location: "Building A - Ground Floor",
      status: "pending",
      installer: "Not Assigned",
      scheduledDate: "2025-06-28",
      estimatedTime: "4 hours",
      priority: "high",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Installation Tracking</h1>
          <p className="text-muted-foreground">Track and manage door installation schedules</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddInstallationOpen} onOpenChange={setIsAddInstallationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Schedule Installation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Installation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="door-select">Select Door</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select door to install" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="door1">Reception Area Door</SelectItem>
                      <SelectItem value="door2">Storage Room Door</SelectItem>
                      <SelectItem value="door3">Emergency Exit Door</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installer-select">Assign Installer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select installer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                      <SelectItem value="sarah">Sarah Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="install-date">Installation Date</Label>
                  <Input id="install-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
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
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddInstallationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddInstallationOpen(false)}>Schedule</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Upcoming installations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Currently installing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Finished installations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting schedule</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Installations</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installation Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search installations..." className="pl-8" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-medium p-2 pl-0">Door Name</th>
                      <th className="text-left font-medium p-2">Location</th>
                      <th className="text-left font-medium p-2">Installer</th>
                      <th className="text-left font-medium p-2">Scheduled Date</th>
                      <th className="text-left font-medium p-2">Est. Time</th>
                      <th className="text-left font-medium p-2">Priority</th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-left font-medium p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installations.map((installation) => (
                      <tr key={installation.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 pl-0 font-medium">{installation.doorName}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-slate-500" />
                            {installation.location}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-slate-500" />
                            {installation.installer}
                          </div>
                        </td>
                        <td className="py-3">{new Date(installation.scheduledDate).toLocaleDateString()}</td>
                        <td className="py-3">{installation.estimatedTime}</td>
                        <td className="py-3">
                          <Badge
                            variant={
                              installation.priority === "critical"
                                ? "destructive"
                                : installation.priority === "high"
                                  ? "outline"
                                  : "secondary"
                            }
                            className={
                              installation.priority === "critical"
                                ? "bg-red-500"
                                : installation.priority === "high"
                                  ? "text-orange-500 border-orange-500"
                                  : installation.priority === "medium"
                                    ? "text-blue-500 border-blue-500"
                                    : "bg-slate-500"
                            }
                          >
                            {installation.priority.charAt(0).toUpperCase() + installation.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              installation.status === "completed"
                                ? "success"
                                : installation.status === "in-progress"
                                  ? "outline"
                                  : "secondary"
                            }
                            className={
                              installation.status === "completed"
                                ? "bg-green-500"
                                : installation.status === "in-progress"
                                  ? "text-blue-500 border-blue-500"
                                  : installation.status === "scheduled"
                                    ? "text-amber-500 border-amber-500"
                                    : "bg-slate-500"
                            }
                          >
                            {installation.status.charAt(0).toUpperCase() + installation.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              View
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
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Scheduled installations will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">In-progress installations will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Completed installations will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
