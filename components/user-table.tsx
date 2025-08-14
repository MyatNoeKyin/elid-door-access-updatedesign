import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2, Key, Fingerprint, CreditCard, Eye, Copy } from "lucide-react"

interface UserTableProps {
  searchTerm?: string
  filter?: "active" | "inactive" | "pending"
}

export default function UserTable({ searchTerm = "", filter }: UserTableProps) {
  const users = [
    {
      id: 1,
      userId: "USR001234",
      name: "John Smith",
      displayName: "JS",
      department: "Information Technology",
      departmentId: "IT001",
      email: "john.smith@example.com",
      status: "active",
      pin: true,
      fingerprint: true,
      card: true,
      cardCount: 2,
      directoryCode: "1001",
      phoneNumber: "+1-555-0123",
      validFrom: "2024-01-15",
      validTo: "2026-01-15",
    },
    {
      id: 2,
      userId: "USR001235",
      name: "Sarah Johnson",
      displayName: "SJ",
      department: "Human Resources",
      departmentId: "HR001",
      email: "sarah.johnson@example.com",
      status: "active",
      pin: true,
      fingerprint: true,
      card: true,
      cardCount: 1,
      directoryCode: "1002",
      phoneNumber: "+1-555-0124",
      validFrom: "2024-02-01",
      validTo: "2026-02-01",
    },
    {
      id: 3,
      userId: "USR001236",
      name: "Michael Brown",
      displayName: "MB",
      department: "Finance",
      departmentId: "FIN001",
      email: "michael.brown@example.com",
      status: "inactive",
      pin: true,
      fingerprint: false,
      card: true,
      cardCount: 1,
      directoryCode: "1003",
      phoneNumber: "+1-555-0125",
      validFrom: "2023-12-01",
      validTo: "2025-12-01",
    },
    {
      id: 4,
      userId: "USR001237",
      name: "Emily Davis",
      displayName: "ED",
      department: "Marketing",
      departmentId: "MKT001",
      email: "emily.davis@example.com",
      status: "active",
      pin: false,
      fingerprint: true,
      card: true,
      cardCount: 1,
      directoryCode: "1004",
      phoneNumber: "+1-555-0126",
      validFrom: "2024-03-15",
      validTo: "2026-03-15",
    },
    {
      id: 5,
      userId: "USR001238",
      name: "Robert Wilson",
      displayName: "RW",
      department: "Research & Development",
      departmentId: "RD001",
      email: "robert.wilson@example.com",
      status: "pending",
      pin: true,
      fingerprint: false,
      card: false,
      cardCount: 0,
      directoryCode: "1005",
      phoneNumber: "+1-555-0127",
      validFrom: "2024-07-01",
      validTo: "2026-07-01",
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.departmentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = !filter || user.status === filter

    return matchesSearch && matchesFilter
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left font-medium p-2 pl-0">User</th>
            <th className="text-left font-medium p-2">Department</th>
            <th className="text-left font-medium p-2">Contact</th>
            <th className="text-left font-medium p-2">Status</th>
            <th className="text-left font-medium p-2">Auth Methods</th>
            <th className="text-left font-medium p-2">Validity</th>
            <th className="text-left font-medium p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 pl-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{user.displayName}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span>{user.userId}</span>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <div>
                  <div className="font-medium">{user.department}</div>
                  <Badge variant="outline" className="text-xs">
                    {user.departmentId}
                  </Badge>
                </div>
              </td>
              <td className="py-3">
                <div className="text-xs">
                  <div>{user.email}</div>
                  <div className="text-slate-500">
                    Dir: {user.directoryCode} | {user.phoneNumber}
                  </div>
                </div>
              </td>
              <td className="py-3">
                <Badge
                  variant={user.status === "active" ? "success" : user.status === "inactive" ? "secondary" : "outline"}
                  className={
                    user.status === "active"
                      ? "bg-green-500"
                      : user.status === "inactive"
                        ? "bg-slate-500"
                        : "text-amber-500 border-amber-500"
                  }
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </td>
              <td className="py-3">
                <div className="flex gap-1">
                  {user.pin && (
                    <Badge variant="outline" className="border-slate-200 text-slate-700 text-xs">
                      <Key className="h-3 w-3 mr-1" /> PIN
                    </Badge>
                  )}
                  {user.fingerprint && (
                    <Badge variant="outline" className="border-slate-200 text-slate-700 text-xs">
                      <Fingerprint className="h-3 w-3 mr-1" /> Bio
                    </Badge>
                  )}
                  {user.card && (
                    <Badge variant="outline" className="border-slate-200 text-slate-700 text-xs">
                      <CreditCard className="h-3 w-3 mr-1" /> {user.cardCount}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-3">
                <div className="text-xs">
                  <div>From: {user.validFrom}</div>
                  <div className="text-slate-500">To: {user.validTo}</div>
                </div>
              </td>
              <td className="py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit User</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Key className="mr-2 h-4 w-4" />
                      <span>Manage Access</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Manage Cards</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Fingerprint className="mr-2 h-4 w-4" />
                      <span>Enroll Biometrics</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete User</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div className="text-center p-6">
          <p className="text-slate-500">No users found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
