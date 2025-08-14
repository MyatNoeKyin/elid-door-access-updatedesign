"use client"

import { useRouter } from "next/navigation"
import TimeZoneForm from "@/components/time-zone-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// This would typically come from a global state or database in a real application
// For demonstration, we'll simulate adding to a list
interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

interface DailySchedule {
  day: string
  timers: TimeSlot[]
}

interface TimeZone {
  id: number
  name: string
  description: string
  dailySchedules: DailySchedule[]
  status: "active" | "inactive"
}

// Simulate a global data store for demonstration purposes
const timeZonesData: TimeZone[] = [
  {
    id: 1,
    name: "Business Hours",
    description: "Standard office hours (Mon-Fri 08:00-18:00)",
    dailySchedules: [], // Simplified for example
    status: "active",
  },
]

export default function AddTimeZonePage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = (data: Omit<TimeZone, "id">) => {
    // Simulate saving to a backend/global state
    const newId = Math.max(...timeZonesData.map((tz) => tz.id), 0) + 1
    const newTimeZone = { ...data, id: newId }
    timeZonesData.push(newTimeZone) // In a real app, this would be an API call

    toast({
      title: "Time Zone Created!",
      description: `Time zone "${newTimeZone.name}" has been created.`,
    })
    router.push("/dashboard/time-zones")
  }

  const handleCancel = () => {
    router.push("/dashboard/time-zones")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Time Zone</h1>
          <p className="text-muted-foreground">Define a new time schedule for access control.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Time Zone Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeZoneForm onSave={handleSave} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}
