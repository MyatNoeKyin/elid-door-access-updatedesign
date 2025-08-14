"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Fingerprint, CreditCard, Key, User, Building, Calendar, Plus, Trash2, Scan, FileText } from "lucide-react"

interface UserFormProps {
  onStepChange?: (step: number) => void
  currentStep?: number
  onSuccess?: () => void
}

export default function UserForm({ onStepChange, currentStep = 1, onSuccess }: UserFormProps = {}) {
  const [step, setStep] = useState(currentStep)
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    displayName: "",
    department: "",
    userPin: "",
    validFrom: "",
    validTo: "",
    fingerprintEnabled: false,
    cardEnabled: false,
    directoryCode: "",
    phoneNumber: "",
    timezoneTable: "",
    cards: [] as string[],
    accessGroups: [] as string[],
    individualDoors: [] as any[],
  })

  const departments = [
    { id: "IT001", name: "Information Technology", parent: null },
    { id: "HR001", name: "Human Resources", parent: null },
    { id: "FIN001", name: "Finance", parent: null },
    { id: "MKT001", name: "Marketing", parent: null },
    { id: "RD001", name: "Research & Development", parent: null },
    { id: "IT002", name: "Software Development", parent: "IT001" },
    { id: "IT003", name: "Network Administration", parent: "IT001" },
  ]

  const accessGroups = [
    { id: "STD001", name: "Standard Employee", doors: 8, users: 145 },
    { id: "MGT001", name: "Management", doors: 15, users: 23 },
    { id: "IT001", name: "IT Department", doors: 12, users: 31 },
    { id: "EXE001", name: "Executive", doors: 20, users: 8 },
    { id: "SEC001", name: "Security Personnel", doors: 25, users: 12 },
  ]

  const doors = [
    { id: "DOOR001", name: "Main Entrance", area: "Lobby" },
    { id: "DOOR002", name: "Office Area A", area: "Floor 1" },
    { id: "DOOR003", name: "Office Area B", area: "Floor 1" },
    { id: "DOOR004", name: "Conference Room", area: "Floor 1" },
    { id: "DOOR005", name: "Server Room", area: "Floor 1" },
    { id: "DOOR006", name: "Break Room", area: "Floor 1" },
  ]

  const handleNext = () => {
    const nextStep = Math.min(step + 1, 5)
    setStep(nextStep)
    onStepChange?.(nextStep)
  }

  const handlePrevious = () => {
    const prevStep = Math.max(step - 1, 1)
    setStep(prevStep)
    onStepChange?.(prevStep)
  }

  const generateUserId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const randomNum = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")
    return `USR${timestamp}${randomNum}`
  }

  const generateDisplayName = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
    }
    return ""
  }

  const addCard = () => {
    const newCardId = `CARD${Date.now().toString().slice(-6)}`
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCardId],
    }))
  }

  const removeCard = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }))
  }

  const renderUserInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID *</Label>
            <div className="flex space-x-2">
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
                placeholder="Enter unique User ID"
              />
              <Button variant="outline" onClick={() => setFormData((prev) => ({ ...prev, userId: generateUserId() }))}>
                Auto
              </Button>
            </div>
            <p className="text-xs text-slate-500">Alphanumeric, cannot be modified after creation</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      {dept.name} ({dept.id})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter last name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <div className="flex space-x-2">
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                placeholder="Abbreviation"
              />
              <Button
                variant="outline"
                onClick={() => setFormData((prev) => ({ ...prev, displayName: generateDisplayName() }))}
              >
                Auto
              </Button>
            </div>
            <p className="text-xs text-slate-500">Abbreviation of full name</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userPin">User PIN *</Label>
            <Input
              id="userPin"
              type="password"
              maxLength={4}
              value={formData.userPin}
              onChange={(e) => setFormData((prev) => ({ ...prev, userPin: e.target.value }))}
              placeholder="4-digit PIN"
            />
            <p className="text-xs text-slate-500">User can change this later</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Validity Period</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">Valid From</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData((prev) => ({ ...prev, validFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validTo">Valid To</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData((prev) => ({ ...prev, validTo: e.target.value }))}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">Default: 2-year validity period</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Directory Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="directoryCode">Directory Code</Label>
              <Input
                id="directoryCode"
                value={formData.directoryCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, directoryCode: e.target.value }))}
                placeholder="Unique directory code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Contact number"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCardInfoStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Access Card Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Card Assignment</h3>
            <p className="text-sm text-slate-500">Manage multiple access cards for this user</p>
          </div>
          <Switch
            checked={formData.cardEnabled}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, cardEnabled: checked }))}
          />
        </div>

        {formData.cardEnabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Assigned Cards</h4>
              <Button variant="outline" size="sm" onClick={addCard}>
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </div>

            {formData.cards.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-md">
                <CreditCard className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                <p className="text-slate-500">No cards assigned</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={addCard}>
                  Add First Card
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.cards.map((card, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                      <span className="font-medium">{card}</span>
                      <Badge variant="outline" className="ml-2">
                        Primary
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeCard(index)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-medium">Card Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Manual Card Entry</Label>
                  <Input placeholder="Enter Card ID manually" />
                </div>
                <div className="space-y-2">
                  <Label>Temporary Cards</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select from available cards" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temp001">TEMP001 - Available</SelectItem>
                      <SelectItem value="temp002">TEMP002 - Available</SelectItem>
                      <SelectItem value="temp003">TEMP003 - Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Scan className="mr-2 h-4 w-4" />
                Scan New Card
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderFingerprintStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Fingerprint className="mr-2 h-5 w-5" />
          Biometric Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Fingerprint Enrollment</h3>
            <p className="text-sm text-slate-500">Configure biometric authentication for secure access</p>
          </div>
          <Switch
            checked={formData.fingerprintEnabled}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, fingerprintEnabled: checked }))}
          />
        </div>

        {formData.fingerprintEnabled && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Enrollment Settings</h4>
                <div className="space-y-2">
                  <Label>Enrollment Quality</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Templates per Finger</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Template</SelectItem>
                      <SelectItem value="2">2 Templates</SelectItem>
                      <SelectItem value="3">3 Templates</SelectItem>
                      <SelectItem value="4">4 Templates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Duress/Alarm Settings</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox id="alarm-finger" />
                  <Label htmlFor="alarm-finger">Enable Alarm Finger</Label>
                </div>
                <div className="space-y-2">
                  <Label>Alarm Finger Selection</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select finger for alarm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left-thumb">Left Thumb</SelectItem>
                      <SelectItem value="left-index">Left Index</SelectItem>
                      <SelectItem value="right-thumb">Right Thumb</SelectItem>
                      <SelectItem value="right-index">Right Index</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Fingerprint Status</h4>
              <div className="text-center p-8 border border-dashed rounded-md bg-slate-50">
                <Fingerprint className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <p className="text-slate-500 mb-4">No fingerprints enrolled</p>
                <Button>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Start Enrollment Process
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Mifare Card Integration</h4>
              <div className="flex items-center space-x-2">
                <Checkbox id="write-to-card" />
                <Label htmlFor="write-to-card">Write fingerprint templates to Mifare card</Label>
              </div>
              <div className="space-y-2">
                <Label>Storage Sector</Label>
                <Select defaultValue="sector1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sector1">Sector 1</SelectItem>
                    <SelectItem value="sector2">Sector 2</SelectItem>
                    <SelectItem value="sector3">Sector 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderAccessRightStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2 h-5 w-5" />
          Access Rights Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Access Configuration Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-3">
                <input type="radio" id="use-access-group" name="access-type" value="group" defaultChecked />
                <Label htmlFor="use-access-group" className="font-medium">
                  Use Access Groups
                </Label>
              </div>
              <p className="text-xs text-slate-500 mb-3">Assign predefined access groups with standard permissions</p>

              <div className="space-y-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select access groups" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{group.name}</span>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline">{group.doors} doors</Badge>
                            <Badge variant="outline">{group.users} users</Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Access Groups</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                      <span className="text-sm">Standard Employee</span>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center space-x-2 mb-3">
                <input type="radio" id="use-individual" name="access-type" value="individual" />
                <Label htmlFor="use-individual" className="font-medium">
                  Individual Door Assignment
                </Label>
              </div>
              <p className="text-xs text-slate-500 mb-3">Assign specific doors with custom time restrictions</p>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Select Doors/Floors</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {doors.map((door) => (
                      <div key={door.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={door.id} />
                          <Label htmlFor={door.id}>{door.name}</Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {door.area}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Timezone Table</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-pass">All Pass (24/7)</SelectItem>
                      <SelectItem value="business-hours">Business Hours</SelectItem>
                      <SelectItem value="custom">Custom Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Access Control Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h4 className="font-medium">Anti-Passback (APB)</h4>
                <p className="text-xs text-slate-500">Prevent multiple entries without exit</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h4 className="font-medium">Holiday Control</h4>
                <p className="text-xs text-slate-500">Apply holiday restrictions</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h4 className="font-medium">PIN Control</h4>
                <p className="text-xs text-slate-500">Require PIN for access</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h4 className="font-medium">Directory Display</h4>
                <p className="text-xs text-slate-500">Show in controller directory</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderPrintPreviewStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Review & Save
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">User Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="font-medium">{formData.userId || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium">{formData.department || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Display Name:</span>
                <span className="font-medium">{formData.displayName || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PIN:</span>
                <span className="font-medium">{"*".repeat(formData.userPin.length)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Access Credentials</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Fingerprint:</span>
                <Badge variant={formData.fingerprintEnabled ? "default" : "secondary"}>
                  {formData.fingerprintEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Access Cards:</span>
                <Badge variant={formData.cardEnabled ? "default" : "secondary"}>
                  {formData.cardEnabled ? `${formData.cards.length} cards` : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Directory Code:</span>
                <span className="font-medium">{formData.directoryCode || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-medium">{formData.phoneNumber || "Not set"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Validity Period</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-slate-500" />
              <span>From: {formData.validFrom || "Not set"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-slate-500" />
              <span>To: {formData.validTo || "Not set"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Summary</h3>
          <div className="p-4 bg-slate-50 rounded-md">
            <p className="text-sm text-slate-600">
              User profile is ready to be created. All required information has been provided. The user will receive
              access credentials and can begin using the system immediately after creation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderUserInfoStep()
      case 2:
        return renderCardInfoStep()
      case 3:
        return renderFingerprintStep()
      case 4:
        return renderAccessRightStep()
      case 5:
        return renderPrintPreviewStep()
      default:
        return renderUserInfoStep()
    }
  }

  return (
    <div className="space-y-6">
      {renderCurrentStep()}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
          Previous
        </Button>
        <div className="flex space-x-2">
          {step < 5 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button
              onClick={() => {
                console.log("Saving user...", formData)
                onSuccess?.()
              }}
            >
              Create User
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
