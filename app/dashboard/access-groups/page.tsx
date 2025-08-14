"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Key, Users, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AccessGroupsPage() {
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false)

  const accessGroups = [
    {
      id: 1,
      name: "Standard Employee",
      description: "Basic office access during business hours",
      userCount: 145,
      doorCount: 8,
      status: "active",
    },
    {
      id: 2,
      name: "Management",
      description: "Extended access including executive areas",
      userCount: 23,
      doorCount: 15,
      status: "active",
    },
    {
      id: 3,
      name: "IT Department",
      description: "Full access to server rooms and technical areas",
      userCount: 45,
      doorCount: 22,
      status: "active",
    },
    {
      id: 4,
      name: "Security Personnel",
      description: "24/7 access to all areas including restricted zones",
      userCount: 8,
      doorCount: 35,
      status: "active",
    },
    {
      id: 5,
      name: "Contractors",
      description: "Limited access to designated work areas",
      userCount: 12,
      doorCount: 5,
      status: "active",
    },
    {
      id: 6,
      name: "Visitors",
      description: "Temporary access to reception and meeting areas",
      userCount: 3,
      doorCount: 3,
      status: "inactive",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Access Groups</h1>
          <p className="text-muted-foreground">Create and manage user access groups</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Access Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Access Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input id="group-name" placeholder="Enter group name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea id="group-description" placeholder="Enter group description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddGroupOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Saving access group...")
                      setIsAddGroupOpen(false)
                    }}
                  >
                    Create Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessGroups.length}</div>
            <p className="text-xs text-muted-foreground">Access groups configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessGroups.filter((g) => g.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessGroups.reduce((sum, g) => sum + g.userCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Users with group access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Doors/Group</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(accessGroups.reduce((sum, g) => sum + g.doorCount, 0) / accessGroups.length)}
            </div>
            <p className="text-xs text-muted-foreground">Average doors per group</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search access groups..." className="pl-8" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium p-2 pl-0">Group Name</th>
                  <th className="text-left font-medium p-2">Description</th>
                  <th className="text-left font-medium p-2">Users</th>
                  <th className="text-left font-medium p-2">Doors</th>
                  <th className="text-left font-medium p-2">Status</th>
                  <th className="text-left font-medium p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessGroups.map((group) => (
                  <tr key={group.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pl-0">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{group.name}</span>
                      </div>
                    </td>
                    <td className="py-3 max-w-xs">
                      <p className="text-slate-600 truncate">{group.description}</p>
                    </td>
                    <td className="py-3">{group.userCount} users</td>
                    <td className="py-3">{group.doorCount} doors</td>
                    <td className="py-3">
                      <Badge
                        variant={group.status === "active" ? "success" : "secondary"}
                        className={group.status === "active" ? "bg-green-500" : "bg-slate-500"}
                      >
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
