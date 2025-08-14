"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Device {
  id: string
  name: string
  priority: number
  areaName: string
}

const mockDevices: Device[] = [
  {
    id: "2",
    name: "Executive Floor Reader",
    priority: 2,
    areaName: "Executive Area",
  },
  {
    id: "3",
    name: "Lobby Telephone System",
    priority: 1,
    areaName: "Public Area",
  },
  {
    id: "4",
    name: "HR Biometric Scanner",
    priority: 3,
    areaName: "Office Area",
  },
  {
    id: "5",
    name: "Parking Camera System",
    priority: 4,
    areaName: "Parking Area",
  },
]

const areas = ["Executive Area", "Public Area", "Office Area", "Parking Area", "Server Room"]

export default function DeviceSettingPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices)
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [newDevice, setNewDevice] = useState({
    name: "",
    priority: 1, // Default priority
    areaName: "", // Default area name
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deviceToDeleteId, setDeviceToDeleteId] = useState<string | null>(null)

  const handleAddDevice = () => {
    const device: Device = {
      id: Date.now().toString(),
      ...newDevice,
    }
    setDevices([...devices, device])
    setNewDevice({
      name: "",
      priority: 1,
      areaName: "",
    })
    setIsAddDeviceDialogOpen(false)
  }

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device)
    setNewDevice({
      name: device.name,
      priority: device.priority,
      areaName: device.areaName,
    })
  }

  const handleUpdateDevice = () => {
    if (editingDevice) {
      setDevices(devices.map((d) => (d.id === editingDevice.id ? { ...d, ...newDevice } : d)))
      setEditingDevice(null)
      setNewDevice({
        name: "",
        priority: 1,
        areaName: "",
      })
    }
  }

  const handleDeleteDevice = (id: string) => {
    setDeviceToDeleteId(id)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteDevice = () => {
    if (deviceToDeleteId) {
      setDevices(devices.filter((d) => d.id !== deviceToDeleteId))
      setDeviceToDeleteId(null)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Setting</h1>
          <p className="text-muted-foreground">Manage access control devices and their network configuration</p>
        </div>
        <Dialog open={isAddDeviceDialogOpen} onOpenChange={setIsAddDeviceDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>Register a new access control device to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Device Name
                </Label>
                <Input
                  id="name"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Main Entrance Reader"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="areaName" className="text-right">
                  Area Name
                </Label>
                <Select
                  value={newDevice.areaName}
                  onValueChange={(value) => setNewDevice({ ...newDevice, areaName: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Input
                  id="priority"
                  type="number"
                  value={newDevice.priority}
                  onChange={(e) => setNewDevice({ ...newDevice, priority: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                  placeholder="e.g., 1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddDevice}>
                Add Device
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Devices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Device Configuration</CardTitle>
          <CardDescription>Manage device settings and network configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Area Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => {
                return (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.areaName}</TableCell>
                    <TableCell>{device.priority}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault()
                                  handleEditDevice(device)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Device</DialogTitle>
                                <DialogDescription>Update device configuration and settings.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-name" className="text-right">
                                    Device Name
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={newDevice.name}
                                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-areaName" className="text-right">
                                    Area Name
                                  </Label>
                                  <Select
                                    value={newDevice.areaName}
                                    onValueChange={(value) => setNewDevice({ ...newDevice, areaName: value })}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {areas.map((area) => (
                                        <SelectItem key={area} value={area}>
                                          {area}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-priority" className="text-right">
                                    Priority
                                  </Label>
                                  <Input
                                    id="edit-priority"
                                    type="number"
                                    value={newDevice.priority}
                                    onChange={(e) =>
                                      setNewDevice({ ...newDevice, priority: Number.parseInt(e.target.value) || 0 })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={handleUpdateDevice}>
                                  Update Device
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem onClick={() => handleDeleteDevice(device.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the device and remove its data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDevice}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
