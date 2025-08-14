"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Shield, Eye, FileText, User, Clock, AlertTriangle } from "lucide-react"

export default function SecurityAuditPage() {
  const loginHistory = [
    {
      id: 1,
      user: "John Smith",
      role: "System Manager",
      loginTime: "2025-06-19 14:30:15",
      ipAddress: "192.168.1.100",
      status: "success",
      location: "Office Network",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      role: "Manager",
      loginTime: "2025-06-19 09:15:22",
      ipAddress: "192.168.1.105",
      status: "success",
      location: "Office Network",
    },
    {
      id: 3,
      user: "Unknown User",
      role: "N/A",
      loginTime: "2025-06-19 02:45:33",
      ipAddress: "203.0.113.45",
      status: "failed",
      location: "External",
    },
  ]

  const operatorActions = [
    {
      id: 1,
      operator: "John Smith",
      action: "Created new user",
      target: "Emily Davis",
      timestamp: "2025-06-19 14:25:00",
      details: "Added user to HR department with standard access",
    },
    {
      id: 2,
      operator: "Sarah Johnson",
      action: "Modified access group",
      target: "IT Department Group",
      timestamp: "2025-06-19 13:45:00",
      details: "Added server room access to IT department group",
    },
    {
      id: 3,
      operator: "Mike Wilson",
      action: "Door unlock override",
      target: "Emergency Exit",
      timestamp: "2025-06-19 12:30:00",
      details: "Emergency unlock due to fire drill",
    },
  ]

  const securitySettings = {
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    pinLength: 4,
    pinRequireUnique: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security & Audit</h1>
          <p className="text-muted-foreground">Monitor security events and manage audit trails</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Generate Report
          </Button>
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" /> Security Scan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Attempts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginHistory.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginHistory.filter((l) => l.status === "failed").length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">Security alerts</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operator Actions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operatorActions.length}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">Excellent</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="login-history">
        <TabsList>
          <TabsTrigger value="login-history">Login History</TabsTrigger>
          <TabsTrigger value="operator-actions">Operator Actions</TabsTrigger>
          <TabsTrigger value="security-settings">Security Settings</TabsTrigger>
          <TabsTrigger value="audit-reports">Audit Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="login-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search login history..." className="pl-8" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left font-medium p-2 pl-0">User</th>
                      <th className="text-left font-medium p-2">Role</th>
                      <th className="text-left font-medium p-2">Login Time</th>
                      <th className="text-left font-medium p-2">IP Address</th>
                      <th className="text-left font-medium p-2">Location</th>
                      <th className="text-left font-medium p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginHistory.map((login) => (
                      <tr key={login.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 pl-0">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {login.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{login.user}</span>
                          </div>
                        </td>
                        <td className="py-3">{login.role}</td>
                        <td className="py-3 font-mono text-xs">{login.loginTime}</td>
                        <td className="py-3 font-mono text-xs">{login.ipAddress}</td>
                        <td className="py-3">{login.location}</td>
                        <td className="py-3">
                          <Badge
                            variant={login.status === "success" ? "success" : "destructive"}
                            className={login.status === "success" ? "bg-green-500" : "bg-red-500"}
                          >
                            {login.status.charAt(0).toUpperCase() + login.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operator-actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operator Action Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operatorActions.map((action) => (
                  <div key={action.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {action.operator
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{action.operator}</span>
                      </div>
                      <span className="text-xs text-slate-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {action.timestamp}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{action.action}</span>
                        {action.target && <span className="text-slate-600"> → {action.target}</span>}
                      </p>
                      <p className="text-xs text-slate-500">{action.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-settings" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-length">Minimum Length</Label>
                  <Input id="min-length" type="number" defaultValue={securitySettings.passwordMinLength} />
                </div>
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked={securitySettings.passwordRequireSpecial} />
                      <span className="text-sm">Require special characters</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked={securitySettings.passwordRequireNumbers} />
                      <span className="text-sm">Require numbers</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked={securitySettings.passwordRequireUppercase} />
                      <span className="text-sm">Require uppercase letters</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PIN Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin-length">PIN Length</Label>
                  <Input id="pin-length" type="number" defaultValue={securitySettings.pinLength} />
                </div>
                <div className="space-y-2">
                  <Label>PIN Requirements</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked={securitySettings.pinRequireUnique} />
                      <span className="text-sm">Require unique PINs</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue={securitySettings.sessionTimeout} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-attempts">Max Login Attempts</Label>
                  <Input id="max-attempts" type="number" defaultValue={securitySettings.maxLoginAttempts} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                  <Input id="lockout-duration" type="number" defaultValue={securitySettings.lockoutDuration} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Force Password Reset for All Users
                </Button>
                <Button className="w-full" variant="outline">
                  Clear All Active Sessions
                </Button>
                <Button className="w-full" variant="outline">
                  Generate Security Report
                </Button>
                <Button className="w-full" variant="outline">
                  Export Audit Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit-reports" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Audit reports and compliance data will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
