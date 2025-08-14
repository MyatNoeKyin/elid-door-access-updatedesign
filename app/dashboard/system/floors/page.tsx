"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Plus, Edit, Trash2, MapPin, Users, DoorOpen } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface DoorAssignment {
  id: string
  name: string
  controller: string
  status: "Active" | "Inactive" | "Maintenance"
}

interface Floor {
  id: string
  name: string
  totalDoors: number
  activeUsers: number
  status: "Active" | "Inactive" | "Maintenance"
  controller: string
  floorNo: number
  releaseTime: number
  autoOpenTZT: string
  areaName: string
  assignedDoors: DoorAssignment[]
}

const mockFloors: Floor[] = [
  {
    id: "1",
    name: "Ground Floor",
    totalDoors: 8,
    activeUsers: 5,
    status: "Active",
    controller: "CTRL-001",
    floorNo: 1,
    releaseTime: 5,
    autoOpenTZT: "[0 Stop]",
    areaName: "Main Lobby Area",
    assignedDoors: [
      { id: "D001", name: "Main Entrance", controller: "CTRL-001", status: "Active" },
      { id: "D002", name: "Lobby Exit", controller: "CTRL-001", status: "Active" },
      { id: "D003", name: "Reception Door", controller: "CTRL-001", status: "Maintenance" },
      { id: "D004", name: "Security Office", controller: "CTRL-001", status: "Active" },
      { id: "D005", name: "Server Room 1", controller: "CTRL-001", status: "Inactive" },
      { id: "D006", name: "Storage Room A", controller: "CTRL-001", status: "Active" },
      { id: "D007", name: "Loading Dock", controller: "CTRL-001", status: "Active" },
      { id: "D008", name: "Restroom East", controller: "CTRL-001", status: "Active" },
    ],
  },
  {
    id: "2",
    name: "First Floor",
    totalDoors: 12,
    activeUsers: 89,
    status: "Active",
    controller: "CTRL-002",
    floorNo: 2,
    releaseTime: 7,
    autoOpenTZT: "Office Hours",
    areaName: "Admin Wing",
    assignedDoors: [
      { id: "D009", name: "HR Office", controller: "CTRL-002", status: "Active" },
      { id: "D010", name: "Finance Office", controller: "CTRL-002", status: "Active" },
      { id: "D011", name: "Conference Room 1", controller: "CTRL-002", status: "Active" },
      { id: "D012", name: "IT Office", controller: "CTRL-002", status: "Maintenance" },
    ],
  },
  {
    id: "3",
    name: "Second Floor",
    totalDoors: 10,
    activeUsers: 34,
    status: "Active",
    controller: "CTRL-003",
    floorNo: 3,
    releaseTime: 6,
    autoOpenTZT: "24/7",
    areaName: "Executive Suite",
    assignedDoors: [
      { id: "D013", name: "CEO Office", controller: "CTRL-003", status: "Active" },
      { id: "D014", name: "Board Room", controller: "CTRL-003", status: "Active" },
    ],
  },
  {
    id: "4",
    name: "Basement Level 1",
    totalDoors: 6,
    activeUsers: 12,
    status: "Maintenance",
    controller: "CTRL-004",
    floorNo: 4,
    releaseTime: 10,
    autoOpenTZT: "[0 Stop]",
    areaName: "Storage Area",
    assignedDoors: [
      { id: "D015", name: "Archive Room", controller: "CTRL-004", status: "Maintenance" },
      { id: "D016", name: "Utility Room", controller: "CTRL-004", status: "Active" },
    ],
  },
  {
    id: "5",
    name: "Third Floor",
    totalDoors: 15,
    activeUsers: 67,
    status: "Active",
    controller: "CTRL-005",
    floorNo: 1,
    releaseTime: 8,
    autoOpenTZT: "Weekdays",
    areaName: "R&D Lab",
    assignedDoors: [
      { id: "D017", name: "Lab Entrance", controller: "CTRL-005", status: "Active" },
      { id: "D018", name: "Clean Room", controller: "CTRL-005", status: "Active" },
      { id: "D019", name: "Testing Area", controller: "CTRL-005", status: "Inactive" },
    ],
  },
]

