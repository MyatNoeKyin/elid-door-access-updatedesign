"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Settings, Monitor, Lock, UserCheck, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface PermissionMatrix {
  [key: string]: {
    read: boolean
    modify: boolean
    all: boolean
  }
}

interface MonitoringPoint {
  id: string
  name: string
  location: string
  type: "door" | "camera" | "alarm" | "sensor"
}

interface AssignedMonitoringPoint extends MonitoringPoint {
  permissions: {
    read: boolean
    control: boolean
    acknowledge: boolean
  }
}

interface OperatorFormData {
  operatorId: string
  pin: string
  description: string
  role: "systemmanager" | "manager" | "operator"
  operatingRights: string[]
  assignedDepartments: { id: string; name: string }[]
  canManageUsersReadWrite: boolean
  userPermissions: PermissionMatrix
  userFieldPermissions: PermissionMatrix
  systemPermissions: PermissionMatrix
  accessPermissions: PermissionMatrix
  assignedMonitoringPoints: AssignedMonitoringPoint[]
}

interface Department {
  id: string
  name: string
}

const allDepartments: Department[] = [
  { id: "IT001", name: "Information Technology" },
  { id: "HR001", name: "Human Resources" },
  { id: "FIN001", name: "Finance" },
  { id: "MKT001", name: "Marketing" },
  { id: "RD001", name: "Research & Development" },
  { id: "SAL001", name: "Sales" },
  { id: "OPS001", name: "Operations" },
]

const allMonitoringPoints: MonitoringPoint[] = [
  { id: "MP001", name: "Main Entrance Door", location: "Building A - Ground Floor", type: "door" },
  { id: "MP002", name: "Server Room Door", location: "Building A - 2nd Floor", type: "door" },
  { id: "MP003", name: "Emergency Exit", location: "Building A - Ground Floor", type: "door" },
  { id: "MP004", name: "Lobby Camera 1", location: "Building A - Ground Floor", type: "camera" },
  { id: "MP005", name: "Lobby Camera 2", location: "Building A - Ground Floor", type: "camera" },
  { id: "MP006", name: "Parking Camera", location: "Building A - Parking Lot", type: "camera" },
  { id: "MP007", name: "Fire Alarm Panel", location: "Building A - 1st Floor", type: "alarm" },
  { id: "MP008", name: "Security Alarm", location: "Building A - Ground Floor", type: "alarm" },
  { id: "MP009", name: "Temperature Sensor", location: "Server Room", type: "sensor" },
  { id: "MP010", name: "Motion Sensor", location: "Building A - Corridor", type: "sensor" },
]

const operatingRightsOptions = [
  { id: "department_access", name: "Department Access", icon: Building, tab: "access-management" },
  { id: "access_management", name: "Access Management", icon: Lock, tab: "access-management" },
  { id: "system_setup", name: "System Setup", icon: Settings, tab: "system-setup" },
  { id: "monitoring_setup", name: "Monitoring Setup", icon: Monitor, tab: "monitor-setup" },
]

const userInformationFields = [
  "User Name",
  "User Pin",
  "User Picture",
  "User Card",
  "User Finger",
  "User Access Right",
  "Add User",
  "Delete User",
]

const userFields = ["User Field 1"]

const systemSettingFields = ["Default Setting", "Door Setting", "Floor Setting", "Device Setting", "Controller Setting"]

const accessManagementFields = [
  "Timezone Setting",
  "Holiday Setting",
  "Group Setting",
  "Add Card By Batch",
  "Add Card By Controller",
  "Delete Temp Card",
  "Door To User Assignment",
  "Delete User By Door",
]

interface OperatorFormProps {
  initialData?: OperatorFormData
  onSubmit: (data: OperatorFormData) => void
}

