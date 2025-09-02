"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useTrending } from "@/hooks/queries/useCourseTabs";
import { useSearchParams } from "react-router-dom";
import TrendingCoursesSkeleton from "./trendingkeleton";
import { useEffect } from "react";

type Course = {
    id: string;
    title: string;
    thumbnailUrl: string;
    instructor: { name: string };
    pricing: number;
};




export default function TrendingCourses() {

    const [searchParams] = useSearchParams()
    const category = searchParams.get('category')
    if (!category) return null

    const { data: trending, isLoading, isError } = useTrending(category)


    if (isLoading) {
        return <TrendingCoursesSkeleton />
    }

    if (isError) {
        return <p className="text-center pt-20 text-red-500">Failed to load trending courses.</p>
    }

    return (
        <div className="w-full max-w-9xl mx-auto md:h-[40vh] h-[40vh]">
            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full mt-2 h-full"
            >
                {
                    trending?.length === 0 && <>
                        <p className="text-3xl text-center pt-20">No Trending Courses Right Now</p>
                    </>
                }
                <CarouselContent className="h-[55vh]">
                    {trending?.map((course, idx) => (
                               <CarouselItem
                            key={idx}
                            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 "
                        >
                            <div className="h-full">
                                <div className="h-full">
                                    <div className="h-[41%]">
                                        <img
                                            src={course.thumbnailUrl}
                                            alt={course.title}
                                            width={400}
                                            height={200}
                                            className="w-[95%] h-full object-cover border-2"
                                        />
                                    </div>
                                    <div className="p-3 space-y-1">
                                        <h3 className="font-semibold truncate">{course.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {course.instructor?.name}
                                        </p>
                                        <p>Ratings</p>
                                        <p className="text-sm font-semibold">
                                            ${course.pricing}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/* Prev / Next buttons */}
                <CarouselPrevious
                    className="top-22 -translate-y-1/2 -left-6 h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center"
                />
                <CarouselNext
                    className="top-22 -translate-y-1/2 -right-6 h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center"
                />
            </Carousel>
        </div>
    );
}
