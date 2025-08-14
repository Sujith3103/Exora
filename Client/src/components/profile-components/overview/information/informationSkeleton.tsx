import { Card } from '@/components/ui/card';

export default function InformationSkeleton() {
  return (
    <div className="max-w-screen xl:px-20 px-10 py-10 flex flex-wrap justify-between items-center ">
      <div className="flex sm:flex-row flex-col w-full gap-10">

        {/* Basic Information */}
        <div className="sm:w-1/2 w-full ">
          <div className="font-bold mb-10 bg-gray-300 h-5 w-40 rounded animate-pulse"></div>
          <Card className="w-full p-5 flex flex-col gap-4 ">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 w-full">
                <div className="w-40 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </Card>
        </div>

        {/* Security Details */}
        <div className="sm:w-1/2 w-full">
          <div className="font-bold mb-10 bg-gray-300 h-5 w-40 rounded animate-pulse"></div>
          <Card className="w-full p-5 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 w-full">
                <div className="w-40 h-5 bg-gray-300 rounded animate-pulse"></div>
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  );
}
