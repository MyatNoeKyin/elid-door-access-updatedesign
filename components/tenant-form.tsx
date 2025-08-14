"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"

interface TenantFormData {
  tenantName: string
  managerName: string
  description: string
  pin: string
}

interface TenantFormProps {
  initialData?: TenantFormData
  onSubmit: (data: TenantFormData) => void
  onCancel: () => void
}

export function TenantForm({ initialData, onSubmit, onCancel }: TenantFormProps) {
  const [formData, setFormData] = useState<TenantFormData>(
    initialData || {
      tenantName: "",
      managerName: "John Administrator", // Default manager name for new tenants
      description: "",
      pin: "1234", // Default PIN for new tenants
    },
  )

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        tenantName: "",
        managerName: "John Administrator", // Ensure default for new forms
        description: "",
        pin: "1234",
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tenantName">Tenant Name</Label>
        <Input id="tenantName" value={formData.tenantName} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pin">Modify PIN (Password)</Label>
        <Input id="pin" type="password" value={formData.pin} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Modify Description</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="managerName">Manager</Label>
        <Input id="managerName" value={formData.managerName} onChange={handleChange} disabled={true} />{" "}
        {/* Always disabled */}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Save Changes" : "Add Tenant"}</Button>
      </DialogFooter>
    </form>
  )
}
