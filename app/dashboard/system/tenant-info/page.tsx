"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Building } from "lucide-react"
import { TenantForm } from "@/components/tenant-form"

interface Tenant {
  id: string
  tenantName: string
  managerName: string
  description: string
  pin: string
}

export default function TenantInfoPage() {
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      tenantName: "ELID Technologies Corp",
      managerName: "John Administrator",
      description: "Main corporate tenant for ELID Access Control System.",
      pin: "1234",
    },
    {
      id: "2",
      tenantName: "Global Security Solutions",
      managerName: "Jane Doe",
      description: "Partner company specializing in large-scale security deployments.",
      pin: "5678",
    },
  ])
  const [isAddTenantDialogOpen, setIsAddTenantDialogOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | undefined>(undefined)

  const handleAddTenant = (newTenantData: Omit<Tenant, "id">) => {
    const newTenant: Tenant = {
      id: (tenants.length + 1).toString(), // Simple ID generation
      ...newTenantData,
    }
    setTenants((prev) => [...prev, newTenant])
    setIsAddTenantDialogOpen(false)
  }

  const handleUpdateTenant = (updatedTenantData: Tenant) => {
    setTenants((prev) => prev.map((tenant) => (tenant.id === updatedTenantData.id ? updatedTenantData : tenant)))
    setIsAddTenantDialogOpen(false)
    setEditingTenant(undefined)
  }

  const handleDeleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((tenant) => tenant.id !== id))
  }

  const openEditDialog = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsAddTenantDialogOpen(true)
  }

  const closeDialog = () => {
    setIsAddTenantDialogOpen(false)
    setEditingTenant(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenant Settings</h1>
          <p className="text-muted-foreground">Manage tenant organizations and their primary details.</p>
        </div>
        <Dialog open={isAddTenantDialogOpen} onOpenChange={setIsAddTenantDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTenant(undefined)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTenant ? "Edit Tenant" : "Add New Tenant"}</DialogTitle>
              <DialogDescription>
                {editingTenant ? "Make changes to this tenant's profile." : "Add a new tenant to your system."}
              </DialogDescription>
            </DialogHeader>
            <TenantForm
              initialData={editingTenant}
              onSubmit={editingTenant ? handleUpdateTenant : handleAddTenant}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Tenant Configuration
          </CardTitle>
          <CardDescription>Overview of all configured tenants.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.tenantName}</TableCell>
                  <TableCell>{tenant.managerName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{tenant.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(tenant)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTenant(tenant.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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
