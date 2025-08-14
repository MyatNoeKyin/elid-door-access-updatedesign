"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Clock, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface TimeSlot {
  id: string // e.g., "timer1", "timer2", "timer3"
  startTime: string
  endTime: string
}

interface DailySchedule {
  day: string // e.g., "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
  timers: TimeSlot[] // Always 3 timers
}

interface TimeZone {
  id: number
  name: string
  description: string
  dailySchedules: DailySchedule[]
  status: "active" | "inactive"
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// This data would typically be fetched from a backend
const initialTimeZonesData: TimeZone[] = [
  {
    id: 1,
    name: "Business Hours",
    description: "Standard office hours (Mon-Fri 08:00-18:00)",
    dailySchedules: daysOfWeek.map((day) => ({
      day,
      timers: [
        {
          id: "timer1",
          startTime: day === "Sat" || day === "Sun" ? "00:00" : "08:00",
          endTime: day === "Sat" || day === "Sun" ? "00:00" : "18:00",
        },
        { id: "timer2", startTime: "00:00", endTime: "00:00" },
        { id: "timer3", startTime: "00:00", endTime: "00:00" },
      ],
    })),
    status: "active",
  },
  {
    id: 2,
    name: "Extended Hours",
    description: "Extended access for management (Mon-Sat 06:00-22:00)",
    dailySchedules: daysOfWeek.map((day) => ({
      day,
      timers: [
        { id: "timer1", startTime: day === "Sun" ? "00:00" : "06:00", endTime: day === "Sun" ? "00:00" : "22:00" },
        { id: "timer2", startTime: "00:00", endTime: "00:00" },
        { id: "timer3", startTime: "00:00", endTime: "00:00" },
      ],
    })),
    status: "active",
  },
  {
    id: 3,
    name: "24/7 Access",
    description: "Round-the-clock access for all days",
    dailySchedules: daysOfWeek.map((day) => ({
      day,
      timers: [
        { id: "timer1", startTime: "00:00", endTime: "23:59" },
        { id: "timer2", startTime: "00:00", endTime: "00:00" },
        { id: "timer3", startTime: "00:00", endTime: "00:00" },
      ],
    })),
    status: "active",
  },
  {
    id: 4,
    name: "Weekend Only",
    description: "Weekend maintenance access (Sat-Sun 08:00-17:00)",
    dailySchedules: daysOfWeek.map((day) => ({
      day,
      timers: [
        {
          id: "timer1",
          startTime: day === "Sat" || day === "Sun" ? "08:00" : "00:00",
          endTime: day === "Sat" || day === "Sun" ? "17:00" : "00:00",
        },
        { id: "timer2", startTime: "00:00", endTime: "00:00" },
        { id: "timer3", startTime: "00:00", endTime: "00:00" },
      ],
    })),
    status: "active",
  },
  {
    id: 5,
    name: "Night Shift",
    description: "Night shift workers (Mon-Fri 22:00-06:00)",
    dailySchedules: daysOfWeek.map((day) => ({
      day,
      timers: [
        {
          id: "timer1",
          startTime: day === "Sat" || day === "Sun" ? "00:00" : "22:00",
          endTime: day === "Sat" || day === "Sun" ? "00:00" : "06:00",
        },
        { id: "timer2", startTime: "00:00", endTime: "00:00" },
        { id: "timer3", startTime: "00:00", endTime: "00:00" },
      ],
    })),
    status: "inactive",
  },
]

export default function TimeZonesPage() {
  const router = useRouter()
  const [timeZones, setTimeZones] = useState<TimeZone[]>(initialTimeZonesData) // In a real app, this would be fetched
  const { toast } = useToast()

  const handleDeleteTimeZone = useCallback(
    (id: number) => {
      setTimeZones((prevTimeZones) => prevTimeZones.filter((tz) => tz.id !== id))
      toast({
        title: "Time Zone Deleted!",
        description: "The time zone has been removed.",
      })
    },
    [toast],
  )

  const totalTimeZones = useMemo(() => timeZones.length, [timeZones])
  const activeZones = useMemo(() => timeZones.filter((tz) => tz.status === "active").length, [timeZones])
  const fullWeekAccessZones = useMemo(
    () =>
      timeZones.filter((tz) =>
        tz.dailySchedules.every((day) => day.timers.some((t) => t.startTime === "00:00" && t.endTime === "23:59")),
      ).length,
    [timeZones],
  )
  const businessHoursZones = useMemo(
    () =>
      timeZones.filter(
        (tz) =>
          tz.dailySchedules
            .slice(0, 5)
            .every((day) => day.timers.some((t) => t.startTime === "08:00" && t.endTime === "18:00")) &&
          tz.dailySchedules
            .slice(5, 7)
            .every((day) => day.timers.every((t) => t.startTime === "00:00" && t.endTime === "00:00")),
      ).length,
    [timeZones],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Time Zones</h1>
          <p className="text-muted-foreground">Configure access time schedules</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard/time-zones/add">
              <Plus className="mr-2 h-4 w-4" /> Create Time Zone
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time Zones</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTimeZones}</div>
            <p className="text-xs text-muted-foreground">Configured schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Zones</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeZones}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24/7 Zones</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fullWeekAccessZones}</div>
            <p className="text-xs text-muted-foreground">Full week access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessHoursZones}</div>
            <p className="text-xs text-muted-foreground">Weekday only</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search time zones..." className="pl-8" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left font-medium p-2 pl-0 min-w-[120px]">Name</th>
                  <th className="text-left font-medium p-2 min-w-[200px]">Description</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="text-left font-medium p-2 min-w-[150px]">
                      {day}
                    </th>
                  ))}
                  <th className="text-left font-medium p-2 min-w-[80px]">Status</th>
                  <th className="text-left font-medium p-2 min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeZones.map((tz) => (
                  <tr key={tz.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 pl-0">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{tz.name}</span>
                      </div>
                    </td>
                    <td className="py-3 max-w-xs">
                      <p className="text-slate-600 truncate">{tz.description}</p>
                    </td>
                    {daysOfWeek.map((day) => {
                      const dailySchedule = tz.dailySchedules.find((s) => s.day === day)
                      return (
                        <td key={day} className="py-3">
                          <div className="flex flex-col gap-1">
                            {dailySchedule?.timers.map(
                              (timer, index) =>
                                (timer.startTime !== "00:00" || timer.endTime !== "00:00") && (
                                  <span key={index} className="text-xs text-slate-700">
                                    {timer.startTime} - {timer.endTime}
                                  </span>
                                ),
                            )}
                            {(!dailySchedule ||
                              dailySchedule.timers.every((t) => t.startTime === "00:00" && t.endTime === "00:00")) && (
                              <span className="text-xs text-muted-foreground">No timers</span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                    <td className="py-3">
                      <Badge
                        variant={tz.status === "active" ? "default" : "secondary"}
                        className={cn(
                          tz.status === "active"
                            ? "bg-green-500 hover:bg-green-500/80"
                            : "bg-slate-500 hover:bg-slate-500/80",
                          "text-white",
                        )}
                      >
                        {tz.status.charAt(0).toUpperCase() + tz.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/time-zones/edit/${tz.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteTimeZone(tz.id)}
                        >
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
