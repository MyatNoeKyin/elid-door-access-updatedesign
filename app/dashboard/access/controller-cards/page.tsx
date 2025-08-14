"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, Play, Square, RefreshCw, Wifi, WifiOff, CreditCard } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Controller {
  id: string
  name: string
  ipAddress: string
  status: "online" | "offline" | "scanning"
  lastSeen: string
  cardsDetected: number
}

interface DetectedCard {
  id: string
  cardNumber: string
  facilityCode: string
  controllerId: string
  detectedAt: string
  status: "new" | "existing" | "assigned"
}

const controllers: Controller[] = [
  {
    id: "CTRL_001",
    name: "Main Entrance",
    ipAddress: "192.168.1.100",
    status: "online",
    lastSeen: "2024-01-15 16:45:23",
    cardsDetected: 0,
  },
  {
    id: "CTRL_002",
    name: "Parking Garage",
    ipAddress: "192.168.1.101",
    status: "scanning",
    lastSeen: "2024-01-15 16:45:20",
    cardsDetected: 3,
  },
  {
    id: "CTRL_003",
    name: "Server Room",
    ipAddress: "192.168.1.102",
    status: "offline",
    lastSeen: "2024-01-15 14:30:15",
    cardsDetected: 0,
  },
]

const initialDetectedCards: DetectedCard[] = [
  {
    id: "1",
    cardNumber: "12345",
    facilityCode: "123",
    controllerId: "CTRL_002",
    detectedAt: "2024-01-15 16:44:30",
    status: "new",
  },
  {
    id: "2",
    cardNumber: "12346",
    facilityCode: "123",
    controllerId: "CTRL_002",
    detectedAt: "2024-01-15 16:43:15",
    status: "existing",
  },
  {
    id: "3",
    cardNumber: "12347",
    facilityCode: "123",
    controllerId: "CTRL_002",
    detectedAt: "2024-01-15 16:42:45",
    status: "assigned",
  },
  {
    id: "4",
    cardNumber: "12348",
    facilityCode: "123",
    controllerId: "CTRL_001",
    detectedAt: "2024-01-15 16:46:00",
    status: "new",
  },
  {
    id: "5",
    cardNumber: "12349",
    facilityCode: "123",
    controllerId: "CTRL_001",
    detectedAt: "2024-01-15 16:46:10",
    status: "new",
  },
  {
    id: "6",
    cardNumber: "12350",
    facilityCode: "123",
    controllerId: "CTRL_002",
    detectedAt: "2024-01-15 16:46:20",
    status: "existing",
  },
  {
    id: "7",
    cardNumber: "12351",
    facilityCode: "123",
    controllerId: "CTRL_001",
    detectedAt: "2024-01-15 16:46:30",
    status: "new",
  },
]

