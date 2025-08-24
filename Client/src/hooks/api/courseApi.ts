import server from "@/api/axiosinstance"
import type { CourseQueryOptions } from "@/config/config"

export const fetchCourses = async (queryOptions: CourseQueryOptions) => {

    const response = await server.get('/courses', {
        params: queryOptions
    })
    console.log("query options:", queryOptions)
    return response.data

}