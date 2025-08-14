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
import { Plus, Edit, Trash2, WifiOff, Activity, AlertTriangle, CheckCircle, MoreHorizontal, Server } from "lucide-react"
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

interface Controller {
  id: string
  name: string
  type: "Standard" | "Advanced" | "Lite"
  ipAddress: string
  location: string
  floor: string
  status: "Online" | "Offline" | "Error" | "Maintenance"
  lastSeen: string
  firmware: string
  serialNumber: string
  csId: string
  alarmPriority: number
  securityPins: string[]
  parentControllerId?: string // For nesting
}

const mockControllers: Controller[] = [
  {
    id: "C001",
    name: "Main Entrance Controller",
    type: "Standard",
    ipAddress: "192.168.1.100",
    location: "Main Entrance",
    floor: "Ground Floor",
    status: "Online",
    lastSeen: "2024-01-09 15:30:00",
    firmware: "v2.1.4",
    serialNumber: "CTRL-001-2024",
    csId: "CS1",
    alarmPriority: 5,
    securityPins: ["1234"],
  },
  {
    id: "C002",
    name: "Server Room Controller",
    type: "Advanced",
    ipAddress: "192.168.1.105",
    location: "Server Room",
    floor: "Basement Level 1",
    status: "Error",
    lastSeen: "2024-01-09 14:15:30",
    firmware: "v3.0.0",
    serialNumber: "CTRL-002-2024",
    csId: "CS1",
    alarmPriority: 1,
    securityPins: ["5678", "9012"],
  },
  {
    id: "C003",
    name: "Executive Floor Controller",
    type: "Lite",
    ipAddress: "192.168.1.106",
    location: "Executive Office",
    floor: "Second Floor",
    status: "Maintenance",
    lastSeen: "2024-01-09 12:00:00",
    firmware: "v1.0.0",
    serialNumber: "CTRL-003-2024",
    csId: "CS2",
    alarmPriority: 8,
    securityPins: ["3456"],
    parentControllerId: "C001",
  },
]

const controllerTypes = ["Standard", "Advanced", "Lite"]
const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor", "Basement Level 1"]
const centralSystems = [
  { id: "CS1", name: "Central System A" },
  { id: "CS2", name: "Central System B" },
]

