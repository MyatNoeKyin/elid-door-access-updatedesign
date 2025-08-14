"use client"

import { useState, useCallback, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface TimeSlot {
  id: string // e.g., "timer1", "timer2", "timer3"
  startTime: string
  endTime: string
}

interface DailySchedule {
  day: string // e.g., "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
  timers: TimeSlot[] // Always 3 timers
}

interface TimeZoneFormData {
  id?: number // Optional for new time zones
  name: string
  description: string
  dailySchedules: DailySchedule[]
  status?: "active" | "inactive"
}

interface TimeZoneFormProps {
  initialData?: TimeZoneFormData
  onSave: (data: TimeZoneFormData) => void
  onCancel: () => void
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const createDefaultDailySchedules = (): DailySchedule[] => {
  return daysOfWeek.map((day) => ({
    day,
    timers: [
      { id: "timer1", startTime: "00:00", endTime: "00:00" },
      { id: "timer2", startTime: "00:00", endTime: "00:00" },
      { id: "timer3", startTime: "00:00", endTime: "00:00" },
    ],
  }))
}

export default function TimeZoneForm({ initialData, onSave, onCancel }: TimeZoneFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [dailySchedules, setDailySchedules] = useState<DailySchedule[]>(
    initialData?.dailySchedules
      ? JSON.parse(JSON.stringify(initialData.dailySchedules))
      : createDefaultDailySchedules(),
  )
  const { toast } = useToast()

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setDailySchedules(JSON.parse(JSON.stringify(initialData.dailySchedules)))
    } else {
      setName("")
      setDescription("")
      setDailySchedules(createDefaultDailySchedules())
    }
  }, [initialData])

  const handleScheduleChange = useCallback(
    (day: string, timerId: string, field: "startTime" | "endTime", value: string) => {
      setDailySchedules((prevSchedules) =>
        prevSchedules.map((daily) =>
          daily.day === day
            ? {
                ...daily,
                timers: daily.timers.map((timer) => (timer.id === timerId ? { ...timer, [field]: value } : timer)),
              }
            : daily,
        ),
      )
    },
    [],
  )

  const handleCopyTimers = useCallback(
    (sourceDay: string, targetDays: string[]) => {
      const sourceSchedule = dailySchedules.find((s) => s.day === sourceDay)
      if (!sourceSchedule) return

      setDailySchedules((prevSchedules) =>
        prevSchedules.map((daily) =>
          targetDays.includes(daily.day)
            ? { ...daily, timers: JSON.parse(JSON.stringify(sourceSchedule.timers)) } // Deep copy
            : daily,
        ),
      )
      toast({
        title: "Timers Copied!",
        description: `Copied ${sourceDay}'s timers to selected days.`,
      })
    },
    [dailySchedules, toast],
  )

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Time Zone Name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    // Filter out empty timers (00:00 - 00:00) if desired, or keep them
    const cleanedSchedules = dailySchedules.map((daily) => ({
      ...daily,
      timers: daily.timers.filter((timer) => timer.startTime !== "00:00" || timer.endTime !== "00:00"),
    }))

    onSave({
      id: initialData?.id,
      name,
      description,
      dailySchedules: cleanedSchedules,
      status: initialData?.status || "active", // Preserve status or default to active
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tz-name">Time Zone Name</Label>
          <Input
            id="tz-name"
            placeholder="Enter time zone name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tz-description">Description</Label>
          <Textarea
            id="tz-description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-semibold">Daily Schedules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dailySchedules.map((daily) => (
            <Card key={daily.day} className="p-4">
              <CardTitle className="text-sm font-medium mb-2 flex justify-between items-center">
                {daily.day}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy Timers</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1 text-sm font-medium text-muted-foreground">Copy to:</div>
                    {daysOfWeek
                      .filter((d) => d !== daily.day)
                      .map((targetDay) => (
                        <DropdownMenuItem key={targetDay} onSelect={() => handleCopyTimers(daily.day, [targetDay])}>
                          {targetDay}
                        </DropdownMenuItem>
                      ))}
                    <DropdownMenuItem
                      onSelect={() =>
                        handleCopyTimers(
                          daily.day,
                          daysOfWeek.filter((d) => d !== daily.day),
                        )
                      }
                    >
                      All other days
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
              <div className="space-y-3">
                {daily.timers.map((timer, index) => (
                  <div key={timer.id} className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor={`${daily.day}-${timer.id}-start`} className="text-xs">
                        Timer {index + 1} Start
                      </Label>
                      <Input
                        id={`${daily.day}-${timer.id}-start`}
                        type="time"
                        value={timer.startTime}
                        onChange={(e) => handleScheduleChange(daily.day, timer.id, "startTime", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`${daily.day}-${timer.id}-end`} className="text-xs">
                        Timer {index + 1} End
                      </Label>
                      <Input
                        id={`${daily.day}-${timer.id}-end`}
                        type="time"
                        value={timer.endTime}
                        onChange={(e) => handleScheduleChange(daily.day, timer.id, "endTime", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create Time Zone"}</Button>
      </div>
    </div>
  )
}