export default function ControllerCardsPage() {
  const [selectedController, setSelectedController] = useState<string>("")
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [scanDuration, setScanDuration] = useState("30")
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>(initialDetectedCards)
  const [selectedCards, setSelectedCards] = useState<string[]>([])

  const startScan = () => {
    if (!selectedController) return

    setIsScanning(true)
    setScanProgress(0)

    // Simulate scanning progress
    const duration = Number.parseInt(scanDuration) * 1000
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 100 / (duration / 1000)
      })
    }, 1000)
  }

  const stopScan = () => {
    setIsScanning(false)
    setScanProgress(0)
  }

  const getControllerStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-600" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-600" />
      case "scanning":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Cpu className="h-4 w-4 text-gray-600" />
    }
  }

  const getControllerStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "scanning":
        return <Badge className="bg-blue-100 text-blue-800">Scanning</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getCardStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>
      case "existing":
        return <Badge className="bg-yellow-100 text-yellow-800">Existing</Badge>
      case "assigned":
        return <Badge className="bg-green-100 text-green-800">Assigned</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleSelectAllCards = (checked: boolean) => {
    if (checked) {
      setSelectedCards(detectedCards.map((card) => card.id))
    } else {
      setSelectedCards([])
    }
  }

  const handleSelectCard = (cardId: string, checked: boolean) => {
    if (checked) {
      setSelectedCards((prev) => [...prev, cardId])
    } else {
      setSelectedCards((prev) => prev.filter((id) => id !== cardId))
    }
  }

  const handleDeleteSelectedCards = () => {
    setDetectedCards((prev) => prev.filter((card) => !selectedCards.includes(card.id)))
    setSelectedCards([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Cards by Controller</h1>
        <p className="text-muted-foreground">
          Scan and detect cards directly from access control controllers in real-time
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Controllers</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controllers.filter((c) => c.status === "online").length}</div>
            <p className="text-xs text-muted-foreground">Ready to scan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Detected</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detectedCards.length}</div>
            <p className="text-xs text-muted-foreground">This session</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Cards</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">New</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{detectedCards.filter((c) => c.status === "new").length}</div>
            <p className="text-xs text-muted-foreground">Need assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controllers.filter((c) => c.status === "scanning").length}</div>
            <p className="text-xs text-muted-foreground">Currently scanning</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scan" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scan">Card Scanning</TabsTrigger>
          <TabsTrigger value="controllers">Controller Status</TabsTrigger>
          <TabsTrigger value="detected">Detected Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>Card Detection Scanner</span>
              </CardTitle>
              <CardDescription>
                (1) Choose a controller (associated with a door reader) to scan. (2) Click [Start Scanning] and present
                the card at the selected door reader. All detected cards will be stored as temporary cards in the system
                until assigned to a user.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="controller-select">Select Controller</Label>
                  <Select value={selectedController} onValueChange={setSelectedController}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a controller" />
                    </SelectTrigger>
                    <SelectContent>
                      {controllers
                        .filter((c) => c.status === "online")
                        .map((controller) => (
                          <SelectItem key={controller.id} value={controller.id}>
                            {controller.name} ({controller.ipAddress})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scan-duration">Scan Duration (seconds)</Label>
                  <Select value={scanDuration} onValueChange={setScanDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="120">2 minutes</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isScanning && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm font-medium">Scanning for cards...</span>
                    </div>
                    <span className="text-sm text-blue-600">{Math.round(scanProgress)}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-xs text-blue-600">
                    Present cards to the selected controller to detect them. Detected cards will be stored as temporary
                    cards.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <Button onClick={startScan} disabled={!selectedController || isScanning} className="flex-1">
                  <Play className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
                <Button variant="outline" onClick={stopScan} disabled={!isScanning} className="flex-1 bg-transparent">
                  <Square className="mr-2 h-4 w-4" />
                  Stop Scanning
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controllers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cpu className="h-5 w-5" />
                <span>Controller Status</span>
              </CardTitle>
              <CardDescription>Monitor the status and connectivity of all access controllers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Controller</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cards Detected</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {controllers.map((controller) => (
                    <TableRow key={controller.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getControllerStatusIcon(controller.status)}
                          <div>
                            <div>{controller.name}</div>
                            <div className="text-sm text-gray-500">{controller.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{controller.ipAddress}</code>
                      </TableCell>
                      <TableCell>{getControllerStatusBadge(controller.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{controller.cardsDetected}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{controller.lastSeen}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Detected Cards</span>
              </CardTitle>
              <CardDescription>Cards that have been detected during scanning sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={selectedCards.length === 0}>
                      Delete Selected Cards ({selectedCards.length})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the selected temporary cards.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelectedCards}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={detectedCards.length > 0 && selectedCards.length === detectedCards.length}
                        onCheckedChange={(checked) => handleSelectAllCards(checked as boolean)}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Card Number</TableHead>
                    <TableHead>Facility Code</TableHead>
                    <TableHead>Controller</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detected At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detectedCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCards.includes(card.id)}
                          onCheckedChange={(checked) => handleSelectCard(card.id, checked as boolean)}
                          aria-label={`Select card ${card.cardNumber}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <code className="bg-gray-100 px-2 py-1 rounded">{card.cardNumber}</code>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded">{card.facilityCode}</code>
                      </TableCell>
                      <TableCell>{controllers.find((c) => c.id === card.controllerId)?.name}</TableCell>
                      <TableCell>{getCardStatusBadge(card.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{card.detectedAt}</TableCell>
                      <TableCell>
                        {card.status === "new" && (
                          <Button size="sm" variant="outline">
                            Assign to User
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
