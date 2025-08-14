"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  CreditCard,
  Fingerprint,
  Calendar,
  Clock,
  Shield,
  User,
  AlertTriangle,
} from "lucide-react"

// Define AccessItem interface for consistency
interface AccessItem {
  id: string
  name: string
}

// Mock data for users with more detailed information
const users = [
  {
    id: "USR001",
    firstName: "John",
    lastName: "Doe",
    displayName: "J.Doe",
    department: "IT",
    pin: "1234",
    validFrom: "2024-01-01",
    validUntil: "2026-01-15",
    lastAccess: "2024-01-09 14:30",
    status: "Active",
    profilePicture: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 123-4567",
    directoryCode: "1001",
    telephoneNumber: "+1 (555) 123-4567",
    dialTimezoneTable: "Business Hours",
    activateDialing: true,
    showNameInDirectory: true,
    telephoneAccess: true,
    cards: [
      {
        id: "CARD001",
        cardId: "1234567890",
        status: "Active",
        isLost: false,
        isInhibited: false,
        useFingerprint: true,
        effectiveDate: "2024-01-01",
        effectiveTime: "00:00",
        expiryDate: "2026-01-15",
        expiryTime: "23:59",
        isPrimary: true,
      },
    ],
    fingerprints: [
      {
        id: "FP001",
        finger: "Right Index",
        enrolled: true,
        quality: "High",
        enrolledDate: "2024-01-01",
      },
      {
        id: "FP002",
        finger: "Left Index",
        enrolled: true,
        quality: "Medium",
        enrolledDate: "2024-01-01",
      },
    ],
    accessGroups: ["IT Staff", "Building Access"],
    timeZone: "Standard Hours",
    assignedDoors: [
      { id: "door-1", name: "Main Entrance" },
      { id: "door-3", name: "Server Room" },
    ],
    assignedFloors: [{ id: "floor-1", name: "Ground Floor" }],
  },
  {
    id: "USR002",
    firstName: "Jane",
    lastName: "Smith",
    displayName: "J.Smith",
    department: "HR",
    pin: "5678",
    validFrom: "2024-01-01",
    validUntil: "2025-12-20",
    lastAccess: "2024-01-09 09:15",
    status: "Active",
    profilePicture: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 234-5678",
    directoryCode: "1002",
    telephoneNumber: "+1 (555) 234-5678",
    dialTimezoneTable: "Extended Hours",
    activateDialing: false,
    showNameInDirectory: false,
    telephoneAccess: true,
    cards: [
      {
        id: "CARD002",
        cardId: "2345678901",
        status: "Active",
        isLost: false,
        isInhibited: false,
        useFingerprint: false,
        effectiveDate: "2024-01-01",
        effectiveTime: "00:00",
        expiryDate: "2025-12-20",
        expiryTime: "23:59",
        isPrimary: true,
      },
    ],
    fingerprints: [],
    accessGroups: ["HR Staff", "Building Access"],
    timeZone: "Standard Hours",
    assignedDoors: [
      { id: "door-2", name: "Office Floor 1" },
      { id: "door-4", name: "Warehouse Access" },
    ],
    assignedFloors: [{ id: "floor-2", name: "First Floor" }],
  },
  {
    id: "USR003",
    firstName: "Mike",
    lastName: "Johnson",
    displayName: "M.Johnson",
    department: "Security",
    pin: "9012",
    validFrom: "2024-01-01",
    validUntil: "2025-06-30",
    lastAccess: "2024-01-08 16:45",
    status: "Inactive",
    profilePicture: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 345-6789",
    directoryCode: "1003",
    telephoneNumber: "+1 (555) 345-6789",
    dialTimezoneTable: "24/7 Access",
    activateDialing: true,
    showNameInDirectory: true,
    telephoneAccess: false,
    cards: [
      {
        id: "CARD003",
        cardId: "3456789012",
        status: "Active",
        isLost: false,
        isInhibited: false,
        useFingerprint: true,
        effectiveDate: "2024-01-01",
        effectiveTime: "00:00",
        expiryDate: "2025-06-30",
        expiryTime: "23:59",
        isPrimary: true,
      },
    ],
    fingerprints: [
      {
        id: "FP003",
        finger: "Right Thumb",
        enrolled: true,
        quality: "High",
        enrolledDate: "2024-01-01",
      },
    ],
    accessGroups: ["Security Staff", "All Areas"],
    timeZone: "24/7 Access",
    assignedDoors: [
      { id: "door-1", name: "Main Entrance" },
      { id: "door-2", name: "Office Floor 1" },
      { id: "door-3", name: "Server Room" },
      { id: "door-4", name: "Warehouse Access" },
    ],
    assignedFloors: [
      { id: "floor-1", name: "Ground Floor" },
      { id: "floor-2", name: "First Floor" },
      { id: "floor-3", name: "Second Floor" },
    ],
  },
  {
    id: "USR004",
    firstName: "Sarah",
    lastName: "Wilson",
    displayName: "S.Wilson",
    department: "Finance",
    pin: "3456",
    validFrom: "2024-01-01",
    validUntil: "2026-03-10",
    lastAccess: "2024-01-09 11:20",
    status: "Active",
    profilePicture: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 456-7890",
    directoryCode: "1004",
    telephoneNumber: "+1 (555) 456-7890",
    dialTimezoneTable: "Business Hours",
    activateDialing: true,
    showNameInDirectory: false,
    telephoneAccess: true,
    cards: [
      {
        id: "CARD004",
        cardId: "4567890123",
        status: "Active",
        isLost: false,
        isInhibited: false,
        useFingerprint: true,
        effectiveDate: "2024-01-01",
        effectiveTime: "00:00",
        expiryDate: "2026-03-10",
        expiryTime: "23:59",
        isPrimary: true,
      },
    ],
    fingerprints: [
      {
        id: "FP004",
        finger: "Right Index",
        enrolled: true,
        quality: "High",
        enrolledDate: "2024-01-01",
      },
    ],
    accessGroups: ["Finance Staff", "Building Access"],
    timeZone: "Business Hours",
    assignedDoors: [{ id: "door-5", name: "Executive Office" }],
    assignedFloors: [{ id: "floor-4", name: "Third Floor" }],
  },
]

