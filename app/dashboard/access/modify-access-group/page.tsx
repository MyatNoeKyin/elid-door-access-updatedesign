"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { Search, Users, Key, Edit, Trash2, Save, X } from "lucide-react"
import { toast } from "sonner"

interface AccessGroup {
  id: number
  name: string
  description: string
  userCount: number
  doorCount: number
  status: "active" | "inactive"
  createdDate: string
}

export default function ModifyAccessGroupPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingDescription, setEditingDescription] = useState("")

  const [accessGroups, setAccessGroups] = useState<AccessGroup[]>([
    {
      id: 1,
      name: "Standard Employee",
      description: "Basic office access during business hours",
      userCount: 145,
      doorCount: 8,
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Management",
      description: "Extended access including executive areas",
      userCount: 23,
      doorCount: 15,
      status: "active",
      createdDate: "2024-01-10",
    },
    {
      id: 3,
      name: "IT Department",
      description: "Full access to server rooms and technical areas",
      userCount: 45,
      doorCount: 22,
      status: "active",
      createdDate: "2024-01-08",
    },
    {
      id: 4,
      name: "Security Personnel",
      description: "24/7 access to all areas including restricted zones",
      userCount: 8,
      doorCount: 35,
      status: "active",
      createdDate: "2024-01-05",
    },
    {
      id: 5,
      name: "Contractors",
      description: "Limited access to designated work areas",
      userCount: 12,
      doorCount: 5,
      status: "active",
      createdDate: "2024-01-20",
    },
    {
      id: 6,
      name: "Visitors",
      description: "Temporary access to reception and meeting areas",
      userCount: 3,
      doorCount: 3,
      status: "inactive",
      createdDate: "2024-01-25",
    },
    {
      id: 7,
      name: "Maintenance",
      description: "Access to utility areas and maintenance rooms",
      userCount: 15,
      doorCount: 12,
      status: "active",
      createdDate: "2024-01-12",
    },
    {
      id: 8,
      name: "Executive",
      description: "Full building access with VIP privileges",
      userCount: 5,
      doorCount: 40,
      status: "active",
      createdDate: "2024-01-03",
    },
  ])

  const filteredGroups = accessGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditStart = (group: AccessGroup) => {
    setEditingId(group.id)
    setEditingDescription(group.description)
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingDescription("")
  }

  const handleEditSave = (groupId: number) => {
    if (!editingDescription.trim()) {
      toast.error("Description cannot be empty")
      return
    }

    setAccessGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, description: editingDescription.trim() } : group)),
    )

    setEditingId(null)
    setEditingDescription("")
    toast.success("Access group description updated successfully")
  }

  const handleDelete = (groupId: number) => {
    const group = accessGroups.find((g) => g.id === groupId)
    if (!group) return

    if (group.userCount > 0) {
      toast.error(`Cannot delete "${group.name}" - it has ${group.userCount} assigned users`)
      return
    }

    setAccessGroups((prev) => prev.filter((g) => g.id !== groupId))
    toast.success(`Access group "${group.name}" deleted successfully`)
  }

  const totalGroups = accessGroups.length
  const activeGroups = accessGroups.filter((g) => g.status === "active").length
  const totalUsers = accessGroups.reduce((sum, g) => sum + g.userCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modify Access Group</h1>
          <p className="text-muted-foreground">Edit access group descriptions and manage groups</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGroups}</div>
            <p className="text-xs text-muted-foreground">Access groups configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGroups}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Users with group access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredGroups.length}</div>
            <p className="text-xs text-muted-foreground">Groups shown</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Access Groups</CardTitle>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search access groups..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium p-3 pl-0">Group Name</th>
                  <th className="text-left font-medium p-3">Description</th>
                  <th className="text-left font-medium p-3">Users</th>
                  <th className="text-left font-medium p-3">Doors</th>
                  <th className="text-left font-medium p-3">Status</th>
                  <th className="text-left font-medium p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group) => (
                  <tr key={group.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pl-0">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{group.name}</span>
                      </div>
                    </td>
                    <td className="py-3 max-w-md">
                      {editingId === group.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            placeholder="Enter group description"
                            className="min-h-[60px]"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleEditSave(group.id)} className="h-7">
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleEditCancel}
                              className="h-7 bg-transparent"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600">{group.description}</p>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-500" />
                        <span>{group.userCount}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Key className="h-3 w-3 text-slate-500" />
                        <span>{group.doorCount}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={group.status === "active" ? "default" : "secondary"}
                        className={
                          group.status === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-slate-500 hover:bg-slate-600"
                        }
                      >
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {editingId === group.id ? null : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStart(group)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Access Group</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the access group "{group.name}"?
                                    {group.userCount > 0 && (
                                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                                        <strong>Warning:</strong> This group has {group.userCount} assigned users. You
                                        must reassign these users before deleting the group.
                                      </div>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(group.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={group.userCount > 0}
                                  >
                                    Delete Group
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No access groups found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}

          {filteredGroups.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredGroups.length} of {totalGroups} access groups
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
