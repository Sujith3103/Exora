import { Card } from "@/components/ui/card";

export default function CourseSkeleton() {
  return (
    <div className="lg:px-15 p-5 md:pt-10 flex flex-col gap-6">
      {/* Header */}
      <div className="h-8 w-1/3 bg-gray-200 rounded-md" />

      {/* Guarantee card */}
      <Card className="flex flex-row gap-2 mt-2 p-4 items-center">
        <div className="h-5 w-5 bg-gray-200 rounded-full" />
        <div className="h-5 w-2/3 bg-gray-200 rounded-md" />
      </Card>

      {/* Filter & Sort */}
      <div className="flex gap-4">
        <div className="h-10 w-28 bg-gray-200 rounded-md" />
        <div className="h-10 w-40 bg-gray-200 rounded-md" />
      </div>

      <div className="flex gap-6 mt-6">
        {/* Sidebar filter */}
        <div className="hidden md:block w-60 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-full bg-gray-200 rounded-md" />
          ))}
        </div>

        {/* Course list */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="h-40 w-full bg-gray-200 rounded-md" />
              <div className="h-6 w-3/4 bg-gray-200 rounded-md" />
              <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
