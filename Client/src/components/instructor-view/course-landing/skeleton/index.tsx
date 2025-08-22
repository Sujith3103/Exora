import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const CourseLandingSkeleton = () => {
  return (
    <Card className="p-10 flex flex-col rounded-none space-y-6">
      {/* Header */}
      <Skeleton className="h-8 w-1/3" />

      {/* Form fields (title, subtitle, description) */}
      <div className="space-y-5">
        <div>
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-1/4 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>

      {/* Basic Info Selects */}
      <div className="flex sm:flex-row flex-col gap-5">
        <Skeleton className="h-10 sm:w-1/3 w-full" />
        <Skeleton className="h-10 sm:w-1/3 w-full" />
        <Skeleton className="h-10 sm:w-1/3 w-full" />
      </div>

      {/* Requirements */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-16 w-full" />
      </div>

      {/* Course Image Upload */}
      <div className="flex gap-5">
        <Skeleton className="w-120 h-64" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-16 w-80" />
          <div className="flex gap-5">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CourseLandingSkeleton
