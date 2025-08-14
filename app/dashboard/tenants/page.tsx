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
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Building2, Users, Settings, Edit, Trash2 } from "lucide-react"

export default function TenantsPage() {
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false)

  const tenants = [
    {
      id: 1,
      name: "Acme Corporation",
      code: "ACME",
      status: "active",
      userCount: 245,
      doorCount: 18,
      template: "Corporate",
      contactEmail: "admin@acme.com",
      createdDate: "2025-01-15",
    },
    {
      id: 2,
      name: "TechStart Inc",
      code: "TECH",
      status: "active",
      userCount: 89,
      doorCount: 12,
      template: "Small Business",
      contactEmail: "it@techstart.com",
      createdDate: "2025-02-20",
    },
    {
      id: 3,
      name: "Global Industries",
      code: "GLOB",
      status: "inactive",
      userCount: 456,
      doorCount: 35,
      template: "Enterprise",
      contactEmail: "security@global.com",
      createdDate: "2024-11-10",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenant Management</h1>
          <p className="text-muted-foreground">Manage multiple independent client environments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddTenantOpen} onOpenChange={setIsAddTenantOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Tenant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant-name">Tenant Name</Label>
                    <Input id="tenant-name" placeholder="Enter tenant name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tenant-code">Tenant Code</Label>
                    <Input id="tenant-code" placeholder="Enter unique code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" placeholder="Enter contact email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">Default Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small Business</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter tenant description" />
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Tenant Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Multi-factor Authentication</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Audit Logging</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>API Access</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Mobile App Access</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddTenantOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddTenantOpen(false)}>Create Tenant</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">Managed environments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.filter((t) => t.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.reduce((sum, t) => sum + t.userCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doors</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.reduce((sum, t) => sum + t.doorCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Managed access points</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search tenants..." className="pl-8" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium p-2 pl-0">Tenant Name</th>
                  <th className="text-left font-medium p-2">Code</th>
                  <th className="text-left font-medium p-2">Template</th>
                  <th className="text-left font-medium p-2">Users</th>
                  <th className="text-left font-medium p-2">Doors</th>
                  <th className="text-left font-medium p-2">Status</th>
                  <th className="text-left font-medium p-2">Created</th>
                  <th className="text-left font-medium p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pl-0">
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-xs text-slate-500">{tenant.contactEmail}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline">{tenant.code}</Badge>
                    </td>
                    <td className="py-3">{tenant.template}</td>
                    <td className="py-3">{tenant.userCount}</td>
                    <td className="py-3">{tenant.doorCount}</td>
                    <td className="py-3">
                      <Badge
                        variant={tenant.status === "active" ? "success" : "secondary"}
                        className={tenant.status === "active" ? "bg-green-500" : "bg-slate-500"}
                      >
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3">{new Date(tenant.createdDate).toLocaleDateString()}</td>
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
