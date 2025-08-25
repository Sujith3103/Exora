import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchCourses } from "./api/courseApi"
import type { CourseQueryOptions } from "@/config/config"

export const useCourses = (queryOptions:CourseQueryOptions) => {

    return useQuery({
        queryKey:["courses",queryOptions],
        queryFn:() => fetchCourses(queryOptions),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus:false,
        staleTime: 1000*60
    })

}