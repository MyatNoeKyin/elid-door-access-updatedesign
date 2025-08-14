"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, CreditCard, Users, Plus } from "lucide-react"
import { toast } from "sonner"

interface Department {
  id: string
  name: string
}

const mockDepartments: Department[] = [
  { id: "CORP", name: "Corporate" },
  { id: "TECH", name: "Technology" },
  { id: "FINA", name: "Finance" },
  { id: "MARK", name: "Marketing" },
  { id: "SALE", name: "Sales Department" },
  { id: "HUMA", name: "Human Resources" },
]

export default function BatchCardsPage() {
  const [step, setStep] = useState(1)
  const [startCardId, setStartCardId] = useState("")
  const [total, setTotal] = useState("")
  const [stepIncrement, setStepIncrement] = useState("1")
  const [addStaff, setAddStaff] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [previewCards, setPreviewCards] = useState<string[]>([])

  // Generate preview cards based on input
  const generatePreview = () => {
    if (!startCardId || !total) return []

    const cards: string[] = []
    const totalNum = Number.parseInt(total)
    const stepNum = Number.parseInt(stepIncrement)

    // Extract numeric part and prefix from start card ID
    const match = startCardId.match(/^(.*)(\d+)$/)
    if (!match) {
      // If no numeric part, just append numbers
      for (let i = 0; i < Math.min(totalNum, 5); i++) {
        cards.push(`${startCardId}${i * stepNum}`)
      }
    } else {
      const prefix = match[1]
      const startNum = Number.parseInt(match[2])
      const numLength = match[2].length

      for (let i = 0; i < Math.min(totalNum, 5); i++) {
        const newNum = startNum + i * stepNum
        const paddedNum = newNum.toString().padStart(numLength, "0")
        cards.push(`${prefix}${paddedNum}`)
      }
    }

    return cards
  }

  const handleNext = () => {
    if (!startCardId.trim()) {
      toast.error("Please enter a start card ID")
      return
    }
    if (!total.trim() || Number.parseInt(total) <= 0) {
      toast.error("Please enter a valid total quantity")
      return
    }
    if (addStaff && !selectedDepartment) {
      toast.error("Please select a department when adding staff")
      return
    }

    const cards = generateAllCards()
    setPreviewCards(cards)
    setStep(2)
  }

  const generateAllCards = () => {
    if (!startCardId || !total) return []

    const cards: string[] = []
    const totalNum = Number.parseInt(total)
    const stepNum = Number.parseInt(stepIncrement)

    const match = startCardId.match(/^(.*)(\d+)$/)
    if (!match) {
      for (let i = 0; i < totalNum; i++) {
        cards.push(`${startCardId}${i * stepNum}`)
      }
    } else {
      const prefix = match[1]
      const startNum = Number.parseInt(match[2])
      const numLength = match[2].length

      for (let i = 0; i < totalNum; i++) {
        const newNum = startNum + i * stepNum
        const paddedNum = newNum.toString().padStart(numLength, "0")
        cards.push(`${prefix}${paddedNum}`)
      }
    }

    return cards
  }

  const handleGenerate = () => {
    // Here you would typically send the data to your backend
    const selectedDept = mockDepartments.find((d) => d.id === selectedDepartment)

    toast.success(
      `Successfully generated ${previewCards.length} cards${
        addStaff ? ` with staff assignments to ${selectedDept?.name}` : ""
      }`,
    )

    // Reset form
    setStep(1)
    setStartCardId("")
    setTotal("")
    setStepIncrement("1")
    setAddStaff(false)
    setSelectedDepartment("")
    setPreviewCards([])
  }

  const handleBack = () => {
    setStep(1)
  }

  const previewSample = generatePreview()

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Preview Generated Cards</h1>
            <p className="text-muted-foreground">Review the cards before final generation</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{previewCards.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Start ID</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{startCardId}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Step</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stepIncrement}</div>
            </CardContent>
          </Card>
        </div>

        {addStaff && (
          <Card>
            <CardHeader>
              <CardTitle>Staff Assignment</CardTitle>
              <CardDescription>Cards will be assigned to staff in the selected department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{mockDepartments.find((d) => d.id === selectedDepartment)?.name}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Generated Card IDs</CardTitle>
            <CardDescription>All {previewCards.length} cards that will be created</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Index</TableHead>
                  <TableHead>Card ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewCards.map((cardId, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono">{cardId}</TableCell>
                    <TableCell>
                      <span className="text-green-600">Ready to Generate</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleBack}>
            Back to Configuration
          </Button>
          <Button onClick={handleGenerate}>Generate {previewCards.length} Cards</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Card by Batch</h1>
        <p className="text-muted-foreground">Generate multiple cards with sequential IDs</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Batch Card Configuration</CardTitle>
          <CardDescription>Configure the parameters for batch card generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="startCardId">Start Card ID</Label>
              <Input
                id="startCardId"
                placeholder="e.g., CARD001, EMP0001"
                value={startCardId}
                onChange={(e) => setStartCardId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                The starting card ID. Numeric parts will be incremented automatically.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Total (Quantity)</Label>
              <Input
                id="total"
                type="number"
                placeholder="e.g., 50"
                min="1"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Number of cards to generate.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="step">Step (Increment)</Label>
              <Input
                id="step"
                type="number"
                placeholder="1"
                min="1"
                value={stepIncrement}
                onChange={(e) => setStepIncrement(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Increment step for card ID numbers (default: 1).</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addStaff"
                  checked={addStaff}
                  onCheckedChange={(checked) => setAddStaff(checked as boolean)}
                />
                <Label htmlFor="addStaff">Add Staff</Label>
              </div>

              {addStaff && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="department">Choose Department</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Staff will be created and assigned to the selected department.
                  </p>
                </div>
              )}
            </div>
          </div>

          {previewSample.length > 0 && (
            <div className="space-y-2">
              <Label>Preview (First 5 cards)</Label>
              <div className="p-3 bg-muted rounded-md">
                <div className="space-y-1">
                  {previewSample.map((cardId, index) => (
                    <div key={index} className="font-mono text-sm">
                      {index + 1}. {cardId}
                    </div>
                  ))}
                  {Number.parseInt(total) > 5 && (
                    <div className="text-sm text-muted-foreground">... and {Number.parseInt(total) - 5} more cards</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
