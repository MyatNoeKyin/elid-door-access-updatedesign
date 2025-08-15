"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import {
  Users,
  UserPlus,
  Building,
  Settings,
  CreditCard,
  Clock,
  Calendar,
  Shield,
  ChevronDown,
  ChevronRight,
  Database,
  MapPin,
  Server,
  UserCog,
  Plus,
  Trash2,
  DoorOpen,
  LayoutDashboard,
  FileText,
  Building2,
  Monitor,
  UserCheck,
  Edit,
  Layers,
  Sparkles,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Security Center",
    href: "/dashboard/security-dashboard",
    icon: Shield,
    badge: "NEW",
  },
  {
    name: "Real-Time Monitoring",
    href: "/dashboard/monitoring/real-time",
    icon: Monitor,
  },
  {
    name: "Showcase",
    href: "/dashboard/showcase",
    icon: Sparkles,
    badge: "DEMO",
  },
  {
    name: "User Management",
    icon: Users,
    children: [
      {
        name: "Add New User",
        href: "/dashboard/users/add",
        icon: UserPlus,
      },
      {
        name: "User Details",
        href: "/dashboard/users",
        icon: Users,
      },
    ],
  },
  {
    name: "System Setup",
    icon: Settings,
    children: [
      {
        name: "Card Settings",
        href: "/dashboard/system/cards",
        icon: CreditCard,
      },
      {
        name: "User Field Setting",
        href: "/dashboard/system/user-fields",
        icon: Database,
      },
      {
        name: "Controller Setting",
        href: "/dashboard/system/controllers",
        icon: Server,
      },
      {
        name: "Area Setting",
        href: "/dashboard/areas",
        icon: MapPin,
      },
      {
        name: "Door Setting",
        href: "/dashboard/doors",
        icon: DoorOpen,
      },
      {
        name: "Floor Setting",
        href: "/dashboard/system/floors",
        icon: Building2,
      },
      {
        name: "Device Setting",
        href: "/dashboard/system/devices",
        icon: Monitor,
      },
      {
        name: "Department Setting",
        href: "/dashboard/departments",
        icon: Building,
      },
      {
        name: "Change Tenant Info",
        href: "/dashboard/system/tenant-info",
        icon: UserCheck,
      },
      {
        name: "Communication Server",
        href: "/dashboard/system/communication",
        icon: Server,
      },
      {
        name: "Operator",
        href: "/dashboard/operators",
        icon: UserCog,
      },
    ],
  },
  {
    name: "Access Management",
    icon: Shield,
    children: [
      {
        name: "Timezone",
        href: "/dashboard/time-zones",
        icon: Clock,
      },
      {
        name: "Holidays",
        href: "/dashboard/holidays",
        icon: Calendar,
      },
      {
        name: "Add Card by Batch",
        href: "/dashboard/access/batch-cards",
        icon: Plus,
      },
      {
        name: "Add Card by Controller",
        href: "/dashboard/access/controller-cards",
        icon: CreditCard,
      },
      {
        name: "Delete Temp Card",
        href: "/dashboard/access/delete-temp-cards",
        icon: Trash2,
      },
      {
        name: "Modify Access Group",
        href: "/dashboard/access/modify-access-group",
        icon: Edit,
      },
      {
        name: "Assign Doors to Users",
        href: "/dashboard/access/assign-doors-users",
        icon: DoorOpen,
      },
      {
        name: "Assign Floors to Users",
        href: "/dashboard/access/assign-floors-users",
        icon: Layers,
      },
    ],
  },
  {
    name: "Access Logs",
    href: "/dashboard/logs",
    icon: FileText,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(["User Management"])

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionName) ? prev.filter((name) => name !== sectionName) : [...prev, sectionName],
    )
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
          <Shield className="h-6 w-6" />
          <span>ELID Access</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {navigation.map((item) => {
            if (item.children) {
              const isOpen = openSections.includes(item.name)
              return (
                <Collapsible key={item.name} open={isOpen} onOpenChange={() => toggleSection(item.name)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start text-left font-normal">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.href}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left font-normal pl-8",
                          pathname === child.href && "bg-accent text-accent-foreground",
                        )}
                        asChild
                      >
                        <Link href={child.href}>
                          <child.icon className="mr-2 h-4 w-4" />
                          {child.name}
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  pathname === item.href && "bg-accent text-accent-foreground",
                )}
                asChild
              >
                <Link href={item.href} className="w-full flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="default" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
