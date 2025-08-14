"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DoorClosed, Trash2 } from "lucide-react"

interface Door {
  id: string
  name: string
}

interface UserAssignment {
  id: string
  name: string
  department: string
  doorId: string // The door this user is assigned to
}

// Mock Data
const mockDoors: Door[] = [
  { id: "door-1", name: "Main Entrance" },
  { id: "door-2", name: "Server Room" },
  { id: "door-3", name: "Office Floor 1" },
  { id: "door-4", name: "Warehouse Gate" },
]

const initialUserDoorAssignments: UserAssignment[] = [
  { id: "user-1", name: "John Doe", department: "IT", doorId: "door-1" },
  { id: "user-2", name: "Jane Smith", department: "HR", doorId: "door-1" },
  { id: "user-3", name: "Mike Johnson", department: "Security", doorId: "door-2" },
  { id: "user-4", name: "Sarah Wilson", department: "Finance", doorId: "door-3" },
  { id: "user-5", name: "Robert Brown", department: "Operations", doorId: "door-1" },
  { id: "user-6", name: "Emily Davis", department: "IT", doorId: "door-4" },
  { id: "user-7", name: "David Lee", department: "Security", doorId: "door-2" },
]

export default function DeleteUserByDoorPage() {
  const [selectedDoorId, setSelectedDoorId] = useState<string>("")
  const [userDoorAssignments, setUserDoorAssignments] = useState<UserAssignment[]>(initialUserDoorAssignments)
  const [usersForSelectedDoor, setUsersForSelectedDoor] = useState<UserAssignment[]>([])
  const [selectedUsersToDelete, setSelectedUsersToDelete] = useState<string[]>([])

  useEffect(() => {
    if (selectedDoorId) {
      setUsersForSelectedDoor(userDoorAssignments.filter((user) => user.doorId === selectedDoorId))
      setSelectedUsersToDelete([]) // Clear selection when door changes
    } else {
      setUsersForSelectedDoor([])
    }
  }, [selectedDoorId, userDoorAssignments])

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsersToDelete(usersForSelectedDoor.map((user) => user.id))
    } else {
      setSelectedUsersToDelete([])
    }
  }

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsersToDelete((prev) => [...prev, userId])
    } else {
      setSelectedUsersToDelete((prev) => prev.filter((id) => id !== userId))
    }
  }

  const handleDeleteSelectedUsersFromDoor = () => {
    // Filter out the assignments for the selected users from the selected door
    setUserDoorAssignments((prevAssignments) =>
      prevAssignments.filter(
        (assignment) => !(selectedUsersToDelete.includes(assignment.id) && assignment.doorId === selectedDoorId),
      ),
    )
    setSelectedUsersToDelete([]) // Clear selection after deletion
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delete User by Door</h1>
        <p className="text-muted-foreground">Remove user access from specific doors</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DoorClosed className="h-5 w-5" />
            <span>Select Door</span>
          </CardTitle>
          <CardDescription>Choose a door to view and manage user assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="door-select">Door</Label>
            <Select value={selectedDoorId} onValueChange={setSelectedDoorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a door" />
              </SelectTrigger>
              <SelectContent>
                {mockDoors.map((door) => (
                  <SelectItem key={door.id} value={door.id}>
                    {door.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedDoorId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5" />
              <span>Users Assigned to {mockDoors.find((d) => d.id === selectedDoorId)?.name}</span>
            </CardTitle>
            <CardDescription>Select users to remove their access from this door</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-between items-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={selectedUsersToDelete.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected Users ({selectedUsersToDelete.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently remove the selected users' access from this door.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelectedUsersFromDoor}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        usersForSelectedDoor.length > 0 && selectedUsersToDelete.length === usersForSelectedDoor.length
                      }
                      onCheckedChange={(checked) => handleSelectAllUsers(checked as boolean)}
                      aria-label="Select all users"
                    />
                  </TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersForSelectedDoor.length > 0 ? (
                  usersForSelectedDoor.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsersToDelete.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                          aria-label={`Select user ${user.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" disabled={selectedUsersToDelete.includes(user.id)}>
                          View User
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No users assigned to this door.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
