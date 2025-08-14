import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  )
}
