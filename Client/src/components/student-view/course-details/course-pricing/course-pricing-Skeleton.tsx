import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export const CoursePricingSkeleton = () => {
  return (
    <Card className="h-full gap-0 pt-0 rounded-none p-5">
      {/* Image */}
      <Skeleton className="p-2 border-b min-w-full min-h-[200px] max-h-[220px] rounded-none" />

      {/* Pricing */}
      <Skeleton className="h-6 w-24 mt-4" />

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <Skeleton className="h-13 w-full rounded-sm" />
        <Skeleton className="h-13 w-full rounded-sm" />
      </div>
    </Card>
  )
}
