"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { toast } from "@/hooks/use-toast"
import { Building, Plus, Edit, Trash2, Search } from "lucide-react"

interface Department {
  id: string
  name: string
  parentId?: string
  parentName?: string
  userCount: number
  createdAt: string
  status: "active" | "inactive"
}

// Mock data
const mockDepartments: Department[] = [
  {
    id: "CORP",
    name: "Corporate",
    userCount: 25,
    createdAt: "2024-01-15",
    status: "active",
  },
  {
    id: "CORP_SALE",
    name: "Sales",
    parentId: "CORP",
    parentName: "Corporate",
    userCount: 12,
    createdAt: "2024-01-16",
    status: "active",
  },
  {
    id: "CORP_MARK",
    name: "Marketing",
    parentId: "CORP",
    parentName: "Corporate",
    userCount: 8,
    createdAt: "2024-01-17",
    status: "active",
  },
  {
    id: "TECH",
    name: "Technology",
    userCount: 18,
    createdAt: "2024-01-18",
    status: "active",
  },
  {
    id: "TECH_DEV",
    name: "Development",
    parentId: "TECH",
    parentName: "Technology",
    userCount: 15,
    createdAt: "2024-01-19",
    status: "active",
  },
  {
    id: "HUMA",
    name: "Human Resources",
    userCount: 5,
    createdAt: "2024-01-20",
    status: "active",
  },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    parentId: "",
  })

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.parentName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDepartment = () => {
    if (!formData.id.trim() || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department ID and name are required",
        variant: "destructive",
      })
      return
    }

    // Check if ID already exists
    if (departments.some((d) => d.id === formData.id)) {
      toast({
        title: "Error",
        description: "Department ID already exists",
        variant: "destructive",
      })
      return
    }

    const parentDept = departments.find((d) => d.id === formData.parentId)

    const newDepartment: Department = {
      id: formData.id,
      name: formData.name,
      parentId: formData.parentId || undefined,
      parentName: parentDept?.name,
      userCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    }

    setDepartments([...departments, newDepartment])
    setFormData({ id: "", name: "", parentId: "" })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: `Department "${formData.name}" created successfully`,
    })
  }

  const handleEditDepartment = () => {
    if (!editingDepartment || !formData.name.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      })
      return
    }

    const parentDept = departments.find((d) => d.id === formData.parentId)

    setDepartments(
      departments.map((dept) =>
        dept.id === editingDepartment.id
          ? {
              ...dept,
              name: formData.name,
              parentId: formData.parentId || undefined,
              parentName: parentDept?.name,
            }
          : dept,
      ),
    )

    setIsEditDialogOpen(false)
    setEditingDepartment(null)
    setFormData({ id: "", name: "", parentId: "" })

    toast({
      title: "Success",
      description: "Department updated successfully",
    })
  }

  const handleDeleteDepartment = (id: string) => {
    const hasChildren = departments.some((dept) => dept.parentId === id)
    const department = departments.find((dept) => dept.id === id)

    if (hasChildren) {
      toast({
        title: "Cannot Delete",
        description: "This department has child departments. Please delete or reassign them first.",
        variant: "destructive",
      })
      return
    }

    if (department && department.userCount > 0) {
      toast({
        title: "Cannot Delete",
        description: `This department has ${department.userCount} users. Please reassign them first.`,
        variant: "destructive",
      })
      return
    }

    setDepartments(departments.filter((dept) => dept.id !== id))
    toast({
      title: "Success",
      description: "Department deleted successfully",
    })
  }

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      id: department.id,
      name: department.name,
      parentId: department.parentId || "",
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ id: "", name: "", parentId: "" })
    setEditingDepartment(null)
  }

  // Get available parent departments (excluding the current department and its children when editing)
  const getAvailableParents = () => {
    if (!editingDepartment) return departments

    const getChildIds = (parentId: string): string[] => {
      const children = departments.filter((d) => d.parentId === parentId)
      return children.reduce((acc, child) => [...acc, child.id, ...getChildIds(child.id)], [] as string[])
    }

    const excludeIds = [editingDepartment.id, ...getChildIds(editingDepartment.id)]
    return departments.filter((d) => !excludeIds.includes(d.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Settings</h1>
          <p className="text-muted-foreground">Manage organizational departments and their hierarchy</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>Create a new department with a unique ID and name.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Department (Optional)</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Root Department)</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id">Department ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                  placeholder="Enter department ID (e.g., SALES)"
                />
                <p className="text-sm text-muted-foreground">
                  Use a unique identifier for this department (letters and numbers only)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDepartment}>Add Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>View and manage all departments in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department ID</TableHead>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Parent Department</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-mono">{department.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        {department.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {department.parentName ? (
                        <Badge variant="outline">{department.parentName}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Root</span>
                      )}
                    </TableCell>
                    <TableCell>{department.userCount}</TableCell>
                    <TableCell>
                      <Badge variant={department.status === "active" ? "default" : "secondary"}>
                        {department.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{department.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(department)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Department</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{department.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDepartment(department.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update department information. Department ID cannot be changed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Department ID</Label>
              <Input value={editingDepartment?.id || ""} disabled className="bg-muted" />
              <p className="text-sm text-muted-foreground">Department ID cannot be modified</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editParentId">Parent Department</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Root Department)</SelectItem>
                  {getAvailableParents().map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editName">Department Name</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter department name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>Update Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