export default function OperatorForm({ initialData, onSubmit }: OperatorFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<OperatorFormData>(
    initialData || {
      operatorId: "",
      pin: "",
      description: "",
      role: "operator",
      operatingRights: [],
      assignedDepartments: [],
      canManageUsersReadWrite: false,
      userPermissions: userInformationFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      userFieldPermissions: userFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      systemPermissions: systemSettingFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      accessPermissions: accessManagementFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      assignedMonitoringPoints: [],
    },
  )
  const [activeTab, setActiveTab] = useState("operator-information")

  // Effect to automatically switch to Operator Setup tab
  useEffect(() => {
    if (formData.operatorId && formData.pin && formData.description && activeTab === "operator-information") {
      setActiveTab("operator-setup")
    }
  }, [formData.operatorId, formData.pin, formData.description, activeTab])

  const availableDepartments = useMemo(() => {
    const assignedIds = new Set(formData.assignedDepartments.map((d) => d.id))
    return allDepartments.filter((d) => !assignedIds.has(d.id))
  }, [formData.assignedDepartments])

  const availableMonitoringPoints = useMemo(() => {
    const assignedIds = new Set(formData.assignedMonitoringPoints.map((mp) => mp.id))
    return allMonitoringPoints.filter((mp) => !assignedIds.has(mp.id))
  }, [formData.assignedMonitoringPoints])

  const getRightsForTab = (tabId: string) => operatingRightsOptions.filter((right) => right.tab === tabId)

  const handleSubmit = () => {
    onSubmit(formData)
    // Reset form
    setFormData({
      operatorId: "",
      pin: "",
      description: "",
      role: "operator",
      operatingRights: [],
      assignedDepartments: [],
      canManageUsersReadWrite: false,
      userPermissions: userInformationFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      userFieldPermissions: userFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      systemPermissions: systemSettingFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      accessPermissions: accessManagementFields.reduce((acc, field) => {
        acc[field] = { read: false, modify: false, all: false }
        return acc
      }, {} as PermissionMatrix),
      assignedMonitoringPoints: [],
    })
    setActiveTab("operator-information")
    router.push("/dashboard/operators")
  }

  const [selectedAvailableDepartments, setSelectedAvailableDepartments] = useState<string[]>([])
  const [selectedAssignedDepartments, setSelectedAssignedDepartments] = useState<string[]>([])
  const [selectedAvailableMonitoringPoints, setSelectedAvailableMonitoringPoints] = useState<string[]>([])
  const [selectedAssignedMonitoringPoints, setSelectedAssignedMonitoringPoints] = useState<string[]>([])

  const handleSelectAvailableDepartment = (deptId: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailableDepartments([...selectedAvailableDepartments, deptId])
    } else {
      setSelectedAvailableDepartments(selectedAvailableDepartments.filter((id) => id !== deptId))
    }
  }

  const handleSelectAssignedDepartment = (deptId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignedDepartments([...selectedAssignedDepartments, deptId])
    } else {
      setSelectedAssignedDepartments(selectedAssignedDepartments.filter((id) => id !== deptId))
    }
  }

  const handleAssignSelectedDepartments = () => {
    const departmentsToAssign = availableDepartments.filter((dept) => selectedAvailableDepartments.includes(dept.id))
    setFormData((prev) => ({
      ...prev,
      assignedDepartments: [...prev.assignedDepartments, ...departmentsToAssign].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }))
    setSelectedAvailableDepartments([])
  }

  const handleRemoveSelectedDepartments = () => {
    setFormData((prev) => ({
      ...prev,
      assignedDepartments: prev.assignedDepartments.filter((dept) => !selectedAssignedDepartments.includes(dept.id)),
    }))
    setSelectedAssignedDepartments([])
  }

  const handleSelectAvailableMonitoringPoint = (pointId: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailableMonitoringPoints([...selectedAvailableMonitoringPoints, pointId])
    } else {
      setSelectedAvailableMonitoringPoints(selectedAvailableMonitoringPoints.filter((id) => id !== pointId))
    }
  }

  const handleSelectAssignedMonitoringPoint = (pointId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignedMonitoringPoints([...selectedAssignedMonitoringPoints, pointId])
    } else {
      setSelectedAssignedMonitoringPoints(selectedAssignedMonitoringPoints.filter((id) => id !== pointId))
    }
  }

  const handleAssignSelectedMonitoringPoints = () => {
    const pointsToAssign = availableMonitoringPoints.filter((point) =>
      selectedAvailableMonitoringPoints.includes(point.id),
    )
    const newAssignedPoints: AssignedMonitoringPoint[] = pointsToAssign.map((point) => ({
      ...point,
      permissions: {
        read: false,
        control: false,
        acknowledge: false,
      },
    }))

    setFormData((prev) => ({
      ...prev,
      assignedMonitoringPoints: [...prev.assignedMonitoringPoints, ...newAssignedPoints].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }))
    setSelectedAvailableMonitoringPoints([])
  }

  const handleRemoveSelectedMonitoringPoints = () => {
    setFormData((prev) => ({
      ...prev,
      assignedMonitoringPoints: prev.assignedMonitoringPoints.filter(
        (point) => !selectedAssignedMonitoringPoints.includes(point.id),
      ),
    }))
    setSelectedAssignedMonitoringPoints([])
  }

  const handleMonitoringPointPermissionChange = (
    pointId: string,
    permission: "read" | "control" | "acknowledge",
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      assignedMonitoringPoints: prev.assignedMonitoringPoints.map((mp) =>
        mp.id === pointId
          ? {
              ...mp,
              permissions: {
                ...mp.permissions,
                [permission]: checked,
              },
            }
          : mp,
      ),
    }))
  }

  const handlePermissionChange = (
    section: "userPermissions" | "userFieldPermissions" | "systemPermissions" | "accessPermissions",
    field: string,
    type: "read" | "modify" | "all",
    checked: boolean | "indeterminate",
  ) => {
    setFormData((prev) => {
      const newPermissions = { ...prev[section] }
      const currentFieldPermissions = { ...newPermissions[field] }

      if (type === "all") {
        currentFieldPermissions.read = checked as boolean
        currentFieldPermissions.modify = checked as boolean
        currentFieldPermissions.all = checked as boolean
      } else {
        currentFieldPermissions[type] = checked as boolean
        currentFieldPermissions.all = currentFieldPermissions.read && currentFieldPermissions.modify
      }

      newPermissions[field] = currentFieldPermissions
      return { ...prev, [section]: newPermissions }
    })
  }

  const getMonitoringPointTypeIcon = (type: string) => {
    switch (type) {
      case "door":
        return "🚪"
      case "camera":
        return "📹"
      case "alarm":
        return "🚨"
      case "sensor":
        return "📡"
      default:
        return "📍"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="operator-information" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto bg-white border-b px-0">
          <TabsTrigger
            value="operator-information"
            className="flex flex-col py-3 h-auto data-[state=active]:bg-gray-50 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            <User className="h-4 w-4 mb-1" />
            Operator Information
          </TabsTrigger>
          <TabsTrigger
            value="operator-setup"
            className="flex flex-col py-3 h-auto data-[state=active]:bg-gray-50 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            <UserCheck className="h-4 w-4 mb-1" />
            Operator Setup
          </TabsTrigger>
          <TabsTrigger
            value="access-management"
            className="flex flex-col py-3 h-auto data-[state=active]:bg-gray-50 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            <Lock className="h-4 w-4 mb-1" />
            Access Management
          </TabsTrigger>
          <TabsTrigger
            value="system-setup"
            className="flex flex-col py-3 h-auto data-[state=active]:bg-gray-50 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            <Settings className="h-4 w-4 mb-1" />
            System Setup
          </TabsTrigger>
          <TabsTrigger
            value="monitor-setup"
            className="flex flex-col py-3 h-auto data-[state=active]:bg-gray-50 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            <Monitor className="h-4 w-4 mb-1" />
            Monitor Setup
          </TabsTrigger>
        </TabsList>

        {/* Operator Information Tab Content */}
        <TabsContent value="operator-information" className="pt-4">
          <Card className="shadow-none border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" /> Basic Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the operator&apos;s personal information and department assignment
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operator-id">Operator ID (Login Name) *</Label>
                  <Input
                    id="operator-id"
                    placeholder="Enter operator ID"
                    value={formData.operatorId}
                    onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator-pin">PIN (Login Password) *</Label>
                  <Input
                    id="operator-pin"
                    type="password"
                    placeholder="Enter PIN"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operator-description">Description</Label>
                  <Input
                    id="operator-description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operator-role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value as "operator" | "manager" | "systemmanager",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="systemmanager">System Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operator Setup Tab Content */}
        <TabsContent value="operator-setup" className="pt-4">
          <Card className="shadow-none border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-5 w-5" /> Operator Setup (Department Assignment)
              </CardTitle>
              <p className="text-sm text-muted-foreground">Assign departments and user management rights.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Department Assignment Section */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold">Departments</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Available Departments */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Available ({availableDepartments.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAvailableDepartments.length === availableDepartments.length) {
                              setSelectedAvailableDepartments([])
                            } else {
                              setSelectedAvailableDepartments(availableDepartments.map((d) => d.id))
                            }
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAvailableDepartments.length === availableDepartments.length ? "None" : "All"}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleAssignSelectedDepartments}
                          disabled={selectedAvailableDepartments.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Assign ({selectedAvailableDepartments.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableBody>
                          {availableDepartments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                                No available departments
                              </TableCell>
                            </TableRow>
                          ) : (
                            availableDepartments.map((dept) => (
                              <TableRow key={dept.id} className="hover:bg-muted/50">
                                <TableCell className="w-8 py-1">
                                  <Checkbox
                                    checked={selectedAvailableDepartments.includes(dept.id)}
                                    onCheckedChange={(checked) =>
                                      handleSelectAvailableDepartment(dept.id, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="py-1 text-sm">{dept.name}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Assigned Departments */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Assigned ({formData.assignedDepartments.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAssignedDepartments.length === formData.assignedDepartments.length) {
                              setSelectedAssignedDepartments([])
                            } else {
                              setSelectedAssignedDepartments(formData.assignedDepartments.map((d) => d.id))
                            }
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAssignedDepartments.length === formData.assignedDepartments.length ? "None" : "All"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveSelectedDepartments}
                          disabled={selectedAssignedDepartments.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Remove ({selectedAssignedDepartments.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableBody>
                          {formData.assignedDepartments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                                No assigned departments
                              </TableCell>
                            </TableRow>
                          ) : (
                            formData.assignedDepartments.map((dept) => (
                              <TableRow key={dept.id} className="hover:bg-muted/50">
                                <TableCell className="w-8 py-1">
                                  <Checkbox
                                    checked={selectedAssignedDepartments.includes(dept.id)}
                                    onCheckedChange={(checked) =>
                                      handleSelectAssignedDepartment(dept.id, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="py-1 text-sm font-medium">{dept.name}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information Permissions Matrix */}
              <Card className="shadow-none border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">User Information Permissions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure read and modify permissions for user information fields.
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 py-2 px-4 font-semibold border-b bg-gray-100 rounded-t-md text-xs">
                    <div>User Information</div>
                    <div className="text-center">Read</div>
                    <div className="text-center">Modify</div>
                    <div className="text-center">All</div>
                  </div>
                  {userInformationFields.map((field) => (
                    <div
                      key={field}
                      className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 items-center py-2 px-4 border-b last:border-b-0"
                    >
                      <Label className="font-normal text-xs">{field}</Label>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={formData.userPermissions[field]?.read || false}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("userPermissions", field, "read", checked)
                          }
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={formData.userPermissions[field]?.modify || false}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("userPermissions", field, "modify", checked)
                          }
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={formData.userPermissions[field]?.all || false}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("userPermissions", field, "all", checked)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* User Field Permissions Matrix */}
              <Card className="shadow-none border-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">User Field Permissions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure read and modify permissions for custom user fields.
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 py-2 px-4 font-semibold border-b bg-gray-100 rounded-t-md text-xs">
                    <div>User Field</div>
                    <div className="text-center">Read</div>
                    <div className="text-center">Modify</div>
                    <div className="text-center">All</div>
                  </div>
                  {userFields.map((field) => (
                    <div
                      key={field}
                      className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 items-center py-2 px-4 border-b last:border-b-0"
                    >
                      <Label className="font-normal text-xs">{field}</Label>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={formData.userFieldPermissions[field]?.read || false}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("userFieldPermissions", field, "read", checked)
                          }
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={formData.userFieldPermissions[field]?.modify || false}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("userFieldPermissions", field, "modify", checked)
                          }
                        />
                      </div>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={formData.userFieldPermissions[field]?.all || false}
                          onCheckedChange={(checked) =>
                            handlePermissionChange("userFieldPermissions", field, "all", checked)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Management Tab Content */}
        <TabsContent value="access-management" className="pt-4">
          <Card className="shadow-none border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Authorize Information Permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure read and modify permissions for access management settings.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 py-2 px-4 font-semibold border-b bg-gray-100 rounded-t-md text-xs">
                <div>Authorize Information</div>
                <div className="text-center">Read</div>
                <div className="text-center">Modify</div>
                <div className="text-center">All</div>
              </div>
              {accessManagementFields.map((field) => (
                <div
                  key={field}
                  className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 items-center py-2 px-4 border-b last:border-b-0"
                >
                  <Label className="font-normal text-xs">{field}</Label>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={formData.accessPermissions[field]?.read || false}
                      onCheckedChange={(checked) => handlePermissionChange("accessPermissions", field, "read", checked)}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={formData.accessPermissions[field]?.modify || false}
                      onCheckedChange={(checked) =>
                        handlePermissionChange("accessPermissions", field, "modify", checked)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={formData.accessPermissions[field]?.all || false}
                      onCheckedChange={(checked) => handlePermissionChange("accessPermissions", field, "all", checked)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Setup Tab Content */}
        <TabsContent value="system-setup" className="pt-4">
          <Card className="shadow-none border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Authorize Information Permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure read and modify permissions for system settings.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 py-2 px-4 font-semibold border-b bg-gray-100 rounded-t-md text-xs">
                <div>Authorize Information</div>
                <div className="text-center">Read</div>
                <div className="text-center">Modify</div>
                <div className="text-center">All</div>
              </div>
              {systemSettingFields.map((field) => (
                <div
                  key={field}
                  className="grid grid-cols-[1fr_minmax(0,60px)_minmax(0,60px)_minmax(0,60px)] gap-x-4 items-center py-2 px-4 border-b last:border-b-0"
                >
                  <Label className="font-normal text-xs">{field}</Label>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={formData.systemPermissions[field]?.read || false}
                      onCheckedChange={(checked) => handlePermissionChange("systemPermissions", field, "read", checked)}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={formData.systemPermissions[field]?.modify || false}
                      onCheckedChange={(checked) =>
                        handlePermissionChange("systemPermissions", field, "modify", checked)
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={formData.systemPermissions[field]?.all || false}
                      onCheckedChange={(checked) => handlePermissionChange("systemPermissions", field, "all", checked)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitor Setup Tab Content */}
        <TabsContent value="monitor-setup" className="pt-4">
          <Card className="shadow-none border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Monitor className="h-5 w-5" /> Monitor Setup Rights
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Assign monitoring points and configure permissions for this operator.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Monitoring Points Assignment Section */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold">Monitoring Points</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Available Monitoring Points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Available ({availableMonitoringPoints.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAvailableMonitoringPoints.length === availableMonitoringPoints.length) {
                              setSelectedAvailableMonitoringPoints([])
                            } else {
                              setSelectedAvailableMonitoringPoints(availableMonitoringPoints.map((mp) => mp.id))
                            }
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAvailableMonitoringPoints.length === availableMonitoringPoints.length
                            ? "None"
                            : "All"}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleAssignSelectedMonitoringPoints}
                          disabled={selectedAvailableMonitoringPoints.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Assign ({selectedAvailableMonitoringPoints.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableBody>
                          {availableMonitoringPoints.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center text-muted-foreground py-4 text-xs">
                                No available monitoring points
                              </TableCell>
                            </TableRow>
                          ) : (
                            availableMonitoringPoints.map((point) => (
                              <TableRow key={point.id} className="hover:bg-muted/50">
                                <TableCell className="w-8 py-1">
                                  <Checkbox
                                    checked={selectedAvailableMonitoringPoints.includes(point.id)}
                                    onCheckedChange={(checked) =>
                                      handleSelectAvailableMonitoringPoint(point.id, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="w-8 py-1">
                                  <span className="text-sm">{getMonitoringPointTypeIcon(point.type)}</span>
                                </TableCell>
                                <TableCell className="py-1">
                                  <div className="text-xs">
                                    <div className="font-medium">{point.name}</div>
                                    <div className="text-muted-foreground">{point.location}</div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Assigned Monitoring Points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Assigned ({formData.assignedMonitoringPoints.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAssignedMonitoringPoints.length === formData.assignedMonitoringPoints.length) {
                              setSelectedAssignedMonitoringPoints([])
                            } else {
                              setSelectedAssignedMonitoringPoints(formData.assignedMonitoringPoints.map((mp) => mp.id))
                            }
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAssignedMonitoringPoints.length === formData.assignedMonitoringPoints.length
                            ? "None"
                            : "All"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveSelectedMonitoringPoints}
                          disabled={selectedAssignedMonitoringPoints.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Remove ({selectedAssignedMonitoringPoints.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-8 py-1"></TableHead>
                            <TableHead className="w-8 py-1"></TableHead>
                            <TableHead className="py-1 text-xs">Point</TableHead>
                            <TableHead className="w-12 text-center py-1 text-xs">Read</TableHead>
                            <TableHead className="w-12 text-center py-1 text-xs">Control</TableHead>
                            <TableHead className="w-16 text-center py-1 text-xs">Acknowledge</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.assignedMonitoringPoints.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-muted-foreground py-4 text-xs">
                                No assigned monitoring points
                              </TableCell>
                            </TableRow>
                          ) : (
                            formData.assignedMonitoringPoints.map((point) => (
                              <TableRow key={point.id} className="hover:bg-muted/50">
                                <TableCell className="w-8 py-1">
                                  <Checkbox
                                    checked={selectedAssignedMonitoringPoints.includes(point.id)}
                                    onCheckedChange={(checked) =>
                                      handleSelectAssignedMonitoringPoint(point.id, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="w-8 py-1">
                                  <span className="text-sm">{getMonitoringPointTypeIcon(point.type)}</span>
                                </TableCell>
                                <TableCell className="py-1">
                                  <div className="text-xs">
                                    <div className="font-medium">{point.name}</div>
                                    <div className="text-muted-foreground">{point.location}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center py-1">
                                  <Checkbox
                                    checked={point.permissions.read}
                                    onCheckedChange={(checked) =>
                                      handleMonitoringPointPermissionChange(point.id, "read", checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center py-1">
                                  <Checkbox
                                    checked={point.permissions.control}
                                    onCheckedChange={(checked) =>
                                      handleMonitoringPointPermissionChange(point.id, "control", checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="text-center py-1">
                                  <Checkbox
                                    checked={point.permissions.acknowledge}
                                    onCheckedChange={(checked) =>
                                      handleMonitoringPointPermissionChange(point.id, "acknowledge", checked as boolean)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-end space-x-2 pt-6">
          <Button variant="outline" onClick={() => router.push("/dashboard/operators")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Operator</Button>
        </div>
      </Tabs>
    </div>
  )
}