// Mock system configuration
const systemConfig = {
  hasSktesTelephoneController: true, // Set to false to disable telephone access
  availableTimezones: ["Business Hours", "Extended Hours", "24/7 Access", "Weekend Only", "Custom Schedule"],
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUserClick = (user: (typeof users)[0]) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const closeUserDetails = () => {
    setShowUserDetails(false)
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user profiles, access credentials, and permissions</p>
        </div>
        <Link href="/dashboard/users/add">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Active users in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Fingerprint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.fingerprints.length > 0).length}</div>
            <p className="text-xs text-muted-foreground">Biometric enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(users.map((u) => u.department)).size}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>View and manage all users in the system</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Credentials</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Last Access</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{user.displayName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        <span className="text-xs">{user.cards[0]?.cardId}</span>
                      </div>
                      {user.fingerprints.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Fingerprint className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">FP</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{user.validUntil}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastAccess}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUserClick(user)}>
                          <User className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="mr-2 h-4 w-4" />
                          Manage Access
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Manage Cards
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Fingerprint className="mr-2 h-4 w-4" />
                          Manage Fingerprints
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">
                {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "User Details"}
              </DialogTitle>
            </div>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="user-info" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="user-info">User Information</TabsTrigger>
                <TabsTrigger value="telephone">Telephone Access</TabsTrigger>
                <TabsTrigger value="cards">Card Information</TabsTrigger>
                <TabsTrigger value="fingerprint">Fingerprint Information</TabsTrigger>
                <TabsTrigger value="access">Access Right</TabsTrigger>
              </TabsList>

              <TabsContent value="user-info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Profile Picture Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Profile Picture</Label>
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-32 h-32">
                        <AvatarImage
                          src={selectedUser.profilePicture || "/placeholder.svg"}
                          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                        />
                        <AvatarFallback className="text-2xl">
                          {selectedUser.firstName[0]}
                          {selectedUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">200x200px recommended</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG formats</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="md:col-span-2 space-y-4">
                    <Label className="text-base font-semibold">Basic Information</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">User ID</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Display Name</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.displayName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">First Name</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Name</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Department</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.department}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">PIN</Label>
                        <p className="text-sm text-muted-foreground">••••</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Validity Information */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Validity Period</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Valid From</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.validFrom}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Label className="text-sm font-medium">Valid Until</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.validUntil}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="telephone" className="space-y-6">
                {!systemConfig.hasSktesTelephoneController ? (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">SKTES Telephone Controller Required</p>
                      <p className="text-xs text-yellow-700">
                        This menu is only enabled when the system has at least one SKTES Telephone Controller
                        configured.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Telephone Access Configuration</Label>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        SKTES Controller Available
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Directory Code */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Directory Code</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.directoryCode}</p>
                        <p className="text-xs text-muted-foreground">
                          Code visitors select or enter on the SKTES controller's LCD to call this user
                        </p>
                      </div>

                      {/* Telephone Number */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Telephone Number</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.telephoneNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          The actual number dialed after selecting the Directory Code
                        </p>
                      </div>

                      {/* Dial Timezone Table */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Dial Timezone Table</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.dialTimezoneTable}</p>
                        <p className="text-xs text-muted-foreground">
                          Time-based control for when the directory can be used
                        </p>
                      </div>

                      {/* Checkboxes as static text/badges */}
                      <div className="space-y-4">
                        {/* Activate Dialing */}
                        <div className="flex items-center space-x-2">
                          <Badge variant={selectedUser.activateDialing ? "default" : "secondary"}>
                            {selectedUser.activateDialing ? "Activated" : "Deactivated"}
                          </Badge>
                          <div className="grid gap-1.5 leading-none">
                            <Label className="text-sm font-medium leading-none">Activate Dialing</Label>
                            <p className="text-xs text-muted-foreground">
                              Show/hide the Directory Code on the SKTES controller for visitors
                            </p>
                          </div>
                        </div>

                        {/* Show Name in Directory */}
                        <div className="flex items-center space-x-2">
                          <Badge variant={selectedUser.showNameInDirectory ? "default" : "secondary"}>
                            {selectedUser.showNameInDirectory ? "Shown" : "Hidden"}
                          </Badge>
                          <div className="grid gap-1.5 leading-none">
                            <Label className="text-sm font-medium leading-none">Show Name in Directory</Label>
                            <p className="text-xs text-muted-foreground">
                              Display user name beside the Directory Code on the SKTES controller's LCD
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Directory Display Preview */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">SKTES Controller Directory Display Preview</Label>
                      <div className="border rounded-lg p-4 bg-gray-50 font-mono text-sm">
                        <div className="text-center mb-2 font-bold">DIRECTORY</div>
                        <div className="border-t border-gray-300 pt-2">
                          {selectedUser.activateDialing ? (
                            <div className="flex justify-between">
                              <span>{selectedUser.directoryCode || "----"}</span>
                              <span>
                                {selectedUser.showNameInDirectory
                                  ? `${selectedUser.firstName} ${selectedUser.lastName}`
                                  : "---"}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 italic">Directory entry hidden</div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This shows how the user's entry will appear on the SKTES controller's LCD display
                      </p>
                    </div>

                    <Separator />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cards" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Card Information</Label>
                    <Badge variant="outline">{selectedUser.cards.length} Card(s)</Badge>
                  </div>

                  <div className="space-y-4">
                    {selectedUser.cards.map((card) => (
                      <div key={card.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="font-medium">Card ID: {card.cardId}</span>
                            {card.isPrimary && <Badge variant="default">Primary</Badge>}
                          </div>
                          <Badge variant={card.status === "Active" ? "default" : "secondary"}>{card.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <Label className="text-xs font-medium">Effective</Label>
                              <p className="text-xs text-muted-foreground">
                                {card.effectiveDate} {card.effectiveTime}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <div>
                              <Label className="text-xs font-medium">Expiry</Label>
                              <p className="text-xs text-muted-foreground">
                                {card.expiryDate} {card.expiryTime}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Lost Card</Label>
                            <p className="text-xs text-muted-foreground">{card.isLost ? "Yes" : "No"}</p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Inhibited</Label>
                            <p className="text-xs text-muted-foreground">{card.isInhibited ? "Yes" : "No"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="h-3 w-3 text-muted-foreground" />
                            <Label className="text-xs font-medium">Use Fingerprint</Label>
                            <Badge variant={card.useFingerprint ? "default" : "secondary"} className="text-xs">
                              {card.useFingerprint ? "Required" : "Not Required"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fingerprint" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Fingerprint Information</Label>
                    <Badge variant="outline">{selectedUser.fingerprints.length} Enrolled</Badge>
                  </div>

                  {selectedUser.fingerprints.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUser.fingerprints.map((fingerprint) => (
                        <div key={fingerprint.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Fingerprint className="h-4 w-4" />
                              <span className="font-medium">{fingerprint.finger}</span>
                            </div>
                            <Badge variant={fingerprint.enrolled ? "default" : "secondary"}>
                              {fingerprint.enrolled ? "Enrolled" : "Not Enrolled"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Quality</Label>
                              <p className="text-sm text-muted-foreground">{fingerprint.quality}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Enrolled Date</Label>
                              <p className="text-sm text-muted-foreground">{fingerprint.enrolledDate}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Fingerprint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No fingerprints enrolled</p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Enroll Template</Label>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Choose Card ID</li>
                      <li>Click [Enroll]</li>
                      <li>Select a Finger</li>
                      <li>Press your finger</li>
                      <li>
                        If the fingerprint quality is poor or the finger already exists in the system, a prompt will ask
                        you to try again.
                      </li>
                      <li>
                        <span className="font-medium">Save Automatically:</span> All successfully enrolled fingerprints
                        will be saved automatically by the system.
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="access" className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Access Rights Configuration</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Access Groups</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedUser.accessGroups.map((group, index) => (
                            <Badge key={index} variant="outline">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Time Zone</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.timeZone}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">User Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={selectedUser.status === "Active" ? "default" : "secondary"}>
                            {selectedUser.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Last Access</Label>
                        <p className="text-sm text-muted-foreground">{selectedUser.lastAccess}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Assigned Doors */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Assigned Doors</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUser.assignedDoors && selectedUser.assignedDoors.length > 0 ? (
                        selectedUser.assignedDoors.map((door) => (
                          <Badge key={door.id} variant="secondary">
                            {door.name}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No doors assigned.</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Assigned Floors */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Assigned Floors</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUser.assignedFloors && selectedUser.assignedFloors.length > 0 ? (
                        selectedUser.assignedFloors.map((floor) => (
                          <Badge key={floor.id} variant="secondary">
                            {floor.name}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No floors assigned.</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Access Statistics</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">{selectedUser.cards.length}</div>
                        <p className="text-xs text-muted-foreground">Total Cards</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">
                          {selectedUser.cards.filter((c) => c.status === "Active").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Active Cards</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">{selectedUser.fingerprints.length}</div>
                        <p className="text-xs text-muted-foreground">Fingerprints</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">{selectedUser.accessGroups.length}</div>
                        <p className="text-xs text-muted-foreground">Access Groups</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Special Controls</Label>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Anti-Passback</span>
                        </div>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Time Zone Restrictions</span>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Duress Code</span>
                        </div>
                        <Badge variant="secondary">Not Set</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
