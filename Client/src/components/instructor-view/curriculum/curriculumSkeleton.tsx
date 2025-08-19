import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const CurriculumSkeleton = () => {
  return (
    <div className="space-y-5">
      {[1, 2].map((i) => (
        <Card
          key={i}
          className="p-5 border border-gray-200 rounded-md shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </Card>
      ))}

      {/* Skeleton for Add Section Button */}
      <Button
        variant="outline"
        disabled
        className="flex items-center gap-1 mt-15 text-purple-600 border-purple-500"
      >
        <Plus size={16} /> Add Section
      </Button>
    </div>
  )
}

export default CurriculumSkeleton
