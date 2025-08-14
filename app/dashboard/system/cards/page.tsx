"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Shield, Clock, AlertTriangle } from "lucide-react"

export default function CardSettingsPage() {
  const [cardFormat, setCardFormat] = useState("26bit")
  const [facilityCode, setFacilityCode] = useState("123")
  const [duressEnabled, setDuressEnabled] = useState(false)
  const [antiPassbackEnabled, setAntiPassbackEnabled] = useState(true)
  const [tempCardExpiry, setTempCardExpiry] = useState("24")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Card Settings</h1>
        <p className="text-muted-foreground">
          Configure card formats, security settings, and temporary card management
        </p>
      </div>

      <Tabs defaultValue="format" className="space-y-4">
        <TabsList>
          <TabsTrigger value="format">Card Format</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="temporary">Temporary Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="format" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Card Format Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure the card format and encoding settings for your access control system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="card-format">Card Format</Label>
                  <Select value={cardFormat} onValueChange={setCardFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="26bit">26-bit Wiegand</SelectItem>
                      <SelectItem value="34bit">34-bit Wiegand</SelectItem>
                      <SelectItem value="37bit">37-bit Wiegand</SelectItem>
                      <SelectItem value="custom">Custom Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility-code">Facility Code</Label>
                  <Input
                    id="facility-code"
                    value={facilityCode}
                    onChange={(e) => setFacilityCode(e.target.value)}
                    placeholder="Enter facility code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Bits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">26</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Facility Bits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Card Number Bits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">16</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Format Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>26-bit Wiegand Format:</strong>
                    </p>
                    <p>• 1 parity bit + 8 facility code bits + 16 card number bits + 1 parity bit</p>
                    <p>• Range: 0-255 (facility), 0-65535 (card number)</p>
                    <p>• Most common format for access control systems</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Configure security features and access control policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Duress Cards</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable special cards that trigger silent alarms when used
                  </p>
                </div>
                <Switch checked={duressEnabled} onCheckedChange={setDuressEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anti-Passback</Label>
                  <p className="text-sm text-muted-foreground">Prevent users from passing their card to others</p>
                </div>
                <Switch checked={antiPassbackEnabled} onCheckedChange={setAntiPassbackEnabled} />
              </div>

              {duressEnabled && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span>Duress Card Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duress Facility Code</Label>
                        <Input placeholder="Enter duress facility code" />
                      </div>
                      <div className="space-y-2">
                        <Label>Alert Recipients</Label>
                        <Input placeholder="security@company.com" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temporary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Temporary Card Management</span>
              </CardTitle>
              <CardDescription>Configure settings for temporary and visitor cards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="temp-expiry">Default Expiry (hours)</Label>
                  <Input
                    id="temp-expiry"
                    value={tempCardExpiry}
                    onChange={(e) => setTempCardExpiry(e.target.value)}
                    placeholder="24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp-range">Temporary Card Range</Label>
                  <Input id="temp-range" placeholder="90000-99999" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Active Temp Cards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23</div>
                    <Badge variant="secondary" className="mt-1">
                      Currently active
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Expired Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <Badge variant="destructive" className="mt-1">
                      Need cleanup
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Available Cards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">9,977</div>
                    <Badge variant="outline" className="mt-1">
                      Ready to assign
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="flex space-x-4">
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Cleanup Expired Cards
                </Button>
                <Button variant="outline">Export Temp Card Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
