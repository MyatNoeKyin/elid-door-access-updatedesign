"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Building, Key, Plus } from "lucide-react"

export default function DoorAssignmentPage() {
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false)

  const users = [
    { id: 1, name: "John Smith", department: "IT", accessLevel: "Standard" },
    { id: 2, name: "Sarah Johnson", department: "HR", accessLevel: "Management" },
    { id: 3, name: "Michael Brown", department: "Finance", accessLevel: "Standard" },
    { id: 4, name: "Emily Davis", department: "Marketing", accessLevel: "Standard" },
  ]

  const departments = [
    { id: 1, name: "Information Technology", userCount: 45 },
    { id: 2, name: "Human Resources", userCount: 12 },
    { id: 3, name: "Finance", userCount: 18 },
    { id: 4, name: "Marketing", userCount: 23 },
  ]

  const doors = [
    { id: 1, name: "Main Entrance", area: "Building Access", assigned: true },
    { id: 2, name: "Server Room", area: "IT Department", assigned: false },
    { id: 3, name: "Office 101", area: "Office Area", assigned: true },
    { id: 4, name: "Conference Room", area: "Meeting Area", assigned: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Door Assignment</h1>
          <p className="text-muted-foreground">Assign door access to users, departments, and access groups</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isCreateAssignmentOpen} onOpenChange={setIsCreateAssignmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Door Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="assignment-type">Assignment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Individual User</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="access-group">Access Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Select Target</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user/department/group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="it-dept">IT Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doors">Select Doors</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doors to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Entrance</SelectItem>
                      <SelectItem value="server">Server Room</SelectItem>
                      <SelectItem value="office">Office Areas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateAssignmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Creating assignment...")
                      setIsCreateAssignmentOpen(false)
                    }}
                  >
                    Create Assignment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="individual">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual">Individual Users</TabsTrigger>
          <TabsTrigger value="department">By Department</TabsTrigger>
          <TabsTrigger value="access-group">By Access Group</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Select User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search users..." className="pl-8" />
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-slate-500">
                            {user.department} - {user.accessLevel}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assign Doors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-slate-500 mb-4">Select a user to assign door access</div>
                  <div className="space-y-2">
                    {doors.map((door) => (
                      <div key={door.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{door.name}</p>
                          <p className="text-sm text-slate-500">{door.area}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked={door.assigned} />
                          <Badge
                            variant={door.assigned ? "success" : "secondary"}
                            className={door.assigned ? "bg-green-500" : "bg-slate-500"}
                          >
                            {door.assigned ? "Assigned" : "Not Assigned"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Access Control Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>PIN Access</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Anti-Passback</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Holiday Access</Label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Time Zone Restriction</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Select Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search departments..." className="pl-8" />
                  </div>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                      >
                        <div>
                          <p className="font-medium">{dept.name}</p>
                          <p className="text-sm text-slate-500">{dept.userCount} users</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Door Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-slate-500 mb-4">
                    Select a department to assign door access to all users
                  </div>
                  <div className="space-y-2">
                    {doors.map((door) => (
                      <div key={door.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{door.name}</p>
                          <p className="text-sm text-slate-500">{door.area}</p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access-group" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Select Access Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Employee</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="it">IT Department</SelectItem>
                      <SelectItem value="security">Security Personnel</SelectItem>
                      <SelectItem value="contractors">Contractors</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="p-4 border rounded-md bg-slate-50">
                    <h4 className="font-medium mb-2">Standard Employee</h4>
                    <p className="text-sm text-slate-600 mb-2">Basic office access during business hours</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">145 users</Badge>
                      <Badge variant="outline">8 doors assigned</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Door Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-slate-500 mb-4">Modify door access for the selected access group</div>
                  <div className="space-y-2">
                    {doors.map((door) => (
                      <div key={door.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{door.name}</p>
                          <p className="text-sm text-slate-500">{door.area}</p>
                        </div>
                        <Switch defaultChecked={door.id <= 3} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Assignment</Button>
      </div>
    </div>
  )
}
