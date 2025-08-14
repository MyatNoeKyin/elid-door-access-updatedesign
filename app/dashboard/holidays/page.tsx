"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HolidaysPage() {
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false)

  const holidays = [
    {
      id: 1,
      name: "New Year's Day",
      date: "2025-01-01",
      type: "National",
      accessRestricted: true,
      status: "active",
    },
    {
      id: 2,
      name: "Independence Day",
      date: "2025-07-04",
      type: "National",
      accessRestricted: true,
      status: "active",
    },
    {
      id: 3,
      name: "Christmas Day",
      date: "2025-12-25",
      type: "National",
      accessRestricted: true,
      status: "active",
    },
    {
      id: 4,
      name: "Company Founding Day",
      date: "2025-03-15",
      type: "Company",
      accessRestricted: false,
      status: "active",
    },
    {
      id: 5,
      name: "Thanksgiving",
      date: "2025-11-27",
      type: "National",
      accessRestricted: true,
      status: "active",
    },
    {
      id: 6,
      name: "Labor Day",
      date: "2025-09-01",
      type: "National",
      accessRestricted: false,
      status: "inactive",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Holiday Management</h1>
          <p className="text-muted-foreground">Configure holidays and access restrictions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isAddHolidayOpen} onOpenChange={setIsAddHolidayOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Holiday</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="holiday-name">Holiday Name</Label>
                  <Input id="holiday-name" placeholder="Enter holiday name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holiday-date">Date</Label>
                  <Input id="holiday-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holiday-type">Type</Label>
                  <Select defaultValue="national">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="religious">Religious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Access Restricted</Label>
                    <p className="text-sm text-muted-foreground">Restrict access during this holiday</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Year Valid</Label>
                    <p className="text-sm text-muted-foreground">Is this holiday valid for the current year?</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddHolidayOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Saving holiday...")
                      setIsAddHolidayOpen(false)
                    }}
                  >
                    Add Holiday
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
            <CardTitle className="text-sm font-medium">Total Holidays</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holidays.length}</div>
            <p className="text-xs text-muted-foreground">Configured holidays</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Holidays</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holidays.filter((h) => h.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restricted Access</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holidays.filter((h) => h.accessRestricted).length}</div>
            <p className="text-xs text-muted-foreground">With access restrictions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">National Holidays</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holidays.filter((h) => h.type === "National").length}</div>
            <p className="text-xs text-muted-foreground">National holidays</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holidays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search holidays..." className="pl-8" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium p-2 pl-0">Holiday Name</th>
                  <th className="text-left font-medium p-2">Date</th>
                  <th className="text-left font-medium p-2">Type</th>
                  <th className="text-left font-medium p-2">Access Restricted</th>
                  <th className="text-left font-medium p-2">Status</th>
                  <th className="text-left font-medium p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((holiday) => (
                  <tr key={holiday.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pl-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{holiday.name}</span>
                      </div>
                    </td>
                    <td className="py-3">{new Date(holiday.date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={
                          holiday.type === "National"
                            ? "border-blue-200 text-blue-800 bg-blue-50"
                            : "border-purple-200 text-purple-800 bg-purple-50"
                        }
                      >
                        {holiday.type}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={holiday.accessRestricted ? "destructive" : "success"}
                        className={holiday.accessRestricted ? "bg-red-500" : "bg-green-500"}
                      >
                        {holiday.accessRestricted ? "Restricted" : "Normal"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={holiday.status === "active" ? "success" : "secondary"}
                        className={holiday.status === "active" ? "bg-green-500" : "bg-slate-500"}
                      >
                        {holiday.status.charAt(0).toUpperCase() + holiday.status.slice(1)}
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
