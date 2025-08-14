"use client"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export type Door = {
  id: string
  name: string
  controller: string // New field
  doorNo: number // New field
  releaseTime: number
  doorOpenTimeout: number
  autoOpenTimezone: string
  pinDisableTimezone: string
  securityPin: boolean
  alarmPriority: "Low" | "Medium" | "High" | "Critical"
  workMode: "Auto Control" | "Always Open" | "Always Close"
}

const data: Door[] = [
  {
    id: "DOOR001",
    name: "Main Entrance",
    controller: "CTRL-001",
    doorNo: 1,
    releaseTime: 5,
    doorOpenTimeout: 10,
    autoOpenTimezone: "[0 Stop]",
    pinDisableTimezone: "[31 All Pass]",
    securityPin: true,
    alarmPriority: "High",
    workMode: "Auto Control",
  },
  {
    id: "DOOR002",
    name: "Server Room",
    controller: "CTRL-002",
    doorNo: 2,
    releaseTime: 3,
    doorOpenTimeout: 6,
    autoOpenTimezone: "[0 Stop]",
    pinDisableTimezone: "[31 All Pass]",
    securityPin: true,
    alarmPriority: "Critical",
    workMode: "Always Close",
  },
  {
    id: "DOOR003",
    name: "HR Office",
    controller: "CTRL-001",
    doorNo: 3,
    releaseTime: 7,
    doorOpenTimeout: 14,
    autoOpenTimezone: "Office Hours",
    pinDisableTimezone: "Weekends",
    securityPin: false,
    alarmPriority: "Medium",
    workMode: "Auto Control",
  },
  {
    id: "DOOR004",
    name: "Warehouse Gate",
    controller: "CTRL-003",
    doorNo: 1,
    releaseTime: 10,
    doorOpenTimeout: 20,
    autoOpenTimezone: "Delivery Hours",
    pinDisableTimezone: "Holidays",
    securityPin: true,
    alarmPriority: "High",
    workMode: "Auto Control",
  },
  {
    id: "DOOR005",
    name: "Cafeteria Entrance",
    controller: "CTRL-004",
    doorNo: 4,
    releaseTime: 5,
    doorOpenTimeout: 10,
    autoOpenTimezone: "Lunch Break",
    pinDisableTimezone: "Cleaning Crew",
    securityPin: false,
    alarmPriority: "Low",
    workMode: "Always Open",
  },
  {
    id: "DOOR006",
    name: "Executive Office",
    controller: "CTRL-002",
    doorNo: 1,
    releaseTime: 4,
    doorOpenTimeout: 8,
    autoOpenTimezone: "[0 Stop]",
    pinDisableTimezone: "[31 All Pass]",
    securityPin: true,
    alarmPriority: "Critical",
    workMode: "Always Close",
  },
  {
    id: "DOOR007",
    name: "Storage Room",
    controller: "CTRL-003",
    doorNo: 2,
    releaseTime: 6,
    doorOpenTimeout: 12,
    autoOpenTimezone: "Daily 8-6",
    pinDisableTimezone: "Inventory",
    securityPin: false,
    alarmPriority: "Medium",
    workMode: "Auto Control",
  },
  {
    id: "DOOR008",
    name: "Research Lab",
    controller: "CTRL-005",
    doorNo: 1,
    releaseTime: 5,
    doorOpenTimeout: 10,
    autoOpenTimezone: "Lab Hours",
    pinDisableTimezone: "Experiments",
    securityPin: true,
    alarmPriority: "High",
    workMode: "Auto Control",
  },
]

export const columns: ColumnDef<Door>[] = [
  {
    accessorKey: "name",
    header: "Door Name",
  },
  {
    accessorKey: "controller",
    header: "Controller",
  },
  {
    accessorKey: "doorNo",
    header: "Door No.",
  },
  {
    accessorKey: "workMode",
    header: "Work Mode",
  },
  {
    accessorKey: "releaseTime",
    header: "Release Time (s)",
  },
  {
    accessorKey: "doorOpenTimeout",
    header: "Open Timeout (s)",
  },
  {
    accessorKey: "autoOpenTimezone",
    header: "Auto Open TZ",
  },
  {
    accessorKey: "pinDisableTimezone",
    header: "PIN Disable TZ",
  },
  {
    accessorKey: "securityPin",
    header: "Security PIN",
    cell: ({ row }) => (row.getValue("securityPin") ? "Enabled" : "Disabled"),
  },
  {
    accessorKey: "alarmPriority",
    header: "Alarm Priority",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const door = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(door.id)}>Copy Door ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Door Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Door</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete Door</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DoorTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
