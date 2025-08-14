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
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Wrench, Calendar, FileText, User } from "lucide-react"

export default function MaintenanceLogPage() {
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false)

  const maintenanceRecords = [
    {
      id: 1,
      doorName: "Main Entrance",
      location: "Building A - Ground Floor",
      type: "Preventive",
      date: "2025-06-18",
      technician: "Mike Johnson",
      description: "Quarterly maintenance check - cleaned sensors, tested all functions",
      status: "completed",
      nextDue: "2025-09-18",
      cost: "$150",
    },
    {
      id: 2,
      doorName: "Server Room",
      location: "Building B - Basement",
      type: "Corrective",
      date: "2025-06-15",
      technician: "Sarah Wilson",
      description: "Replaced faulty card reader - was not reading cards properly",
      status: "completed",
      nextDue: "2025-12-15",
      cost: "$320",
    },
    {
      id: 3,
      doorName: "Conference Room A",
      location: "Building A - 2nd Floor",
      type: "Inspection",
      date: "2025-06-10",
      technician: "John Smith",
      description: "Annual safety inspection - all systems functioning normally",
      status: "completed",
      nextDue: "2026-06-10",
      cost: "$75",
    },
    {
      id: 4,
      doorName: "Executive Office",
      location: "Building A - 3rd Floor",
      type: "Upgrade",
      date: "2025-06-20",
      technician: "Mike Johnson",
      description: "Firmware update to latest version - improved security features",
      status: "scheduled",
      nextDue: "2025-12-20",
      cost: "$100",
    },
  ]

  const upcomingMaintenance = [
    {
      id: 1,
      doorName: "Storage Room",
      dueDate: "2025-06-25",
      type: "Preventive",
      priority: "medium",
    },
    {
      id: 2,
      doorName: "Emergency Exit",
      dueDate: "2025-06-28",
      type: "Inspection",
      priority: "high",
    },
    {
      id: 3,
      doorName: "Reception Area",
      dueDate: "2025-07-02",
      type: "Preventive",
      priority: "low",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance Log</h1>
          <p className="text-muted-foreground">Track maintenance history and schedule upcoming services</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddMaintenanceOpen} onOpenChange={setIsAddMaintenanceOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Maintenance Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Maintenance Record</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="door-select">Select Door</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select door" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="door1">Main Entrance</SelectItem>
                      <SelectItem value="door2">Server Room</SelectItem>
                      <SelectItem value="door3">Conference Room A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-type">Maintenance Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="corrective">Corrective</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="upgrade">Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-date">Maintenance Date</Label>
                  <Input id="maintenance-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technician">Technician</Label>
                  <Input id="technician" placeholder="Enter technician name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input id="cost" placeholder="Enter cost (optional)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the maintenance work performed" />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddMaintenanceOpen(false)}>Save Record</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceRecords.length}</div>
            <p className="text-xs text-muted-foreground">Maintenance records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maintenanceRecords.filter((r) => r.date.startsWith("2025-06")).length}
            </div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMaintenance.length}</div>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$645</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search maintenance records..." className="pl-8" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-medium p-2 pl-0">Door Name</th>
                      <th className="text-left font-medium p-2">Type</th>
                      <th className="text-left font-medium p-2">Date</th>
                      <th className="text-left font-medium p-2">Technician</th>
                      <th className="text-left font-medium p-2">Cost</th>
                      <th className="text-left font-medium p-2">Next Due</th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-left font-medium p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceRecords.map((record) => (
                      <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 pl-0">
                          <div>
                            <p className="font-medium">{record.doorName}</p>
                            <p className="text-xs text-slate-500">{record.location}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className={
                              record.type === "Corrective"
                                ? "border-red-200 text-red-800 bg-red-50"
                                : record.type === "Preventive"
                                  ? "border-blue-200 text-blue-800 bg-blue-50"
                                  : record.type === "Upgrade"
                                    ? "border-green-200 text-green-800 bg-green-50"
                                    : "border-purple-200 text-purple-800 bg-purple-50"
                            }
                          >
                            {record.type}
                          </Badge>
                        </td>
                        <td className="py-3">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-slate-500" />
                            {record.technician}
                          </div>
                        </td>
                        <td className="py-3">{record.cost}</td>
                        <td className="py-3">{new Date(record.nextDue).toLocaleDateString()}</td>
                        <td className="py-3">
                          <Badge
                            variant={record.status === "completed" ? "success" : "outline"}
                            className={
                              record.status === "completed" ? "bg-green-500" : "text-amber-500 border-amber-500"
                            }
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">
                            View Details
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

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMaintenance.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">{item.doorName}</h4>
                      <p className="text-sm text-slate-500">
                        {item.type} maintenance due on {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          item.priority === "high"
                            ? "destructive"
                            : item.priority === "medium"
                              ? "outline"
                              : "secondary"
                        }
                        className={
                          item.priority === "high"
                            ? "bg-red-500"
                            : item.priority === "medium"
                              ? "text-amber-500 border-amber-500"
                              : "bg-slate-500"
                        }
                      >
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </Badge>
                      <Button size="sm">Schedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Maintenance reports and analytics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
