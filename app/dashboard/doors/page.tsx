"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Plus, Lock, DoorClosed, AlertTriangle, Settings } from "lucide-react"
import DoorTable from "@/components/door-table"
import DoorForm from "@/components/door-form"

export default function DoorsPage() {
  const [isAddDoorOpen, setIsAddDoorOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Door Configuration</h1>
          <p className="text-muted-foreground">Manage and configure access control doors for your installations</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Bulk Configure
          </Button>
          <Dialog open={isAddDoorOpen} onOpenChange={setIsAddDoorOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Door
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Door</DialogTitle>
              </DialogHeader>
              <DoorForm onSuccess={() => setIsAddDoorOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doors</CardTitle>
            <DoorClosed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground">+5 installed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doors</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82</div>
            <p className="text-xs text-muted-foreground">95% operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Installation</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting installation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Required</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500">2 high priority</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-doors">
        <TabsList>
          <TabsTrigger value="all-doors">All Doors</TabsTrigger>
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="pending">Pending Installation</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="all-doors" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Door Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search doors by name, controller, or area..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export List
                  </Button>
                  <Button variant="outline" size="sm">
                    Import Doors
                  </Button>
                </div>
              </div>
              <DoorTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="installed" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Installed doors will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Doors pending installation will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Doors requiring maintenance will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