const controllers = ["CTRL-001", "CTRL-002", "CTRL-003", "CTRL-004", "CTRL-005"]
const autoOpenTimezones = ["[0 Stop]", "Office Hours", "24/7", "Weekdays", "Custom Schedule"]
const areaNames = ["Main Lobby Area", "Admin Wing", "Executive Suite", "Storage Area", "R&D Lab", "Server Room"]

export default function FloorSettingPage() {
  const [floors, setFloors] = useState<Floor[]>(mockFloors)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null)
  const [newFloor, setNewFloor] = useState({
    name: "",
    status: "Active" as const,
    controller: "",
    floorNo: 0,
    releaseTime: 5,
    autoOpenTZT: "[0 Stop]",
    areaName: "",
  })

  const handleAddFloor = () => {
    const floor: Floor = {
      id: Date.now().toString(),
      ...newFloor,
      totalDoors: 0, // New floors start with 0 doors
      activeUsers: 0, // New floors start with 0 active users
      assignedDoors: [], // New floors start with no assigned doors
    }
    setFloors([...floors, floor])
    setNewFloor({
      name: "",
      status: "Active",
      controller: "",
      floorNo: 0,
      releaseTime: 5,
      autoOpenTZT: "[0 Stop]",
      areaName: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditFloor = (floor: Floor) => {
    setEditingFloor(floor)
    setNewFloor({
      name: floor.name,
      status: floor.status,
      controller: floor.controller,
      floorNo: floor.floorNo,
      releaseTime: floor.releaseTime,
      autoOpenTZT: floor.autoOpenTZT,
      areaName: floor.areaName,
    })
  }

  const handleUpdateFloor = () => {
    if (editingFloor) {
      setFloors(floors.map((f) => (f.id === editingFloor.id ? { ...f, ...newFloor } : f)))
      setEditingFloor(null)
      setNewFloor({
        name: "",
        status: "Active",
        controller: "",
        floorNo: 0,
        releaseTime: 5,
        autoOpenTZT: "[0 Stop]",
        areaName: "",
      })
    }
  }

  const handleDeleteFloor = (id: string) => {
    setFloors(floors.filter((f) => f.id !== id))
  }

  const getStatusBadge = (status: Floor["status"] | DoorAssignment["status"]) => {
    const variants = {
      Active: "default",
      Inactive: "secondary",
      Maintenance: "destructive",
    } as const
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Floor Setting</h1>
          <p className="text-muted-foreground">Manage building floors and their access control configuration</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Floor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Floor</DialogTitle>
              <DialogDescription>Create a new floor configuration for access control management.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Floor Name
                </Label>
                <Input
                  id="name"
                  value={newFloor.name}
                  onChange={(e) => setNewFloor({ ...newFloor, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Ground Floor"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="controller" className="text-right">
                  Controller
                </Label>
                <Select
                  value={newFloor.controller}
                  onValueChange={(value) => setNewFloor({ ...newFloor, controller: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select controller" />
                  </SelectTrigger>
                  <SelectContent>
                    {controllers.map((controller) => (
                      <SelectItem key={controller} value={controller}>
                        {controller}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="floorNo" className="text-right">
                  Floor No.
                </Label>
                <Input
                  id="floorNo"
                  type="number"
                  value={newFloor.floorNo}
                  onChange={(e) => setNewFloor({ ...newFloor, floorNo: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                  placeholder="Enter floor number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="releaseTime" className="text-right">
                  Release Time (s)
                </Label>
                <Input
                  id="releaseTime"
                  type="number"
                  value={newFloor.releaseTime}
                  onChange={(e) => setNewFloor({ ...newFloor, releaseTime: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                  placeholder="e.g., 5"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="autoOpenTZT" className="text-right">
                  Auto Open TZT
                </Label>
                <Select
                  value={newFloor.autoOpenTZT}
                  onValueChange={(value) => setNewFloor({ ...newFloor, autoOpenTZT: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {autoOpenTimezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="areaName" className="text-right">
                  Area Name
                </Label>
                <Select
                  value={newFloor.areaName}
                  onValueChange={(value) => setNewFloor({ ...newFloor, areaName: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areaNames.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newFloor.status}
                  onValueChange={(value: Floor["status"]) => setNewFloor({ ...newFloor, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddFloor}>
                Add Floor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Floors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{floors.length}</div>
            <p className="text-xs text-muted-foreground">Across all buildings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Floors</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{floors.filter((f) => f.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doors</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{floors.reduce((sum, f) => sum + f.assignedDoors.length, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all floors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{floors.reduce((sum, f) => sum + f.activeUsers, 0)}</div>
            <p className="text-xs text-muted-foreground">With floor access</p>
          </CardContent>
        </Card>
      </div>

      {/* Floors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Floor Configuration</CardTitle>
          <CardDescription>Manage floor settings and access control configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Floor Name</TableHead>
                  <TableHead>Controller</TableHead>
                  <TableHead>Floor No.</TableHead>
                  <TableHead>Release Time (s)</TableHead>
                  <TableHead>Auto Open TZT</TableHead>
                  <TableHead>Area Name</TableHead>
                  <TableHead>Doors</TableHead>
                  <TableHead>Active Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
            <Accordion type="multiple" className="w-full">
              {floors.map((floor) => (
                <AccordionItem key={floor.id} value={floor.id} className="border-b">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="grid grid-cols-[200px_repeat(8,_minmax(0,_1fr))_auto] w-full items-center text-sm font-medium px-4 py-2">
                      <div className="text-left font-medium">{floor.name}</div>
                      <div className="text-left">{floor.controller}</div>
                      <div className="text-left">{floor.floorNo}</div>
                      <div className="text-left">{floor.releaseTime}</div>
                      <div className="text-left">{floor.autoOpenTZT}</div>
                      <div className="text-left">{floor.areaName}</div>
                      <div className="text-left">{floor.assignedDoors.length}</div>
                      <div className="text-left">{floor.activeUsers}</div>
                      <div className="text-left">{getStatusBadge(floor.status)}</div>
                      <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleEditFloor(floor)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Floor</DialogTitle>
                              <DialogDescription>Update floor configuration and settings.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Floor Name
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={newFloor.name}
                                  onChange={(e) => setNewFloor({ ...newFloor, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-controller" className="text-right">
                                  Controller
                                </Label>
                                <Select
                                  value={newFloor.controller}
                                  onValueChange={(value) => setNewFloor({ ...newFloor, controller: value })}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {controllers.map((controller) => (
                                      <SelectItem key={controller} value={controller}>
                                        {controller}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-floorNo" className="text-right">
                                  Floor No.
                                </Label>
                                <Input
                                  id="edit-floorNo"
                                  type="number"
                                  value={newFloor.floorNo}
                                  onChange={(e) =>
                                    setNewFloor({ ...newFloor, floorNo: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-releaseTime" className="text-right">
                                  Release Time (s)
                                </Label>
                                <Input
                                  id="edit-releaseTime"
                                  type="number"
                                  value={newFloor.releaseTime}
                                  onChange={(e) =>
                                    setNewFloor({ ...newFloor, releaseTime: Number.parseInt(e.target.value) || 0 })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-autoOpenTZT" className="text-right">
                                  Auto Open TZT
                                </Label>
                                <Select
                                  value={newFloor.autoOpenTZT}
                                  onValueChange={(value) => setNewFloor({ ...newFloor, autoOpenTZT: value })}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {autoOpenTimezones.map((tz) => (
                                      <SelectItem key={tz} value={tz}>
                                        {tz}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-areaName" className="text-right">
                                  Area Name
                                </Label>
                                <Select
                                  value={newFloor.areaName}
                                  onValueChange={(value) => setNewFloor({ ...newFloor, areaName: value })}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {areaNames.map((area) => (
                                      <SelectItem key={area} value={area}>
                                        {area}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-status" className="text-right">
                                  Status
                                </Label>
                                <Select
                                  value={newFloor.status}
                                  onValueChange={(value: Floor["status"]) =>
                                    setNewFloor({ ...newFloor, status: value })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleUpdateFloor}>
                                Update Floor
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFloor(floor.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2 bg-muted/20">
                    {floor.assignedDoors.length > 0 ? (
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Door ID</TableHead>
                            <TableHead>Door Name</TableHead>
                            <TableHead>Controller</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {floor.assignedDoors.map((door) => (
                            <TableRow key={door.id}>
                              <TableCell className="font-medium">{door.id}</TableCell>
                              <TableCell>{door.name}</TableCell>
                              <TableCell>{door.controller}</TableCell>
                              <TableCell>{getStatusBadge(door.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">No doors assigned to this floor.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
