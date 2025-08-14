"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, Building2, Plus, Trash2, UserCheck, Shield, Key, Filter, X, Check } from "lucide-react"
import { toast } from "sonner"

// Types
interface Floor {
  id: string
  name: string
  building: string
  level: number
  status: "active" | "inactive"
}

interface User {
  id: string
  name: string
  department: string
  status: "active" | "inactive"
}

interface Assignment {
  id: string
  floorId: string
  floorName: string
  userId: string
  userName: string
  accessLevel: "full" | "restricted" | "emergency"
  assignedDate: string
}

// Mock data
const mockFloors: Floor[] = [
  { id: "1", name: "Main Lobby", building: "Tower A", level: 1, status: "active" },
  { id: "2", name: "Executive Floor", building: "Tower A", level: 20, status: "active" },
  { id: "3", name: "IT Department", building: "Tower B", level: 5, status: "active" },
  { id: "4", name: "Conference Center", building: "Tower A", level: 2, status: "active" },
  { id: "5", name: "Cafeteria Level", building: "Tower B", level: 1, status: "active" },
  { id: "6", name: "R&D Labs", building: "Tower C", level: 3, status: "active" },
  { id: "7", name: "Storage Level", building: "Tower B", level: -1, status: "inactive" },
  { id: "8", name: "Rooftop Access", building: "Tower A", level: 25, status: "active" },
  { id: "9", name: "Parking Level", building: "Tower A", level: -2, status: "active" },
  { id: "10", name: "Recreation Floor", building: "Tower C", level: 8, status: "active" },
]

const mockUsers: User[] = [
  { id: "1", name: "John Smith", department: "IT", status: "active" },
  { id: "2", name: "Sarah Johnson", department: "HR", status: "active" },
  { id: "3", name: "Mike Wilson", department: "Security", status: "active" },
  { id: "4", name: "Emily Davis", department: "Finance", status: "active" },
  { id: "5", name: "David Brown", department: "Operations", status: "inactive" },
  { id: "6", name: "Lisa Anderson", department: "Marketing", status: "active" },
  { id: "7", name: "Tom Garcia", department: "IT", status: "active" },
  { id: "8", name: "Anna Martinez", department: "Legal", status: "active" },
]

const mockAssignments: Assignment[] = [
  {
    id: "1",
    floorId: "1",
    floorName: "Main Lobby",
    userId: "1",
    userName: "John Smith",
    accessLevel: "full",
    assignedDate: "2024-01-15",
  },
  {
    id: "2",
    floorId: "3",
    floorName: "IT Department",
    userId: "1",
    userName: "John Smith",
    accessLevel: "full",
    assignedDate: "2024-01-15",
  },
  {
    id: "3",
    floorId: "1",
    floorName: "Main Lobby",
    userId: "2",
    userName: "Sarah Johnson",
    accessLevel: "restricted",
    assignedDate: "2024-01-16",
  },
  {
    id: "4",
    floorId: "2",
    floorName: "Executive Floor",
    userId: "3",
    userName: "Mike Wilson",
    accessLevel: "full",
    assignedDate: "2024-01-17",
  },
  {
    id: "5",
    floorId: "4",
    floorName: "Conference Center",
    userId: "4",
    userName: "Emily Davis",
    accessLevel: "restricted",
    assignedDate: "2024-01-18",
  },
  {
    id: "6",
    floorId: "6",
    floorName: "R&D Labs",
    userId: "1",
    userName: "John Smith",
    accessLevel: "full",
    assignedDate: "2024-01-19",
  },
  {
    id: "7",
    floorId: "5",
    floorName: "Cafeteria Level",
    userId: "6",
    userName: "Lisa Anderson",
    accessLevel: "restricted",
    assignedDate: "2024-01-20",
  },
  {
    id: "8",
    floorId: "8",
    floorName: "Rooftop Access",
    userId: "3",
    userName: "Mike Wilson",
    accessLevel: "emergency",
    assignedDate: "2024-01-21",
  },
]

