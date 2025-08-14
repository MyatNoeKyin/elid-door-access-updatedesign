"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DoorFormProps {
  onSuccess?: () => void
  doorData?: any // For edit mode
  mode?: "create" | "edit"
}

export default function DoorForm({ onSuccess, doorData, mode = "create" }: DoorFormProps = {}) {
  const [securityPin, setSecurityPin] = useState(doorData?.securityPin || false)
  const [releaseTime, setReleaseTime] = useState(doorData?.releaseTime || 5)
  const [doorOpenTimeout, setDoorOpenTimeout] = useState(doorData?.doorOpenTimeout || releaseTime * 2)

  // Update doorOpenTimeout when releaseTime changes
  const handleReleaseTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReleaseTime = Number.parseInt(e.target.value)
    setReleaseTime(newReleaseTime)
    setDoorOpenTimeout(newReleaseTime * 2)
  }

  return (
    <Tabs defaultValue="door-settings">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="door-settings">Door Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="door-settings" className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doorName">Door Name *</Label>
            <Input id="doorName" placeholder="Enter door name" defaultValue={doorData?.name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="controller">Controller *</Label>
            <Select defaultValue={doorData?.controller || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select controller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CTRL-001">Controller A</SelectItem>
                <SelectItem value="CTRL-002">Controller B</SelectItem>
                <SelectItem value="CTRL-003">Controller C</SelectItem>
                <SelectItem value="CTRL-004">Controller D</SelectItem>
                <SelectItem value="CTRL-005">Controller E</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doorNo">Door No. *</Label>
            <Input
              id="doorNo"
              type="number"
              placeholder="Enter door number on controller"
              defaultValue={doorData?.doorNo || ""}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workMode">Work Mode *</Label>
            <Select defaultValue={doorData?.workMode || "Auto Control"}>
              <SelectTrigger>
                <SelectValue placeholder="Select work mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auto Control">Auto Control</SelectItem>
                <SelectItem value="Always Open">Always Open</SelectItem>
                <SelectItem value="Always Close">Always Close</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="releaseTime">Release Time (seconds)</Label>
            <Input
              id="releaseTime"
              type="number"
              placeholder="Enter release time (1-255s)"
              value={releaseTime}
              onChange={handleReleaseTimeChange}
              min="1"
              max="255"
            />
            <p className="text-xs text-muted-foreground">Default: 5 seconds. Range: 1 to 255 seconds.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="doorOpenTimeout">Door Open Timeout (seconds)</Label>
            <Input
              id="doorOpenTimeout"
              type="number"
              placeholder="Enter door open timeout (1-255s)"
              value={doorOpenTimeout}
              onChange={(e) => setDoorOpenTimeout(Number.parseInt(e.target.value))}
              min="1"
              max="255"
            />
            <p className="text-xs text-muted-foreground">Default: 2 times of Release Time. Range: 1 to 255 seconds.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="autoOpenTimezone">Auto Open Timezone Table</Label>
            <Select defaultValue={doorData?.autoOpenTimezone || "[0 Stop]"}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="[0 Stop]">[0 Stop] (Disabled)</SelectItem>
                <SelectItem value="Office Hours">Office Hours</SelectItem>
                <SelectItem value="24/7">24/7</SelectItem>
                <SelectItem value="Weekdays">Weekdays</SelectItem>
                <SelectItem value="Custom Schedule">Custom Schedule</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Door will be open automatically during a valid Timezone period.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pinDisableTimezone">PIN Disable Timezone Table</Label>
            <Select defaultValue={doorData?.pinDisableTimezone || "[31 All Pass]"}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="[31 All Pass]">[31 All Pass]</SelectItem>
                <SelectItem value="Night Shift">Night Shift</SelectItem>
                <SelectItem value="Maintenance Window">Maintenance Window</SelectItem>
                <SelectItem value="Holidays">Holidays</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Only card but without PIN is needed to open door during this Timezone period.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alarmPriority">Alarm Priority</Label>
            <Select defaultValue={doorData?.alarmPriority || "Medium"}>
              <SelectTrigger>
                <SelectValue placeholder="Select alarm priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <Label>Security PIN</Label>
              <p className="text-xs text-slate-500">Enable emergency override PIN</p>
            </div>
            <Switch checked={securityPin} onCheckedChange={setSecurityPin} />
          </div>
        </div>
      </TabsContent>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            console.log(`${mode === "create" ? "Creating" : "Updating"} door...`)
            onSuccess?.()
          }}
        >
          {mode === "create" ? "Create Door" : "Update Door"}
        </Button>
      </div>
    </Tabs>
  )
}
