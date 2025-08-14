import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

export default function RecentActivityTable() {
  const activities = [
    {
      id: 1,
      user: "John Smith",
      department: "IT",
      door: "Main Entrance",
      time: "2 minutes ago",
      status: "success",
      method: "Card",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      department: "HR",
      door: "Office 201",
      time: "15 minutes ago",
      status: "success",
      method: "Fingerprint",
    },
    {
      id: 3,
      user: "Michael Brown",
      department: "Finance",
      door: "Server Room",
      time: "32 minutes ago",
      status: "failed",
      method: "PIN",
    },
    {
      id: 4,
      user: "Emily Davis",
      department: "Marketing",
      door: "Conference Room",
      time: "1 hour ago",
      status: "success",
      method: "Card",
    },
    {
      id: 5,
      user: "Robert Wilson",
      department: "R&D",
      door: "Lab Access",
      time: "1 hour ago",
      status: "success",
      method: "Fingerprint",
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left font-medium p-2 pl-0">User</th>
            <th className="text-left font-medium p-2">Door</th>
            <th className="text-left font-medium p-2">Time</th>
            <th className="text-left font-medium p-2">Method</th>
            <th className="text-left font-medium p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 pl-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">
                      {activity.user
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-xs text-slate-500">{activity.department}</p>
                  </div>
                </div>
              </td>
              <td className="py-2">{activity.door}</td>
              <td className="py-2">{activity.time}</td>
              <td className="py-2">
                <Badge variant="outline">{activity.method}</Badge>
              </td>
              <td className="py-2">
                {activity.status === "success" ? (
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
  )
}
