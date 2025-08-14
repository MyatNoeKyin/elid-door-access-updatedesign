"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, Download, Users, FileText, CheckCircle, XCircle, Clock } from "lucide-react"

export default function BulkOperationsPage() {
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const bulkJobs = [
    {
      id: 1,
      type: "User Import",
      status: "completed",
      total: 150,
      processed: 150,
      successful: 148,
      failed: 2,
      startTime: "2025-06-19 14:30",
      endTime: "2025-06-19 14:35",
    },
    {
      id: 2,
      type: "Access Assignment",
      status: "in_progress",
      total: 75,
      processed: 45,
      successful: 45,
      failed: 0,
      startTime: "2025-06-19 15:00",
      endTime: null,
    },
    {
      id: 3,
      type: "Credential Export",
      status: "pending",
      total: 200,
      processed: 0,
      successful: 0,
      failed: 0,
      startTime: null,
      endTime: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Operations</h1>
          <p className="text-muted-foreground">Import users, assign access, and manage bulk operations</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Template
          </Button>
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" /> Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="import-type">Import Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select import type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="credentials">Credentials</SelectItem>
                      <SelectItem value="access-rules">Access Rules</SelectItem>
                      <SelectItem value="departments">Departments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">CSV File</Label>
                  <Input id="file-upload" type="file" accept=".csv" />
                  <p className="text-xs text-muted-foreground">Upload a CSV file with the required format</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validation">Validation Options</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Validate data before import</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Skip duplicate entries</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Send notification on completion</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsImportOpen(false)}>Start Import</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bulkJobs.length}</div>
            <p className="text-xs text-muted-foreground">Bulk operations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bulkJobs.filter((j) => j.status === "in_progress").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bulkJobs.filter((j) => j.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">Overall success rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">Bulk Jobs</TabsTrigger>
          <TabsTrigger value="import">Import Users</TabsTrigger>
          <TabsTrigger value="assign">Assign Access</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operation Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkJobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{job.type}</h4>
                        <p className="text-sm text-slate-500">
                          {job.startTime && `Started: ${job.startTime}`}
                          {job.endTime && ` | Completed: ${job.endTime}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          job.status === "completed"
                            ? "success"
                            : job.status === "in_progress"
                              ? "outline"
                              : "secondary"
                        }
                        className={
                          job.status === "completed"
                            ? "bg-green-500"
                            : job.status === "in_progress"
                              ? "text-blue-500 border-blue-500"
                              : "bg-slate-500"
                        }
                      >
                        {job.status === "in_progress"
                          ? "In Progress"
                          : job.status === "completed"
                            ? "Completed"
                            : "Pending"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {job.processed}/{job.total}
                        </span>
                      </div>
                      <Progress value={(job.processed / job.total) * 100} className="h-2" />

                      <div className="flex justify-between text-xs text-slate-500">
                        <span className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {job.successful} successful
                        </span>
                        {job.failed > 0 && (
                          <span className="flex items-center">
                            <XCircle className="h-3 w-3 mr-1 text-red-500" />
                            {job.failed} failed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600">Drop your CSV file here or click to browse</p>
                  <Button variant="outline" className="mt-2">
                    Choose File
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Access Group</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default access group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Employee</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="visitor">Visitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Access Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Users</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="department">By Department</SelectItem>
                        <SelectItem value="access-group">By Access Group</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Group</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it-dept">IT Department</SelectItem>
                        <SelectItem value="hr-dept">HR Department</SelectItem>
                        <SelectItem value="all-users">All Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Rules to Assign</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                    {["Main Entrance", "Office Areas", "Conference Rooms", "Break Room"].map((door) => (
                      <label key={door} className="flex items-center space-x-2">
                        <input type="checkbox" />
                        <span className="text-sm">{door}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full">Start Bulk Assignment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data to export" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="users">All Users</SelectItem>
                      <SelectItem value="access-logs">Access Logs</SelectItem>
                      <SelectItem value="doors">Door Configuration</SelectItem>
                      <SelectItem value="departments">Departments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="From date" />
                    <Input type="date" placeholder="To date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
