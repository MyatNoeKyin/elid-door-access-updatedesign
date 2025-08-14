"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, PlusCircle, Home, User, UserCheck, Building } from "lucide-react"
import Link from "next/link"

interface Operator {
  id: number
  operatorId: string
  pin: string
  description: string
  role: "systemmanager" | "manager" | "operator"
  status: "active" | "inactive"
  operatingRights: string[]
  assignedDepartments: { id: string; name: string }[]
  canManageUsersReadWrite: boolean
}

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      operatorId: "admin.user",
      pin: "1234",
      description: "System Administrator",
      role: "systemmanager",
      status: "active",
      operatingRights: ["department_access", "access_management", "system_setup", "monitoring_setup"],
      assignedDepartments: [{ id: "IT001", name: "Information Technology" }],
      canManageUsersReadWrite: true,
    },
    {
      id: 2,
      operatorId: "john.doe",
      pin: "5678",
      description: "HR Manager",
      role: "manager",
      status: "active",
      operatingRights: ["department_access", "access_management"],
      assignedDepartments: [{ id: "HR001", name: "Human Resources" }],
      canManageUsersReadWrite: false,
    },
    {
      id: 3,
      operatorId: "jane.smith",
      pin: "9012",
      description: "Security Operator",
      role: "operator",
      status: "inactive",
      operatingRights: ["monitoring_setup"],
      assignedDepartments: [{ id: "OPS001", name: "Operations" }],
      canManageUsersReadWrite: true,
    },
  ])

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Operators</h1>
        <nav className="ml-auto flex gap-2 text-sm items-center">
          <Link href="#" className="flex items-center gap-1 hover:underline">
            <Home className="h-3 w-3" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Operators</span>
        </nav>
        <Link href="/dashboard/operators/add" passHref>
          <Button className="ml-auto gap-1">
            <PlusCircle className="h-4 w-4" />
            New Operator
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operators</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operators.length}</div>
            <p className="text-xs text-muted-foreground">All registered operators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operators</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operators.filter((op) => op.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently active in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Operators</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operators.filter((op) => op.status === "inactive").length}</div>
            <p className="text-xs text-muted-foreground">Operators not currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments Assigned</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(operators.flatMap((op) => op.assignedDepartments.map((d) => d.id))).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique departments managed by operators</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operator List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Operating Rights</TableHead>
                <TableHead>Assigned Departments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {operator.operatorId
                            .split(".")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{operator.operatorId}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{operator.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        operator.role === "systemmanager"
                          ? "border-red-200 text-red-800 bg-red-50"
                          : operator.role === "manager"
                            ? "border-blue-200 text-blue-800 bg-blue-50"
                            : "border-green-200 text-green-800 bg-green-50"
                      }
                    >
                      {operator.role === "systemmanager"
                        ? "System Manager"
                        : operator.role === "manager"
                          ? "Manager"
                          : "Operator"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={operator.status === "active" ? "default" : "secondary"}
                      className={operator.status === "active" ? "bg-green-500 text-white" : "bg-slate-500 text-white"}
                    >
                      {operator.status.charAt(0).toUpperCase() + operator.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {operator.operatingRights.length > 0 ? (
                        operator.operatingRights.map((right) => (
                          <Badge key={right} variant="outline" className="capitalize">
                            {right.replace(/_/g, " ")}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {operator.assignedDepartments.length > 0 ? (
                        operator.assignedDepartments.map((dept) => (
                          <Badge key={dept.id} variant="outline">
                            {dept.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                      {operator.canManageUsersReadWrite && operator.assignedDepartments.length > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          R/W Users
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
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
    </main>
  )
}
