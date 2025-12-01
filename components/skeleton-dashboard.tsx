import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Skeleton className="h-32 w-full bg-zinc-800" />
        <Skeleton className="h-32 w-full bg-zinc-800" />
        <Skeleton className="h-32 w-full bg-zinc-800" />
        <Skeleton className="h-32 w-full bg-zinc-800" />
      </div>

      <Skeleton className="h-64 w-full bg-zinc-800" />
    </div>
  )
}
