"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Search, Trash2, CreditCard, Users, Calendar, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface TempCard {
  id: string
  cardNumber: string
  holderName: string
  department: string
  issueDate: string
  expiryDate: string
  status: "Active" | "Expired" | "Suspended"
  accessLevel: string
  issuedBy: string
}

export default function DeleteTempCardsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [tempCards, setTempCards] = useState<TempCard[]>([
    {
      id: "1",
      cardNumber: "TEMP-001",
      holderName: "John Visitor",
      department: "Corporate",
      issueDate: "2025-01-15",
      expiryDate: "2025-01-22",
      status: "Active",
      accessLevel: "Visitor",
      issuedBy: "Admin User",
    },
    {
      id: "2",
      cardNumber: "TEMP-002",
      holderName: "Jane Contractor",
      department: "Technology",
      issueDate: "2025-01-10",
      expiryDate: "2025-01-20",
      status: "Expired",
      accessLevel: "Contractor",
      issuedBy: "Security Officer",
    },
    {
      id: "3",
      cardNumber: "TEMP-003",
      holderName: "Mike Consultant",
      department: "Finance",
      issueDate: "2025-01-18",
      expiryDate: "2025-01-25",
      status: "Active",
      accessLevel: "Consultant",
      issuedBy: "HR Manager",
    },
    {
      id: "4",
      cardNumber: "TEMP-004",
      holderName: "Sarah Intern",
      department: "Marketing",
      issueDate: "2025-01-12",
      expiryDate: "2025-01-19",
      status: "Suspended",
      accessLevel: "Intern",
      issuedBy: "Department Head",
    },
    {
      id: "5",
      cardNumber: "TEMP-005",
      holderName: "David Vendor",
      department: "Sales Department",
      issueDate: "2025-01-16",
      expiryDate: "2025-01-23",
      status: "Active",
      accessLevel: "Vendor",
      issuedBy: "Facility Manager",
    },
  ])

  // Filter cards based on search and filters
  const filteredCards = tempCards.filter((card) => {
    const matchesSearch =
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || card.status === statusFilter
    const matchesDepartment = departmentFilter === "All" || card.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  // Get unique departments for filter
  const departments = Array.from(new Set(tempCards.map((card) => card.department)))

  // Handle individual card selection
  const handleCardSelect = (cardId: string) => {
    setSelectedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]))
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCards.length === filteredCards.length) {
      setSelectedCards([])
    } else {
      setSelectedCards(filteredCards.map((card) => card.id))
    }
  }

  // Delete single card
  const handleDeleteCard = (cardId: string) => {
    setTempCards((prev) => prev.filter((card) => card.id !== cardId))
    setSelectedCards((prev) => prev.filter((id) => id !== cardId))
    toast.success("Temporary card has been deleted and access revoked immediately.")
  }

  // Delete multiple cards
  const handleBulkDelete = () => {
    setTempCards((prev) => prev.filter((card) => !selectedCards.includes(card.id)))
    const deletedCount = selectedCards.length
    setSelectedCards([])
    toast.success(`${deletedCount} temporary cards have been deleted and access revoked immediately.`)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Expired":
        return "destructive"
      case "Suspended":
        return "secondary"
      default:
        return "outline"
    }
  }

  const activeCards = tempCards.filter((card) => card.status === "Active").length
  const expiredCards = tempCards.filter((card) => card.status === "Expired").length
  const suspendedCards = tempCards.filter((card) => card.status === "Suspended").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Delete Temporary Cards</h1>
        <p className="text-muted-foreground">Manage and delete temporary access cards</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempCards.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCards}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredCards}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{selectedCards.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter and Search</CardTitle>
          <CardDescription>Find specific temporary cards to manage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by card number, holder name, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Temporary Cards</CardTitle>
              <CardDescription>
                {filteredCards.length} of {tempCards.length} cards shown
                {selectedCards.length > 0 && ` • ${selectedCards.length} selected`}
              </CardDescription>
            </div>
            {selectedCards.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedCards.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Cards</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedCards.length} temporary cards? This action will
                      immediately revoke access for all selected cards and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Cards
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCards.length === filteredCards.length && filteredCards.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all cards"
                  />
                </TableHead>
                <TableHead>Card Number</TableHead>
                <TableHead>Holder Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead>Issued By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No temporary cards found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={() => handleCardSelect(card.id)}
                        aria-label={`Select card ${card.cardNumber}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono">{card.cardNumber}</TableCell>
                    <TableCell className="font-medium">{card.holderName}</TableCell>
                    <TableCell>{card.department}</TableCell>
                    <TableCell>{card.issueDate}</TableCell>
                    <TableCell>{card.expiryDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(card.status)}>{card.status}</Badge>
                    </TableCell>
                    <TableCell>{card.accessLevel}</TableCell>
                    <TableCell>{card.issuedBy}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Temporary Card</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete card {card.cardNumber} for {card.holderName}? This will
                              immediately revoke their access and cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCard(card.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Card
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