export default function ControllerSettingPage() {
  const [controllers, setControllers] = useState<Controller[]>(mockControllers)
  const [isAddControllerDialogOpen, setIsAddControllerDialogOpen] = useState(false)
  const [editingController, setEditingController] = useState<Controller | null>(null)
  const [newController, setNewController] = useState({
    id: "",
    name: "",
    type: "Standard" as Controller["type"],
    ipAddress: "",
    location: "",
    floor: "",
    status: "Online" as Controller["status"],
    firmware: "",
    serialNumber: "",
    csId: "",
    alarmPriority: 5,
    securityPins: ["", "", ""],
    parentControllerId: "",
  })
  const [currentWizardStep, setCurrentWizardStep] = useState(1)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [controllerToDeleteId, setControllerToDeleteId] = useState<string | null>(null)
  const [showManualUpdateDialog, setShowManualUpdateDialog] = useState(false)
  const [controllerToManualUpdate, setControllerToManualUpdate] = useState<Controller | null>(null)

  const generateControllerName = (type: string, id: string) => {
    if (type && id) {
      return `${type} Controller ${id}`
    }
    return ""
  }

  const validatePin = (pin: string) => {
    return pin.length >= 4 && pin.length <= 8 && pin !== "00000000"
  }

  const handleAddController = () => {
    // Basic validation for required fields in Step 2
    if (!newController.id || !newController.csId || !newController.type || !newController.serialNumber) {
      alert("Please fill in all required fields for the controller.")
      return
    }
    if (newController.securityPins.some((pin) => pin && !validatePin(pin))) {
      alert("Security PINs must be 4-8 digits and not '00000000'.")
      return
    }

    const controller: Controller = {
      ...newController,
      lastSeen: new Date().toLocaleString(),
      securityPins: newController.securityPins.filter((pin) => pin !== ""), // Store only non-empty pins
    }
    setControllers([...controllers, controller])
    resetNewControllerForm()
    setIsAddControllerDialogOpen(false)
    setCurrentWizardStep(1) // Reset wizard step
  }

  const handleEditController = (controller: Controller) => {
    setEditingController(controller)
    setNewController({
      id: controller.id,
      name: controller.name,
      type: controller.type,
      ipAddress: controller.ipAddress,
      location: controller.location,
      floor: controller.floor,
      status: controller.status,
      firmware: controller.firmware,
      serialNumber: controller.serialNumber,
      csId: controller.csId,
      alarmPriority: controller.alarmPriority,
      securityPins: controller.securityPins
        ? [...controller.securityPins, ...Array(3 - controller.securityPins.length).fill("")]
        : ["", "", ""],
      parentControllerId: controller.parentControllerId || "",
    })
  }

  const handleUpdateController = () => {
    if (editingController) {
      if (newController.securityPins.some((pin) => pin && !validatePin(pin))) {
        alert("Security PINs must be 4-8 digits and not '00000000'.")
        return
      }
      setControllers(
        controllers.map((c) =>
          c.id === editingController.id
            ? {
                ...c,
                ...newController,
                lastSeen: new Date().toLocaleString(),
                securityPins: newController.securityPins.filter((pin) => pin !== ""),
              }
            : c,
        ),
      )
      setEditingController(null)
      resetNewControllerForm()
    }
  }

  const handleDeleteController = (id: string) => {
    setControllerToDeleteId(id)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteController = () => {
    if (controllerToDeleteId) {
      setControllers(controllers.filter((c) => c.id !== controllerToDeleteId))
      setControllerToDeleteId(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleManualUpdate = (controller: Controller) => {
    setControllerToManualUpdate(controller)
    setShowManualUpdateDialog(true)
  }

  const confirmManualUpdate = () => {
    // Logic to re-download data to the controller would go here
    console.log(`Manually updating controller: ${controllerToManualUpdate?.name} (${controllerToManualUpdate?.id})`)
    setShowManualUpdateDialog(false)
    setControllerToManualUpdate(null)
    // In a real app, you'd trigger an API call here
  }

  const resetNewControllerForm = () => {
    setNewController({
      id: "",
      name: "",
      type: "Standard",
      ipAddress: "",
      location: "",
      floor: "",
      status: "Online",
      firmware: "",
      serialNumber: "",
      csId: "",
      alarmPriority: 5,
      securityPins: ["", "", ""],
      parentControllerId: "",
    })
  }

  const getStatusBadge = (status: Controller["status"]) => {
    const config = {
      Online: { variant: "default" as const, icon: CheckCircle },
      Offline: { variant: "secondary" as const, icon: WifiOff },
      Error: { variant: "destructive" as const, icon: AlertTriangle },
      Maintenance: { variant: "outline" as const, icon: Activity },
    }
    const { variant, icon: Icon } = config[status]
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controller Setting</h1>
          <p className="text-muted-foreground">Manage access control controllers and their network configuration</p>
        </div>
        <Dialog open={isAddControllerDialogOpen} onOpenChange={setIsAddControllerDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setCurrentWizardStep(1)
                resetNewControllerForm()
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Controller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentWizardStep === 1
                  ? "Step 1: Select Controller Location"
                  : "Step 2: Enter Controller Information"}
              </DialogTitle>
              <DialogDescription>
                {currentWizardStep === 1
                  ? "Choose where the new controller will be located."
                  : "Provide details for the new controller."}
              </DialogDescription>
            </DialogHeader>

            {currentWizardStep === 1 && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="csId" className="text-right">
                    Central System (CS) <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newController.csId}
                    onValueChange={(value) => setNewController({ ...newController, csId: value })}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select CS" />
                    </SelectTrigger>
                    <SelectContent>
                      {centralSystems.map((cs) => (
                        <SelectItem key={cs.id} value={cs.id}>
                          {cs.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="parentController" className="text-right">
                    Parent Controller (Optional)
                  </Label>
                  <Select
                    value={newController.parentControllerId}
                    onValueChange={(value) => setNewController({ ...newController, parentControllerId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select parent controller" />
                    </SelectTrigger>
                    <SelectContent>
                      {controllers.map((controller) => (
                        <SelectItem key={controller.id} value={controller.id}>
                          {controller.name} ({controller.serialNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={newController.location}
                    onChange={(e) => setNewController({ ...newController, location: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Main Entrance"
                  />
                </div>
              </div>
            )}

            {currentWizardStep === 2 && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="controllerId" className="text-right">
                    Controller ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="controllerId"
                    value={newController.id}
                    onChange={(e) => setNewController({ ...newController, id: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., C001"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serialNumber" className="text-right">
                    CS ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="serialNumber"
                    value={newController.serialNumber}
                    onChange={(e) => setNewController({ ...newController, serialNumber: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., CTRL-001-2024"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="controllerType" className="text-right">
                    Controller Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newController.type}
                    onValueChange={(value: Controller["type"]) => {
                      setNewController({
                        ...newController,
                        type: value,
                        name: generateControllerName(value, newController.id),
                      })
                    }}
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select controller type" />
                    </SelectTrigger>
                    <SelectContent>
                      {controllerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="controllerName" className="text-right">
                    Controller Name
                  </Label>
                  <Input
                    id="controllerName"
                    value={newController.name}
                    onChange={(e) => setNewController({ ...newController, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Auto-generated, can rename"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="alarmPriority" className="text-right">
                    Alarm Priority
                  </Label>
                  <Input
                    id="alarmPriority"
                    type="number"
                    value={newController.alarmPriority}
                    onChange={(e) =>
                      setNewController({ ...newController, alarmPriority: Number.parseInt(e.target.value) || 0 })
                    }
                    className="col-span-3"
                    placeholder="e.g., 5"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Security PINs</Label>
                  <div className="col-span-3 space-y-2">
                    {newController.securityPins.map((pin, index) => (
                      <Input
                        key={index}
                        type="password"
                        value={pin}
                        onChange={(e) => {
                          const updatedPins = [...newController.securityPins]
                          updatedPins[index] = e.target.value
                          setNewController({ ...newController, securityPins: updatedPins })
                        }}
                        placeholder={`PIN ${index + 1} (4-8 digits)`}
                        className={pin && !validatePin(pin) ? "border-red-500" : ""}
                      />
                    ))}
                    <p className="text-sm text-muted-foreground">
                      Up to 3 PIN groups, 4-8 digits, cannot be "00000000".
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              {currentWizardStep === 1 && (
                <Button onClick={() => setCurrentWizardStep(2)} disabled={!newController.csId}>
                  Next
                </Button>
              )}
              {currentWizardStep === 2 && (
                <>
                  <Button variant="outline" onClick={() => setCurrentWizardStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" onClick={handleAddController}>
                    Add Controller
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Controllers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controllers.length}</div>
            <p className="text-xs text-muted-foreground">Registered controllers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Controllers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controllers.filter((c) => c.status === "Online").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Controllers</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controllers.filter((c) => c.status === "Error").length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controllers.filter((c) => c.status === "Maintenance").length}</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Controllers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Controller Configuration</CardTitle>
          <CardDescription>Manage controller settings and network configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Controller Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controllers.map((controller) => (
                <TableRow key={controller.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4" />
                      {controller.name}
                    </div>
                  </TableCell>
                  <TableCell>{controller.type}</TableCell>
                  <TableCell className="font-mono">{controller.ipAddress}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{controller.location}</div>
                      <div className="text-sm text-muted-foreground">{controller.floor}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(controller.status)}</TableCell>
                  <TableCell className="text-sm">{controller.lastSeen}</TableCell>
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
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Edit Controller</DialogTitle>
                              <DialogDescription>Update controller configuration and settings.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-id" className="text-right">
                                  Controller ID
                                </Label>
                                <Input
                                  id="edit-id"
                                  value={newController.id}
                                  onChange={(e) => setNewController({ ...newController, id: e.target.value })}
                                  className="col-span-3"
                                  disabled // Controller ID usually not editable
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Controller Name
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={newController.name}
                                  onChange={(e) => setNewController({ ...newController, name: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-type" className="text-right">
                                  Controller Type
                                </Label>
                                <Select
                                  value={newController.type}
                                  onValueChange={(value: Controller["type"]) =>
                                    setNewController({ ...newController, type: value })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {controllerTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-ipAddress" className="text-right">
                                  IP Address
                                </Label>
                                <Input
                                  id="edit-ipAddress"
                                  value={newController.ipAddress}
                                  onChange={(e) => setNewController({ ...newController, ipAddress: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-location" className="text-right">
                                  Location
                                </Label>
                                <Input
                                  id="edit-location"
                                  value={newController.location}
                                  onChange={(e) => setNewController({ ...newController, location: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-floor" className="text-right">
                                  Floor
                                </Label>
                                <Select
                                  value={newController.floor}
                                  onValueChange={(value) => setNewController({ ...newController, floor: value })}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {floors.map((floor) => (
                                      <SelectItem key={floor} value={floor}>
                                        {floor}
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
                                  value={newController.status}
                                  onValueChange={(value: Controller["status"]) =>
                                    setNewController({ ...newController, status: value })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Online">Online</SelectItem>
                                    <SelectItem value="Offline">Offline</SelectItem>
                                    <SelectItem value="Error">Error</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-csId" className="text-right">
                                  CS ID
                                </Label>
                                <Input
                                  id="edit-csId"
                                  value={newController.csId}
                                  onChange={(e) => setNewController({ ...newController, csId: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-alarmPriority" className="text-right">
                                  Alarm Priority
                                </Label>
                                <Input
                                  id="edit-alarmPriority"
                                  type="number"
                                  value={newController.alarmPriority}
                                  onChange={(e) =>
                                    setNewController({
                                      ...newController,
                                      alarmPriority: Number.parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Security PINs</Label>
                                <div className="col-span-3 space-y-2">
                                  {newController.securityPins.map((pin, index) => (
                                    <Input
                                      key={index}
                                      type="password"
                                      value={pin}
                                      onChange={(e) => {
                                        const updatedPins = [...newController.securityPins]
                                        updatedPins[index] = e.target.value
                                        setNewController({ ...newController, securityPins: updatedPins })
                                      }}
                                      placeholder={`PIN ${index + 1} (4-8 digits)`}
                                      className={pin && !validatePin(pin) ? "border-red-500" : ""}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleUpdateController}>
                                Update Controller
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem onClick={() => handleDeleteController(controller.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManualUpdate(controller)}>
                          <Activity className="h-4 w-4 mr-2" /> Manual Update
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
              This action cannot be undone. This will permanently delete the controller and remove its data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteController}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manual Update Dialog */}
      <Dialog open={showManualUpdateDialog} onOpenChange={setShowManualUpdateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manual Update Controller</DialogTitle>
            <DialogDescription>
              This action will re-download all data (Card Data, Timezone Table, and relevant configurations) to the
              selected controller.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Controller: <span className="font-medium">{controllerToManualUpdate?.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Serial Number: <span className="font-medium">{controllerToManualUpdate?.serialNumber}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmManualUpdate}>Confirm Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