export default function AssignFloorsUsersPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFloorIds, setSelectedFloorIds] = useState<string[]>([])
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([])
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isFloorsPopoverOpen, setIsFloorsPopoverOpen] = useState(false)

  // Assignment dialog state
  const [availableFloors, setAvailableFloors] = useState<Floor[]>(mockFloors)
  const [assignedFloors, setAssignedFloors] = useState<Floor[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>(mockUsers)
  const [assignedUsers, setAssignedUsers] = useState<User[]>([])

  // Add state for checkbox selections
  const [selectedAvailableFloors, setSelectedAvailableFloors] = useState<string[]>([])
  const [selectedAssignedFloors, setSelectedAssignedFloors] = useState<string[]>([])
  const [selectedAvailableUsers, setSelectedAvailableUsers] = useState<string[]>([])
  const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>([])

  // Get unique floors for filter dropdown
  const uniqueFloors = Array.from(
    new Map(
      assignments.map((assignment) => [assignment.floorId, { id: assignment.floorId, name: assignment.floorName }]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name))

  // Filter assignments based on search and floor filter
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.floorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.userName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFloorFilter = selectedFloorIds.length === 0 || selectedFloorIds.includes(assignment.floorId)

    return matchesSearch && matchesFloorFilter
  })

  // Handle checkbox selection
  const handleSelectAssignment = (assignmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignments([...selectedAssignments, assignmentId])
    } else {
      setSelectedAssignments(selectedAssignments.filter((id) => id !== assignmentId))
    }
  }

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssignments(filteredAssignments.map((assignment) => assignment.id))
    } else {
      setSelectedAssignments([])
    }
  }

  // Check if all visible assignments are selected
  const isAllSelected =
    filteredAssignments.length > 0 &&
    filteredAssignments.every((assignment) => selectedAssignments.includes(assignment.id))

  // Check if some (but not all) assignments are selected
  const isIndeterminate = selectedAssignments.length > 0 && !isAllSelected

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedAssignments.length === 0) return

    setAssignments(assignments.filter((assignment) => !selectedAssignments.includes(assignment.id)))
    setSelectedAssignments([])
    toast.success(`Deleted ${selectedAssignments.length} assignment(s)`)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedFloorIds([])
    setSelectedAssignments([])
  }

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || selectedFloorIds.length > 0

  // Handle floor selection in multi-select
  const handleFloorSelection = (floorId: string) => {
    setSelectedFloorIds((current) => {
      if (current.includes(floorId)) {
        return current.filter((id) => id !== floorId)
      } else {
        return [...current, floorId]
      }
    })
  }

  // Add checkbox handlers
  const handleSelectAvailableFloor = (floorId: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailableFloors([...selectedAvailableFloors, floorId])
    } else {
      setSelectedAvailableFloors(selectedAvailableFloors.filter((id) => id !== floorId))
    }
  }

  const handleSelectAssignedFloor = (floorId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignedFloors([...selectedAssignedFloors, floorId])
    } else {
      setSelectedAssignedFloors(selectedAssignedFloors.filter((id) => id !== floorId))
    }
  }

  const handleSelectAvailableUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailableUsers([...selectedAvailableUsers, userId])
    } else {
      setSelectedAvailableUsers(selectedAvailableUsers.filter((id) => id !== userId))
    }
  }

  const handleSelectAssignedUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssignedUsers([...selectedAssignedUsers, userId])
    } else {
      setSelectedAssignedUsers(selectedAssignedUsers.filter((id) => id !== userId))
    }
  }

  const handleAssignSelectedFloors = () => {
    const floorsToAssign = availableFloors.filter((floor) => selectedAvailableFloors.includes(floor.id))
    setAssignedFloors([...assignedFloors, ...floorsToAssign])
    setAvailableFloors(availableFloors.filter((floor) => !selectedAvailableFloors.includes(floor.id)))
    setSelectedAvailableFloors([])
  }

  const handleRemoveSelectedFloors = () => {
    const floorsToRemove = assignedFloors.filter((floor) => selectedAssignedFloors.includes(floor.id))
    setAvailableFloors([...availableFloors, ...floorsToRemove])
    setAssignedFloors(assignedFloors.filter((floor) => !selectedAssignedFloors.includes(floor.id)))
    setSelectedAssignedFloors([])
  }

  const handleAssignSelectedUsers = () => {
    const usersToAssign = availableUsers.filter((user) => selectedAvailableUsers.includes(user.id))
    setAssignedUsers([...assignedUsers, ...usersToAssign])
    setAvailableUsers(availableUsers.filter((user) => !selectedAvailableUsers.includes(user.id)))
    setSelectedAvailableUsers([])
  }

  const handleRemoveSelectedUsers = () => {
    const usersToRemove = assignedUsers.filter((user) => selectedAssignedUsers.includes(user.id))
    setAvailableUsers([...availableUsers, ...usersToRemove])
    setAssignedUsers(assignedUsers.filter((user) => !selectedAssignedUsers.includes(user.id)))
    setSelectedAssignedUsers([])
  }

  // Handle assignment creation
  const handleCreateAssignments = () => {
    if (assignedFloors.length === 0 || assignedUsers.length === 0) {
      toast.error("Please select at least one floor and one user")
      return
    }

    const newAssignments: Assignment[] = []
    assignedFloors.forEach((floor) => {
      assignedUsers.forEach((user) => {
        newAssignments.push({
          id: `${Date.now()}-${floor.id}-${user.id}`,
          floorId: floor.id,
          floorName: floor.name,
          userId: user.id,
          userName: user.name,
          accessLevel: "full",
          assignedDate: new Date().toISOString().split("T")[0],
        })
      })
    })

    setAssignments([...assignments, ...newAssignments])

    // Reset dialog state
    setAvailableFloors(mockFloors)
    setAssignedFloors([])
    setAvailableUsers(mockUsers)
    setAssignedUsers([])
    setSelectedAvailableFloors([])
    setSelectedAssignedFloors([])
    setSelectedAvailableUsers([])
    setSelectedAssignedUsers([])

    setIsAssignDialogOpen(false)
    toast.success(`Created ${newAssignments.length} floor-user assignments`)
  }

  const getAccessLevelBadge = (level: string) => {
    const variants = {
      full: "bg-green-100 text-green-800",
      restricted: "bg-yellow-100 text-yellow-800",
      emergency: "bg-red-100 text-red-800",
    }
    return variants[level as keyof typeof variants] || variants.full
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assign Floors to Users</h1>
          <p className="text-muted-foreground">Manage floor access assignments for users</p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Assign Floors to Users
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center text-xl">
                <Key className="mr-2 h-5 w-5" />
                Access Rights Configuration
              </DialogTitle>
              <DialogDescription>Select which floors and users to assign access.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Floors Section */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold">Floors</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Available Floors */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Available ({availableFloors.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAvailableFloors.length === availableFloors.length) {
                              setSelectedAvailableFloors([])
                            } else {
                              setSelectedAvailableFloors(availableFloors.map((f) => f.id))
                            }
                          }}
                          disabled={availableFloors.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAvailableFloors.length === availableFloors.length ? "None" : "All"}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleAssignSelectedFloors}
                          disabled={selectedAvailableFloors.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Assign ({selectedAvailableFloors.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableBody>
                          {availableFloors.map((floor) => (
                            <TableRow key={floor.id} className="hover:bg-muted/50">
                              <TableCell className="w-8 py-1">
                                <Checkbox
                                  checked={selectedAvailableFloors.includes(floor.id)}
                                  onCheckedChange={(checked) =>
                                    handleSelectAvailableFloor(floor.id, checked as boolean)
                                  }
                                />
                              </TableCell>
                              <TableCell className="py-1">
                                <div className="text-xs">
                                  <div className="font-medium">{floor.name}</div>
                                  <div className="text-muted-foreground">
                                    {floor.building} • Level {floor.level}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {availableFloors.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                                All floors have been assigned
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Assigned Floors */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Assigned ({assignedFloors.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAssignedFloors.length === assignedFloors.length) {
                              setSelectedAssignedFloors([])
                            } else {
                              setSelectedAssignedFloors(assignedFloors.map((f) => f.id))
                            }
                          }}
                          disabled={assignedFloors.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAssignedFloors.length === assignedFloors.length ? "None" : "All"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveSelectedFloors}
                          disabled={selectedAssignedFloors.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Remove ({selectedAssignedFloors.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableBody>
                          {assignedFloors.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                                No floors assigned
                              </TableCell>
                            </TableRow>
                          ) : (
                            assignedFloors.map((floor) => (
                              <TableRow key={floor.id} className="hover:bg-muted/50">
                                <TableCell className="w-8 py-1">
                                  <Checkbox
                                    checked={selectedAssignedFloors.includes(floor.id)}
                                    onCheckedChange={(checked) =>
                                      handleSelectAssignedFloor(floor.id, checked as boolean)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="py-1">
                                  <div className="text-xs">
                                    <div className="font-medium">{floor.name}</div>
                                    <div className="text-muted-foreground">
                                      {floor.building} • Level {floor.level}
                                    </div>
                                  </div>
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

              {/* Users Section */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold">Users</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Available Users */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Available ({availableUsers.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAvailableUsers.length === availableUsers.length) {
                              setSelectedAvailableUsers([])
                            } else {
                              setSelectedAvailableUsers(availableUsers.map((u) => u.id))
                            }
                          }}
                          disabled={availableUsers.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAvailableUsers.length === availableUsers.length ? "None" : "All"}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleAssignSelectedUsers}
                          disabled={selectedAvailableUsers.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Assign ({selectedAvailableUsers.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableBody>
                          {availableUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/50">
                              <TableCell className="w-8 py-1">
                                <Checkbox
                                  checked={selectedAvailableUsers.includes(user.id)}
                                  onCheckedChange={(checked) => handleSelectAvailableUser(user.id, checked as boolean)}
                                />
                              </TableCell>
                              <TableCell className="py-1">
                                <div className="text-xs">
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-muted-foreground">{user.department}</div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {availableUsers.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                                All users have been assigned
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Assigned Users */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Assigned ({assignedUsers.length})</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedAssignedUsers.length === assignedUsers.length) {
                              setSelectedAssignedUsers([])
                            } else {
                              setSelectedAssignedUsers(assignedUsers.map((u) => u.id))
                            }
                          }}
                          disabled={assignedUsers.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          {selectedAssignedUsers.length === assignedUsers.length ? "None" : "All"}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveSelectedUsers}
                          disabled={selectedAssignedUsers.length === 0}
                          className="h-7 px-2 text-xs"
                        >
                          Remove ({selectedAssignedUsers.length})
                        </Button>
                      </div>
                    </div>
                    <div className="h-48 overflow-y-auto border rounded text-sm">
                      <Table>
                        <TableBody>
                          {assignedUsers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                                No users assigned
                              </TableCell>
                            </TableRow>
                          ) : (
                            assignedUsers.map((user) => (
                              <TableRow key={user.id} className="hover:bg-muted/50">
                                <TableCell className="w-8 py-1">
                                  <Checkbox
                                    checked={selectedAssignedUsers.includes(user.id)}
                                    onCheckedChange={(checked) => handleSelectAssignedUser(user.id, checked as boolean)}
                                  />
                                </TableCell>
                                <TableCell className="py-1">
                                  <div className="text-xs">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-muted-foreground">{user.department}</div>
                                  </div>
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
            </div>

            <DialogFooter className="pt-6 border-t">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAssignments}>Create Assignments</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Floors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(assignments.map((a) => a.floorId)).size}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(assignments.map((a) => a.userId)).size}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Access</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.filter((a) => a.accessLevel === "full").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Current Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Floor-User Assignments</CardTitle>
          <CardDescription>View and manage all current floor access assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by floor name or user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Popover open={isFloorsPopoverOpen} onOpenChange={setIsFloorsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isFloorsPopoverOpen}
                    className="w-[240px] justify-between bg-transparent"
                  >
                    {selectedFloorIds.length === 0
                      ? "Filter by floors"
                      : `${selectedFloorIds.length} floor${selectedFloorIds.length > 1 ? "s" : ""} selected`}
                    <Filter className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0">
                  <Command>
                    <CommandInput placeholder="Search floors..." />
                    <CommandList>
                      <CommandEmpty>No floors found.</CommandEmpty>
                      <CommandGroup>
                        {uniqueFloors.map((floor) => (
                          <CommandItem
                            key={floor.id}
                            value={floor.name}
                            onSelect={() => handleFloorSelection(floor.id)}
                          >
                            <Checkbox
                              checked={selectedFloorIds.includes(floor.id)}
                              className="mr-2"
                              onCheckedChange={() => {}}
                            />
                            <span>{floor.name}</span>
                            {selectedFloorIds.includes(floor.id) && <Check className="ml-auto h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Selected Floors Pills */}
          {selectedFloorIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFloorIds.map((floorId) => {
                const floor = uniqueFloors.find((f) => f.id === floorId)
                if (!floor) return null

                return (
                  <Badge key={floorId} variant="secondary" className="px-3 py-1">
                    {floor.name}
                    <X
                      className="ml-2 h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedFloorIds(selectedFloorIds.filter((id) => id !== floorId))}
                    />
                  </Badge>
                )
              })}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {hasActiveFilters && (
                <span>
                  Showing {filteredAssignments.length} of {assignments.length} assignments
                </span>
              )}
            </div>
            {selectedAssignments.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedAssignments.length})
              </Button>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate
                      }}
                    />
                  </TableHead>
                  <TableHead>Floor Name</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAssignments.includes(assignment.id)}
                          onCheckedChange={(checked) => handleSelectAssignment(assignment.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{assignment.floorName}</TableCell>
                      <TableCell>{assignment.userName}</TableCell>
                      <TableCell>
                        <Badge className={getAccessLevelBadge(assignment.accessLevel)}>{assignment.accessLevel}</Badge>
                      </TableCell>
                      <TableCell>{assignment.assignedDate}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAssignments(assignments.filter((a) => a.id !== assignment.id))
                            setSelectedAssignments(selectedAssignments.filter((id) => id !== assignment.id))
                            toast.success("Assignment removed successfully")
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {hasActiveFilters
                        ? "No assignments found matching your filters."
                        : "No floor-user assignments found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredAssignments.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                {!hasActiveFilters && <span>Showing {filteredAssignments.length} assignments</span>}
                {selectedAssignments.length > 0 && (
                  <span className="ml-2">• {selectedAssignments.length} selected</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
