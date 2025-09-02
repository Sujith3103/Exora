import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingCoursesSkeleton() {
  return (
    <div className="w-full max-w-9xl mx-auto md:h-[50vh] h-[40vh]">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full mt-2"
      >
        <CarouselContent>
          {Array.from({ length: 4 }).map((_, idx) => (
            <CarouselItem
              key={idx}
              className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="h-full flex flex-col rounded-md border p-3 space-y-3">
                {/* Thumbnail skeleton */}
                <Skeleton className="aspect-video w-full rounded-md" />

                {/* Text skeletons */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
  