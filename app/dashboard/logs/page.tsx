"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import {
  Search,
  Download,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Settings,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedDoors, setSelectedDoors] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [doorDropdownOpen, setDoorDropdownOpen] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

  // Advanced search filters
  const [advancedFilters, setAdvancedFilters] = useState({
    userName: "",
    cardId: "",
    accessResult: "all",
    deviceName: "",
    doorName: "",
    dateFrom: "",
    dateTo: "",
  })

  const accessLogs = [
    {
      id: 1,
      timestamp: "2025-06-19 14:32:15",
      user: "John Smith",
      userId: "EMP001",
      department: "IT",
      door: "Main Entrance",
      action: "Access Granted",
      method: "Card",
      cardId: "C001234",
      deviceName: "Reader-01",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2025-06-19 14:28:42",
      user: "Sarah Johnson",
      userId: "EMP002",
      department: "HR",
      door: "Office 201",
      action: "Access Granted",
      method: "Fingerprint",
      cardId: "C001235",
      deviceName: "Reader-02",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2025-06-19 14:15:33",
      user: "Michael Brown",
      userId: "EMP003",
      department: "Finance",
      door: "Server Room",
      action: "Access Denied",
      method: "PIN",
      cardId: "C001236",
      deviceName: "Reader-03",
      status: "failed",
    },
    {
      id: 4,
      timestamp: "2025-06-19 13:45:21",
      user: "Emily Davis",
      userId: "EMP004",
      department: "Marketing",
      door: "Conference Room",
      action: "Access Granted",
      method: "Card",
      cardId: "C001237",
      deviceName: "Reader-04",
      status: "success",
    },
    {
      id: 5,
      timestamp: "2025-06-19 13:22:18",
      user: "Robert Wilson",
      userId: "EMP005",
      department: "R&D",
      door: "Lab Access",
      action: "Access Granted",
      method: "Fingerprint",
      cardId: "C001238",
      deviceName: "Reader-05",
      status: "success",
    },
  ]

  const systemEvents = [
    {
      id: 1,
      timestamp: "2025-06-19 14:35:00",
      event: "Door Forced Open",
      location: "Main Entrance",
      severity: "high",
      description: "Door was forced open without proper authentication",
    },
    {
      id: 2,
      timestamp: "2025-06-19 14:20:00",
      event: "Controller Offline",
      location: "Building B - Floor 2",
      severity: "medium",
      description: "Access controller lost network connection",
    },
    {
      id: 3,
      timestamp: "2025-06-19 13:55:00",
      event: "Multiple Failed Attempts",
      location: "Server Room",
      severity: "medium",
      description: "5 consecutive failed access attempts detected",
    },
    {
      id: 4,
      timestamp: "2025-06-19 13:30:00",
      event: "System Backup Completed",
      location: "System",
      severity: "low",
      description: "Daily system backup completed successfully",
    },
  ]

  // Get unique users for the people filter
  const uniqueUsers = Array.from(
    new Set(
      accessLogs.map((log) => ({
        name: log.user,
        id: log.userId,
      })),
    ),
  )

  // Get unique doors
  const uniqueDoors = Array.from(new Set(accessLogs.map((log) => log.door)))

  // Status options
  const statusOptions = [
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
  ]

  // Filter logs based on current filters
  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesUser = selectedUsers.length === 0 || selectedUsers.includes(log.userId)
    const matchesDoor = selectedDoors.length === 0 || selectedDoors.includes(log.door)
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(log.status)

    return matchesSearch && matchesUser && matchesDoor && matchesStatus
  })

  const handleAdvancedSearch = () => {
    // Apply advanced filters logic here
    console.log("Advanced search filters:", advancedFilters)
    setAdvancedSearchOpen(false)
  }

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      userName: "",
      cardId: "",
      accessResult: "all",
      deviceName: "",
      doorName: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  const clearAllFilters = () => {
    setSelectedUsers([])
    setSelectedDoors([])
    setSelectedStatuses([])
    setSearchTerm("")
  }

  // Multi-select component for users
  const UserMultiSelect = () => (
    <Popover open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={userDropdownOpen}
          className="w-[200px] justify-between bg-transparent"
        >
          {selectedUsers.length === 0
            ? "Filter by people"
            : selectedUsers.length === 1
              ? uniqueUsers.find((user) => user.id === selectedUsers[0])?.name
              : `${selectedUsers.length} people selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search people..." />
          <CommandList>
            <CommandEmpty>No person found.</CommandEmpty>
            <CommandGroup>
              {uniqueUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    setSelectedUsers((prev) =>
                      prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id],
                    )
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0")}
                  />
                  {user.name} ({user.id})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  // Multi-select component for doors
  const DoorMultiSelect = () => (
    <Popover open={doorDropdownOpen} onOpenChange={setDoorDropdownOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={doorDropdownOpen}
          className="w-[180px] justify-between bg-transparent"
        >
          {selectedDoors.length === 0
            ? "Filter by door"
            : selectedDoors.length === 1
              ? selectedDoors[0]
              : `${selectedDoors.length} doors selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search doors..." />
          <CommandList>
            <CommandEmpty>No door found.</CommandEmpty>
            <CommandGroup>
              {uniqueDoors.map((door) => (
                <CommandItem
                  key={door}
                  onSelect={() => {
                    setSelectedDoors((prev) => (prev.includes(door) ? prev.filter((d) => d !== door) : [...prev, door]))
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedDoors.includes(door) ? "opacity-100" : "opacity-0")} />
                  {door}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  // Multi-select component for status
  const StatusMultiSelect = () => (
    <Popover open={statusDropdownOpen} onOpenChange={setStatusDropdownOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={statusDropdownOpen}
          className="w-[180px] justify-between bg-transparent"
        >
          {selectedStatuses.length === 0
            ? "Filter by status"
            : selectedStatuses.length === 1
              ? statusOptions.find((status) => status.value === selectedStatuses[0])?.label
              : `${selectedStatuses.length} statuses selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((status) => (
                <CommandItem
                  key={status.value}
                  onSelect={() => {
                    setSelectedStatuses((prev) =>
                      prev.includes(status.value) ? prev.filter((s) => s !== status.value) : [...prev, status.value],
                    )
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedStatuses.includes(status.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Access Logs & History</h1>
          <p className="text-muted-foreground">Monitor and audit system usage</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Access</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-8 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">1 high priority</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="access-logs">
        <TabsList>
          <TabsTrigger value="access-logs">Access Logs</TabsTrigger>
          <TabsTrigger value="system-events">System Events</TabsTrigger>
          <TabsTrigger value="audit-trail">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="access-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 mb-6">
                {/* Basic Search and Filters Row */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by user name or ID..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <UserMultiSelect />
                  <DoorMultiSelect />
                  <StatusMultiSelect />
                </div>

                {/* Active Filters Display */}
                {(selectedUsers.length > 0 ||
                  selectedDoors.length > 0 ||
                  selectedStatuses.length > 0 ||
                  searchTerm) && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1">
                        Search: {searchTerm}
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedUsers.map((userId) => {
                      const user = uniqueUsers.find((u) => u.id === userId)
                      return (
                        <Badge key={userId} variant="secondary" className="gap-1">
                          {user?.name}
                          <button
                            onClick={() => setSelectedUsers((prev) => prev.filter((id) => id !== userId))}
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </Badge>
                      )
                    })}
                    {selectedDoors.map((door) => (
                      <Badge key={door} variant="secondary" className="gap-1">
                        {door}
                        <button
                          onClick={() => setSelectedDoors((prev) => prev.filter((d) => d !== door))}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {selectedStatuses.map((status) => {
                      const statusLabel = statusOptions.find((s) => s.value === status)?.label
                      return (
                        <Badge key={status} variant="secondary" className="gap-1">
                          {statusLabel}
                          <button
                            onClick={() => setSelectedStatuses((prev) => prev.filter((s) => s !== status))}
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </Badge>
                      )
                    })}
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear all
                    </Button>
                  </div>
                )}

                {/* Advanced Search Button */}
                <div className="flex justify-start">
                  <Dialog open={advancedSearchOpen} onOpenChange={setAdvancedSearchOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Advanced Search
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Advanced Search Filters</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="userName">User Name / ID</Label>
                          <Input
                            id="userName"
                            placeholder="Enter user name or ID"
                            value={advancedFilters.userName}
                            onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, userName: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardId">Card ID</Label>
                          <Input
                            id="cardId"
                            placeholder="Enter card ID"
                            value={advancedFilters.cardId}
                            onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, cardId: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accessResult">Access Result</Label>
                          <Select
                            value={advancedFilters.accessResult}
                            onValueChange={(value) => setAdvancedFilters((prev) => ({ ...prev, accessResult: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Results</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deviceName">Device Name</Label>
                          <Input
                            id="deviceName"
                            placeholder="Enter device name"
                            value={advancedFilters.deviceName}
                            onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, deviceName: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="doorName">Door Name</Label>
                          <Input
                            id="doorName"
                            placeholder="Enter door name"
                            value={advancedFilters.doorName}
                            onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, doorName: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateFrom">Date From</Label>
                          <Input
                            id="dateFrom"
                            type="date"
                            value={advancedFilters.dateFrom}
                            onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dateTo">Date To</Label>
                          <Input
                            id="dateTo"
                            type="date"
                            value={advancedFilters.dateTo}
                            onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={clearAdvancedFilters}>
                          Clear Filters
                        </Button>
                        <Button onClick={handleAdvancedSearch}>Search</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-medium p-2 pl-0">Timestamp</th>
                      <th className="text-left font-medium p-2">User</th>
                      <th className="text-left font-medium p-2">Door</th>
                      <th className="text-left font-medium p-2">Action</th>
                      <th className="text-left font-medium p-2">Method</th>
                      <th className="text-left font-medium p-2">Device</th>
                      <th className="text-left font-medium p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 pl-0 font-mono text-xs">{log.timestamp}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {log.user
                                  .split(" ")
                                  .map((name) => name[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-xs">{log.user}</p>
                              <p className="text-xs text-slate-500">
                                {log.userId} • {log.department}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">{log.door}</td>
                        <td className="py-3">{log.action}</td>
                        <td className="py-3">
                          <Badge variant="outline">{log.method}</Badge>
                        </td>
                        <td className="py-3 text-xs text-slate-500">{log.deviceName}</td>
                        <td className="py-3">
                          {log.status === "success" ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <span>Success</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span>Failed</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No logs found matching your search criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-start p-4 rounded-lg border ${
                      event.severity === "high"
                        ? "border-red-200 bg-red-50"
                        : event.severity === "medium"
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-5 w-5 mr-3 mt-0.5 ${
                        event.severity === "high"
                          ? "text-red-500"
                          : event.severity === "medium"
                            ? "text-amber-500"
                            : "text-slate-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-medium ${
                            event.severity === "high"
                              ? "text-red-800"
                              : event.severity === "medium"
                                ? "text-amber-800"
                                : "text-slate-800"
                          }`}
                        >
                          {event.event}
                        </h4>
                        <Badge
                          variant={
                            event.severity === "high"
                              ? "destructive"
                              : event.severity === "medium"
                                ? "outline"
                                : "secondary"
                          }
                          className={
                            event.severity === "high"
                              ? "bg-red-500"
                              : event.severity === "medium"
                                ? "text-amber-500 border-amber-500"
                                : "bg-slate-500"
                          }
                        >
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                        </Badge>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          event.severity === "high"
                            ? "text-red-700"
                            : event.severity === "medium"
                              ? "text-amber-700"
                              : "text-slate-700"
                        }`}
                      >
                        {event.location} - {event.timestamp}
                      </p>
                      <p
                        className={`text-sm mt-2 ${
                          event.severity === "high"
                            ? "text-red-600"
                            : event.severity === "medium"
                              ? "text-amber-600"
                              : "text-slate-600"
                        }`}
                      >
                        {event.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-2 bg-transparent">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-trail" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Audit trail data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
