"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, CreditCard, Fingerprint, Key, User, Trash2, Calendar, Clock, Phone, Plus, X } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface AccessItem {
  id: string
  name: string
}

interface CardInfo {
  id: string
  cardId: string
  lostCard: boolean
  inhibitCard: boolean
  useFingerprint: boolean
  effectiveDate: string
  expiryDate: string
  effectiveTime: string
  expiryTime: string
  isPrimary: boolean
}

interface FingerprintEnrollment {
  id: string
  cardId: string
  fingerType: string
  alarmFinger: boolean
  writeToCard: boolean
  status: "enrolled" | "pending" | "failed"
}

interface AccessGroup {
  id: string
  name: string
  description?: string
}

const ALL_DOORS: AccessItem[] = [
  { id: "door-1", name: "Main Entrance" },
  { id: "door-2", name: "Office Floor 1" },
  { id: "door-3", name: "Server Room" },
  { id: "door-4", name: "Warehouse Access" },
  { id: "door-5", name: "Executive Office" },
  { id: "door-6", name: "IT Department" },
  { id: "door-7", name: "Conference Room" },
  { id: "door-8", name: "Storage Area" },
  { id: "door-9", name: "Loading Dock" },
  { id: "door-10", name: "Break Room" },
]

const ALL_FLOORS: AccessItem[] = [
  { id: "floor-1", name: "Ground Floor" },
  { id: "floor-2", name: "First Floor" },
  { id: "floor-3", name: "Second Floor" },
  { id: "floor-4", name: "Third Floor" },
  { id: "floor-5", name: "Basement" },
  { id: "floor-6", name: "Fourth Floor" },
  { id: "floor-7", name: "Fifth Floor" },
]

const FINGER_TYPES = [
  "Right Thumb",
  "Right Forefinger",
  "Right Middle Finger",
  "Right Ring Finger",
  "Right Little Finger",
  "Left Thumb",
  "Left Forefinger",
  "Left Middle Finger",
  "Left Ring Finger",
  "Left Little Finger",
]

const ALL_ACCESS_GROUPS_INITIAL: AccessGroup[] = [
  { id: "ag-1", name: "Administrators", description: "Full system access" },
  { id: "ag-2", name: "Employees", description: "Standard office hours access" },
  { id: "ag-3", name: "Visitors", description: "Limited lobby access" },
  { id: "ag-4", name: "Maintenance Staff", description: "After-hours building access" },
  { id: "ag-5", name: "Executives", description: "Access to executive floors and offices" },
]

