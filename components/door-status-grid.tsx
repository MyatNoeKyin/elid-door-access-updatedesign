import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function DoorStatusGrid() {
  const doors = [
    { id: 1, name: "Main Entrance", status: "normal", mode: "Auto" },
    { id: 2, name: "Server Room", status: "normal", mode: "Always Closed" },
    { id: 3, name: "Office 101", status: "normal", mode: "Auto" },
    { id: 4, name: "Office 102", status: "normal", mode: "Auto" },
    { id: 5, name: "Conference Room", status: "open", mode: "Always Open" },
    { id: 6, name: "R&D Lab", status: "normal", mode: "Auto" },
    { id: 7, name: "Storage Room", status: "alarm", mode: "Auto" },
    { id: 8, name: "Executive Office", status: "normal", mode: "Auto" },
    { id: 9, name: "Break Room", status: "normal", mode: "Auto" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {doors.map((door) => (
        <div
          key={door.id}
          className={cn(
            "p-3 rounded-md border",
            door.status === "normal" && "border-slate-200 bg-white",
            door.status === "open" && "border-blue-200 bg-blue-50",
            door.status === "alarm" && "border-red-200 bg-red-50",
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{door.name}</h4>
              <p className="text-xs text-slate-500">Mode: {door.mode}</p>
            </div>
            <Badge
              className={cn(
                door.status === "normal" && "bg-green-500",
                door.status === "open" && "bg-blue-500",
                door.status === "alarm" && "bg-red-500",
              )}
            >
              {door.status === "normal" && "Secured"}
              {door.status === "open" && "Open"}
              {door.status === "alarm" && "Alarm"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
