"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Database, Type, Hash, Calendar, ToggleLeft } from "lucide-react"

interface UserField {
  id: string
  name: string
  type: "text" | "number" | "date" | "boolean"
  required: boolean
  defaultValue?: string
  usageCount: number
}

const initialFields: UserField[] = [
  {
    id: "employee_id",
    name: "Employee ID",
    type: "text",
    required: true,
    usageCount: 156,
  },
  {
    id: "phone",
    name: "Phone Number",
    type: "text",
    required: false,
    usageCount: 142,
  },
  {
    id: "hire_date",
    name: "Hire Date",
    type: "date",
    required: false,
    usageCount: 98,
  },
  {
    id: "security_level",
    name: "Security Level",
    type: "number",
    required: true,
    defaultValue: "1",
    usageCount: 156,
  },
]

export default function UserFieldsPage() {
  const [fields, setFields] = useState<UserField[]>(initialFields)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<UserField | null>(null)
  const [newField, setNewField] = useState({
    name: "",
    type: "text" as const,
    required: false,
    defaultValue: "",
  })

  const getFieldIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="h-4 w-4" />
      case "number":
        return <Hash className="h-4 w-4" />
      case "date":
        return <Calendar className="h-4 w-4" />
      case "boolean":
        return <ToggleLeft className="h-4 w-4" />
      default:
        return <Type className="h-4 w-4" />
    }
  }

  const handleAddField = () => {
    if (fields.length >= 10) {
      alert("Maximum of 10 custom fields allowed")
      return
    }

    const field: UserField = {
      id: newField.name.toLowerCase().replace(/\s+/g, "_"),
      name: newField.name,
      type: newField.type,
      required: newField.required,
      defaultValue: newField.defaultValue || undefined,
      usageCount: 0,
    }

    setFields([...fields, field])
    setIsAddDialogOpen(false)
    setNewField({ name: "", type: "text", required: false, defaultValue: "" })
  }

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Field Settings</h1>
          <p className="text-muted-foreground">Configure custom fields for user profiles (maximum 10 fields)</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={fields.length >= 10}>
              <Plus className="mr-2 h-4 w-4" />
              Add Field ({fields.length}/10)
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Field</DialogTitle>
              <DialogDescription>
                Create a new custom field for user profiles. This field will be available when adding or editing users.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="field-name" className="text-right">
                  Field Name
                </Label>
                <Input
                  id="field-name"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Badge Number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="field-type" className="text-right">
                  Field Type
                </Label>
                <Select
                  value={newField.type}
                  onValueChange={(value: "text" | "number" | "date" | "boolean") =>
                    setNewField({ ...newField, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="boolean">Yes/No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="default-value" className="text-right">
                  Default Value
                </Label>
                <Input
                  id="default-value"
                  value={newField.defaultValue}
                  onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
                  className="col-span-3"
                  placeholder="Optional default value"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="required" className="text-right">
                  Required Field
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="required"
                    checked={newField.required}
                    onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddField}>
                Add Field
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.length}</div>
            <p className="text-xs text-muted-foreground">of 10 maximum</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required Fields</CardTitle>
            <Badge variant="destructive" className="h-4 w-4 rounded-full p-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.filter((f) => f.required).length}</div>
            <p className="text-xs text-muted-foreground">Must be filled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Type className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...fields.map((f) => f.usageCount))}</div>
            <p className="text-xs text-muted-foreground">Usage count</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{10 - fields.length}</div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
          <CardDescription>Manage custom fields that will be available in user profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getFieldIcon(field.type)}
                      <span>{field.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {field.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {field.required ? (
                      <Badge variant="destructive">Required</Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {field.defaultValue ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{field.defaultValue}</code>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{field.usageCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingField(field)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteField(field.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
