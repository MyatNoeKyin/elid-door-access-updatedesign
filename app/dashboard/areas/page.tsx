"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, MapPin, ChevronRight, Edit, Trash2, Users } from "lucide-react"
import React from "react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

// Dummy data for items
const allDoors = [
  { id: "d1", name: "Main Entrance" },
  { id: "d2", name: "Back Door" },
  { id: "d3", name: "Server Room Door" },
  { id: "d4", name: "Office 101 Door" },
  { id: "d5", name: "Office 102 Door" },
  { id: "d6", name: "Conference Room Door" },
  { id: "d7", name: "Break Room Door" },
  { id: "d8", name: "Storage Room Door" },
  { id: "d9", name: "Loading Dock Door" },
  { id: "d10", name: "Executive Office Door" },
]

const allDevices = [
  { id: "dev1", name: "Reader 1" },
  { id: "dev2", name: "Reader 2" },
  { id: "dev3", name: "Camera 1" },
  { id: "dev4", name: "Alarm Panel" },
]

const allFloors = [
  { id: "f1", name: "Ground Floor" },
  { id: "f2", name: "First Floor" },
  { id: "f3", name: "Second Floor" },
]

const allControllers = [
  { id: "c1", name: "Controller A" },
  { id: "c2", name: "Controller B" },
]

const allUserGroups = [
  { id: "ug1", name: "Administrators" },
  { id: "ug2", name: "Security Staff" },
  { id: "ug3", name: "Office Workers" },
  { id: "ug4", name: "Maintenance Team" },
  { id: "ug5", name: "Visitors" },
  { id: "ug6", name: "Contractors" },
  { id: "ug7", name: "Executive Team" },
  { id: "ug8", name: "IT Support" },
]

