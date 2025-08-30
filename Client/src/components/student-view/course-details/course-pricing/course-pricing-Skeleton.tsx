import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export const CoursePricingSkeleton = () => {
  return (
    <Card className="h-full gap-0 pt-0 rounded-none p-5 bg-transparent border-none">
      {/* Image */}
      <div className='bg-white p-5'>
        <Skeleton className="p-2 border-b min-w-full min-h-[200px] max-h-[220px] rounded-none bg-gray-200" />

        {/* Pricing */}
        <Skeleton className="h-6 w-24 mt-4 bg-gray-200" />

        {/* Buttons */}
        <div className="flex flex-col gap-10 mt-4">
          <Skeleton className="h-13 w-full rounded-sm bg-gray-200" />
          <Skeleton className="h-13 w-full rounded-sm bg-gray-200" />
          <Skeleton className="h-13 w-full rounded-sm bg-gray-200" />
        </div>
      </div>
    </Card>
  )
}
