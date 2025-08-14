"use client"

import OperatorForm from "@/components/operator-form"
import { Home } from "lucide-react"
import Link from "next/link"

export default function AddOperatorPage() {
  const handleCreateOperator = (data: any) => {
    console.log("New operator data:", data)
    // Here you would typically send this data to your backend API
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Add New Operator</h1>
        <nav className="ml-auto flex gap-2 text-sm items-center">
          <Link href="#" className="flex items-center gap-1 hover:underline">
            <Home className="h-3 w-3" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/dashboard/operators" className="hover:underline">
            Operators
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Add New Operator</span>
        </nav>
      </div>
      <p className="text-sm text-muted-foreground -mt-4">
        Create a new operator profile with access credentials and permissions.
      </p>

      <div className="flex-1">
        <OperatorForm onSubmit={handleCreateOperator} />
      </div>
    </main>
  )
}
