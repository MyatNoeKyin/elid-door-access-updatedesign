import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Users, Building, DoorClosed, AlertTriangle, Clock, ShieldAlert } from "lucide-react"
import RecentActivityTable from "@/components/recent-activity-table"
import DoorStatusGrid from "@/components/door-status-grid"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Super Admin. Here's an overview of your system.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button variant="outline">Export Reports</Button>
          <Button>System Check</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doors</CardTitle>
            <DoorClosed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground">All doors operational</p>
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
              <span className="text-red-500">+1 high priority</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert className="border-amber-500 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-800">System Notification</AlertTitle>
        <AlertDescription className="text-amber-700">
          Scheduled maintenance tonight at 2:00 AM. Some services may be temporarily unavailable.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest access events across all doors</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityTable />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Door Status</CardTitle>
            <CardDescription>Real-time status of all access points</CardDescription>
          </CardHeader>
          <CardContent>
            <DoorStatusGrid />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="access-attempts">Access Attempts</TabsTrigger>
          <TabsTrigger value="system-events">System Events</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center p-4 rounded-lg border border-red-200 bg-red-50">
              <ShieldAlert className="h-5 w-5 text-red-500 mr-3" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-red-800">Door Forced Open</h4>
                  <Badge variant="destructive">High</Badge>
                </div>
                <p className="text-sm text-red-700">Main Entrance - 10 minutes ago</p>
              </div>
              <Button size="sm" variant="outline" className="ml-2">
                View
              </Button>
            </div>
            <div className="flex items-center p-4 rounded-lg border border-amber-200 bg-amber-50">
              <Clock className="h-5 w-5 text-amber-500 mr-3" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-amber-800">Door Held Open</h4>
                  <Badge variant="outline" className="text-amber-500 border-amber-500">
                    Medium
                  </Badge>
                </div>
                <p className="text-sm text-amber-700">Server Room - 25 minutes ago</p>
              </div>
              <Button size="sm" variant="outline" className="ml-2">
                View
              </Button>
            </div>
            <div className="flex items-center p-4 rounded-lg border border-amber-200 bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-amber-800">Multiple Failed Access Attempts</h4>
                  <Badge variant="outline" className="text-amber-500 border-amber-500">
                    Medium
                  </Badge>
                </div>
                <p className="text-sm text-amber-700">R&D Lab - 42 minutes ago</p>
              </div>
              <Button size="sm" variant="outline" className="ml-2">
                View
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="access-attempts" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Access attempts data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system-events" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <div className="text-center p-6">
                <p className="text-muted-foreground">System events data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
