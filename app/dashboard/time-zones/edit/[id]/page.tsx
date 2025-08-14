"use client"

import { useRouter } from "next/navigation"
import TimeZoneForm from "@/components/time-zone-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

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
const initialTimeZonesData: TimeZone[] = [
  {
    id: 1,
    name: "Business Hours",
    description: "Standard office hours (Mon-Fri 08:00-18:00)",
    dailySchedules: [
      {
        day: "Mon",
        timers: [
          { id: "timer1", startTime: "08:00", endTime: "18:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Tue",
        timers: [
          { id: "timer1", startTime: "08:00", endTime: "18:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Wed",
        timers: [
          { id: "timer1", startTime: "08:00", endTime: "18:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Thu",
        timers: [
          { id: "timer1", startTime: "08:00", endTime: "18:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Fri",
        timers: [
          { id: "timer1", startTime: "08:00", endTime: "18:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sat",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sun",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Extended Hours",
    description: "Extended access for management (Mon-Sat 06:00-22:00)",
    dailySchedules: [
      {
        day: "Mon",
        timers: [
          { id: "timer1", startTime: "06:00", endTime: "22:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Tue",
        timers: [
          { id: "timer1", startTime: "06:00", endTime: "22:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Wed",
        timers: [
          { id: "timer1", startTime: "06:00", endTime: "22:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Thu",
        timers: [
          { id: "timer1", startTime: "06:00", endTime: "22:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Fri",
        timers: [
          { id: "timer1", startTime: "06:00", endTime: "22:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sat",
        timers: [
          { id: "timer1", startTime: "06:00", endTime: "22:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sun",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
    ],
    status: "active",
  },
  {
    id: 3,
    name: "24/7 Access",
    description: "Round-the-clock access for all days",
    dailySchedules: [
      {
        day: "Mon",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "23:59" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Tue",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "23:59" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Wed",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "23:59" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Thu",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "23:59" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Fri",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "23:59" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sat",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "23:59" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sun",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "23:59" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
    ],
    status: "active",
  },
  {
    id: 4,
    name: "Weekend Only",
    description: "Weekend maintenance access (Sat-Sun 08:00-17:00)",
    dailySchedules: [
      {
        day: "Mon",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Tue",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Wed",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Thu",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Fri",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sat",
        timers: [
          { id: "timer1", startTime: "08:00", endTime: "17:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sun",
        timers: [
          { id: "timer1", startTime: "08:00", endTime: "17:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
    ],
    status: "active",
  },
  {
    id: 5,
    name: "Night Shift",
    description: "Night shift workers (Mon-Fri 22:00-06:00)",
    dailySchedules: [
      {
        day: "Mon",
        timers: [
          { id: "timer1", startTime: "22:00", endTime: "06:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Tue",
        timers: [
          { id: "timer1", startTime: "22:00", endTime: "06:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Wed",
        timers: [
          { id: "timer1", startTime: "22:00", endTime: "06:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Thu",
        timers: [
          { id: "timer1", startTime: "22:00", endTime: "06:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Fri",
        timers: [
          { id: "timer1", startTime: "22:00", endTime: "06:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sat",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
      {
        day: "Sun",
        timers: [
          { id: "timer1", startTime: "00:00", endTime: "00:00" },
          { id: "timer2", startTime: "00:00", endTime: "00:00" },
          { id: "timer3", startTime: "00:00", endTime: "00:00" },
        ],
      },
    ],
    status: "inactive",
  },
]

export default function EditTimeZonePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [timeZone, setTimeZone] = useState<TimeZone | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data based on ID
    const foundTimeZone = initialTimeZonesData.find((tz) => tz.id === Number.parseInt(params.id))
    if (foundTimeZone) {
      setTimeZone(foundTimeZone)
    } else {
      toast({
        title: "Error",
        description: "Time Zone not found.",
        variant: "destructive",
      })
      router.push("/dashboard/time-zones") // Redirect if not found
    }
    setLoading(false)
  }, [params.id, router, toast])

  const handleSave = (data: TimeZone) => {
    // Simulate updating data in a backend/global state
    const index = initialTimeZonesData.findIndex((tz) => tz.id === data.id)
    if (index !== -1) {
      initialTimeZonesData[index] = data // In a real app, this would be an API call
    }

    toast({
      title: "Time Zone Updated!",
      description: `Time zone "${data.name}" has been updated.`,
    })
    router.push("/dashboard/time-zones")
  }

  const handleCancel = () => {
    router.push("/dashboard/time-zones")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <Skeleton className="h-8 w-64" />
            </h1>
            <p className="text-muted-foreground">
              <Skeleton className="h-4 w-96 mt-2" />
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <Card key={index} className="p-4">
                    <CardTitle className="text-sm font-medium mb-2 flex justify-between items-center">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-7 w-7 rounded-md" />
                    </CardTitle>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, timerIndex) => (
                        <div key={timerIndex} className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-9 w-full" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-9 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!timeZone) {
    return null // Should not happen if loading is handled correctly
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Time Zone</h1>
          <p className="text-muted-foreground">Modify the time schedule for &quot;{timeZone.name}&quot;.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Time Zone Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeZoneForm initialData={timeZone} onSave={handleSave} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}