export default function AreasPage() {
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false)
  const [isUserGroupAssignmentOpen, setIsUserGroupAssignmentOpen] = useState(false)
  const [selectedAreaForUserGroups, setSelectedAreaForUserGroups] = useState<number | null>(null)
  const [currentWizardStep, setCurrentWizardStep] = useState(1)
  const [newAreaForm, setNewAreaForm] = useState({
    name: "",
    parentId: "none",
    description: "",
  })
  const [availableDoors, setAvailableDoors] = useState(allDoors)
  const [assignedDoors, setAssignedDoors] = useState<typeof allDoors>([])
  const [availableDevices, setAvailableDevices] = useState(allDevices)
  const [assignedDevices, setAssignedDevices] = useState<typeof allDevices>([])
  const [availableFloors, setAvailableFloors] = useState(allFloors)
  const [assignedFloors, setAssignedFloors] = useState<typeof allFloors>([])
  const [availableControllers, setAvailableControllers] = useState(allControllers)
  const [assignedControllers, setAssignedControllers] = useState<typeof allControllers>([])
  const [selectedAvailableDoors, setSelectedAvailableDoors] = useState<string[]>([])
  const [selectedAssignedDoors, setSelectedAssignedDoors] = useState<string[]>([])
  const [selectedAvailableDevices, setSelectedAvailableDevices] = useState<string[]>([])
  const [selectedAssignedDevices, setSelectedAssignedDevices] = useState<string[]>([])
  const [selectedAvailableFloors, setSelectedAvailableFloors] = useState<string[]>([])
  const [selectedAssignedFloors, setSelectedAssignedFloors] = useState<string[]>([])
  const [selectedAvailableControllers, setSelectedAvailableControllers] = useState<string[]>([])
  const [selectedAssignedControllers, setSelectedAssignedControllers] = useState<string[]>([])

  // User Groups Assignment State
  const [availableUserGroups, setAvailableUserGroups] = useState(allUserGroups)
  const [assignedUserGroups, setAssignedUserGroups] = useState<typeof allUserGroups>([])
  const [selectedAvailableUserGroups, setSelectedAvailableUserGroups] = useState<string[]>([])
  const [selectedAssignedUserGroups, setSelectedAssignedUserGroups] = useState<string[]>([])

  const { toast } = useToast()

  // Dummy areas data, extended with counts for other items
  const [areas, setAreas] = useState([
    {
      id: 1,
      name: "Building A",
      code: "BLDG-A",
      parentId: null,
      level: 0,
      description: "Main office building",
      doorCount: 12,
      deviceCount: 3,
      floorCount: 2,
      controllerCount: 1,
      children: [
        {
          id: 2,
          name: "Ground Floor",
          code: "BLDG-A-GF",
          parentId: 1,
          level: 1,
          description: "Reception and common areas",
          doorCount: 4,
          deviceCount: 1,
          floorCount: 1,
          controllerCount: 0,
        },
        {
          id: 3,
          name: "First Floor",
          code: "BLDG-A-1F",
          parentId: 1,
          level: 1,
          description: "Office spaces and meeting rooms",
          doorCount: 6,
          deviceCount: 1,
          floorCount: 1,
          controllerCount: 0,
        },
        {
          id: 4,
          name: "Second Floor",
          code: "BLDG-A-2F",
          parentId: 1,
          level: 1,
          description: "Executive offices",
          doorCount: 2,
          deviceCount: 1,
          floorCount: 0,
          controllerCount: 1,
        },
      ],
    },
    {
      id: 5,
      name: "Building B",
      code: "BLDG-B",
      parentId: null,
      level: 0,
      description: "Technical and storage facility",
      doorCount: 8,
      deviceCount: 2,
      floorCount: 1,
      controllerCount: 1,
      children: [
        {
          id: 6,
          name: "Server Room",
          code: "BLDG-B-SVR",
          parentId: 5,
          level: 1,
          description: "Data center and IT infrastructure",
          doorCount: 3,
          deviceCount: 1,
          floorCount: 0,
          controllerCount: 1,
        },
        {
          id: 7,
          name: "Storage Area",
          code: "BLDG-B-STG",
          parentId: 5,
          level: 1,
          description: "Equipment and supply storage",
          doorCount: 5,
          deviceCount: 1,
          floorCount: 1,
          controllerCount: 0,
        },
      ],
    },
  ])

  const handleNewAreaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewAreaForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleNewAreaSelectChange = (id: string, value: string) => {
    setNewAreaForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleNextStep = () => {
    if (currentWizardStep === 1) {
      if (!newAreaForm.name) {
        toast({
          title: "Validation Error",
          description: "Area Name is required.",
          variant: "destructive",
        })
        return
      }
    }
    setCurrentWizardStep((prev) => prev + 1)
  }

  const handleBackStep = () => {
    setCurrentWizardStep((prev) => prev - 1)
  }

  const handleCreateArea = () => {
    console.log("Creating Area:", newAreaForm)
    console.log("Assigned Doors:", assignedDoors)
    console.log("Assigned Devices:", assignedDevices)
    console.log("Assigned Floors:", assignedFloors)
    console.log("Assigned Controllers:", assignedControllers)

    setIsAddAreaOpen(false)
    setCurrentWizardStep(1)
    setNewAreaForm({ name: "", parentId: "none", description: "" })
    setAvailableDoors(allDoors)
    setAssignedDoors([])
    setAvailableDevices(allDevices)
    setAssignedDevices([])
    setAvailableFloors(allFloors)
    setAssignedFloors([])
    setAvailableControllers(allControllers)
    setAssignedControllers([])
    setSelectedAvailableDoors([])
    setSelectedAssignedDoors([])
    setSelectedAvailableDevices([])
    setSelectedAssignedDevices([])
    setSelectedAvailableFloors([])
    setSelectedAssignedFloors([])
    setSelectedAvailableControllers([])
    setSelectedAssignedControllers([])
    toast({
      title: "Success",
      description: "New area created successfully!",
    })
  }

  const handleDeleteArea = (areaId: number) => {
    const areaToDelete = findAreaById(areas, areaId)

    if (
      areaToDelete &&
      (areaToDelete.doorCount > 0 ||
        areaToDelete.deviceCount > 0 ||
        areaToDelete.floorCount > 0 ||
        areaToDelete.controllerCount > 0)
    ) {
      toast({
        title: "Deletion Failed",
        description: "Cannot delete area with assigned doors, devices, floors, or controllers.",
        variant: "destructive",
      })
      return
    }

    if (window.confirm("Are you sure you want to delete this area? This action is irreversible.")) {
      setAreas((prevAreas) => removeAreaById(prevAreas, areaId))
      toast({
        title: "Area Deleted",
        description: "The area has been successfully deleted.",
      })
    }
  }

  const handleOpenUserGroupAssignment = (areaId: number) => {
    setSelectedAreaForUserGroups(areaId)
    // Reset user groups assignment state
    setAvailableUserGroups(allUserGroups)
    setAssignedUserGroups([])
    setSelectedAvailableUserGroups([])
    setSelectedAssignedUserGroups([])
    setIsUserGroupAssignmentOpen(true)
  }

  const handleSaveUserGroupAssignment = () => {
    const areaName = findAreaById(areas, selectedAreaForUserGroups!)?.name || "Unknown Area"
    console.log(`Saving user group assignments for area: ${areaName}`)
    console.log("Assigned User Groups:", assignedUserGroups)

    setIsUserGroupAssignmentOpen(false)
    setSelectedAreaForUserGroups(null)
    toast({
      title: "Success",
      description: `User groups assigned to ${areaName} successfully!`,
    })
  }

  const findAreaById = (currentAreas: any[], id: number): any | null => {
    for (const area of currentAreas) {
      if (area.id === id) {
        return area
      }
      if (area.children) {
        const found = findAreaById(area.children, id)
        if (found) return found
      }
    }
    return null
  }

  const removeAreaById = (currentAreas: any[], id: number): any[] => {
    return currentAreas.filter((area) => {
      if (area.id === id) {
        return false
      }
      if (area.children) {
        area.children = removeAreaById(area.children, id)
      }
      return true
    })
  }

  const renderAreaTree = (areas: any[], level = 0) => {
    return areas.flatMap((area) => (
      <React.Fragment key={area.id}>
        <tr className="border-b border-slate-100 hover:bg-slate-50">
          <td className="py-3 pl-0">
            <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
              {level > 0 && <ChevronRight className="h-4 w-4 mr-1 text-slate-400" />}
              <MapPin className="h-4 w-4 mr-2 text-slate-500" />
              <span className="font-medium">{area.name}</span>
            </div>
          </td>
          <td className="py-3 max-w-xs">
            <p className="text-slate-600 truncate">{area.description}</p>
          </td>
          <td className="py-3">
            {area.doorCount} doors, {area.deviceCount} devices, {area.floorCount} floors, {area.controllerCount}{" "}
            controllers
          </td>
          <td className="py-3">
            <Badge
              variant="outline"
              className={
                level === 0 ? "border-blue-200 text-blue-800 bg-blue-50" : "border-green-200 text-green-800 bg-green-50"
              }
            >
              {level === 0 ? "Parent" : "Child"}
            </Badge>
          </td>
          <td className="py-3">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenUserGroupAssignment(area.id)}
                title="Assign User Groups"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteArea(area.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </td>
        </tr>
        {area.children && renderAreaTree(area.children, level + 1)}
      </React.Fragment>
    ))
  }

  const renderAssignmentSection = (
    title: string,
    availableItems: { id: string; name: string }[],
    assignedItems: { id: string; name: string }[],
    type: "door" | "device" | "floor" | "controller",
  ) => {
    const getSelectedAvailable = () => {
      switch (type) {
        case "door":
          return selectedAvailableDoors
        case "device":
          return selectedAvailableDevices
        case "floor":
          return selectedAvailableFloors
        case "controller":
          return selectedAvailableControllers
      }
    }

    const getSelectedAssigned = () => {
      switch (type) {
        case "door":
          return selectedAssignedDoors
        case "device":
          return selectedAssignedDevices
        case "floor":
          return selectedAssignedFloors
        case "controller":
          return selectedAssignedControllers
      }
    }

    const setSelectedAvailable = (items: string[]) => {
      switch (type) {
        case "door":
          setSelectedAvailableDoors(items)
          break
        case "device":
          setSelectedAvailableDevices(items)
          break
        case "floor":
          setSelectedAvailableFloors(items)
          break
        case "controller":
          setSelectedAvailableControllers(items)
          break
      }
    }

    const setSelectedAssigned = (items: string[]) => {
      switch (type) {
        case "door":
          setSelectedAssignedDoors(items)
          break
        case "device":
          setSelectedAssignedDevices(items)
          break
        case "floor":
          setSelectedAssignedFloors(items)
          break
        case "controller":
          setSelectedAssignedControllers(items)
          break
      }
    }

    const handleSelectAllAvailable = () => {
      const selected = getSelectedAvailable()
      if (selected.length === availableItems.length) {
        setSelectedAvailable([])
      } else {
        setSelectedAvailable(availableItems.map((item) => item.id))
      }
    }

    const handleSelectAllAssigned = () => {
      const selected = getSelectedAssigned()
      if (selected.length === assignedItems.length) {
        setSelectedAssigned([])
      } else {
        setSelectedAssigned(assignedItems.map((item) => item.id))
      }
    }

    const handleAssignSelected = () => {
      const selectedIds = getSelectedAvailable()
      const itemsToAssign = availableItems.filter((item) => selectedIds.includes(item.id))

      switch (type) {
        case "door":
          setAssignedDoors((prev) => [...prev, ...itemsToAssign])
          setAvailableDoors((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
        case "device":
          setAssignedDevices((prev) => [...prev, ...itemsToAssign])
          setAvailableDevices((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
        case "floor":
          setAssignedFloors((prev) => [...prev, ...itemsToAssign])
          setAvailableFloors((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
        case "controller":
          setAssignedControllers((prev) => [...prev, ...itemsToAssign])
          setAvailableControllers((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
      }
      setSelectedAvailable([])
    }

    const handleRemoveSelected = () => {
      const selectedIds = getSelectedAssigned()
      const itemsToRemove = assignedItems.filter((item) => selectedIds.includes(item.id))

      switch (type) {
        case "door":
          setAvailableDoors((prev) => [...prev, ...itemsToRemove])
          setAssignedDoors((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
        case "device":
          setAvailableDevices((prev) => [...prev, ...itemsToRemove])
          setAssignedDevices((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
        case "floor":
          setAvailableFloors((prev) => [...prev, ...itemsToRemove])
          setAssignedFloors((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
        case "controller":
          setAvailableControllers((prev) => [...prev, ...itemsToRemove])
          setAssignedControllers((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
          break
      }
      setSelectedAssigned([])
    }

    const handleAvailableItemChange = (itemId: string, checked: boolean) => {
      const selected = getSelectedAvailable()
      if (checked) {
        setSelectedAvailable([...selected, itemId])
      } else {
        setSelectedAvailable(selected.filter((id) => id !== itemId))
      }
    }

    const handleAssignedItemChange = (itemId: string, checked: boolean) => {
      const selected = getSelectedAssigned()
      if (checked) {
        setSelectedAssigned([...selected, itemId])
      } else {
        setSelectedAssigned(selected.filter((id) => id !== itemId))
      }
    }

    const selectedAvailable = getSelectedAvailable()
    const selectedAssigned = getSelectedAssigned()

    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Available Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Available ({availableItems.length})</h4>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllAvailable}
                  className="h-7 px-2 text-xs bg-transparent"
                >
                  {selectedAvailable.length === availableItems.length ? "None" : "All"}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAssignSelected}
                  disabled={selectedAvailable.length === 0}
                  className="h-7 px-2 text-xs"
                >
                  Assign ({selectedAvailable.length})
                </Button>
              </div>
            </div>
            <div className="h-48 overflow-y-auto border rounded text-sm">
              <Table>
                <TableBody>
                  {availableItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                        No available {type}s
                      </TableCell>
                    </TableRow>
                  ) : (
                    availableItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="w-8 py-1">
                          <Checkbox
                            checked={selectedAvailable.includes(item.id)}
                            onCheckedChange={(checked) => handleAvailableItemChange(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="py-1 text-sm">{item.name}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Assigned Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Assigned ({assignedItems.length})</h4>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllAssigned}
                  className="h-7 px-2 text-xs bg-transparent"
                >
                  {selectedAssigned.length === assignedItems.length ? "None" : "All"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveSelected}
                  disabled={selectedAssigned.length === 0}
                  className="h-7 px-2 text-xs"
                >
                  Remove ({selectedAssigned.length})
                </Button>
              </div>
            </div>
            <div className="h-48 overflow-y-auto border rounded text-sm">
              <Table>
                <TableBody>
                  {assignedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                        No assigned {type}s
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignedItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="w-8 py-1">
                          <Checkbox
                            checked={selectedAssigned.includes(item.id)}
                            onCheckedChange={(checked) => handleAssignedItemChange(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="py-1 text-sm">{item.name}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderUserGroupAssignmentSection = () => {
    const handleSelectAllAvailable = () => {
      if (selectedAvailableUserGroups.length === availableUserGroups.length) {
        setSelectedAvailableUserGroups([])
      } else {
        setSelectedAvailableUserGroups(availableUserGroups.map((group) => group.id))
      }
    }

    const handleSelectAllAssigned = () => {
      if (selectedAssignedUserGroups.length === assignedUserGroups.length) {
        setSelectedAssignedUserGroups([])
      } else {
        setSelectedAssignedUserGroups(assignedUserGroups.map((group) => group.id))
      }
    }

    const handleAssignSelected = () => {
      const groupsToAssign = availableUserGroups.filter((group) => selectedAvailableUserGroups.includes(group.id))
      setAssignedUserGroups((prev) => [...prev, ...groupsToAssign])
      setAvailableUserGroups((prev) => prev.filter((group) => !selectedAvailableUserGroups.includes(group.id)))
      setSelectedAvailableUserGroups([])
    }

    const handleRemoveSelected = () => {
      const groupsToRemove = assignedUserGroups.filter((group) => selectedAssignedUserGroups.includes(group.id))
      setAvailableUserGroups((prev) => [...prev, ...groupsToRemove])
      setAssignedUserGroups((prev) => prev.filter((group) => !selectedAssignedUserGroups.includes(group.id)))
      setSelectedAssignedUserGroups([])
    }

    const handleAvailableGroupChange = (groupId: string, checked: boolean) => {
      if (checked) {
        setSelectedAvailableUserGroups((prev) => [...prev, groupId])
      } else {
        setSelectedAvailableUserGroups((prev) => prev.filter((id) => id !== groupId))
      }
    }

    const handleAssignedGroupChange = (groupId: string, checked: boolean) => {
      if (checked) {
        setSelectedAssignedUserGroups((prev) => [...prev, groupId])
      } else {
        setSelectedAssignedUserGroups((prev) => prev.filter((id) => id !== groupId))
      }
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available User Groups */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Available User Groups ({availableUserGroups.length})</h4>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllAvailable}
                className="h-7 px-2 text-xs bg-transparent"
              >
                {selectedAvailableUserGroups.length === availableUserGroups.length ? "None" : "All"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAssignSelected}
                disabled={selectedAvailableUserGroups.length === 0}
                className="h-7 px-2 text-xs"
              >
                Assign ({selectedAvailableUserGroups.length})
              </Button>
            </div>
          </div>
          <div className="h-64 overflow-y-auto border rounded text-sm">
            <Table>
              <TableBody>
                {availableUserGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                      No available user groups
                    </TableCell>
                  </TableRow>
                ) : (
                  availableUserGroups.map((group) => (
                    <TableRow key={group.id} className="hover:bg-muted/50">
                      <TableCell className="w-8 py-2">
                        <Checkbox
                          checked={selectedAvailableUserGroups.includes(group.id)}
                          onCheckedChange={(checked) => handleAvailableGroupChange(group.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="py-2 text-sm">{group.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Assigned User Groups */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Assigned User Groups ({assignedUserGroups.length})</h4>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllAssigned}
                className="h-7 px-2 text-xs bg-transparent"
              >
                {selectedAssignedUserGroups.length === assignedUserGroups.length ? "None" : "All"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={selectedAssignedUserGroups.length === 0}
                className="h-7 px-2 text-xs"
              >
                Remove ({selectedAssignedUserGroups.length})
              </Button>
            </div>
          </div>
          <div className="h-64 overflow-y-auto border rounded text-sm">
            <Table>
              <TableBody>
                {assignedUserGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                      No assigned user groups
                    </TableCell>
                  </TableRow>
                ) : (
                  assignedUserGroups.map((group) => (
                    <TableRow key={group.id} className="hover:bg-muted/50">
                      <TableCell className="w-8 py-2">
                        <Checkbox
                          checked={selectedAssignedUserGroups.includes(group.id)}
                          onCheckedChange={(checked) => handleAssignedGroupChange(group.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="py-2 text-sm">{group.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Area Management</h1>
          <p className="text-muted-foreground">Organize access zones with hierarchical structure</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddAreaOpen} onOpenChange={setIsAddAreaOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Area
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentWizardStep === 1 ? "Add New Area" : "Assign Items to Area"}</DialogTitle>
              </DialogHeader>
              {currentWizardStep === 1 && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="area-name">
                      Area Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter area name"
                      value={newAreaForm.name}
                      onChange={handleNewAreaChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-area">Parent Area</Label>
                    <Select
                      value={newAreaForm.parentId}
                      onValueChange={(value) => handleNewAreaSelectChange("parentId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent area (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Root Level)</SelectItem>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter area description"
                      value={newAreaForm.description}
                      onChange={handleNewAreaChange}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddAreaOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleNextStep}>Next</Button>
                  </div>
                </div>
              )}
              {currentWizardStep === 2 && (
                <div className="space-y-6 pt-4">
                  {renderAssignmentSection("Doors", availableDoors, assignedDoors, "door")}
                  {renderAssignmentSection("Devices", availableDevices, assignedDevices, "device")}
                  {renderAssignmentSection("Floors", availableFloors, assignedFloors, "floor")}
                  {renderAssignmentSection("Controllers", availableControllers, assignedControllers, "controller")}
                  <div className="flex justify-between space-x-2 pt-4">
                    <Button variant="outline" onClick={handleBackStep}>
                      Back
                    </Button>
                    <Button onClick={handleCreateArea}>Create Area</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Group Assignment Modal */}
      <Dialog open={isUserGroupAssignmentOpen} onOpenChange={setIsUserGroupAssignmentOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Assign User Groups to{" "}
              {selectedAreaForUserGroups ? findAreaById(areas, selectedAreaForUserGroups)?.name : "Area"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {renderUserGroupAssignmentSection()}
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsUserGroupAssignmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveUserGroupAssignment}>Save Assignment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{areas.length + areas.flatMap((a) => a.children || []).length}</div>
            <p className="text-xs text-muted-foreground">Configured zones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parent Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{areas.length}</div>
            <p className="text-xs text-muted-foreground">Root level areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Child Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{areas.flatMap((a) => a.children || []).length}</div>
            <p className="text-xs text-muted-foreground">Sub-areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doors</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {areas.reduce(
                (sum, area) =>
                  sum +
                  area.doorCount +
                  (area.children
                    ? area.children.reduce((childSum: number, child: any) => childSum + child.doorCount, 0)
                    : 0),
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Across all areas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Area Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search areas..." className="pl-8" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium p-2 pl-0">Area Name</th>
                  <th className="text-left font-medium p-2">Description</th>
                  <th className="text-left font-medium p-2">Assigned Items</th>
                  <th className="text-left font-medium p-2">Type</th>
                  <th className="text-left font-medium p-2">Actions</th>
                </tr>
              </thead>
              <tbody>{renderAreaTree(areas)}</tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