function AccessSection({
  title,
  type,
  available,
  setAvailable,
  assigned,
  setAssigned,
}: {
  title: string
  type: "doors" | "floors"
  available: AccessItem[]
  setAvailable: React.Dispatch<React.SetStateAction<AccessItem[]>>
  assigned: AccessItem[]
  setAssigned: React.Dispatch<React.SetStateAction<AccessItem[]>>
}) {
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([])
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([])

  const handleSelectAllAvailable = () => {
    if (selectedAvailable.length === available.length) {
      setSelectedAvailable([])
    } else {
      setSelectedAvailable(available.map((item) => item.id))
    }
  }

  const handleSelectAllAssigned = () => {
    if (selectedAssigned.length === assigned.length) {
      setSelectedAssigned([])
    } else {
      setSelectedAssigned(assigned.map((item) => item.id))
    }
  }

  const handleAssignSelected = () => {
    const itemsToAssign = available.filter((item) => selectedAvailable.includes(item.id))
    setAssigned((prev) => [...prev, ...itemsToAssign].sort((a, b) => a.name.localeCompare(b.name)))
    setAvailable((prev) => prev.filter((item) => !selectedAvailable.includes(item.id)))
    setSelectedAvailable([])
  }

  const handleRemoveSelected = () => {
    const itemsToRemove = assigned.filter((item) => selectedAssigned.includes(item.id))
    setAvailable((prev) => [...prev, ...itemsToRemove].sort((a, b) => a.name.localeCompare(b.name)))
    setAssigned((prev) => prev.filter((item) => !selectedAssigned.includes(item.id)))
    setSelectedAssigned([])
  }

  const handleAvailableItemChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedAvailable((prev) => [...prev, itemId])
    } else {
      setSelectedAvailable((prev) => prev.filter((id) => id !== itemId))
    }
  }

  const handleAssignedItemChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssigned((prev) => [...prev, itemId])
    } else {
      setSelectedAssigned((prev) => prev.filter((id) => id !== itemId))
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Available Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Available ({available.length})</h4>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllAvailable}
                className="h-7 px-2 text-xs bg-transparent"
              >
                {selectedAvailable.length === available.length ? "None" : "All"}
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
                {available.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                      No available {type}
                    </TableCell>
                  </TableRow>
                ) : (
                  available.map((item) => (
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
            <h4 className="text-sm font-medium">Assigned ({assigned.length})</h4>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllAssigned}
                className="h-7 px-2 text-xs bg-transparent"
              >
                {selectedAssigned.length === assigned.length ? "None" : "All"}
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
                {assigned.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-4 text-xs">
                      No assigned {type}
                    </TableCell>
                  </TableRow>
                ) : (
                  assigned.map((item) => (
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

function AccessGroupSection({
  selectedGroups,
  setSelectedGroups,
}: {
  selectedGroups: AccessGroup[]
  setSelectedGroups: React.Dispatch<React.SetStateAction<AccessGroup[]>>
}) {
  const [allAccessGroups, setAllAccessGroups] = useState<AccessGroup[]>(ALL_ACCESS_GROUPS_INITIAL)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false)
  const [groupNameError, setGroupNameError] = useState("")
  const [selectedAvailableGroups, setSelectedAvailableGroups] = useState<string[]>([])

  const availableGroups = allAccessGroups.filter((group) => !selectedGroups.some((sg) => sg.id === group.id))

  const handleSelectAllAvailable = () => {
    if (selectedAvailableGroups.length === availableGroups.length) {
      setSelectedAvailableGroups([])
    } else {
      setSelectedAvailableGroups(availableGroups.map((group) => group.id))
    }
  }

  const handleAssignSelected = () => {
    const groupsToAssign = availableGroups.filter((group) => selectedAvailableGroups.includes(group.id))
    setSelectedGroups((prev) => [...prev, ...groupsToAssign].sort((a, b) => a.name.localeCompare(b.name)))
    setSelectedAvailableGroups([])
  }

  const handleRemoveGroup = (groupId: string) => {
    setSelectedGroups((prev) => prev.filter((group) => group.id !== groupId))
  }

  const handleCreateNewGroup = () => {
    if (!newGroupName.trim()) {
      setGroupNameError("Group Name is required.")
      return
    }
    setGroupNameError("")

    const newId = `ag-${Date.now()}`
    const newGroup: AccessGroup = {
      id: newId,
      name: newGroupName.trim(),
      description: newGroupDescription.trim() || undefined,
    }

    setAllAccessGroups((prev) => [...prev, newGroup].sort((a, b) => a.name.localeCompare(b.name)))
    setSelectedGroups((prev) => [...prev, newGroup].sort((a, b) => a.name.localeCompare(b.name)))

    setNewGroupName("")
    setNewGroupDescription("")
    setIsCreateGroupDialogOpen(false)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Access Groups</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Available Access Groups */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Available ({availableGroups.length})</h4>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllAvailable}
                className="h-7 px-2 text-xs bg-transparent"
              >
                {selectedAvailableGroups.length === availableGroups.length ? "None" : "All"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleAssignSelected}
                disabled={selectedAvailableGroups.length === 0}
                className="h-7 px-2 text-xs"
              >
                Assign ({selectedAvailableGroups.length})
              </Button>
            </div>
          </div>
          <div className="h-40 overflow-y-auto border rounded text-sm">
            <Table>
              <TableBody>
                {availableGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4 text-xs">
                      No available groups
                    </TableCell>
                  </TableRow>
                ) : (
                  availableGroups.map((group) => (
                    <TableRow key={group.id} className="hover:bg-muted/50">
                      <TableCell className="w-8 py-1">
                        <Checkbox
                          checked={selectedAvailableGroups.includes(group.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAvailableGroups((prev) => [...prev, group.id])
                            } else {
                              setSelectedAvailableGroups((prev) => prev.filter((id) => id !== group.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="py-1 text-sm font-medium">{group.name}</TableCell>
                      <TableCell className="py-1 text-xs text-muted-foreground">{group.description}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-7 text-xs bg-transparent">
                <Plus className="mr-1 h-3 w-3" /> Create New Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Access Group</DialogTitle>
                <DialogDescription>Define a new access group with a name and optional description.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name *</Label>
                  <Input
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => {
                      setNewGroupName(e.target.value)
                      if (groupNameError && e.target.value.trim()) {
                        setGroupNameError("")
                      }
                    }}
                    placeholder="e.g., Management Access"
                  />
                  {groupNameError && <p className="text-sm text-red-500">{groupNameError}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupDescription">Group Description (Optional)</Label>
                  <Textarea
                    id="groupDescription"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="e.g., Access for all senior management personnel."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateGroupDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNewGroup}>Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Selected Access Groups */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected ({selectedGroups.length})</h4>
          <div className="h-40 overflow-y-auto border rounded text-sm">
            <Table>
              <TableBody>
                {selectedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-4 text-xs">
                      No groups selected
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedGroups.map((group) => (
                    <TableRow key={group.id} className="hover:bg-muted/50">
                      <TableCell className="py-1 text-sm font-medium">{group.name}</TableCell>
                      <TableCell className="py-1 text-xs text-muted-foreground">{group.description}</TableCell>
                      <TableCell className="w-8 py-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveGroup(group.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </Button>
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
  )
}

export default function AddUserPage() {
  const [availableDoors, setAvailableDoors] = useState<AccessItem[]>(ALL_DOORS)
  const [assignedDoors, setAssignedDoors] = useState<AccessItem[]>([])
  const [availableFloors, setAvailableFloors] = useState<AccessItem[]>(ALL_FLOORS)
  const [assignedFloors, setAssignedFloors] = useState<AccessItem[]>([])
  const [selectedAccessGroups, setSelectedAccessGroups] = useState<AccessGroup[]>([])

  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    displayName: "",
    userPin: "",
    department: "",
    useFingerprint: false,
    validityPeriod: "2",
    dialTimezoneTable: "business-hours",
    activateDialing: true,
    showNameInDirectory: true,
    phoneNumber: "",
    directoryCode: "",
    timezone: "all-pass",
  })

  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [cards, setCards] = useState<CardInfo[]>([])
  const [currentCard, setCurrentCard] = useState<Partial<CardInfo>>({
    cardId: "",
    lostCard: false,
    inhibitCard: false,
    useFingerprint: false,
    effectiveDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 years from now
    effectiveTime: "00:00",
    expiryTime: "23:59",
  })

  const [fingerprints, setFingerprints] = useState<FingerprintEnrollment[]>([
    {
      id: "fp1",
      cardId: "1234567890",
      fingerType: "Right Thumb",
      alarmFinger: false,
      writeToCard: false,
      status: "enrolled",
    },
    {
      id: "fp2",
      cardId: "1234567890",
      fingerType: "Right Forefinger",
      alarmFinger: false,
      writeToCard: false,
      status: "enrolled",
    },
    {
      id: "fp3",
      cardId: "9876543210",
      fingerType: "Left Thumb",
      alarmFinger: true,
      writeToCard: true,
      status: "enrolled",
    },
  ])
  const [selectedFingerprintCardId, setSelectedFingerprintCardId] = useState<string | undefined>(undefined)
  const [selectedFingerType, setSelectedFingerType] = useState<string | undefined>(undefined)
  const [enrollmentMessage, setEnrollmentMessage] = useState("Ready to enroll. Select a card ID and finger.")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCardChange = (field: string, value: string | boolean) => {
    setCurrentCard((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateUserId = () => {
    const timestamp = Date.now().toString().slice(-6)
    setFormData((prev) => ({ ...prev, userId: `USR${timestamp}` }))
  }

  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    setFormData((prev) => ({ ...prev, userPin: pin }))
  }

  const selectCard = () => {
    // Simulate card selection from available cards
    const availableCards = ["1234567890", "9876543210", "5555666677", "1111222233", "9999888877"]
    const selectedCard = availableCards[Math.floor(Math.random() * availableCards.length)]
    setCurrentCard((prev) => ({ ...prev, cardId: selectedCard }))
  }

  const addCard = () => {
    if (!currentCard.cardId?.trim()) return

    const newCard: CardInfo = {
      id: `card_${Date.now()}`,
      cardId: currentCard.cardId.trim(),
      lostCard: currentCard.lostCard || false,
      inhibitCard: currentCard.inhibitCard || false,
      useFingerprint: currentCard.useFingerprint || false,
      effectiveDate: currentCard.effectiveDate || new Date().toISOString().split("T")[0],
      expiryDate:
        currentCard.expiryDate || new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      effectiveTime: currentCard.effectiveTime || "00:00",
      expiryTime: currentCard.expiryTime || "23:59",
      isPrimary: cards.length === 0, // First card is primary by default
    }

    setCards((prev) => [...prev, newCard])

    // Reset current card form
    setCurrentCard({
      cardId: "",
      lostCard: false,
      inhibitCard: false,
      useFingerprint: false,
      effectiveDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      effectiveTime: "00:00",
      expiryTime: "23:59",
    })
  }

  const removeCard = (cardId: string) => {
    setCards((prev) => {
      const updatedCards = prev.filter((card) => card.id !== cardId)
      // If we removed the primary card, make the first remaining card primary
      if (updatedCards.length > 0 && !updatedCards.some((card) => card.isPrimary)) {
        updatedCards[0].isPrimary = true
      }
      return updatedCards
    })
  }

  const setPrimaryCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        isPrimary: card.id === cardId,
      })),
    )
  }

  const handleFingerprintCheckboxChange = (id: string, field: "alarmFinger" | "writeToCard", checked: boolean) => {
    setFingerprints((prev) => prev.map((fp) => (fp.id === id ? { ...fp, [field]: checked } : fp)))
  }

  const handleEnrollFinger = () => {
    if (!selectedFingerprintCardId || !selectedFingerType) {
      setEnrollmentMessage("Please select a Card ID and a Finger Type to enroll.")
      return
    }
    setEnrollmentMessage(`Press your ${selectedFingerType} on the scanner...`)
    // Simulate enrollment process
    setTimeout(() => {
      const existingFingerprint = fingerprints.find(
        (fp) => fp.cardId === selectedFingerprintCardId && fp.fingerType === selectedFingerType,
      )
      if (existingFingerprint) {
        setEnrollmentMessage("Fingerprint already exists for this card and finger. Please try again.")
      } else {
        const newFingerprint: FingerprintEnrollment = {
          id: `fp_${Date.now()}`,
          cardId: selectedFingerprintCardId,
          fingerType: selectedFingerType,
          alarmFinger: false,
          writeToCard: false,
          status: "enrolled",
        }
        setFingerprints((prev) => [...prev, newFingerprint])
        setEnrollmentMessage(`Successfully enrolled ${selectedFingerType} for Card ID ${selectedFingerprintCardId}.`)
      }
    }, 2000)
  }

  const handleDeleteFinger = () => {
    if (!selectedFingerprintCardId || !selectedFingerType) {
      setEnrollmentMessage("Please select a Card ID and a Finger Type to delete.")
      return
    }
    setFingerprints((prev) =>
      prev.filter((fp) => !(fp.cardId === selectedFingerprintCardId && fp.fingerType === selectedFingerType)),
    )
    setEnrollmentMessage(`Fingerprint for ${selectedFingerType} deleted.`)
    setSelectedFingerType(undefined)
  }

  const handleWriteFinger = () => {
    if (!selectedFingerprintCardId || filteredFingerprints.length === 0) {
      setEnrollmentMessage("No fingerprints to write or no card selected.")
      return
    }
    setEnrollmentMessage(`Writing fingerprints to card ${selectedFingerprintCardId}...`)
    setTimeout(() => {
      setEnrollmentMessage(`Successfully wrote fingerprints to card ${selectedFingerprintCardId}.`)
    }, 1500)
  }

  const filteredFingerprints = fingerprints.filter(
    (fp) => !selectedFingerprintCardId || fp.cardId === selectedFingerprintCardId,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
        <p className="text-muted-foreground">Create a new user profile with access credentials and permissions</p>
      </div>

      <Tabs defaultValue="user-info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="user-info" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User Info
          </TabsTrigger>
          <TabsTrigger value="telephone-access" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telephone Access
          </TabsTrigger>
          <TabsTrigger value="card-info" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card Info
          </TabsTrigger>
          <TabsTrigger value="fingerprint" className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4" />
            Fingerprint
          </TabsTrigger>
          <TabsTrigger value="access-rights" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Access Rights
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the user's personal information and department assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="userId"
                      value={formData.userId}
                      onChange={(e) => handleInputChange("userId", e.target.value)}
                      placeholder="Enter unique user ID"
                    />
                    <Button type="button" variant="outline" onClick={generateUserId}>
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    placeholder="Abbreviation of full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userPin">User PIN (4 digits) *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="userPin"
                      type="password"
                      maxLength={4}
                      value={formData.userPin}
                      onChange={(e) => handleInputChange("userPin", e.target.value)}
                      placeholder="Enter 4-digit PIN"
                    />
                    <Button type="button" variant="outline" onClick={generatePin}>
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validityPeriod">Validity Period (Years)</Label>
                <Select
                  value={formData.validityPeriod}
                  onValueChange={(value) => handleInputChange("validityPeriod", value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="2">2 Years (Default)</SelectItem>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Profile Picture</h4>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profilePicture">Upload Photo</Label>
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="w-64"
                    />
                    <p className="text-xs text-muted-foreground">Recommended: 200x200px, JPG or PNG format</p>
                  </div>
                </div>
              </div>

              <Separator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telephone-access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Telephone Access Configuration
                </div>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                  SKTES Controller Available
                </Badge>
              </CardTitle>
              <CardDescription>Configure telephone access settings for the user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="directoryCode">Directory Code</Label>
                  <Input
                    id="directoryCode"
                    value={formData.directoryCode}
                    onChange={(e) => handleInputChange("directoryCode", e.target.value)}
                    placeholder="Enter directory code"
                  />
                  <p className="text-sm text-muted-foreground">
                    Code visitors select or enter on the SKTES controller's LCD to call this user
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Telephone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                  <p className="text-sm text-muted-foreground">
                    The actual number dialed after selecting the Directory Code
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="dialTimezoneTable">Dial Timezone Table</Label>
                  <Select
                    value={formData.dialTimezoneTable}
                    onValueChange={(value) => handleInputChange("dialTimezoneTable", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-pass">All Pass (24/7)</SelectItem>
                      <SelectItem value="business-hours">Business Hours</SelectItem>
                      <SelectItem value="weekdays-only">Weekdays Only</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Time-based control for when the directory can be used</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="activateDialing"
                      checked={formData.activateDialing}
                      onCheckedChange={(checked) => handleInputChange("activateDialing", checked as boolean)}
                    />
                    <Label htmlFor="activateDialing">Activate Dialing</Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Show/hide the Directory Code on the SKTES controller for visitors
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showNameInDirectory"
                      checked={formData.showNameInDirectory}
                      onCheckedChange={(checked) => handleInputChange("showNameInDirectory", checked as boolean)}
                    />
                    <Label htmlFor="showNameInDirectory">Show Name in Directory</Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    Display user name beside the Directory Code on the SKTES controller's LCD
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">SKTES Controller Directory Display Preview</h4>
                <Card className="p-6 bg-gray-50 border-dashed border-gray-300">
                  <div className="text-center text-sm font-semibold text-gray-600 mb-4">DIRECTORY</div>
                  <div className="flex justify-between items-center text-lg font-mono">
                    <span>{formData.directoryCode || "XXXX"}</span>
                    <span>
                      {formData.showNameInDirectory
                        ? `${formData.firstName} ${formData.lastName}`.trim() || "John Doe"
                        : ""}
                    </span>
                  </div>
                </Card>
                <p className="text-sm text-muted-foreground">
                  This shows how the user's entry will appear on the SKTES controller's LCD display
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Add Card
              </CardTitle>
              <CardDescription>Configure access card information following the existing system format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Card ID Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="cardId" className="w-20 text-right">
                    Card ID
                  </Label>
                  <Input
                    id="cardId"
                    value={currentCard.cardId || ""}
                    onChange={(e) => handleCardChange("cardId", e.target.value)}
                    placeholder="Enter card ID"
                    className="flex-1 max-w-md"
                  />
                  <Button type="button" variant="outline" onClick={selectCard}>
                    Select Card
                  </Button>
                  <Button type="button" variant="default" onClick={addCard} disabled={!currentCard.cardId?.trim()}>
                    Add Card
                  </Button>
                </div>
              </div>

              {/* Card Status Checkboxes */}
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lostCard"
                    checked={currentCard.lostCard || false}
                    onCheckedChange={(checked) => handleCardChange("lostCard", checked as boolean)}
                  />
                  <Label htmlFor="lostCard">Lost Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inhibitCard"
                    checked={currentCard.inhibitCard || false}
                    onCheckedChange={(checked) => handleCardChange("inhibitCard", checked as boolean)}
                  />
                  <Label htmlFor="inhibitCard">Inhibit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cardUseFingerprint"
                    checked={currentCard.useFingerprint || false}
                    onCheckedChange={(checked) => handleCardChange("useFingerprint", checked as boolean)}
                  />
                  <Label htmlFor="cardUseFingerprint">Use Fingerprint</Label>
                </div>
              </div>

              {/* Date and Time Section */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="effectiveDate" className="w-24 text-right">
                      Effective Date
                    </Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={currentCard.effectiveDate || ""}
                      onChange={(e) => handleCardChange("effectiveDate", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="effectiveTime" className="w-24 text-right">
                      Effective Time
                    </Label>
                    <Input
                      id="effectiveTime"
                      type="time"
                      value={currentCard.effectiveTime || ""}
                      onChange={(e) => handleCardChange("effectiveTime", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="expiryDate" className="w-24 text-right">
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={currentCard.expiryDate || ""}
                      onChange={(e) => handleCardChange("expiryDate", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="expiryTime" className="w-24 text-right">
                      Expiry Time
                    </Label>
                    <Input
                      id="expiryTime"
                      type="time"
                      value={currentCard.expiryTime || ""}
                      onChange={(e) => handleCardChange("expiryTime", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Assigned Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Assigned Cards ({cards.length})</h4>
                  {cards.length > 0 && (
                    <Badge variant="outline">
                      {cards.filter((card) => !card.inhibitCard && !card.lostCard).length} Active
                    </Badge>
                  )}
                </div>

                {cards.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <CreditCard className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                    <p className="text-slate-500 mb-2">No cards assigned</p>
                    <p className="text-sm text-slate-400">Add a card using the form above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cards.map((card) => (
                      <div key={card.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-lg">{card.cardId}</span>
                              {card.isPrimary && (
                                <Badge variant="default" className="text-xs">
                                  Primary
                                </Badge>
                              )}
                              {card.lostCard && (
                                <Badge variant="destructive" className="text-xs">
                                  Lost
                                </Badge>
                              )}
                              {card.inhibitCard && (
                                <Badge variant="secondary" className="text-xs">
                                  Inhibited
                                </Badge>
                              )}
                              {card.useFingerprint && (
                                <Badge variant="outline" className="text-xs">
                                  <Fingerprint className="h-3 w-3 mr-1" />
                                  Fingerprint
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Effective: {card.effectiveDate} {card.effectiveTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Expires: {card.expiryDate} {card.expiryTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!card.isPrimary && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => setPrimaryCard(card.id)}>
                                Set Primary
                              </Button>
                            )}
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeCard(card.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fingerprint" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Fingerprint Enrollment
              </CardTitle>
              <CardDescription>Configure biometric authentication for enhanced security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="useFingerprint"
                  checked={formData.useFingerprint}
                  onCheckedChange={(checked) => handleInputChange("useFingerprint", checked as boolean)}
                />
                <Label htmlFor="useFingerprint">Enable fingerprint authentication</Label>
              </div>

              {formData.useFingerprint && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="fingerprintCardId" className="w-20 text-right">
                      Card ID
                    </Label>
                    <Select value={selectedFingerprintCardId} onValueChange={setSelectedFingerprintCardId}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Card ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {cards.length === 0 ? (
                          <SelectItem disabled value="no-cards">
                            No cards added yet
                          </SelectItem>
                        ) : (
                          cards.map((card) => (
                            <SelectItem key={card.id} value={card.cardId}>
                              {card.cardId}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left side: Finger selection and enrollment actions */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Select Finger for Enrollment</h4>
                      <Select value={selectedFingerType} onValueChange={setSelectedFingerType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a finger" />
                        </SelectTrigger>
                        <SelectContent>
                          {FINGER_TYPES.map((finger) => (
                            <SelectItem key={finger} value={finger}>
                              {finger}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        className="w-full"
                        onClick={handleEnrollFinger}
                        disabled={!selectedFingerprintCardId || !selectedFingerType}
                      >
                        Enroll Finger
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={handleDeleteFinger}
                        disabled={!selectedFingerprintCardId || !selectedFingerType}
                      >
                        Delete Selected Fingerprint
                      </Button>
                    </div>

                    {/* Right side: Enrollment status/feedback and enrolled list */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Fingerprint Scan & Status</h4>
                      <div className="w-full h-40 border rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=120&width=120"
                          alt="Fingerprint Scan"
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-center text-sm text-muted-foreground">{enrollmentMessage}</p>

                      <div className="w-full h-40 flex items-center justify-center bg-gray-50 border rounded-lg">
                        <Image
                          src="/placeholder.svg?height=150&width=200"
                          alt="Hand Diagram"
                          width={200}
                          height={150}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Enrolled Fingerprints ({filteredFingerprints.length})</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Finger Type</TableHead>
                          <TableHead>Card ID</TableHead>
                          <TableHead className="text-center">Alarm Finger</TableHead>
                          <TableHead className="text-center">Write To Card</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFingerprints.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                              No fingerprints enrolled for this card ID.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredFingerprints.map((fp) => (
                            <TableRow key={fp.id}>
                              <TableCell className="font-medium">{fp.fingerType}</TableCell>
                              <TableCell>{fp.cardId}</TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={fp.alarmFinger}
                                  onCheckedChange={(checked) =>
                                    handleFingerprintCheckboxChange(fp.id, "alarmFinger", checked as boolean)
                                  }
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Checkbox
                                  checked={fp.writeToCard}
                                  onCheckedChange={(checked) =>
                                    handleFingerprintCheckboxChange(fp.id, "writeToCard", checked as boolean)
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleWriteFinger}
                      disabled={!selectedFingerprintCardId || filteredFingerprints.length === 0}
                    >
                      Write Fingerprints to Card
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Enrollment Guide:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Choose Card ID from the dropdown above.</li>
                      <li>Select a Finger from the list.</li>
                      <li>
                        Click the <span className="font-semibold text-foreground">[Enroll Finger]</span> button.
                      </li>
                      <li>When prompted, press your finger firmly on the scanner.</li>
                      <li>
                        If the fingerprint quality is poor or the finger already exists in the system, a prompt will ask
                        you to try again.
                      </li>
                      <li>
                        <span className="font-semibold text-foreground">Save Automatically</span>
                        <br />
                        All successfully enrolled fingerprints will be saved automatically by the system.
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Rights TAB */}
        <TabsContent value="access-rights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Access Rights Configuration
              </CardTitle>
              <CardDescription>Select which doors and floors the user can access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doors */}
              <AccessSection
                title="Doors"
                type="doors"
                available={availableDoors}
                setAvailable={setAvailableDoors}
                assigned={assignedDoors}
                setAssigned={setAssignedDoors}
              />

              <Separator />

              {/* Floors */}
              <AccessSection
                title="Floors"
                type="floors"
                available={availableFloors}
                setAvailable={setAvailableFloors}
                assigned={assignedFloors}
                setAssigned={setAssignedFloors}
              />

              <Separator />

              {/* Access Groups */}
              <AccessGroupSection selectedGroups={selectedAccessGroups} setSelectedGroups={setSelectedAccessGroups} />

              <Separator />

              {/* Timezone + access options (unchanged) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timezone Table</Label>
                  <Select value={formData.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-pass">All Pass (24/7)</SelectItem>
                      <SelectItem value="business-hours">Business Hours</SelectItem>
                      <SelectItem value="weekdays-only">Weekdays Only</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access Controls</Label>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="apb" />
                      <Label htmlFor="apb" className="text-sm">
                        Anti-Passback
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="holiday" />
                      <Label htmlFor="holiday" className="text-sm">
                        Holiday Control
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pin" />
                      <Label htmlFor="pin" className="text-sm">
                        PIN Required
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Profile Preview</CardTitle>
              <CardDescription>Review all information before creating the user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Basic Information</h4>
                  {profilePicture && (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden mb-2">
                      <img
                        src={profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>User ID:</strong> {formData.userId || "Not set"}
                    </p>
                    <p>
                      <strong>Name:</strong> {formData.firstName} {formData.lastName}
                    </p>
                    <p>
                      <strong>Display Name:</strong> {formData.displayName || "Not set"}
                    </p>
                    <p>
                      <strong>Department:</strong> {formData.department || "Not selected"}
                    </p>
                    <p>
                      <strong>PIN:</strong> {"*".repeat(formData.userPin.length)}
                    </p>
                    <p>
                      <strong>Validity:</strong> {formData.validityPeriod} year(s)
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Telephone Access</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Phone Number:</strong> {formData.phoneNumber || "Not provided"}
                      </p>
                      <p>
                        <strong>Directory Code:</strong> {formData.directoryCode || "Not provided"}
                      </p>
                      <p>
                        <strong>Dial Timezone:</strong> {formData.dialTimezoneTable}
                      </p>
                      <p>
                        <strong>Activate Dialing:</strong> {formData.activateDialing ? "Enabled" : "Disabled"}
                      </p>
                      <p>
                        <strong>Show Name:</strong> {formData.showNameInDirectory ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Access Configuration</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Cards Assigned:</strong> {cards.length}
                    </p>
                    {cards.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {cards.map((card) => (
                          <p key={card.id} className="text-xs">
                            • {card.cardId}
                            {card.isPrimary ? " (Primary)" : ""}
                            {card.lostCard ? " - Lost" : ""}
                            {card.inhibitCard ? " - Inhibited" : ""}
                            {card.useFingerprint ? " - Fingerprint" : ""}
                          </p>
                        ))}
                      </div>
                    )}
                    <p>
                      <strong>Global Fingerprint:</strong> {formData.useFingerprint ? "Enabled" : "Disabled"}
                    </p>
                    <p>
                      <strong>Timezone:</strong> {formData.timezone}
                    </p>
                    <p>
                      <strong>Assigned Doors:</strong> {assignedDoors.map((d) => d.name).join(", ") || "None"}
                    </p>
                    <p>
                      <strong>Assigned Floors:</strong> {assignedFloors.map((f) => f.name).join(", ") || "None"}
                    </p>
                    <p>
                      <strong>Assigned Access Groups:</strong>{" "}
                      {selectedAccessGroups.map((g) => g.name).join(", ") || "None"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Create User</Button>
      </div>
    </div>
  )
}
